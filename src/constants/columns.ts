import type { Athlete } from "../types/athlete"

export const ATHLETE_COLUMNS: { key: keyof Athlete; label: string }[] = [
    { key: "id", label: "ID" },
    { key: "athleteCode", label: "Code" },
    { key: "firstName", label: "First name" },
    { key: "lastName", label: "Last name" },
    { key: "gender", label: "Gender" },
    { key: "age", label: "Age" },
    { key: "dateOfBirth", label: "DOB" },
    { key: "country", label: "Country" },
    { key: "sport", label: "Sport" },
    { key: "position", label: "Position" },
    { key: "team", label: "Team" },
    { key: "ranking", label: "Ranking" },
    { key: "medals", label: "Medals" },
    { key: "matchesPlayed", label: "Matches" },
    { key: "wins", label: "Wins" },
    { key: "losses", label: "Losses" },
    { key: "winRate", label: "Win rate" },
    { key: "heightCm", label: "Height (cm)" },
    { key: "weightKg", label: "Weight (kg)" },
    { key: "yearsPro", label: "Years pro" },
    { key: "salaryUsd", label: "Salary (USD)" },
    { key: "isOlympian", label: "Olympian" },
    { key: "status", label: "Status" },
    { key: "lastUpdated", label: "Updated" },
]

export const COLUMN_LABELS: Record<keyof Athlete, string> = ATHLETE_COLUMNS.reduce((acc, col) => {
    acc[col.key] = col.label
    return acc
}, {} as Record<keyof Athlete, string>)

export const SEARCH_COLUMNS = [
    "firstName", "lastName", "athleteCode", "country", "sport",
    "position", "team", "gender", "status", "id", "ranking", "age"
].map((k) => ATHLETE_COLUMNS.find((col) => col.key === k)!)
