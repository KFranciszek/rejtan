# Posłowie.pl

Nowoczesna aplikacja do prezentacji danych o posłach X kadencji Sejmu RP i ich oświadczeniach majątkowych. Dane pobierane na żywo z oficjalnego API Sejmu.

## Funkcje

- 📊 **Profile posłów** - Kompletne dane osobowe, zawodowe i polityczne
- 📈 **Statystyki głosowań** - Frekwencja i aktywność parlamentarna
- 💰 **Oświadczenia majątkowe** - Przejrzyste prezentowanie majątku posłów
- 🔍 **Zaawansowane wyszukiwanie** - Filtry po klubach, statusie, itp.
- 📝 **Zapytania poselskie** - Pełne treści zapytań i odpowiedzi
- 🤖 **Streszczenia AI** - Automatyczne streszczenia zapytań i odpowiedzi

## Konfiguracja

### Zmienne środowiskowe

Skopiuj plik `.env.example` do `.env.local` i uzupełnij wymagane wartości:

```bash
cp .env.example .env.local
```

### OpenAI API (opcjonalne)

Aby włączyć funkcję streszczeń AI dla zapytań poselskich:

1. Uzyskaj klucz API z [OpenAI Platform](https://platform.openai.com/api-keys)
2. Dodaj klucz do pliku `.env.local`:

```env
NEXT_PUBLIC_OPENAI_API_KEY=sk-your-actual-openai-api-key-here
```

3. Opcjonalnie dostosuj system prompt:

```env
NEXT_PUBLIC_OPENAI_SYSTEM_PROMPT="Twój niestandardowy prompt dla AI..."
```

**Uwaga:** Bez konfiguracji OpenAI API, streszczenia AI będą niedostępne, ale reszta aplikacji będzie działać normalnie.

## Instalacja i uruchomienie

```bash
# Instalacja zależności
npm install

# Uruchomienie w trybie deweloperskim
npm run dev

# Budowanie dla produkcji
npm run build

# Uruchomienie w trybie produkcyjnym
npm start
```

## Technologie

- **Next.js 14** - Framework React z App Router
- **TypeScript** - Typowanie statyczne
- **Tailwind CSS** - Stylowanie
- **Radix UI** - Komponenty UI
- **TanStack Query** - Zarządzanie stanem i cache
- **OpenAI API** - Generowanie streszczeń AI
- **Lucide React** - Ikony

## Źródła danych

- **API Sejmu RP** - Oficjalne dane o posłach, głosowaniach i zapytaniach
- **Oświadczenia majątkowe** - Dane wyekstraktowane z oficjalnych dokumentów
- **Streszczenia AI** - Generowane przez OpenAI GPT-4

## Struktura projektu

```
├── app/                    # Next.js App Router
│   ├── globals.css        # Style globalne
│   ├── layout.tsx         # Layout główny
│   ├── page.tsx          # Strona główna
│   ├── poslowie/         # Strony posłów
│   └── providers.tsx     # Providery React Query
├── components/           # Komponenty React
│   ├── ui/              # Komponenty UI (Radix)
│   └── ...              # Komponenty biznesowe
├── lib/                 # Biblioteki i utilities
│   ├── api.ts          # Funkcje API
│   ├── openai.ts       # Integracja OpenAI
│   └── utils.ts        # Funkcje pomocnicze
├── types/              # Definicje typów TypeScript
└── .env.local         # Zmienne środowiskowe (nie w repo)
```

## Licencja

MIT License - zobacz plik LICENSE dla szczegółów.

## Kontakt

- Email: kontakt@poslowie.pl
- GitHub: https://github.com/poslowie-pl