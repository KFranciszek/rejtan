import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import { ErrorBoundary } from "@/components/error-boundary"
import Link from "next/link"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Posłowie.pl - Transparentność życia publicznego",
  description: "Nowoczesna aplikacja do prezentacji danych o posłach X kadencji Sejmu RP i ich oświadczeniach majątkowych. Dane pobierane na żywo z oficjalnego API Sejmu.",
  keywords: ["posłowie", "sejm", "transparentność", "oświadczenia majątkowe", "parlament", "API"],
  authors: [{ name: "Posłowie.pl" }],
  openGraph: {
    title: "Posłowie.pl - Transparentność życia publicznego",
    description: "Sprawdź dane o posłach X kadencji Sejmu RP - na żywo z oficjalnego API",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
          <Providers>
            <div className="min-h-screen bg-background">
              <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                  <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2 group">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                        <span className="text-white font-bold text-sm">P</span>
                      </div>
                      <div>
                        <h1 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">Posłowie.pl</h1>
                        <p className="text-xs text-muted-foreground">X kadencja Sejmu RP • API na żywo</p>
                      </div>
                    </Link>
                    <nav className="hidden md:flex items-center space-x-6">
                      <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                        Posłowie
                      </Link>
                      <Link href="/statystyki" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        Statystyki
                      </Link>
                      <Link href="/o-projekcie" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        O projekcie
                      </Link>
                    </nav>
                  </div>
                </div>
              </header>
              <main className="container mx-auto px-4 py-8">
                {children}
              </main>
              <footer className="border-t bg-muted/50 mt-16">
                <div className="container mx-auto px-4 py-8">
                  <div className="text-center text-sm text-muted-foreground space-y-2">
                    <p>© 2024 Posłowie.pl - Dane pochodzą z oficjalnego API Sejmu RP</p>
                    <p>
                      Projekt wspiera transparentność życia publicznego i edukację obywatelską
                    </p>
                    <div className="flex justify-center items-center gap-4 mt-4">
                      <Link href="/o-projekcie" className="hover:text-primary transition-colors">
                        O projekcie
                      </Link>
                      <span>•</span>
                      <a href="https://github.com/poslowie-pl" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                        GitHub
                      </a>
                      <span>•</span>
                      <a href="mailto:kontakt@poslowie.pl" className="hover:text-primary transition-colors">
                        Kontakt
                      </a>
                      <span>•</span>
                      <a href="https://api.sejm.gov.pl" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                        API Sejmu
                      </a>
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  )
}