import { MP, MPProfile, VotingStats, AssetFile, FinancialDeclaration, WrittenQuestion, WrittenQuestionBody, WrittenQuestionSummary, Interpellation } from '@/types/mp'
import { generateSummaryWithOpenAI, checkOpenAIConfiguration } from './openai'

const SEJM_API_BASE = 'https://api.sejm.gov.pl/sejm/term10'

// Cache for API responses to avoid repeated calls
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

function getCachedData(key: string) {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }
  return null
}

function setCachedData(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() })
}

async function fetchWithCache(url: string, cacheKey: string) {
  const cached = getCachedData(cacheKey)
  if (cached) return cached

  try {
    console.log(`Fetching: ${url}`)
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Poslowie.pl/1.0'
      },
      mode: 'cors',
      cache: 'no-cache'
    })
    
    if (!response.ok) {
      // Handle 404 as expected behavior for optional resources
      if (response.status === 404) {
        console.warn(`Resource not found (404): ${url}`)
        setCachedData(cacheKey, null)
        return null
      }
      throw new Error(`HTTP error! status: ${response.status} for ${url}`)
    }
    
    const data = await response.json()
    console.log(`Fetched data for ${cacheKey}:`, data)
    setCachedData(cacheKey, data)
    return data
  } catch (error) {
    console.error(`Error fetching ${url}:`, error)
    // Return null instead of re-throwing to allow graceful handling
    setCachedData(cacheKey, null)
    return null
  }
}

// Helper function to fetch HTML content and parse it
async function fetchHTMLContent(url: string, cacheKey: string): Promise<string | null> {
  const cached = getCachedData(cacheKey)
  if (cached) return cached

  try {
    console.log(`Fetching HTML: ${url}`)
    const response = await fetch(url, {
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'User-Agent': 'Poslowie.pl/1.0'
      },
      mode: 'cors',
      cache: 'no-cache'
    })
    
    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`HTML resource not found (404): ${url}`)
        setCachedData(cacheKey, null)
        return null
      }
      throw new Error(`HTTP error! status: ${response.status} for ${url}`)
    }
    
    const htmlText = await response.text()
    console.log(`Fetched HTML for ${cacheKey}, length: ${htmlText.length}`)
    
    // Parse HTML and extract text content
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlText, 'text/html')
    
    // Extract content from body, excluding script and style tags
    const body = doc.querySelector('body')
    if (!body) {
      console.warn(`No body found in HTML for ${url}`)
      setCachedData(cacheKey, null)
      return null
    }
    
    // Remove script and style elements
    const scripts = body.querySelectorAll('script, style')
    scripts.forEach(el => el.remove())
    
    // Get text content and clean it up
    let textContent = body.textContent || body.innerText || ''
    
    // Clean up the text: remove excessive whitespace, normalize line breaks
    textContent = textContent
      .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
      .replace(/\n\s*\n/g, '\n\n') // Normalize paragraph breaks
      .trim()
    
    console.log(`Extracted text content, length: ${textContent.length}`)
    setCachedData(cacheKey, textContent)
    return textContent
  } catch (error) {
    console.error(`Error fetching HTML ${url}:`, error)
    setCachedData(cacheKey, null)
    return null
  }
}

// Helper function to format MP ID with leading zeros
function formatMPId(id: number): string {
  return String(id).padStart(3, '0')
}

export async function fetchMPs(): Promise<MP[]> {
  try {
    const data = await fetchWithCache(`${SEJM_API_BASE}/MP`, 'mps')
    
    if (!data || !Array.isArray(data)) {
      console.warn('No MP data received or invalid format, using mock data')
      return getMockMPs()
    }
    
    return data.map((mp: any) => ({
      id: mp.id,
      firstName: mp.firstName || '',
      lastName: mp.lastName || '',
      firstLastName: mp.firstLastName || `${mp.firstName} ${mp.lastName}`,
      club: mp.club || 'Niezrzeszony',
      districtNum: mp.districtNum || 0,
      districtName: mp.districtName || '',
      voivodeship: mp.voivodeship || '',
      numberOfVotes: mp.numberOfVotes || 0,
      email: mp.email || null,
      active: mp.active !== false,
      birthDate: mp.birthDate || null,
      birthLocation: mp.birthLocation || null,
      profession: mp.profession || null,
      educationLevel: mp.educationLevel || null,
      inactiveCause: mp.inactiveCause || null
    }))
  } catch (error) {
    console.error('Error fetching MPs:', error)
    // Fallback to mock data if API fails
    return getMockMPs()
  }
}

