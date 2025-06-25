'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  FileText, 
  Vote, 
  Calendar,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  Wrench
} from 'lucide-react'

interface FeatureItem {
  id: string
  name: string
  description: string
  category: 'KPI' | 'Rankingi' | 'Porównania' | 'Analiza czasowa' | 'Legislacja'
  progress: number
  status: 'planned' | 'in-progress' | 'testing' | 'completed'
  icon: React.ReactNode
}

const plannedFeatures: FeatureItem[] = [
  // KPI Cards
  {
    id: 'kpi-attendance',
    name: 'Średnia frekwencja Sejmu',
    description: 'Ogólna frekwencja wszystkich posłów w głosowaniach',
    category: 'KPI',
    progress: 25,
    status: 'planned',
    icon: <TrendingUp className="h-4 w-4" />
  },
  {
    id: 'kpi-votings',
    name: 'Liczba głosowań w kadencji',
    description: 'Łączna liczba przeprowadzonych głosowań',
    category: 'KPI',
    progress: 15,
    status: 'planned',
    icon: <Vote className="h-4 w-4" />
  },
  {
    id: 'kpi-interpellations',
    name: 'Łączna liczba interpelacji',
    description: 'Suma wszystkich złożonych interpelacji',
    category: 'KPI',
    progress: 30,
    status: 'planned',
    icon: <MessageSquare className="h-4 w-4" />
  },

  // Rankingi posłów
  {
    id: 'ranking-attendance',
    name: 'Ranking frekwencji',
    description: 'Top 10 posłów z najwyższą frekwencją',
    category: 'Rankingi',
    progress: 45,
    status: 'in-progress',
    icon: <BarChart3 className="h-4 w-4" />
  },
  {
    id: 'ranking-interpellations',
    name: 'Ranking interpelacji',
    description: 'Top 10 posłów z największą liczbą interpelacji',
    category: 'Rankingi',
    progress: 40,
    status: 'in-progress',
    icon: <MessageSquare className="h-4 w-4" />
  },
  {
    id: 'ranking-questions',
    name: 'Ranking zapytań',
    description: 'Top 10 posłów z największą liczbą zapytań poselskich',
    category: 'Rankingi',
    progress: 35,
    status: 'planned',
    icon: <FileText className="h-4 w-4" />
  },

  // Porównanie klubów
  {
    id: 'clubs-voting',
    name: 'Porównanie głosowań klubów',
    description: 'Stacked bar: "Za / Przeciw / Wstrz." (procentowo)',
    category: 'Porównania',
    progress: 20,
    status: 'planned',
    icon: <Users className="h-4 w-4" />
  },

  // Frekwencja w czasie
  {
    id: 'attendance-heatmap',
    name: 'Frekwencja w czasie',
    description: 'Heatmapa tydzień × klub',
    category: 'Analiza czasowa',
    progress: 10,
    status: 'planned',
    icon: <Calendar className="h-4 w-4" />
  },

  // Aktywność legislacyjna
  {
    id: 'legislative-timeline',
    name: 'Aktywność legislacyjna',
    description: 'Linia czasu "projekty ustaw" (druki)',
    category: 'Legislacja',
    progress: 5,
    status: 'planned',
    icon: <Activity className="h-4 w-4" />
  }
]

const getStatusBadge = (status: FeatureItem['status']) => {
  switch (status) {
    case 'completed':
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 gap-1">
          <CheckCircle className="h-3 w-3" />
          Gotowe
        </Badge>
      )
    case 'testing':
      return (
        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 gap-1">
          <AlertCircle className="h-3 w-3" />
          Testowanie
        </Badge>
      )
    case 'in-progress':
      return (
        <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 gap-1">
          <Wrench className="h-3 w-3" />
          W trakcie
        </Badge>
      )
    case 'planned':
      return (
        <Badge variant="secondary" className="gap-1">
          <Clock className="h-3 w-3" />
          Planowane
        </Badge>
      )
  }
}

const getCategoryColor = (category: FeatureItem['category']) => {
  switch (category) {
    case 'KPI':
      return 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800'
    case 'Rankingi':
      return 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
    case 'Porównania':
      return 'bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800'
    case 'Analiza czasowa':
      return 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800'
    case 'Legislacja':
      return 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
    default:
      return 'bg-gray-50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-800'
  }
}

export default function StatisticsPage() {
  const overallProgress = Math.round(
    plannedFeatures.reduce((sum, feature) => sum + feature.progress, 0) / plannedFeatures.length
  )

  const categoryCounts = plannedFeatures.reduce((acc, feature) => {
    acc[feature.category] = (acc[feature.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 px-4 py-2 rounded-full text-sm font-medium">
          <Wrench className="h-4 w-4" />
          W trakcie przygotowania
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Statystyki i analizy
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Zaawansowane narzędzia analityczne do badania aktywności parlamentarnej, 
          frekwencji posłów i porównywania klubów politycznych
        </p>
      </div>

      {/* Overall Progress */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Ogólny postęp prac</h3>
              <p className="text-sm text-muted-foreground">
                {plannedFeatures.length} planowanych funkcji
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{overallProgress}%</div>
              <div className="text-sm text-muted-foreground">ukończone</div>
            </div>
          </div>
          <Progress value={overallProgress} className="h-3" />
        </CardContent>
      </Card>

      {/* Categories Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Object.entries(categoryCounts).map(([category, count]) => (
          <Card key={category} className={getCategoryColor(category as FeatureItem['category'])}>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{count}</div>
              <div className="text-sm text-muted-foreground">{category}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Features Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Planowane funkcje i ich postęp
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[300px]">Funkcja</TableHead>
                  <TableHead>Kategoria</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[200px]">Postęp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plannedFeatures.map((feature) => (
                  <TableRow key={feature.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mt-0.5">
                          {feature.icon}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">
                            {feature.name}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {feature.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge 
                        variant="secondary" 
                        className={`${getCategoryColor(feature.category)} border`}
                      >
                        {feature.category}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      {getStatusBadge(feature.status)}
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{feature.progress}%</span>
                        </div>
                        <Progress value={feature.progress} className="h-2" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Timeline Info */}
      <Card className="bg-muted/30">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Harmonogram rozwoju</h3>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Funkcje są rozwijane stopniowo, w oparciu o dostępność danych z API Sejmu RP 
              oraz potrzeby użytkowników. Priorytet mają podstawowe statystyki i rankingi.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
              <span>• Faza 1: KPI Cards (Q1 2024)</span>
              <span>• Faza 2: Rankingi posłów (Q2 2024)</span>
              <span>• Faza 3: Porównania klubów (Q3 2024)</span>
              <span>• Faza 4: Analiza czasowa (Q4 2024)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}