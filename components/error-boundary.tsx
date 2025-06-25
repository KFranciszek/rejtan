'use client'

import { Component, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="text-center py-16">
          <div className="space-y-6">
            <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <div className="space-y-2">
              <div className="text-destructive text-xl font-semibold">
                Wystąpił nieoczekiwany błąd
              </div>
              <div className="text-sm text-muted-foreground max-w-md mx-auto">
                Aplikacja napotkała problem. Spróbuj odświeżyć stronę lub skontaktuj się z administratorem.
              </div>
              {this.state.error && (
                <div className="text-xs text-muted-foreground font-mono bg-muted p-2 rounded mt-4">
                  {this.state.error.message}
                </div>
              )}
            </div>
            <Button 
              onClick={() => window.location.reload()}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Odśwież stronę
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}