export async function fetchMPProfile(id: number): Promise<MPProfile | null> {
  try {
    console.log(`Fetching MP profile for ID: ${id}`)
    
    // First, get the MP from the main list to ensure we have basic data
    const allMPs = await fetchMPs()
    const mpData = allMPs.find(mp => mp.id === id)
    
    if (!mpData) {
      console.error(`MP with ID ${id} not found in main list`)
      return null
    }

    console.log(`Found MP data:`, mpData)

    // Fetch all additional data in parallel for better performance
    const [votingStats, interpellationsCount, questionsCount, financialDeclaration] = await Promise.all([
      fetchVotingStats(id),
      fetchInterpellationsCount(id),
      fetchQuestionsCount(id),
      fetchFinancialDeclaration(id)
    ])

    console.log(`Data fetched for MP ${id}:`, {
      votingStats,
      interpellationsCount,
      questionsCount,
      financialDeclaration
    })

    const profile: MPProfile = {
      ...mpData,
      age: mpData.birthDate ? calculateAge(mpData.birthDate) : undefined,
      stats: votingStats,
      interpellationsCount,
      questionsCount,
      assets: [], // Remove assets fetching since it's not working
      presencePct: votingStats.presencePct,
      financialDeclaration
    }

    console.log(`Complete MP profile:`, profile)
    return profile
  } catch (error) {
    console.error(`Error fetching MP profile for ID ${id}:`, error)
    return null
  }
}

export async function fetchVotingStats(id: number): Promise<VotingStats> {
  try {
    // Use the correct endpoint for voting statistics
    const data = await fetchWithCache(`${SEJM_API_BASE}/MP/${id}/votings/stats`, `votings-stats-${id}`)
    
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.warn(`No voting stats found for MP ${id}, using defaults`)
      return getDefaultVotingStats()
    }

    console.log(`Raw voting stats data for MP ${id}:`, data)

    // Aggregate data from all voting sessions
    let totalVotings = 0
    let voted = 0
    let missed = 0

    data.forEach((session: any) => {
      // Each session contains daily voting statistics
      const sessionVotings = session.numVotings || 0
      const sessionVoted = session.numVoted || 0
      const sessionMissed = session.numMissed || 0

      totalVotings += sessionVotings
      voted += sessionVoted
      missed += sessionMissed
    })

    // Calculate presence percentage
    const presencePct = totalVotings > 0 ? Math.round((voted / totalVotings) * 100) : 0

    const stats = {
      totalVotings,
      voted,
      missed,
      presencePct
    }

    console.log(`Processed voting stats for MP ${id}:`, stats)
    return stats
  } catch (error) {
    console.error(`Error fetching voting stats for MP ${id}:`, error)
    return getDefaultVotingStats()
  }
}

async function fetchInterpellationsCount(id: number): Promise<number> {
  try {
    // Format MP ID with leading zeros (e.g., 1 -> "001", 15 -> "015", 241 -> "241")
    const formattedId = formatMPId(id)
    
    // Use the correct endpoint with properly formatted 'from' parameter and high limit
    const data = await fetchWithCache(
      `${SEJM_API_BASE}/interpellations?from=${formattedId}&limit=10000`, 
      `interpellations-count-${id}`
    )
    
    if (!data) {
      console.warn(`No interpellations data found for MP ${id} (formatted: ${formattedId})`)
      return 0
    }
    
    console.log(`Raw interpellations data for MP ${id} (formatted: ${formattedId}):`, data)
    
    // Return the length of the array
    const count = Array.isArray(data) ? data.length : 0
    
    console.log(`Interpellations count for MP ${id}: ${count}`)
    return count
  } catch (error) {
    console.error(`Error fetching interpellations for MP ${id}:`, error)
    return 0
  }
}

