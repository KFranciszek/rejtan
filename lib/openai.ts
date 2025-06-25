interface SummaryResponse {
  question_summary: string
  reply_summary: string
}

export async function generateSummaryWithOpenAI(
  questionBody: string, 
  replyBody: string
): Promise<SummaryResponse> {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY
  
  if (!apiKey) {
    throw new Error('NEXT_PUBLIC_OPENAI_API_KEY nie jest skonfigurowany w zmiennych środowiskowych')
  }

  const systemPrompt = process.env.NEXT_PUBLIC_OPENAI_SYSTEM_PROMPT || 
    "Jesteś ekspertem w analizie dokumentów parlamentarnych. Twoim zadaniem jest tworzenie zwięzłych, obiektywnych streszczeń zapytań poselskich i odpowiedzi na nie."

  const userPrompt = `
Proszę o stworzenie streszczenia następującego zapytania poselskiego i odpowiedzi na nie:

ZAPYTANIE POSELSKIE:
${questionBody}

ODPOWIEDŹ:
${replyBody}

Proszę o zwrócenie odpowiedzi w formacie JSON z polami:
- question_summary: streszczenie zapytania (maksymalnie 2-3 zdania)
- reply_summary: streszczenie odpowiedzi (maksymalnie 2-3 zdania)

Streszczenia powinny być obiektywne, zwięzłe i zrozumiałe dla obywateli.
`

  try {
    console.log('Wysyłanie zapytania do OpenAI API...')
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Używamy gpt-4o-mini jako ekonomicznej opcji
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        max_tokens: 500,
        temperature: 0.3, // Niższa temperatura dla bardziej konsystentnych wyników
        response_format: { type: "json_object" }
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('OpenAI API error:', response.status, errorData)
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log('Otrzymano odpowiedź z OpenAI API')

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Nieprawidłowa odpowiedź z OpenAI API')
    }

    const content = data.choices[0].message.content
    
    try {
      const summary = JSON.parse(content) as SummaryResponse
      
      // Walidacja odpowiedzi
      if (!summary.question_summary || !summary.reply_summary) {
        throw new Error('Brak wymaganych pól w odpowiedzi OpenAI')
      }

      console.log('Pomyślnie wygenerowano streszczenie AI')
      return summary
    } catch (parseError) {
      console.error('Błąd parsowania odpowiedzi JSON z OpenAI:', parseError)
      throw new Error('Nie udało się sparsować odpowiedzi z OpenAI')
    }

  } catch (error) {
    console.error('Błąd podczas komunikacji z OpenAI:', error)
    
    // Zwracamy fallback w przypadku błędu
    throw new Error(
      error instanceof Error 
        ? `Błąd OpenAI: ${error.message}` 
        : 'Nieznany błąd podczas generowania streszczenia'
    )
  }
}

// Funkcja pomocnicza do sprawdzania konfiguracji
export function checkOpenAIConfiguration(): { isConfigured: boolean; error?: string } {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY
  
  if (!apiKey) {
    return {
      isConfigured: false,
      error: 'NEXT_PUBLIC_OPENAI_API_KEY nie jest skonfigurowany w pliku .env.local'
    }
  }

  if (apiKey === 'your_openai_api_key_here') {
    return {
      isConfigured: false,
      error: 'NEXT_PUBLIC_OPENAI_API_KEY zawiera wartość placeholder - proszę wstawić prawdziwy klucz API'
    }
  }

  return { isConfigured: true }
}