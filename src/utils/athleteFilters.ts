import type { Athlete } from "../types/athlete"
import type { SearchState } from "../components/Search"
import type { ColumnFilters } from "../components/Table"

const EXACT_MATCH_FIELDS: (keyof Athlete)[] = ["gender"]

function cellToString(value: Athlete[keyof Athlete]): string {
    if (typeof value === "boolean") return value ? "yes" : "no"
    return String(value).toLowerCase()
}

export function filterBySearch(data: Athlete[], state: SearchState): Athlete[] {
    const { field, query } = state
    const q = query.trim().toLowerCase()
    if (q === "") return data
    const exactMatch = EXACT_MATCH_FIELDS.includes(field)
    return data.filter((row) => {
        const lower = cellToString(row[field])
        return exactMatch ? lower === q : lower.includes(q)
    })
}

export function filterByColumns(
    data: Athlete[],
    columnFilters: ColumnFilters,
): Athlete[] {
    return data.filter((row) =>
        (Object.entries(columnFilters) as [keyof Athlete, string[]][]).every(
            ([key, queries]) => {
                if (!queries || queries.length === 0) return true
                const cell = cellToString(row[key])
                const exactMatch = EXACT_MATCH_FIELDS.includes(key)

                return queries.some((q) => {
                    const query = q.trim().toLowerCase()
                    if (!query) return true
                    return exactMatch ? cell === query : cell.includes(query)
                })
            },
        ),
    )
}

function compare(a: Athlete[keyof Athlete], b: Athlete[keyof Athlete]): number {
    if (typeof a === "number" && typeof b === "number") return a - b
    if (typeof a === "boolean" && typeof b === "boolean")
        return (a ? 1 : 0) - (b ? 1 : 0)
    const sa = String(a)
    const sb = String(b)
    return sa.localeCompare(sb, undefined, { numeric: true })
}

export function sortByColumn(
    data: Athlete[],
    key: keyof Athlete,
    dir: "asc" | "desc",
): Athlete[] {
    return [...data].sort((a, b) => {
        const diff = compare(a[key], b[key])
        return dir === "asc" ? diff : -diff
    })
}
