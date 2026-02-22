import type { Athlete } from "../types/athlete"

const REQUIRED_KEYS: (keyof Athlete)[] = [
  'id', 'athleteCode', 'firstName', 'lastName', 'gender', 'age', 'dateOfBirth',
  'country', 'sport', 'position', 'team', 'ranking', 'medals', 'matchesPlayed',
  'wins', 'losses', 'winRate', 'heightCm', 'weightKg', 'yearsPro', 'salaryUsd',
  'isOlympian', 'status', 'lastUpdated',
]

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function hasKeys(obj: Record<string, unknown>, keys: string[]): boolean {
  return keys.every((key) => key in obj)
}

function parseOne(raw: unknown): Athlete | null {
  if (!isRecord(raw)) return null
  if (!hasKeys(raw, REQUIRED_KEYS as string[])) return null

  const a = raw as Record<string, unknown>
  return {
    id: Number(a.id),
    athleteCode: String(a.athleteCode),
    firstName: String(a.firstName),
    lastName: String(a.lastName),
    gender: String(a.gender),
    age: Number(a.age),
    dateOfBirth: String(a.dateOfBirth),
    country: String(a.country),
    sport: String(a.sport),
    position: String(a.position),
    team: String(a.team),
    ranking: Number(a.ranking),
    medals: Number(a.medals),
    matchesPlayed: Number(a.matchesPlayed),
    wins: Number(a.wins),
    losses: Number(a.losses),
    winRate: Number(a.winRate),
    heightCm: Number(a.heightCm),
    weightKg: Number(a.weightKg),
    yearsPro: Number(a.yearsPro),
    salaryUsd: Number(a.salaryUsd),
    isOlympian: Boolean(a.isOlympian),
    status: String(a.status),
    lastUpdated: String(a.lastUpdated),
  }
}

export function parseAthletes(raw: unknown): Athlete[] {
  if (!Array.isArray(raw)) return []
  const result: Athlete[] = []
  for (const item of raw) {
    const athlete = parseOne(item)
    if (athlete !== null) result.push(athlete)
  }
  return result
}
