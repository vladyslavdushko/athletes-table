import { useState } from "react"
import type { Athlete } from "../Table/types/athlete"
import type { ColumnFilters } from "../Table"
import styles from "./styles.module.css"

const FILTER_FIELDS: { key: keyof Athlete; label: string }[] = [
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
        const initial = Object.entries(appliedFilters)
            .filter(([, v]) => v && v.trim() !== "")
            .map(([key, value]) => ({
                id: nextId++,
                field: key as keyof Athlete,
                value: value!,
            }))
        return initial
    })

    const appliedCount = Object.values(appliedFilters).filter(
        (v) => v && v.trim() !== "",
    ).length

    const addRow = () => {
        const usedFields = new Set(rows.map((r) => r.field))
        const available = FILTER_FIELDS.find((f) => !usedFields.has(f.key))
        setRows((prev) => [
            ...prev,
            { id: nextId++, field: available?.key ?? "firstName", value: "" },
        ])
    }

    const removeRow = (id: number) => {
        const nextRows = rows.filter((r) => r.id !== id)
        setRows(nextRows)

        const filters: ColumnFilters = {}
        for (const row of nextRows) {
            if (row.value.trim() !== "") {
                filters[row.field] = row.value
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
            if (row.value.trim() !== "") {
                filters[row.field] = row.value
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
