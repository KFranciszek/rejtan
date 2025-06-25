import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('pl-PL').format(num)
}

export function calculateAge(birthDate: string): number {
  const birth = new Date(birthDate)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
}

export function getClubColor(club: string): string {
  const clubLower = club.toLowerCase()
  
  if (clubLower.includes('pis')) return 'club-pis'
  if (clubLower.includes('ko') || clubLower.includes('platforma')) return 'club-ko'
  if (clubLower.includes('td') || clubLower.includes('trzecia droga')) return 'club-td'
  if (clubLower.includes('lewica')) return 'club-lewica'
  if (clubLower.includes('konfederacja')) return 'club-konfederacja'
  if (clubLower.includes('psl')) return 'club-psl'
  
  return 'club-default'
}

export function getPresenceColor(percentage: number): string {
  if (percentage >= 90) return 'presence-excellent'
  if (percentage >= 75) return 'presence-good'
  if (percentage >= 60) return 'presence-average'
  return 'presence-poor'
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}