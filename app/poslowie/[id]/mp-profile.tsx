'use client'

import Link from 'next/link'
import { MPProfile as MPProfileType } from '@/types/mp'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { 
  ArrowLeft, 
  Mail, 
  MapPin, 
  Calendar, 
  GraduationCap, 
  Briefcase, 
  Users, 
  Vote,
  FileText,
  MessageSquare,
  TrendingUp,
  Activity,
  AlertCircle,
  CheckCircle,
  BarChart3,
  User,
  DollarSign,
  Home,
  Car,
  CreditCard,
  Building,
  Coins,
  Receipt,
  Database,
  Clock,
  ExternalLink
} from 'lucide-react'
import { formatNumber, getClubColor, getPresenceColor, calculateAge } from '@/lib/utils'

interface MPProfileProps {
  mp: MPProfileType
}

export function MPProfile({ mp }: MPProfileProps) {
  const presenceColor = getPresenceColor(mp.stats.presencePct)
  const age = mp.birthDate ? calculateAge(mp.birthDate) : mp.age

  const formatCurrency = (value: string) => {
    return value.replace(/(\d+)([A-Z]{3})/g, '$1 $2')
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('pl-PL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div>
        <Link href="/">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Powrót do listy posłów
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center ring-4 ring-white/20 shadow-xl">
            <User className="h-12 w-12 text-white" />
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{mp.firstLastName}</h1>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge className={`${getClubColor(mp.club)} text-white border-white/20`}>
                {mp.club}
              </Badge>
              {!mp.active ? (
                <Badge variant="secondary" className="bg-red-500/20 text-red-100 border-red-300/20 gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Nieaktywny
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-green-500/20 text-green-100 border-green-300/20 gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Aktywny
                </Badge>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Okręg {mp.districtNum} · {mp.districtName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{formatNumber(mp.numberOfVotes)} głosów w wyborach</span>
              </div>
              {mp.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <a href={`mailto:${mp.email}`} className="hover:underline">
                    {mp.email}
                  </a>
                </div>
              )}
              {age && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{age} lat</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Personal Info Only */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Dane osobowe
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mp.birthDate && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Data urodzenia</div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(mp.birthDate).toLocaleDateString('pl-PL')}</span>
                  </div>
                </div>
              )}
              
              {mp.birthLocation && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Miejsce urodzenia</div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{mp.birthLocation}</span>
                  </div>
                </div>
              )}
              
              {mp.profession && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Zawód</div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span>{mp.profession}</span>
                  </div>
                </div>
              )}
              
              {mp.educationLevel && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Wykształcenie</div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span>{mp.educationLevel}</span>
                  </div>
                </div>
              )}
              
              {mp.voivodeship && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Województwo</div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{mp.voivodeship}</span>
                  </div>
                </div>
              )}

              {mp.inactiveCause && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Przyczyna nieaktywności</div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="text-red-600 dark:text-red-400">{mp.inactiveCause}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Activity Details */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {/* Contact & Additional Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Informacje kontaktowe i dodatkowe
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Dane kontaktowe</h4>
                    <div className="space-y-3">
                      {mp.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <a href={`mailto:${mp.email}`} className="text-primary hover:underline">
                            {mp.email}
                          </a>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>Okręg {mp.districtNum} - {mp.districtName}</span>
                      </div>
                      {mp.voivodeship && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>Województwo {mp.voivodeship}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold">Przynależność polityczna</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <Badge className={getClubColor(mp.club)}>
                          {mp.club}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Klub parlamentarny w X kadencji Sejmu
                      </div>
                      <div className="text-sm">
                        <strong>Głosy w wyborach:</strong> {formatNumber(mp.numberOfVotes)}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Voting Statistics Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Statystyki głosowań
                  <Badge variant="secondary" className="ml-2">
                    Dane z API Sejmu
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Overall Presence */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Frekwencja ogólna
                    </h4>
                    <div className="text-center">
                      <div className={`text-4xl font-bold mb-2 ${presenceColor}`}>
                        {mp.stats.presencePct}%
                      </div>
                      <Progress value={mp.stats.presencePct} className="h-3 mb-4" />
                      <div className="text-sm text-muted-foreground">
                        obecność w głosowaniach
                      </div>
                    </div>
                  </div>

                  {/* Votes Cast */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Głosowania
                    </h4>
                    <div className="space-y-3">
                      <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg text-center">
                        <div className="text-3xl font-bold text-green-600 mb-1">{mp.stats.voted}</div>
                        <div className="text-sm text-muted-foreground">głosował</div>
                      </div>
                      <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg text-center">
                        <div className="text-3xl font-bold text-red-600 mb-1">{mp.stats.missed}</div>
                        <div className="text-sm text-muted-foreground">nieobecny</div>
                      </div>
                    </div>
                  </div>

                  {/* Total Votings */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg flex items-center gap-2">
                      <Vote className="h-5 w-5" />
                      Łącznie
                    </h4>
                    <div className="text-center bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg">
                      <div className="text-4xl font-bold text-blue-600 mb-2">
                        {mp.stats.totalVotings}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        głosowań w X kadencji
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Parliamentary Activity Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Aktywność parlamentarna
                  <Badge variant="secondary" className="ml-2">
                    Dane z API Sejmu
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Interpellations */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Interpelacje
                    </h4>
                    <div className="text-center bg-purple-50 dark:bg-purple-950/20 p-6 rounded-lg">
                      <div className="text-4xl font-bold text-purple-600 mb-2">
                        {mp.interpellationsCount}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        złożonych interpelacji
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        w X kadencji Sejmu
                      </div>
                    </div>
                    
                    {/* Button to view interpellations */}
                    <div className="text-center mt-4">
                      <Link href={`/poslowie/${mp.id}/interpelacje`}>
                        <Button variant="outline" size="sm" className="gap-2">
                          <FileText className="h-4 w-4" />
                          Zobacz interpelacje
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Questions */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Zapytania poselskie
                    </h4>
                    <div className="text-center bg-orange-50 dark:bg-orange-950/20 p-6 rounded-lg">
                      <div className="text-4xl font-bold text-orange-600 mb-2">
                        {mp.questionsCount}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        zadanych pytań
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        w X kadencji Sejmu
                      </div>
                    </div>
                    
                    {/* Button to view questions */}
                    <div className="text-center mt-4">
                      <Link href={`/poslowie/${mp.id}/zapytania`}>
                        <Button variant="outline" size="sm" className="gap-2">
                          <MessageSquare className="h-4 w-4" />
                          Zobacz zapytania
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Financial Declaration Section - MOVED TO BOTTOM */}
      {mp.financialDeclaration && (
        <Card className="border-2 border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Oświadczenie Majątkowe
              <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                Dane wyekstraktowane z oficjalnych dokumentów
              </Badge>
            </CardTitle>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Złożone: {mp.financialDeclaration.miejsce_i_data_zlozenia} • 
              Przetworzono: {formatDate(mp.financialDeclaration.data_przetworzenia)}
            </div>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="w-full">
              {/* Dane osobowe */}
              <AccordionItem value="personal-data">
                <AccordionTrigger className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Dane osobowe
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Imiona i nazwisko</div>
                      <div className="font-medium">{mp.financialDeclaration.imiona_i_nazwisko}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Data i miejsce urodzenia</div>
                      <div>{mp.financialDeclaration.data_i_miejsce_urodzenia}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Stanowisko</div>
                      <div>{mp.financialDeclaration.miejsce_zatrudnienia_stanowisko_lub_funkcja}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Ustrój majątkowy</div>
                      <div>{mp.financialDeclaration.ustroj_majatkowy}</div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* I. Zasoby pieniężne */}
              <AccordionItem value="financial-assets">
                <AccordionTrigger className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  I. Zasoby pieniężne
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
                      <div className="text-sm font-medium text-muted-foreground mb-2">Środki pieniężne PLN</div>
                      <div className="text-lg font-bold text-green-600">{formatCurrency(mp.financialDeclaration.srodki_pieniezne_pln)}</div>
                    </div>
                    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
                      <div className="text-sm font-medium text-muted-foreground mb-2">Waluty obce</div>
                      <div className="text-lg font-bold text-blue-600">{mp.financialDeclaration.srodki_pieniezne_waluta_obca}</div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
                    <div className="text-sm font-medium text-muted-foreground mb-2">Papiery wartościowe</div>
                    <div>{mp.financialDeclaration.papiery_wartosciowe}</div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* II. Nieruchomości */}
              <AccordionItem value="real-estate">
                <AccordionTrigger className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  II. Nieruchomości
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  {mp.financialDeclaration.dom && (
                    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
                      <div className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                        <Home className="h-4 w-4" />
                        Dom
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <div className="text-xs text-muted-foreground">Powierzchnia</div>
                          <div className="font-medium">{mp.financialDeclaration.dom.powierzchnia}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Wartość</div>
                          <div className="font-medium text-green-600">{formatCurrency(mp.financialDeclaration.dom.wartosc)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Tytuł prawny</div>
                          <div className="font-medium">{mp.financialDeclaration.dom.tytul_prawny}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {mp.financialDeclaration.mieszkanie && mp.financialDeclaration.mieszkanie.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        Mieszkania
                      </div>
                      {mp.financialDeclaration.mieszkanie.map((mieszkanie, index) => (
                        <div key={index} className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <div className="text-xs text-muted-foreground">Powierzchnia</div>
                              <div className="font-medium">{mieszkanie.powierzchnia}</div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">Wartość</div>
                              <div className="font-medium text-green-600">{formatCurrency(mieszkanie.wartosc)}</div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">Tytuł prawny</div>
                              <div className="font-medium">{mieszkanie.tytul_prawny}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {mp.financialDeclaration.gospodarstwo_rolne && (
                    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
                      <div className="text-sm font-medium text-muted-foreground mb-2">Gospodarstwo rolne</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-muted-foreground">Rodzaj</div>
                          <div className="font-medium">{mp.financialDeclaration.gospodarstwo_rolne.rodzaj}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Powierzchnia</div>
                          <div className="font-medium">{mp.financialDeclaration.gospodarstwo_rolne.powierzchnia}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Wartość</div>
                          <div className="font-medium text-green-600">{formatCurrency(mp.financialDeclaration.gospodarstwo_rolne.wartosc)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Przychód/Dochód</div>
                          <div className="font-medium">{mp.financialDeclaration.gospodarstwo_rolne.przychod_dochod}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {mp.financialDeclaration.inne_nieruchomosci !== "Nie dotyczy" && (
                    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
                      <div className="text-sm font-medium text-muted-foreground mb-2">Inne nieruchomości</div>
                      <div>{mp.financialDeclaration.inne_nieruchomosci}</div>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>

              {/* IX. Inne dochody */}
              <AccordionItem value="other-income">
                <AccordionTrigger className="flex items-center gap-2">
                  <Receipt className="h-4 w-4" />
                  IX. Inne dochody
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  {mp.financialDeclaration.inne_dochody.map((dochod, index) => (
                    <div key={index} className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{dochod.zrodlo}</div>
                          <div className="text-sm text-muted-foreground">Źródło dochodu</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">{formatCurrency(dochod.kwota)}</div>
                          <div className="text-sm text-muted-foreground">Kwota</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>

              {/* X. Składniki mienia ruchomego */}
              <AccordionItem value="movable-property">
                <AccordionTrigger className="flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  X. Składniki mienia ruchomego
                </AccordionTrigger>
                <AccordionContent className="space-y-2">
                  {mp.financialDeclaration.mienie_ruchome.map((item, index) => (
                    <div key={index} className="bg-white dark:bg-gray-900 p-3 rounded-lg border flex items-center gap-2">
                      <Coins className="h-4 w-4 text-muted-foreground" />
                      <span>{item}</span>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>

              {/* XI. Zobowiązania pieniężne */}
              <AccordionItem value="financial-obligations">
                <AccordionTrigger className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  XI. Zobowiązania pieniężne
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  {mp.financialDeclaration.zobowiazania_pieniezne.map((zobowiazanie, index) => (
                    <div key={index} className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-red-200 dark:border-red-800">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <div className="text-xs text-muted-foreground">Wierzyciel</div>
                          <div className="font-medium">{zobowiazanie.wierzyciel}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Kwota</div>
                          <div className="font-medium text-red-600">{formatCurrency(zobowiazanie.kwota)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Warunki</div>
                          <div className="font-medium">{zobowiazanie.warunki}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>

              {/* Działalność gospodarcza */}
              {mp.financialDeclaration.dzialalnosc_gospodarcza_i_udzialy_w_spolkach !== "Nie dotyczy" && (
                <AccordionItem value="business-activity">
                  <AccordionTrigger className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    III-VIII. Działalność gospodarcza i udziały w spółkach
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
                      {mp.financialDeclaration.dzialalnosc_gospodarcza_i_udzialy_w_spolkach}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>

            {/* Data Source Info */}
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <Database className="h-4 w-4" />
                <span className="text-sm font-medium">Dane wyekstraktowane z oficjalnych dokumentów posła</span>
              </div>
              <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                Oświadczenie majątkowe zostało przetworzone przez system analizy dokumentów AI
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Financial Declaration Message */}
      {!mp.financialDeclaration && (
        <Card className="border-2 border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-950/20">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 mx-auto bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Oświadczenie majątkowe</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Dane z oświadczenia majątkowego dla tego posła nie zostały jeszcze przetworzone przez system analizy dokumentów.
            </p>
            <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400">
              W trakcie przetwarzania
            </Badge>
          </CardContent>
        </Card>
      )}
    </div>
  )
}