async function fetchQuestionsCount(id: number): Promise<number> {
  try {
    // Format MP ID with leading zeros (e.g., 1 -> "001", 15 -> "015", 241 -> "241")
    const formattedId = formatMPId(id)
    
    // Use the correct endpoint with properly formatted 'from' parameter and high limit
    const data = await fetchWithCache(
      `${SEJM_API_BASE}/writtenQuestions?from=${formattedId}&limit=10000`, 
      `questions-count-${id}`
    )
    
    if (!data) {
      console.warn(`No written questions data found for MP ${id} (formatted: ${formattedId})`)
      return 0
    }
    
    console.log(`Raw questions data for MP ${id} (formatted: ${formattedId}):`, data)
    
    // Return the length of the array
    const count = Array.isArray(data) ? data.length : 0
    
    console.log(`Questions count for MP ${id}: ${count}`)
    return count
  } catch (error) {
    console.error(`Error fetching questions for MP ${id}:`, error)
    return 0
  }
}

// Funkcja do pobierania listy zapytań poselskich
export async function fetchWrittenQuestions(id: number): Promise<WrittenQuestion[]> {
  try {
    // Format MP ID with leading zeros
    const formattedId = formatMPId(id)
    
    console.log(`Fetching written questions for MP ${id} (formatted: ${formattedId})`)
    
    const data = await fetchWithCache(
      `${SEJM_API_BASE}/writtenQuestions?from=${formattedId}&limit=100`, 
      `written-questions-${id}`
    )
    
    if (!data || !Array.isArray(data)) {
      console.warn(`No written questions found for MP ${id}`)
      return []
    }
    
    console.log(`Found ${data.length} written questions for MP ${id}`)
    
    // Map API response to our interface
    return data.map((question: any) => ({
      num: question.num,
      title: question.title || 'Brak tytułu',
      from: question.from,
      to: question.to,
      sentDate: question.sentDate,
      lastModified: question.lastModified,
      replies: question.replies || []
    }))
  } catch (error) {
    console.error(`Error fetching written questions for MP ${id}:`, error)
    return []
  }
}

// Funkcja do pobierania listy interpelacji
export async function fetchInterpellations(id: number): Promise<Interpellation[]> {
  try {
    // Format MP ID with leading zeros
    const formattedId = formatMPId(id)
    
    console.log(`Fetching interpellations for MP ${id} (formatted: ${formattedId})`)
    
    const data = await fetchWithCache(
      `${SEJM_API_BASE}/interpellations?from=${formattedId}&limit=100`, 
      `interpellations-${id}`
    )
    
    if (!data || !Array.isArray(data)) {
      console.warn(`No interpellations found for MP ${id}`)
      return []
    }
    
    console.log(`Found ${data.length} interpellations for MP ${id}`)
    
    // Map API response to our interface
    return data.map((interpellation: any) => ({
      num: interpellation.num,
      title: interpellation.title || 'Brak tytułu',
      from: interpellation.from || [],
      to: interpellation.to || [],
      sentDate: interpellation.sentDate,
      receiptDate: interpellation.receiptDate,
      lastModified: interpellation.lastModified,
      answerDelayedDays: interpellation.answerDelayedDays || 0,
      recipientDetails: interpellation.recipientDetails || [],
      replies: interpellation.replies || []
    }))
  } catch (error) {
    console.error(`Error fetching interpellations for MP ${id}:`, error)
    return []
  }
}

// Funkcja do pobierania treści zapytania - teraz parsuje HTML
export async function fetchWrittenQuestionBody(questionNum: number): Promise<WrittenQuestionBody | null> {
  try {
    console.log(`Fetching question body for question ${questionNum}`)
    
    const textContent = await fetchHTMLContent(
      `${SEJM_API_BASE}/writtenQuestions/${questionNum}/body`,
      `question-body-${questionNum}`
    )
    
    if (!textContent) {
      console.warn(`No body found for question ${questionNum}`)
      return null
    }
    
    return {
      body: textContent
    }
  } catch (error) {
    console.error(`Error fetching question body for ${questionNum}:`, error)
    return null
  }
}

