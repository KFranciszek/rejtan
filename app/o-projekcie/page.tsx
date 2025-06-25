'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Eye, 
  Users, 
  FileText, 
  Search, 
  Github, 
  Heart, 
  Lightbulb,
  Target,
  Shield,
  Code,
  ExternalLink,
  Mail,
  MessageSquare
} from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-5"></div>
        <div className="relative text-center space-y-6 py-12">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              <Eye className="h-4 w-4" />
              Transparentność w działaniu
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              O projekcie Posłowie.pl
            </h1>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Otwarta inicjatywa na rzecz transparentności życia publicznego i edukacji obywatelskiej
            </p>
          </div>
        </div>
      </div>

      {/* Main Story */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-foreground">
              Zastanawiałeś się kiedyś...
            </h2>
            <div className="text-lg text-muted-foreground space-y-4 leading-relaxed">
              <p>
                ...kim właściwie są ludzie, którzy decydują o prawie i przyszłości naszego kraju? 
                Jak głosują, jaki mają majątek, czy chodzą na posiedzenia Sejmu, czy raczej tylko 
                po sejmowych korytarzach?
              </p>
              <p className="font-medium text-foreground">
                No właśnie – my też!
              </p>
            </div>
          </div>
        </div>
        
        <div className="glass rounded-2xl p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-foreground">460</div>
              <div className="text-sm text-muted-foreground">posłów w bazie</div>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-2xl font-bold text-foreground">1000+</div>
              <div className="text-sm text-muted-foreground">oświadczeń</div>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <Search className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-foreground">100%</div>
              <div className="text-sm text-muted-foreground">przejrzystość</div>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <Heart className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="text-2xl font-bold text-foreground">0</div>
              <div className="text-sm text-muted-foreground">ukrytych kosztów</div>
            </div>
          </div>
        </div>
      </div>

      {/* Solution */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-purple-500/5">
        <CardContent className="p-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Lightbulb className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Nasze rozwiązanie</h2>
            </div>
            
            <div className="text-lg text-muted-foreground space-y-4 leading-relaxed">
              <p>
                Dlatego stworzyliśmy aplikację <strong className="text-foreground">Posłowie.pl</strong>. 
                Chcemy, żeby każdy mógł w łatwy sposób zobaczyć, kim są nasi przedstawiciele – 
                bez przedzierania się przez sterty PDF-ów, tabel i stron internetowych, 
                które wyglądają jak z poprzedniej epoki.
              </p>
              
              <p>
                Na Posłowie.pl w jednym miejscu znajdziesz przejrzyste profile wszystkich posłów 
                aktualnej kadencji – wraz z ich danymi osobowymi, frekwencją, przynależnością do klubów, 
                a także oświadczeniami majątkowymi dostępnymi w wygodnej, czytelnej formie.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="card-hover">
          <CardContent className="p-6 space-y-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Profile posłów</h3>
            <p className="text-sm text-muted-foreground">
              Kompletne dane osobowe, zawodowe i polityczne wszystkich parlamentarzystów w jednym miejscu
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6 space-y-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Frekwencja</h3>
            <p className="text-sm text-muted-foreground">
              Śledzenie obecności posłów na głosowaniach i posiedzeniach Sejmu
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6 space-y-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Oświadczenia majątkowe</h3>
            <p className="text-sm text-muted-foreground">
              Przejrzyste prezentowanie majątku posłów w czytelnej, dostępnej formie
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6 space-y-4">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
              <Search className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Łatwe wyszukiwanie</h3>
            <p className="text-sm text-muted-foreground">
              Intuicyjne filtry i wyszukiwarka pozwalają szybko znaleźć interesujących posłów
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6 space-y-4">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Wiarygodne dane</h3>
            <p className="text-sm text-muted-foreground">
              Wszystkie informacje pochodzą z oficjalnych źródeł Sejmu RP
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6 space-y-4">
            <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/20 rounded-lg flex items-center justify-center">
              <Code className="h-6 w-6 text-teal-600 dark:text-teal-400" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Open Source</h3>
            <p className="text-sm text-muted-foreground">
              Otwarty kod źródłowy pozwala każdemu na weryfikację i rozwój projektu
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Mission Statement */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-primary/20">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Eye className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Nasza misja</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Naszym celem jest, aby każdy obywatel, dziennikarz czy aktywista miał prosty dostęp 
              do wiarygodnych i aktualnych informacji o swoich przedstawicielach w parlamencie.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="secondary" className="px-3 py-1">Edukacja obywatelska</Badge>
              <Badge variant="secondary" className="px-3 py-1">Kontrola społeczna</Badge>
              <Badge variant="secondary" className="px-3 py-1">Transparentność</Badge>
              <Badge variant="secondary" className="px-3 py-1">Dostępność</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Open Source Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-foreground">Otwarta inicjatywa</h2>
          <div className="text-lg text-muted-foreground space-y-4 leading-relaxed">
            <p>
              Projekt rozwijamy jako <strong className="text-foreground">otwartą inicjatywę</strong> – 
              możesz śledzić nasz kod na GitHubie, zgłaszać własne pomysły albo stworzyć własną wersję aplikacji.
            </p>
            <p>
              <strong className="text-foreground">Im nas więcej, tym polityka staje się bardziej przejrzysta.</strong>
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button className="gap-2" asChild>
              <a href="https://github.com/poslowie-pl" target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
                Zobacz kod na GitHub
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
            <Button variant="outline" className="gap-2" asChild>
              <a href="mailto:kontakt@poslowie.pl">
                <Mail className="h-4 w-4" />
                Skontaktuj się z nami
              </a>
            </Button>
          </div>
        </div>
        
        <Card className="glass">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Jak możesz pomóc?
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <span>Zgłaszaj błędy i sugestie ulepszeń</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <span>Dziel się projektem ze znajomymi</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <span>Współtwórz kod na GitHubie</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <span>Używaj danych w swoich projektach</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/30">
        <CardContent className="p-8 text-center space-y-6">
          <h2 className="text-3xl font-bold text-foreground">
            Dołącz do nas!
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Razem miejmy oko na posłów – w końcu to nasi reprezentanci, 
            więc mamy prawo wiedzieć o nich wszystko!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="gap-2" asChild>
              <a href="/">
                <Users className="h-5 w-5" />
                Przeglądaj posłów
              </a>
            </Button>
            <Button variant="outline" size="lg" className="gap-2" asChild>
              <a href="https://github.com/poslowie-pl" target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5" />
                Dołącz na GitHub
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}