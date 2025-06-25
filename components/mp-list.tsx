'use client'

import { useMemo } from 'react'
import { MPListItem, SearchFilters } from '@/types/mp'
import { MPTable } from './mp-table'
import { Search, Users } from 'lucide-react'

interface MPListProps {
  mps: MPListItem[]
  filters: SearchFilters
}

export function MPList({ mps, filters }: MPListProps) {
  const filteredMPs = useMemo(() => {
    return mps.filter(mp => {
      // Search filter
      if (filters.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase()
        const fullName = mp.firstLastName.toLowerCase()
        if (!fullName.includes(searchTerm)) {
          return false
        }
      }

      // Club filter
      if (filters.selectedClub && mp.club !== filters.selectedClub) {
        return false
      }

      // Active/inactive filter
      if (!filters.showInactive && !mp.active) {
        return false
      }

      return true
    })
  }, [mps, filters])

  if (filteredMPs.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="space-y-4">
          <div className="w-20 h-20 mx-auto bg-muted/50 rounded-full flex items-center justify-center">
            {filters.searchTerm || filters.selectedClub ? (
              <Search className="h-10 w-10 text-muted-foreground" />
            ) : (
              <Users className="h-10 w-10 text-muted-foreground" />
            )}
          </div>
          <div className="space-y-2">
            <div className="text-muted-foreground text-xl font-medium">
              {filters.searchTerm || filters.selectedClub 
                ? 'Nie znaleziono posłów' 
                : 'Brak posłów do wyświetlenia'
              }
            </div>
            <div className="text-sm text-muted-foreground max-w-md mx-auto">
              {filters.searchTerm || filters.selectedClub
                ? 'Spróbuj zmienić kryteria wyszukiwania lub wyczyść filtry'
                : 'Sprawdź ustawienia filtrów lub spróbuj ponownie później'
              }
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Table view only - pagination is now handled in parent component */}
      <MPTable mps={filteredMPs} />
    </div>
  )
}