'use client'

import Link from 'next/link'
import { MPListItem } from '@/types/mp'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Mail, Users, ExternalLink, ArrowUpDown, AlertTriangle } from 'lucide-react'
import { formatNumber, getClubColor } from '@/lib/utils'
import { useState } from 'react'

interface MPTableProps {
  mps: MPListItem[]
}

type SortField = 'name' | 'club' | 'district' | 'votes' | 'status'
type SortDirection = 'asc' | 'desc'

export function MPTable({ mps }: MPTableProps) {
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedMPs = [...mps].sort((a, b) => {
    let aValue: string | number | boolean
    let bValue: string | number | boolean

    switch (sortField) {
      case 'name':
        aValue = a.firstLastName.toLowerCase()
        bValue = b.firstLastName.toLowerCase()
        break
      case 'club':
        aValue = a.club.toLowerCase()
        bValue = b.club.toLowerCase()
        break
      case 'district':
        aValue = a.districtNum
        bValue = b.districtNum
        break
      case 'votes':
        aValue = a.numberOfVotes
        bValue = b.numberOfVotes
        break
      case 'status':
        aValue = a.active
        bValue = b.active
        break
      default:
        aValue = a.firstLastName.toLowerCase()
        bValue = b.firstLastName.toLowerCase()
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(field)}
      className="h-auto p-0 font-semibold text-left justify-start hover:bg-transparent hover:text-primary"
    >
      <span className="flex items-center gap-1">
        {children}
        <ArrowUpDown className="h-3 w-3" />
      </span>
    </Button>
  )

  if (sortedMPs.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="space-y-4">
          <div className="w-20 h-20 mx-auto bg-muted/50 rounded-full flex items-center justify-center">
            <Users className="h-10 w-10 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <div className="text-muted-foreground text-xl font-medium">
              Nie znaleziono posłów
            </div>
            <div className="text-sm text-muted-foreground max-w-md mx-auto">
              Spróbuj zmienić kryteria wyszukiwania lub wyczyść filtry
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[350px]">
              <SortButton field="name">Poseł</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="club">Klub</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="status">Status</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="district">Okręg</SortButton>
            </TableHead>
            <TableHead className="text-right">
              <SortButton field="votes">Głosy</SortButton>
            </TableHead>
            <TableHead className="w-[100px]">Kontakt</TableHead>
            <TableHead className="w-[80px]">Profil</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedMPs.map((mp) => {
            return (
              <TableRow 
                key={mp.id} 
                className="hover:bg-muted/30 transition-colors duration-200"
              >
                <TableCell>
                  <div className="min-w-0">
                    <div className="font-medium text-foreground truncate">
                      {mp.firstLastName}
                    </div>
                    {mp.inactiveCause && (
                      <div className="text-xs text-muted-foreground truncate max-w-[300px]">
                        {mp.inactiveCause}
                      </div>
                    )}
                  </div>
                </TableCell>
                
                <TableCell>
                  <Badge className={`${getClubColor(mp.club)} text-xs`}>
                    {mp.club}
                  </Badge>
                </TableCell>
                
                <TableCell>
                  {mp.active ? (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                      Aktywny
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Nieaktywny
                    </Badge>
                  )}
                </TableCell>
                
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium text-sm">
                      Okręg {mp.districtNum}
                    </div>
                    <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                      {mp.districtName}
                    </div>
                  </div>
                </TableCell>
                
                <TableCell className="text-right">
                  <div className="font-medium">
                    {formatNumber(mp.numberOfVotes)}
                  </div>
                </TableCell>
                
                <TableCell>
                  {mp.email ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-primary/10"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        window.open(`mailto:${mp.email}`, '_self')
                      }}
                      title={mp.email}
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
                
                <TableCell>
                  <Link 
                    href={`/poslowie/${mp.id}`}
                    className="inline-block"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                      title="Zobacz profil"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}