// Funkcja do pobierania treści odpowiedzi na zapytanie - teraz parsuje HTML
export async function fetchWrittenQuestionReplyBody(questionNum: number, replyKey: string): Promise<WrittenQuestionBody | null> {
  try {
    console.log(`Fetching reply body for question ${questionNum}, reply ${replyKey}`)
    
    const textContent = await fetchHTMLContent(
      `${SEJM_API_BASE}/writtenQuestions/${questionNum}/reply/${replyKey}/body`,
      `question-reply-body-${questionNum}-${replyKey}`
    )
    
    if (!textContent) {
      console.warn(`No reply body found for question ${questionNum}, reply ${replyKey}`)
      return null
    }
    
    return {
      body: textContent
    }
  } catch (error) {
    console.error(`Error fetching reply body for question ${questionNum}, reply ${replyKey}:`, error)
    return null
  }
}

// Funkcja do pobierania treści interpelacji - parsuje HTML
export async function fetchInterpellationBody(interpellationNum: number): Promise<WrittenQuestionBody | null> {
  try {
    console.log(`Fetching interpellation body for interpellation ${interpellationNum}`)
    
    const textContent = await fetchHTMLContent(
      `${SEJM_API_BASE}/interpellations/${interpellationNum}/body`,
      `interpellation-body-${interpellationNum}`
    )
    
    if (!textContent) {
      console.warn(`No body found for interpellation ${interpellationNum}`)
      return null
    }
    
    return {
      body: textContent
    }
  } catch (error) {
    console.error(`Error fetching interpellation body for ${interpellationNum}:`, error)
    return null
  }
}

// Funkcja do pobierania treści odpowiedzi na interpelację - parsuje HTML
export async function fetchInterpellationReplyBody(interpellationNum: number, replyKey: string): Promise<WrittenQuestionBody | null> {
  try {
    console.log(`Fetching interpellation reply body for interpellation ${interpellationNum}, reply ${replyKey}`)
    
    const textContent = await fetchHTMLContent(
      `${SEJM_API_BASE}/interpellations/${interpellationNum}/reply/${replyKey}/body`,
      `interpellation-reply-body-${interpellationNum}-${replyKey}`
    )
    
    if (!textContent) {
      console.warn(`No reply body found for interpellation ${interpellationNum}, reply ${replyKey}`)
      return null
    }
    
    return {
      body: textContent
    }
  } catch (error) {
    console.error(`Error fetching interpellation reply body for interpellation ${interpellationNum}, reply ${replyKey}:`, error)
    return null
  }
}

// Funkcja streszczania z integracją OpenAI
export async function summarizeTextWithAI(questionBody: string, replyBody: string): Promise<WrittenQuestionSummary> {
  try {
    console.log('Sprawdzanie konfiguracji OpenAI...')
    
    // Sprawdź konfigurację OpenAI
    const config = checkOpenAIConfiguration()
    if (!config.isConfigured) {
      console.warn('OpenAI nie jest skonfigurowany:', config.error)
      
      // Zwróć mockowe streszczenie z informacją o konfiguracji
      return {
        question_summary: `Streszczenie AI niedostępne: ${config.error}. Zapytanie dotyczy: ${questionBody.substring(0, 100)}...`,
        reply_summary: `Streszczenie AI niedostępne: ${config.error}. Odpowiedź zawiera: ${replyBody.substring(0, 100)}...`
      }
    }

    console.log('Generowanie streszczenia z OpenAI...')
    
    // Użyj prawdziwego API OpenAI
    const summary = await generateSummaryWithOpenAI(questionBody, replyBody)
    
    console.log('Pomyślnie wygenerowano streszczenie AI')
    return summary
    
  } catch (error) {
    console.error('Błąd podczas generowania streszczenia AI:', error)
    
    // Fallback do mockowego streszczenia w przypadku błędu
    return {
      question_summary: `Błąd AI: ${error instanceof Error ? error.message : 'Nieznany błąd'}. Zapytanie dotyczy: ${questionBody.substring(0, 100)}...`,
      reply_summary: `Błąd AI: ${error instanceof Error ? error.message : 'Nieznany błąd'}. Odpowiedź zawiera: ${replyBody.substring(0, 100)}...`
    }
  }
}

