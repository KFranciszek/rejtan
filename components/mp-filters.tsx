'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, X, Users, RotateCcw, UserCheck, UserX, UsersRound } from 'lucide-react'
import { MPListItem, SearchFilters, ClubFilter, ActiveStatus } from '@/types/mp'
import { debounce } from '@/lib/utils'

interface MPFiltersProps {
  mps: MPListItem[]
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
}

export function MPFilters({ mps, filters, onFiltersChange }: MPFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.searchTerm)

  // Debounced search
  const debouncedSearch = useMemo(
    () => debounce((term: string) => {
      onFiltersChange({ ...filters, searchTerm: term })
    }, 300),
    [filters, onFiltersChange]
  )

  const handleSearchChange = (value: string) => {
    setSearchInput(value)
    debouncedSearch(value)
  }

  // Calculate club filters with counts
  const clubFilters: ClubFilter[] = useMemo(() => {
    const clubCounts = mps.reduce((acc, mp) => {
      acc[mp.club] = (acc[mp.club] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(clubCounts)
      .map(([club, count]) => ({ value: club, label: club, count }))
      .sort((a, b) => b.count - a.count)
  }, [mps])

  // Calculate status counts
  const statusCounts = useMemo(() => {
    const active = mps.filter(mp => mp.active).length
    const inactive = mps.filter(mp => !mp.active).length
    return { all: mps.length, active, inactive }
  }, [mps])

  const clearFilters = () => {
    setSearchInput('')
    onFiltersChange({
      searchTerm: '',
      selectedClub: '',
      activeStatus: 'active' // Reset to default "active" instead of "all"
    })
  }

  const hasActiveFilters = filters.searchTerm || filters.selectedClub || filters.activeStatus !== 'active'

  const getActiveStatusIcon = (status: ActiveStatus) => {
    switch (status) {
      case 'active':
        return <UserCheck className="h-4 w-4" />
      case 'inactive':
        return <UserX className="h-4 w-4" />
      default:
        return <UsersRound className="h-4 w-4" />
    }
  }

  const getActiveStatusLabel = (status: ActiveStatus) => {
    switch (status) {
      case 'active':
        return 'Tylko aktywni'
      case 'inactive':
        return 'Tylko nieaktywni'
      default:
        return 'Wszyscy posłowie'
    }
  }

  return (
    <div className="space-y-6">
      {/* Main Filter Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Search Input */}
        <div className="lg:col-span-5 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Wpisz nazwisko posła..."
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 h-11 focus-ring"
          />
        </div>

        {/* Club Filter */}
        <div className="lg:col-span-4">
          <Select
            value={filters.selectedClub || "all"}
            onValueChange={(value) => 
              onFiltersChange({ ...filters, selectedClub: value === "all" ? "" : value })
            }
          >
            <SelectTrigger className="h-11 focus-ring">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Wszystkie kluby" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center justify-between w-full">
                  <span>Wszystkie kluby</span>
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {mps.length}
                  </Badge>
                </div>
              </SelectItem>
              {clubFilters.map((club) => (
                <SelectItem key={club.value} value={club.value}>
                  <div className="flex items-center justify-between w-full">
                    <span>{club.label}</span>
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {club.count}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Active Status Filter */}
        <div className="lg:col-span-3">
          <Select
            value={filters.activeStatus}
            onValueChange={(value: ActiveStatus) => 
              onFiltersChange({ ...filters, activeStatus: value })
            }
          >
            <SelectTrigger className="h-11 focus-ring">
              <div className="flex items-center gap-2">
                {getActiveStatusIcon(filters.activeStatus)}
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center justify-between w-full">
                  <span>Wszyscy posłowie</span>
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {statusCounts.all}
                  </Badge>
                </div>
              </SelectItem>
              <SelectItem value="active">
                <div className="flex items-center justify-between w-full">
                  <span>Tylko aktywni</span>
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {statusCounts.active}
                  </Badge>
                </div>
              </SelectItem>
              <SelectItem value="inactive">
                <div className="flex items-center justify-between w-full">
                  <span>Tylko nieaktywni</span>
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {statusCounts.inactive}
                  </Badge>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Aktywne filtry:</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8 px-3 text-xs gap-1 hover:bg-destructive/10 hover:text-destructive focus-ring"
            >
              <RotateCcw className="h-3 w-3" />
              Wyczyść wszystkie
            </Button>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            {filters.searchTerm && (
              <Badge variant="secondary" className="gap-1 pr-1">
                Szukaj: "{filters.searchTerm}"
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-destructive/20 hover:text-destructive rounded-full"
                  onClick={() => {
                    setSearchInput('')
                    onFiltersChange({ ...filters, searchTerm: '' })
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            
            {filters.selectedClub && (
              <Badge variant="secondary" className="gap-1 pr-1">
                Klub: {filters.selectedClub}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-destructive/20 hover:text-destructive rounded-full"
                  onClick={() => onFiltersChange({ ...filters, selectedClub: '' })}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            
            {filters.activeStatus !== 'active' && (
              <Badge variant="secondary" className="gap-1 pr-1">
                {getActiveStatusLabel(filters.activeStatus)}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-destructive/20 hover:text-destructive rounded-full"
                  onClick={() => onFiltersChange({ ...filters, activeStatus: 'active' })}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  )
}