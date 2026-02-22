import type { Athlete } from "../Table/types/athlete"
import styles from "./styles.module.css"

const SEARCH_FIELDS: { key: keyof Athlete; label: string }[] = [
  { key: "firstName", label: "First name" },
  { key: "lastName", label: "Last name" },
  { key: "athleteCode", label: "Code" },
  { key: "country", label: "Country" },
  { key: "sport", label: "Sport" },
  { key: "position", label: "Position" },
  { key: "team", label: "Team" },
  { key: "gender", label: "Gender" },
  { key: "status", label: "Status" },
  { key: "id", label: "ID" },
  { key: "ranking", label: "Ranking" },
  { key: "age", label: "Age" },
]

export type SearchState = {
  field: keyof Athlete
  query: string
}

type SearchProps = {
  state: SearchState
  onSearchChange: (state: SearchState) => void
}

export default function Search({ state, onSearchChange }: SearchProps) {
  const { field, query } = state

  return (
    <div className={styles.root}>
      <select
        className={styles.select}
        value={field}
        onChange={(e) =>
          onSearchChange({
            field: e.target.value as keyof Athlete,
            query,
          })
        }
        aria-label="Search category"
      >
        {SEARCH_FIELDS.map(({ key, label }) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
      <input
        type="search"
        className={styles.input}
        placeholder={`Search by ${SEARCH_FIELDS.find((f) => f.key === field)?.label ?? field}...`}
        value={query}
        onChange={(e) =>
          onSearchChange({
            field,
            query: e.target.value,
          })
        }
        aria-label="Search value"
      />
    </div>
  )
}
