'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchMPs, fetchInterpellations } from '@/lib/api'
import { notFound } from 'next/navigation'
import { InterpellationsList } from '@/components/interpellations-list'
import { Loader2, AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function MPInterpellationsPage() {
  const params = useParams()
  const id = params?.id as string
  const mpId = parseInt(id)

  // Validate ID parameter
  if (!id || isNaN(mpId) || mpId <= 0) {
    console.error(`Invalid MP ID: ${id}`)
    notFound()
  }

  // Fetch MP basic data to get name
  const { data: mps } = useQuery({
    queryKey: ['mps'],
    queryFn: fetchMPs,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })

  const mp = mps?.find(mp => mp.id === mpId)

  // Fetch interpellations
  const { data: interpellations, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['interpellations', mpId],
    queryFn: () => fetchInterpellations(mpId),
    enabled: !isNaN(mpId) && mpId > 0,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  })

  if (!mp) {
    return (
      <div className="text-center py-16">
        <div className="space-y-6">
          <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <div className="space-y-2">
            <div className="text-destructive text-xl font-semibold">
              Nie znaleziono posła
            </div>
            <div className="text-sm text-muted-foreground max-w-md mx-auto">
              Poseł o ID {mpId} nie istnieje w bazie danych Sejmu RP
            </div>
          </div>
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Powrót do listy posłów
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Back Button */}
        <div>
          <Link href={`/poslowie/${mpId}`}>
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Powrót do profilu posła
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-foreground">
            Interpelacje - {mp.firstLastName}
          </h1>
          <p className="text-muted-foreground">
            Lista wszystkich interpelacji złożonych przez {mp.firstLastName} w X kadencji Sejmu RP
          </p>
        </div>

        {/* Loading State */}
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="text-center space-y-4">
            <div className="relative">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
              <div className="absolute inset-0 h-12 w-12 animate-pulse-soft mx-auto rounded-full bg-primary/20"></div>
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium text-foreground">Ładowanie interpelacji...</p>
              <p className="text-sm text-muted-foreground">Pobieramy dane z API Sejmu RP</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        {/* Back Button */}
        <div>
          <Link href={`/poslowie/${mpId}`}>
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Powrót do profilu posła
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-foreground">
            Interpelacje - {mp.firstLastName}
          </h1>
        </div>

        {/* Error State */}
        <div className="text-center py-16">
          <div className="space-y-6">
            <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <div className="space-y-2">
              <div className="text-destructive text-xl font-semibold">
                Błąd podczas ładowania interpelacji
              </div>
              <div className="text-sm text-muted-foreground max-w-md mx-auto">
                Nie udało się pobrać interpelacji z API Sejmu RP. Sprawdź połączenie internetowe i spróbuj ponownie.
              </div>
              {error && (
                <div className="text-xs text-muted-foreground font-mono bg-muted p-2 rounded mt-4 max-w-md mx-auto">
                  {error instanceof Error ? error.message : 'Nieznany błąd'}
                </div>
              )}
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
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div>
        <Link href={`/poslowie/${mpId}`}>
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Powrót do profilu posła
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-foreground">
          Interpelacje - {mp.firstLastName}
        </h1>
        <p className="text-muted-foreground">
          Lista wszystkich interpelacji złożonych przez {mp.firstLastName} w X kadencji Sejmu RP
        </p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Klub: <strong className="text-foreground">{mp.club}</strong></span>
          <span>•</span>
          <span>Okręg: <strong className="text-foreground">{mp.districtNum} - {mp.districtName}</strong></span>
          <span>•</span>
          <span>Interpelacji: <strong className="text-foreground">{interpellations?.length || 0}</strong></span>
        </div>
      </div>

      {/* Interpellations Component */}
      <InterpellationsList 
        interpellations={interpellations || []} 
        mpName={mp.firstLastName}
      />
    </div>
  )
}