// Funkcja do pobierania oświadczenia majątkowego
// W środowisku produkcyjnym będzie integrować się z zewnętrznym API LLM
export async function fetchFinancialDeclaration(id: number): Promise<FinancialDeclaration | null> {
  try {
    console.log(`Fetching financial declaration for MP ${id}`)
    
    // Mockowe dane dla wybranych posłów (241 i 242)
    // W produkcji: wywołanie do API LLM z analizą dokumentów PDF
    if (id === 241) {
      return {
        imiona_i_nazwisko: "ANDRZEJ ADAMCZYK",
        data_i_miejsce_urodzenia: "15.01.1970 KRAKÓW",
        miejsce_zatrudnienia_stanowisko_lub_funkcja: "POSEŁ NA SEJM RP",
        ustroj_majatkowy: "małżeńskiej wspólności majątkowej",
        
        srodki_pieniezne_pln: "125.000 PLN",
        srodki_pieniezne_waluta_obca: "5.200 EUR, 1.800 USD",
        papiery_wartosciowe: "Obligacje skarbowe o wartości 50.000 PLN",
        
        dom: {
          powierzchnia: "180 m²",
          wartosc: "850.000 PLN",
          tytul_prawny: "MAŁŻEŃSKA WSPÓLNOŚĆ MAJĄTKOWA"
        },
        mieszkanie: [
          {
            powierzchnia: "65 m²",
            wartosc: "320.000 PLN",
            tytul_prawny: "50% udziału we własności"
          }
        ],
        gospodarstwo_rolne: {
          rodzaj: "WIELOKIERUNKOWE",
          powierzchnia: "8,5 ha",
          wartosc: "1.200.000 PLN",
          zabudowa: "budynki gospodarcze",
          przychod_dochod: "45.000 PLN/35.000 PLN"
        },
        inne_nieruchomosci: "Garaż o powierzchni 25 m² o wartości 45.000 PLN",
        
        dzialalnosc_gospodarcza_i_udzialy_w_spolkach: "Nie dotyczy",
        mienie_nabyte_w_drodze_przetargu: "Nie dotyczy",
        
        inne_dochody: [
          {
            zrodlo: "DIETA PARLAMENTARNA",
            kwota: "156.240 PLN"
          },
          {
            zrodlo: "Stosunek pracy",
            kwota: "85.600 PLN"
          },
          {
            zrodlo: "Z najmu",
            kwota: "18.000 PLN"
          }
        ],
        
        mienie_ruchome: [
          "Samochód osobowy TOYOTA COROLLA rocznik 2019",
          "Ciągnik rolniczy JOHN DEERE rocznik 2015",
          "Kolekcja monet o wartości 15.000 PLN"
        ],
        
        zobowiazania_pieniezne: [
          {
            wierzyciel: "PKO BP S.A.",
            kwota: "245.000 PLN",
            warunki: "kredyt hipoteczny, oprocentowanie zmienne"
          },
          {
            wierzyciel: "Bank Spółdzielczy",
            kwota: "85.000 PLN",
            warunki: "kredyt inwestycyjny na gospodarstwo"
          }
        ],
        
        miejsce_i_data_zlozenia: "WARSZAWA 15.04.2024",
        data_przetworzenia: "2024-04-20T10:30:00Z"
      }
    }
    
    if (id === 242) {
      return {
        imiona_i_nazwisko: "ANNA KOWALSKA",
        data_i_miejsce_urodzenia: "22.03.1975 WARSZAWA",
        miejsce_zatrudnienia_stanowisko_lub_funkcja: "POSEŁ NA SEJM RP",
        ustroj_majatkowy: "odrębny",
        
        srodki_pieniezne_pln: "89.500 PLN",
        srodki_pieniezne_waluta_obca: "Nie dotyczy",
        papiery_wartosciowe: "Akcje spółek giełdowych o wartości 75.000 PLN",
        
        mieszkanie: [
          {
            powierzchnia: "95 m²",
            wartosc: "650.000 PLN",
            tytul_prawny: "własność"
          },
          {
            powierzchnia: "42 m²",
            wartosc: "280.000 PLN",
            tytul_prawny: "własność"
          }
        ],
        inne_nieruchomosci: "Nie dotyczy",
        
        dzialalnosc_gospodarcza_i_udzialy_w_spolkach: "25% udziałów w spółce z o.o. 'Legal Consulting'",
        mienie_nabyte_w_drodze_przetargu: "Nie dotyczy",
        
        inne_dochody: [
          {
            zrodlo: "DIETA PARLAMENTARNA",
            kwota: "156.240 PLN"
          },
          {
            zrodlo: "Działalność prawnicza",
            kwota: "125.000 PLN"
          },
          {
            zrodlo: "Dywidendy",
            kwota: "12.500 PLN"
          }
        ],
        
        mienie_ruchome: [
          "Samochód osobowy BMW X3 rocznik 2021",
          "Biżuteria o wartości 25.000 PLN"
        ],
        
        zobowiazania_pieniezne: [
          {
            wierzyciel: "mBank S.A.",
            kwota: "180.000 PLN",
            warunki: "kredyt hipoteczny, oprocentowanie stałe 4,5%"
          }
        ],
        
        miejsce_i_data_zlozenia: "WARSZAWA 18.04.2024",
        data_przetworzenia: "2024-04-22T14:15:00Z"
      }
    }
    
    // Dla pozostałych posłów zwracamy null (brak danych)
    console.log(`No financial declaration data available for MP ${id}`)
    return null
    
  } catch (error) {
    console.error(`Error fetching financial declaration for MP ${id}:`, error)
    return null
  }
}

