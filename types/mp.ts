export interface MP {
  id: number
  firstName: string
  lastName: string
  firstLastName: string
  club: string
  districtNum: number
  districtName: string
  voivodeship?: string
  numberOfVotes: number
  email?: string | null
  active: boolean
  birthDate?: string
  birthLocation?: string
  profession?: string
  educationLevel?: string
  inactiveCause?: string
}

export interface MPListItem extends MP {
  presencePct?: number
}

export interface VotingStats {
  totalVotings: number
  voted: number
  missed: number
  presencePct: number
}

export interface AssetFile {
  kind: 'P' | 'R1' | 'R2'
  year: number
  url: string
  title?: string
}

// Interfejs dla zapytania poselskiego
export interface WrittenQuestion {
  num: number
  title: string
  from: string
  to: string
  sentDate: string
  lastModified: string
  replies?: WrittenQuestionReply[]
}

export interface WrittenQuestionReply {
  key: string
  from: string
  sentDate: string
  lastModified: string
  attachments?: WrittenQuestionAttachment[]
}

export interface WrittenQuestionAttachment {
  URL: string
  name: string
}

export interface WrittenQuestionBody {
  body: string
}

export interface WrittenQuestionSummary {
  question_summary: string
  reply_summary: string
}

// Interfejs dla interpelacji
export interface Interpellation {
  num: number
  title: string
  from: string[]  // Array of MP IDs who submitted the interpellation
  to: string[]    // Array of recipients
  sentDate: string
  receiptDate: string
  lastModified: string
  answerDelayedDays: number
  recipientDetails?: InterpellationRecipientDetail[]
  replies?: InterpellationReply[]
}

export interface InterpellationRecipientDetail {
  name: string
  sent: string
  answerDelayedDays: number
}

export interface InterpellationReply {
  key?: string
  from: string
  receiptDate: string
  lastModified: string
  onlyAttachment: boolean
  prolongation: boolean
  attachments?: InterpellationAttachment[]
  links?: Array<{
    href: string
    rel: string
  }>
}

export interface InterpellationAttachment {
  URL: string
  name: string
  lastModified: string
}

// Interfejs dla oświadczenia majątkowego
export interface FinancialDeclaration {
  // Dane osobowe
  imiona_i_nazwisko: string
  data_i_miejsce_urodzenia: string
  miejsce_zatrudnienia_stanowisko_lub_funkcja: string
  ustroj_majatkowy: string
  
  // I. Zasoby pieniężne
  srodki_pieniezne_pln: string
  srodki_pieniezne_waluta_obca: string
  papiery_wartosciowe: string
  
  // II. Nieruchomości
  dom?: {
    powierzchnia: string
    wartosc: string
    tytul_prawny: string
  }
  mieszkanie?: Array<{
    powierzchnia: string
    wartosc: string
    tytul_prawny: string
  }>
  gospodarstwo_rolne?: {
    rodzaj: string
    powierzchnia: string
    wartosc: string
    zabudowa: string
    przychod_dochod: string
  }
  inne_nieruchomosci: string
  
  // III-VIII. Działalność gospodarcza i udziały w spółkach
  dzialalnosc_gospodarcza_i_udzialy_w_spolkach: string
  mienie_nabyte_w_drodze_przetargu: string
  
  // IX. Inne dochody
  inne_dochody: Array<{
    zrodlo: string
    kwota: string
  }>
  
  // X. Składniki mienia ruchomego
  mienie_ruchome: string[]
  
  // XI. Zobowiązania pieniężne
  zobowiazania_pieniezne: Array<{
    wierzyciel: string
    kwota: string
    warunki: string
  }>
  
  // Dane końcowe
  miejsce_i_data_zlozenia: string
  data_przetworzenia: string
}

export interface MPProfile extends MPListItem {
  age?: number
  stats: VotingStats
  interpellationsCount: number
  questionsCount: number
  assets: AssetFile[]
  financialDeclaration?: FinancialDeclaration | null
}

export interface ClubFilter {
  value: string
  label: string
  count: number
}

export type ActiveStatus = 'all' | 'active' | 'inactive'

export interface SearchFilters {
  searchTerm: string
  selectedClub: string
  activeStatus: ActiveStatus
}

export type ViewMode = 'grid' | 'table'