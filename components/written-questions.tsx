'use client'

import { useState } from 'react'
import { WrittenQuestion } from '@/types/mp'
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
  EyeOff
} from 'lucide-react'
import { fetchWrittenQuestionBody, fetchWrittenQuestionReplyBody, summarizeTextWithAI } from '@/lib/api'

interface WrittenQuestionsProps {
  questions: WrittenQuestion[]
  mpName: string
}

interface QuestionDetails {
  questionBody?: string
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

export function WrittenQuestions({ questions, mpName }: WrittenQuestionsProps) {
  const [questionDetails, setQuestionDetails] = useState<Record<number, QuestionDetails>>({})

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

  const loadQuestionDetails = async (question: WrittenQuestion) => {
    if (questionDetails[question.num]?.questionBody) {
      return // Already loaded
    }

    setQuestionDetails(prev => ({
      ...prev,
      [question.num]: { 
        ...prev[question.num],
        loadingBody: true,
        showSummary: false
      }
    }))

    try {
      // Fetch question body
      const questionBodyData = await fetchWrittenQuestionBody(question.num)
      
      let replyBodyData = null

      // Fetch reply body if replies exist
      if (question.replies && question.replies.length > 0) {
        const firstReply = question.replies[0]
        replyBodyData = await fetchWrittenQuestionReplyBody(question.num, firstReply.key)
      }

      setQuestionDetails(prev => ({
        ...prev,
        [question.num]: {
          ...prev[question.num],
          questionBody: questionBodyData?.body || 'Brak treści zapytania',
          replyBody: replyBodyData?.body || undefined,
          loadingBody: false
        }
      }))
    } catch (error) {
      console.error('Error loading question details:', error)
      setQuestionDetails(prev => ({
        ...prev,
        [question.num]: {
          ...prev[question.num],
          loadingBody: false,
          error: 'Nie udało się załadować szczegółów zapytania'
        }
      }))
    }
  }

  const toggleSummary = async (question: WrittenQuestion) => {
    const details = questionDetails[question.num]
    
    if (!details?.questionBody) {
      // Load question details first if not loaded
      await loadQuestionDetails(question)
      return
    }

    // Toggle summary visibility
    if (details.showSummary) {
      setQuestionDetails(prev => ({
        ...prev,
        [question.num]: {
          ...prev[question.num],
          showSummary: false
        }
      }))
      return
    }

    // Show summary - generate if not exists
    if (!details.summary && !details.loadingSummary) {
      if (!details.replyBody) {
        // No reply to summarize
        setQuestionDetails(prev => ({
          ...prev,
          [question.num]: {
            ...prev[question.num],
            showSummary: true,
            summary: {
              question_summary: 'Streszczenie dostępne tylko dla zapytań z odpowiedziami.',
              reply_summary: 'Brak odpowiedzi do podsumowania.'
            }
          }
        }))
        return
      }

      // Generate AI summary
      setQuestionDetails(prev => ({
        ...prev,
        [question.num]: {
          ...prev[question.num],
          loadingSummary: true
        }
      }))

      try {
        const summary = await summarizeTextWithAI(details.questionBody, details.replyBody)
        setQuestionDetails(prev => ({
          ...prev,
          [question.num]: {
            ...prev[question.num],
            summary,
            loadingSummary: false,
            showSummary: true
          }
        }))
      } catch (error) {
        console.error('Error generating summary:', error)
        setQuestionDetails(prev => ({
          ...prev,
          [question.num]: {
            ...prev[question.num],
            loadingSummary: false,
            error: 'Nie udało się wygenerować streszczenia'
          }
        }))
      }
    } else {
      // Just show existing summary
      setQuestionDetails(prev => ({
        ...prev,
        [question.num]: {
          ...prev[question.num],
          showSummary: true
        }
      }))
    }
  }

  if (!questions || questions.length === 0) {
    return (
      <Card className="border-2 border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-950/20">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 mx-auto bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-orange-600 dark:text-orange-400" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Zapytania poselskie</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {mpName} nie złożył jeszcze żadnych zapytań poselskich w X kadencji Sejmu.
          </p>
          <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400">
            Brak zapytań
          </Badge>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2 border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Zapytania poselskie
          <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
            {questions.length} {questions.length === 1 ? 'zapytanie' : questions.length < 5 ? 'zapytania' : 'zapytań'}
          </Badge>
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          Zapytania złożone przez {mpName} w X kadencji Sejmu RP
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {questions.map((question, index) => {
            const details = questionDetails[question.num]
            const hasReplies = question.replies && question.replies.length > 0
            
            return (
              <AccordionItem key={question.num} value={`question-${question.num}`}>
                <AccordionTrigger 
                  className="text-left hover:no-underline"
                  onClick={() => loadQuestionDetails(question)}
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <h4 className="font-medium text-foreground leading-tight">
                        {question.title}
                      </h4>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {hasReplies ? (
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
                        <span>Złożone: {formatDate(question.sentDate)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>Do: {question.to}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        <span>Nr {question.num}</span>
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
                          Ładowanie treści zapytania i odpowiedzi...
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

                  {details?.questionBody && !details.loadingBody && (
                    <div className="space-y-4">
                      {/* Summary Toggle Button */}
                      <div className="flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleSummary(question)}
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
                                Zapytanie
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
                            Treść zapytania
                          </h5>
                          <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                            {details.questionBody}
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
                      {question.replies!.map((reply, replyIndex) => (
                        <div key={reply.key} className="bg-muted/30 p-3 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-sm font-medium">Odpowiedź #{replyIndex + 1}</div>
                            <div className="text-xs text-muted-foreground">
                              {formatDate(reply.sentDate)}
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

                  {!hasReplies && details?.questionBody && (
                    <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm font-medium">Oczekuje na odpowiedź</span>
                      </div>
                      <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                        To zapytanie nie otrzymało jeszcze odpowiedzi od adresata
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