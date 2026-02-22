import type { Athlete } from "../../types/athlete"
import { SEARCH_COLUMNS as SEARCH_FIELDS, COLUMN_LABELS } from "../../constants/columns"
import styles from "./styles.module.css"

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
        placeholder={`Search by ${COLUMN_LABELS[field] ?? field}...`}
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
