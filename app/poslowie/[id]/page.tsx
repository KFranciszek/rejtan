'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchMPProfile } from '@/lib/api'
import { notFound } from 'next/navigation'
import { MPProfile } from './mp-profile'
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useParams } from 'next/navigation'

export default function MPPage() {
  const params = useParams()
  const id = params?.id as string
  const mpId = parseInt(id)

  // Validate ID parameter
  if (!id || isNaN(mpId) || mpId <= 0) {
    console.error(`Invalid MP ID: ${id}`)
    notFound()
  }

  const { data: mp, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['mp', mpId],
    queryFn: () => fetchMPProfile(mpId),
    enabled: !isNaN(mpId) && mpId > 0,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <div className="absolute inset-0 h-12 w-12 animate-pulse-soft mx-auto rounded-full bg-primary/20"></div>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-medium text-foreground">Ładowanie profilu posła...</p>
            <p className="text-sm text-muted-foreground">Pobieramy szczegółowe dane z API Sejmu RP</p>
            <p className="text-xs text-muted-foreground">ID posła: {mpId}</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !mp) {
    return (
      <div className="text-center py-16">
        <div className="space-y-6">
          <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <div className="space-y-2">
            <div className="text-destructive text-xl font-semibold">
              {error ? 'Błąd podczas ładowania profilu' : 'Nie znaleziono posła'}
            </div>
            <div className="text-sm text-muted-foreground max-w-md mx-auto">
              {error 
                ? 'Nie udało się pobrać danych z API Sejmu RP. Sprawdź połączenie internetowe i spróbuj ponownie.'
                : `Poseł o ID ${mpId} nie istnieje w bazie danych Sejmu RP`
              }
            </div>
            {error && (
              <div className="text-xs text-muted-foreground font-mono bg-muted p-2 rounded mt-4 max-w-md mx-auto">
                {error instanceof Error ? error.message : 'Nieznany błąd'}
              </div>
            )}
          </div>
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={() => refetch()} 
              disabled={isRefetching}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
              {isRefetching ? 'Ładowanie...' : 'Spróbuj ponownie'}
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.history.back()}
              className="gap-2"
            >
              Powrót
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return <MPProfile mp={mp} />
}