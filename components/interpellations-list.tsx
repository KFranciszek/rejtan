'use client'

import { useState } from 'react'
import { Interpellation } from '@/types/mp'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { 
  FileText, 
  Calendar, 
  User, 
  ChevronDown, 
  Loader2, 
  AlertCircle,
  ExternalLink,
  Download,
  MessageSquare,
  Clock,
  Sparkles,
  Eye,
  EyeOff,
  Users
} from 'lucide-react'
import { fetchInterpellationBody, fetchInterpellationReplyBody, summarizeTextWithAI } from '@/lib/api'

interface InterpellationsListProps {
  interpellations: Interpellation[]
  mpName: string
}

interface InterpellationDetails {
  interpellationBody?: string
  replyBody?: string
  summary?: {
    question_summary: string
    reply_summary: string
  }
  loadingBody: boolean
  loadingSummary: boolean
  showSummary: boolean
  error?: string
}

export function InterpellationsList({ interpellations, mpName }: InterpellationsListProps) {
  const [interpellationDetails, setInterpellationDetails] = useState<Record<number, InterpellationDetails>>({})

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('pl-PL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  const loadInterpellationDetails = async (interpellation: Interpellation) => {
    if (interpellationDetails[interpellation.num]?.interpellationBody) {
      return // Already loaded
    }

    setInterpellationDetails(prev => ({
      ...prev,
      [interpellation.num]: { 
        ...prev[interpellation.num],
        loadingBody: true,
        showSummary: false
      }
    }))

    try {
      // Fetch interpellation body
      const interpellationBodyData = await fetchInterpellationBody(interpellation.num)
      
      let replyBodyData = null

      // Fetch reply body if replies exist and have a key
      if (interpellation.replies && interpellation.replies.length > 0) {
        const firstReply = interpellation.replies.find(reply => reply.key)
        if (firstReply && firstReply.key) {
          replyBodyData = await fetchInterpellationReplyBody(interpellation.num, firstReply.key)
        }
      }

      setInterpellationDetails(prev => ({
        ...prev,
        [interpellation.num]: {
          ...prev[interpellation.num],
          interpellationBody: interpellationBodyData?.body || 'Brak treści interpelacji',
          replyBody: replyBodyData?.body || undefined,
          loadingBody: false
        }
      }))
    } catch (error) {
      console.error('Error loading interpellation details:', error)
      setInterpellationDetails(prev => ({
        ...prev,
        [interpellation.num]: {
          ...prev[interpellation.num],
          loadingBody: false,
          error: 'Nie udało się załadować szczegółów interpelacji'
        }
      }))
    }
  }

  const toggleSummary = async (interpellation: Interpellation) => {
    const details = interpellationDetails[interpellation.num]
    
    if (!details?.interpellationBody) {
      // Load interpellation details first if not loaded
      await loadInterpellationDetails(interpellation)
      return
    }

    // Toggle summary visibility
    if (details.showSummary) {
      setInterpellationDetails(prev => ({
        ...prev,
        [interpellation.num]: {
          ...prev[interpellation.num],
          showSummary: false
        }
      }))
      return
    }

    // Show summary - generate if not exists
    if (!details.summary && !details.loadingSummary) {
      if (!details.replyBody) {
        // No reply to summarize
        setInterpellationDetails(prev => ({
          ...prev,
          [interpellation.num]: {
            ...prev[interpellation.num],
            showSummary: true,
            summary: {
              question_summary: 'Streszczenie dostępne tylko dla interpelacji z odpowiedziami.',
              reply_summary: 'Brak odpowiedzi do podsumowania.'
            }
          }
        }))
        return
      }

      // Generate AI summary
      setInterpellationDetails(prev => ({
        ...prev,
        [interpellation.num]: {
          ...prev[interpellation.num],
          loadingSummary: true
        }
      }))

      try {
        const summary = await summarizeTextWithAI(details.interpellationBody, details.replyBody)
        setInterpellationDetails(prev => ({
          ...prev,
          [interpellation.num]: {
            ...prev[interpellation.num],
            summary,
            loadingSummary: false,
            showSummary: true
          }
        }))
      } catch (error) {
        console.error('Error generating summary:', error)
        setInterpellationDetails(prev => ({
          ...prev,
          [interpellation.num]: {
            ...prev[interpellation.num],
            loadingSummary: false,
            error: 'Nie udało się wygenerować streszczenia'
          }
        }))
      }
    } else {
      // Just show existing summary
      setInterpellationDetails(prev => ({
        ...prev,
        [interpellation.num]: {
          ...prev[interpellation.num],
          showSummary: true
        }
      }))
    }
  }

  if (!interpellations || interpellations.length === 0) {
    return (
      <Card className="border-2 border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-950/20">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 mx-auto bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-orange-600 dark:text-orange-400" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Interpelacje</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {mpName} nie złożył jeszcze żadnych interpelacji w X kadencji Sejmu.
          </p>
          <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400">
            Brak interpelacji
          </Badge>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2 border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Interpelacje
          <Badge variant="secondary" className="ml-2 bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
            {interpellations.length} {interpellations.length === 1 ? 'interpelacja' : interpellations.length < 5 ? 'interpelacje' : 'interpelacji'}
          </Badge>
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          Interpelacje złożone przez {mpName} w X kadencji Sejmu RP
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {interpellations.map((interpellation, index) => {
            const details = interpellationDetails[interpellation.num]
            const hasReplies = interpellation.replies && interpellation.replies.length > 0
            const hasValidReplies = hasReplies && interpellation.replies!.some(reply => !reply.prolongation)
            
            return (
              <AccordionItem key={interpellation.num} value={`interpellation-${interpellation.num}`}>
                <AccordionTrigger 
                  className="text-left hover:no-underline"
                  onClick={() => loadInterpellationDetails(interpellation)}
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <h4 className="font-medium text-foreground leading-tight">
                        {interpellation.title}
                      </h4>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {hasValidReplies ? (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 text-xs">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Odpowiedziano
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            Oczekuje
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Złożone: {formatDate(interpellation.sentDate)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>Do: {interpellation.to.join(', ')}</span>
                      </div>
                      {interpellation.from.length > 1 && (
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>Współautorzy: {interpellation.from.length - 1}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        <span>Nr {interpellation.num}</span>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                
                <AccordionContent className="space-y-6">
                  {details?.loadingBody && (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-center space-y-2">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                        <p className="text-sm text-muted-foreground">
                          Ładowanie treści interpelacji i odpowiedzi...
                        </p>
                      </div>
                    </div>
                  )}

                  {details?.error && (
                    <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                      <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                      <span className="text-sm text-red-600 dark:text-red-400">{details.error}</span>
                    </div>
                  )}

                  {details?.interpellationBody && !details.loadingBody && (
                    <div className="space-y-4">
                      {/* Summary Toggle Button */}
                      <div className="flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleSummary(interpellation)}
                          disabled={details.loadingSummary}
                          className="gap-2"
                        >
                          {details.loadingSummary ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Generowanie streszczenia...
                            </>
                          ) : details.showSummary ? (
                            <>
                              <EyeOff className="h-4 w-4" />
                              Ukryj streszczenie AI
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4" />
                              Pokaż streszczenie AI
                            </>
                          )}
                        </Button>
                      </div>

                      {/* AI Summary Section */}
                      {details.showSummary && details.summary && (
                        <div className="space-y-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                          <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                            <Sparkles className="h-4 w-4" />
                            <span className="font-semibold text-sm">Streszczenie AI</span>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="bg-white dark:bg-gray-900 p-3 rounded-lg border">
                              <h5 className="font-semibold text-foreground mb-2 flex items-center gap-2 text-sm">
                                <FileText className="h-4 w-4" />
                                Interpelacja
                              </h5>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {details.summary.question_summary}
                              </p>
                            </div>

                            {details.replyBody && (
                              <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                                <h5 className="font-semibold text-foreground mb-2 flex items-center gap-2 text-sm">
                                  <MessageSquare className="h-4 w-4" />
                                  Odpowiedź
                                </h5>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                  {details.summary.reply_summary}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Full Content Section */}
                      <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
                          <h5 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Treść interpelacji
                          </h5>
                          <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                            {details.interpellationBody}
                          </div>
                        </div>

                        {details.replyBody && (
                          <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                            <h5 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                              <MessageSquare className="h-4 w-4" />
                              Treść odpowiedzi
                            </h5>
                            <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                              {details.replyBody}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Reply information and attachments */}
                  {hasReplies && (
                    <div className="space-y-3">
                      <h5 className="font-semibold text-foreground">Informacje o odpowiedzi</h5>
                      {interpellation.replies!.map((reply, replyIndex) => (
                        <div key={replyIndex} className="bg-muted/30 p-3 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-sm font-medium">
                              {reply.prolongation ? 'Prolongata' : `Odpowiedź #${replyIndex + 1}`}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatDate(reply.receiptDate)}
                            </div>
                          </div>
                          
                          <div className="text-sm text-muted-foreground mb-2">
                            Od: {reply.from}
                          </div>

                          {reply.attachments && reply.attachments.length > 0 && (
                            <div className="space-y-2">
                              <div className="text-sm font-medium">Załączniki:</div>
                              {reply.attachments.map((attachment, attachIndex) => (
                                <div key={attachIndex} className="flex items-center gap-2">
                                  <Download className="h-4 w-4 text-muted-foreground" />
                                  <a 
                                    href={attachment.URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary hover:underline flex items-center gap-1"
                                  >
                                    {attachment.name}
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {!hasValidReplies && details?.interpellationBody && (
                    <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm font-medium">Oczekuje na odpowiedź</span>
                      </div>
                      <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                        Ta interpelacja nie otrzymała jeszcze odpowiedzi od adresata
                      </div>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </CardContent>
    </Card>
  )
}