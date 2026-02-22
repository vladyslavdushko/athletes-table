import { useState } from "react"
import type { Athlete } from "../../types/athlete"
import type { ColumnFilters } from "../Table"
import { ATHLETE_COLUMNS as FILTER_FIELDS } from "../../constants/columns"
import styles from "./styles.module.css"

type FilterRow = {
    id: number
    field: keyof Athlete
    value: string
}

type FilterPanelProps = {
    onApply: (filters: ColumnFilters) => void
    appliedFilters: ColumnFilters
    onClear: () => void
}

let nextId = 0

export default function FilterPanel({
    onApply,
    appliedFilters,
    onClear,
}: FilterPanelProps) {
    const [open, setOpen] = useState(false)
    const [rows, setRows] = useState<FilterRow[]>(() => {
        const initial: FilterRow[] = []
        for (const [key, values] of Object.entries(appliedFilters)) {
            if (values) {
                for (const value of values) {
                    initial.push({
                        id: nextId++,
                        field: key as keyof Athlete,
                        value,
                    })
                }
            }
        }
        return initial
    })

    const appliedCount = Object.values(appliedFilters).reduce(
        (acc, arr) => acc + (arr ? arr.length : 0),
        0
    )

    const addRow = () => {
        const available = FILTER_FIELDS[0]
        setRows((prev) => [
            ...prev,
            { id: nextId++, field: available.key, value: "" },
        ])
    }

    const removeRow = (id: number) => {
        const nextRows = rows.filter((r) => r.id !== id)
        setRows(nextRows)

        const filters: ColumnFilters = {}
        for (const row of nextRows) {
            const val = row.value.trim()
            if (val !== "") {
                if (!filters[row.field]) filters[row.field] = []
                filters[row.field]!.push(val)
            }
        }
        onApply(filters)
    }

    const updateField = (id: number, field: keyof Athlete) => {
        setRows((prev) =>
            prev.map((r) => (r.id === id ? { ...r, field } : r)),
        )
    }

    const updateValue = (id: number, value: string) => {
        setRows((prev) =>
            prev.map((r) => (r.id === id ? { ...r, value } : r)),
        )
    }

    const handleApply = () => {
        const filters: ColumnFilters = {}
        for (const row of rows) {
            const val = row.value.trim()
            if (val !== "") {
                if (!filters[row.field]) filters[row.field] = []
                filters[row.field]!.push(val)
            }
        }
        onApply(filters)
    }

    const handleClear = () => {
        setRows([])
        onClear()
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault()
            handleApply()
        }
    }

    return (
        <div className={styles.accordion}>
            <button
                type="button"
                className={styles.toggleButton}
                onClick={() => setOpen((prev) => !prev)}
                aria-expanded={open}
            >
                <span className={styles.toggleLabel}>
                    Filters
                    {appliedCount > 0 && (
                        <span className={styles.filterCount}>{appliedCount}</span>
                    )}
                </span>
                <span
                    className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}
                    aria-hidden
                >
                    ▼
                </span>
            </button>

            <div className={`${styles.body} ${open ? styles.bodyOpen : ""}`}>
                <div className={styles.bodyInner}>
                    <div className={styles.content}>
                        {rows.length === 0 && (
                            <p className={styles.emptyHint}>
                                No filters added. Click "+ Add filter" to get started.
                            </p>
                        )}

                        {rows.map((row) => (
                            <div key={row.id} className={styles.filterRow}>
                                <select
                                    className={styles.categorySelect}
                                    value={row.field}
                                    onChange={(e) =>
                                        updateField(row.id, e.target.value as keyof Athlete)
                                    }
                                    aria-label="Filter category"
                                >
                                    {FILTER_FIELDS.map(({ key, label }) => (
                                        <option key={key} value={key}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    className={styles.valueInput}
                                    value={row.value}
                                    onChange={(e) => updateValue(row.id, e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Enter value…"
                                    aria-label="Filter value"
                                />
                                <button
                                    type="button"
                                    className={styles.removeButton}
                                    onClick={() => removeRow(row.id)}
                                    aria-label="Remove filter"
                                >
                                    ×
                                </button>
                            </div>
                        ))}

                        <div className={styles.actions}>
                            <button
                                type="button"
                                className={styles.addButton}
                                onClick={addRow}
                            >
                                + Add filter
                            </button>
                            {rows.length > 0 && (
                                <button
                                    type="button"
                                    className={styles.clearButton}
                                    onClick={handleClear}
                                >
                                    Clear all
                                </button>
                            )}
                            {rows.length > 0 && (
                                <button
                                    type="button"
                                    className={styles.applyButton}
                                    onClick={handleApply}
                                >
                                    Apply filters
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