function calculateAge(birthDate: string): number {
  const birth = new Date(birthDate)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
}

function getDefaultVotingStats(): VotingStats {
  return {
    totalVotings: 0,
    voted: 0,
    missed: 0,
    presencePct: 0
  }
}

// Fallback mock data in case API is unavailable
function getMockMPs(): MP[] {
  return [
    {
      id: 241,
      firstName: 'Andrzej',
      lastName: 'Adamczyk',
      firstLastName: 'Andrzej Adamczyk',
      club: 'PiS',
      districtNum: 13,
      districtName: 'Kraków',
      voivodeship: 'małopolskie',
      numberOfVotes: 45171,
      email: 'andrzej.adamczyk@sejm.gov.pl',
      active: true,
      birthDate: '1970-01-15',
      birthLocation: 'Kraków',
      profession: 'Inżynier',
      educationLevel: 'Wyższe'
    },
    {
      id: 242,
      firstName: 'Anna',
      lastName: 'Kowalska',
      firstLastName: 'Anna Kowalska',
      club: 'KO',
      districtNum: 1,
      districtName: 'Warszawa',
      voivodeship: 'mazowieckie',
      numberOfVotes: 52341,
      email: 'anna.kowalska@sejm.gov.pl',
      active: true,
      birthDate: '1975-03-22',
      birthLocation: 'Warszawa',
      profession: 'Prawnik',
      educationLevel: 'Wyższe'
    },
    {
      id: 243,
      firstName: 'Piotr',
      lastName: 'Nowak',
      firstLastName: 'Piotr Nowak',
      club: 'TD',
      districtNum: 7,
      districtName: 'Gdańsk',
      voivodeship: 'pomorskie',
      numberOfVotes: 38912,
      email: 'piotr.nowak@sejm.gov.pl',
      active: true,
      birthDate: '1968-07-10',
      birthLocation: 'Gdańsk',
      profession: 'Ekonomista',
      educationLevel: 'Wyższe'
    },
    {
      id: 244,
      firstName: 'Maria',
      lastName: 'Wiśniewska',
      firstLastName: 'Maria Wiśniewska',
      club: 'Lewica',
      districtNum: 5,
      districtName: 'Wrocław',
      voivodeship: 'dolnośląskie',
      numberOfVotes: 41203,
      email: 'maria.wisniewska@sejm.gov.pl',
      active: true,
      birthDate: '1972-11-05',
      birthLocation: 'Wrocław',
      profession: 'Nauczyciel',
      educationLevel: 'Wyższe'
    },
    {
      id: 245,
      firstName: 'Tomasz',
      lastName: 'Zieliński',
      firstLastName: 'Tomasz Zieliński',
      club: 'Konfederacja',
      districtNum: 12,
      districtName: 'Poznań',
      voivodeship: 'wielkopolskie',
      numberOfVotes: 29876,
      email: null,
      active: true,
      birthDate: '1980-04-18',
      birthLocation: 'Poznań',
      profession: 'Przedsiębiorca',
      educationLevel: 'Wyższe'
    }
  ]
}