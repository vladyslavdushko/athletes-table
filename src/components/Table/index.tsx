import { useEffect, useState } from "react"
import type { Athlete } from "./types/athlete"
import styles from "./styles.module.css"

const COLUMNS: { key: keyof Athlete; label: string }[] = [
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

function formatCell(value: Athlete[keyof Athlete]): string {
  if (typeof value === "boolean") return value ? "Yes" : "No"
  if (typeof value === "number" && Number.isInteger(value) === false) {
    return (value * 100).toFixed(2) + "%"
  }
  if (typeof value === "number" && value > 1e6) {
    return value.toLocaleString()
  }
  return String(value)
}

export function getColumnMinWidths(athletes: Athlete[]): Record<keyof Athlete, number> {
  const out = {} as Record<keyof Athlete, number>
  for (const { key, label } of COLUMNS) {
    let maxLen = label.length
    for (const row of athletes) {
      const len = formatCell(row[key]).length
      if (len > maxLen) maxLen = len
    }
    out[key] = maxLen + 2
  }
  return out
}

export type ColumnFilters = Partial<Record<keyof Athlete, string>>

export type SortState = { key: keyof Athlete; dir: "asc" | "desc" } | null

type TableProps = {
  athletes: Athlete[]
  maxRows?: number
  sort?: SortState
  onSort?: (key: keyof Athlete) => void
}

const PAGE_SIZE = 100

export default function Table({
  athletes,
  maxRows = PAGE_SIZE,
  sort = null,
  onSort,
}: TableProps) {
  const pageSize = maxRows
  const totalPages = Math.ceil(athletes.length / pageSize)
  const [page, setPage] = useState<number>(1)
  const [pageInput, setPageInput] = useState<string>("1")

  useEffect(() => {
    setPage(1)
  }, [athletes.length])

  useEffect(() => {
    setPageInput(String(page))
  }, [page])

  const start = (page - 1) * pageSize
  const visible = athletes.slice(start, start + pageSize)

  const goToPage = (p: number) => {
    setPage(Math.max(1, Math.min(p, totalPages)))
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            {COLUMNS.map(({ key, label }) => (
              <th
                key={key}
                className={styles.tableHeader}
                onClick={() => onSort?.(key)}
                onKeyDown={(e) => {
                  if (onSort && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault()
                    onSort(key)
                  }
                }}
                tabIndex={onSort ? 0 : undefined}
                role={onSort ? "button" : undefined}
                aria-sort={
                  sort?.key === key
                    ? sort.dir === "asc"
                      ? "ascending"
                      : "descending"
                    : undefined
                }
              >
                {label}
                {sort?.key === key && (
                  <span className={styles.sortIcon} aria-hidden>
                    {sort.dir === "asc" ? " ↑" : " ↓"}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visible.map((row) => (
            <tr key={row.id}>
              {COLUMNS.map((col) => (
                <td
                  key={col.key}
                  className={styles.tableCell}
                >
                  {formatCell(row[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div
          className={styles.pagination}
        >
          <button
            type="button"
            className={styles.paginationButton}
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1}
          >
            Previous
          </button>
          <span className={styles.paginationText}>Page</span>
          <input
            type="number"
            className={styles.pageInput}
            min={1}
            max={totalPages}
            value={pageInput}
            onChange={(e) => {
              setPageInput(e.target.value)
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const trimmed = pageInput.trim()
                if (trimmed === "") {
                  setPageInput(String(page))
                  return
                }
                const n = Number(trimmed)
                if (Number.isNaN(n)) {
                  setPageInput(String(page))
                  return
                }
                const clamped = Math.max(1, Math.min(n, totalPages || 1))
                goToPage(clamped)
                setPageInput(String(clamped))
                e.currentTarget.blur()
              }
            }}
            aria-label="Page number"
          />
          <span className={styles.paginationText}>of {totalPages}</span>
          <button
            type="button"
            className={styles.paginationButton}
            onClick={() => goToPage(page + 1)}
            disabled={page >= totalPages}
          >
            Next
          </button>
          <span className={styles.paginationStatus}>
            ({start + 1}–{start + visible.length} of {athletes.length})
          </span>
        </div>
      )}
    </div>
  )
}
