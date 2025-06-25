'use client'

import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchMPs } from '@/lib/api'
import { MPFilters } from '@/components/mp-filters'
import { MPTable } from '@/components/mp-table'
import { SearchFilters, MPListItem } from '@/types/mp'
import { Loader2, Users, TrendingUp, Award, Search, AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

export default function HomePage() {
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    selectedClub: '',
    activeStatus: 'active' // Changed default to 'active'
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)

  const itemsPerPageOptions = [10, 20, 50, 100, 200]

  const { data: mps, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['mps'],
    queryFn: fetchMPs,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })

  // Convert MPs to MPListItems with mock presence data for now
  const mpListItems: MPListItem[] = useMemo(() => {
    if (!mps) return []
    
    return mps.map(mp => ({
      ...mp,
      presencePct: Math.floor(Math.random() * 40) + 60 // Mock data: 60-100% - will be replaced with real data
    }))
  }, [mps])

  // Filter MPs
  const filteredMPs = useMemo(() => {
    if (!mpListItems.length) return []
    
    return mpListItems.filter(mp => {
      if (filters.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase()
        const fullName = mp.firstLastName.toLowerCase()
        if (!fullName.includes(searchTerm)) return false
      }
      
      if (filters.selectedClub && mp.club !== filters.selectedClub) return false
      
      // Handle active status filter
      if (filters.activeStatus === 'active' && !mp.active) return false
      if (filters.activeStatus === 'inactive' && mp.active) return false
      
      return true
    })
  }, [mpListItems, filters])

  const filteredCount = filteredMPs.length

  // Calculate pagination
  const totalPages = Math.ceil(filteredCount / itemsPerPage)
  const indexOfLastMP = currentPage * itemsPerPage
  const indexOfFirstMP = indexOfLastMP - itemsPerPage
  const currentMPs = filteredMPs.slice(indexOfFirstMP, indexOfLastMP)

  // Reset to first page when filters change
  useMemo(() => {
    setCurrentPage(1)
  }, [filters, itemsPerPage])

  const stats = useMemo(() => {
    if (!mpListItems.length) return { active: 0, inactive: 0, avgPresence: 0, totalClubs: 0 }
    
    const active = mpListItems.filter(mp => mp.active).length
    const inactive = mpListItems.filter(mp => !mp.active).length
    const avgPresence = Math.round(
      mpListItems.reduce((sum, mp) => sum + (mp.presencePct || 0), 0) / mpListItems.length
    )
    const totalClubs = new Set(mpListItems.map(mp => mp.club)).size
    
    return { active, inactive, avgPresence, totalClubs }
  }, [mpListItems])

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('ellipsis')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push('ellipsis')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <div className="absolute inset-0 h-12 w-12 animate-pulse-soft mx-auto rounded-full bg-primary/20"></div>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-medium text-foreground">Ładowanie danych o posłach...</p>
            <p className="text-sm text-muted-foreground">Pobieramy najnowsze informacje z API Sejmu RP</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="space-y-6">
          <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <div className="space-y-2">
            <div className="text-destructive text-xl font-semibold">
              Błąd podczas ładowania danych
            </div>
            <div className="text-sm text-muted-foreground max-w-md mx-auto">
              Nie udało się pobrać danych z API Sejmu RP. Sprawdź połączenie internetowe i spróbuj ponownie.
            </div>
            <div className="text-xs text-muted-foreground">
              {error instanceof Error ? error.message : 'Nieznany błąd'}
            </div>
          </div>
          <Button 
            onClick={() => refetch()} 
            disabled={isRefetching}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
            {isRefetching ? 'Ładowanie...' : 'Spróbuj ponownie'}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-5"></div>
        <div className="relative text-center space-y-6 py-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Posłowie X kadencji Sejmu RP
            </h1>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Transparentne dane o działaniach parlamentarzystów, ich frekwencji w głosowaniach 
              i oświadczeniach majątkowych. Dane pobierane na żywo z oficjalnego API Sejmu RP.
            </p>
          </div>
          
          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto mt-8">
            <div className="glass rounded-xl p-6 text-center space-y-2">
              <div className="w-12 h-12 mx-auto bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-2xl font-bold text-foreground">{stats.active}</div>
              <div className="text-sm text-muted-foreground">aktywnych posłów</div>
            </div>
            
            <div className="glass rounded-xl p-6 text-center space-y-2">
              <div className="w-12 h-12 mx-auto bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="text-2xl font-bold text-foreground">{stats.inactive}</div>
              <div className="text-sm text-muted-foreground">nieaktywnych posłów</div>
            </div>
            
            <div className="glass rounded-xl p-6 text-center space-y-2">
              <div className="w-12 h-12 mx-auto bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-foreground">{stats.avgPresence}%</div>
              <div className="text-sm text-muted-foreground">średnia frekwencja</div>
            </div>
            
            <div className="glass rounded-xl p-6 text-center space-y-2">
              <div className="w-12 h-12 mx-auto bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-foreground">{stats.totalClubs}</div>
              <div className="text-sm text-muted-foreground">klubów parlamentarnych</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Filters Section */}
      <div className="glass rounded-xl p-8 border border-border/50">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Search className="h-4 w-4 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Wyszukaj i filtruj posłów</h2>
            </div>
            <div className="text-xs text-muted-foreground bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded-full">
              Dane na żywo z API Sejmu
            </div>
          </div>
          <MPFilters 
            mps={mpListItems}
            filters={filters}
            onFiltersChange={setFilters}
          />
        </div>
      </div>

      {/* Results Summary with Items Per Page */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold text-foreground">
            Lista posłów
          </h2>
          <p className="text-sm text-muted-foreground">
            Wyświetlono {indexOfFirstMP + 1}-{Math.min(indexOfLastMP, filteredCount)} z {filteredCount} posłów
            {filteredCount !== mpListItems.length && ` (z ${mpListItems.length} ogółem)`}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {filteredCount > 0 && (
            <div className="text-right space-y-1">
              <div className="text-sm font-medium text-foreground">
                Strona {currentPage} z {totalPages}
              </div>
              <div className="w-24 h-1 bg-muted rounded-full overflow-hidden ml-auto">
                <div 
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${(currentPage / totalPages) * 100}%` }}
                />
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Pokaż:</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => setItemsPerPage(Number(value))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {itemsPerPageOptions.map((option) => (
                  <SelectItem key={option} value={option.toString()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* MP Table */}
      <MPTable mps={currentMPs} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage > 1) setCurrentPage(currentPage - 1)
                  }}
                  className={currentPage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              
              {getPageNumbers().map((page, index) => (
                <PaginationItem key={index}>
                  {page === 'ellipsis' ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        setCurrentPage(page as number)
                      }}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                  }}
                  className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          
          <div className="text-sm text-muted-foreground">
            Strona {currentPage} z {totalPages} • {filteredCount} posłów ogółem
          </div>
        </div>
      )}
    </div>
  )
}