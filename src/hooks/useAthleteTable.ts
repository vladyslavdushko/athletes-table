import { useMemo, useState, useTransition } from "react"
import { useDebouncedValue } from "./useDebouncedValue"
import { filterBySearch, filterByColumns, sortByColumn } from "../utils/athleteFilters"
import type { Athlete } from "../types/athlete"
import type { SearchState } from "../components/Search"
import type { ColumnFilters, SortState } from "../components/Table"

const DEFAULT_SEARCH: SearchState = { field: "firstName", query: "" }

export function useAthleteTable(athletes: Athlete[]) {
    const [isPending, startTransition] = useTransition()
    const [search, setSearch] = useState<SearchState>(DEFAULT_SEARCH)
    const [columnFilters, setColumnFilters] = useState<ColumnFilters>({})
    const [sort, setSort] = useState<SortState>(null)

    const debouncedSearch = useDebouncedValue(search, 300)

    const filteredAthletes = useMemo(() => {
        let data = filterBySearch(athletes, debouncedSearch)
        data = filterByColumns(data, columnFilters)
        if (sort) data = sortByColumn(data, sort.key, sort.dir)
        return data
    }, [athletes, debouncedSearch.field, debouncedSearch.query, columnFilters, sort])

    const handleSort = (key: keyof Athlete) => {
        startTransition(() => {
            setSort((prev) =>
                prev?.key === key
                    ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
                    : { key, dir: "asc" },
            )
        })
    }

    const handleApplyFilters = (filters: ColumnFilters) => {
        startTransition(() => {
            setColumnFilters(filters)
        })
    }

    const handleClearFilters = () => {
        startTransition(() => {
            setColumnFilters({})
        })
    }

    const handleSearchChange = (next: SearchState) => {
        setSearch(next)
    }

    const hasActiveFilters =
        search.query.trim() !== "" ||
        Object.values(columnFilters).some((arr) => arr && arr.length > 0)

    const resetAll = () => {
        setSearch(DEFAULT_SEARCH)
        setColumnFilters({})
    }

    return {
        isPending,
        search,
        columnFilters,
        sort,
        filteredAthletes,
        hasActiveFilters,
        handleSort,
        handleApplyFilters,
        handleClearFilters,
        handleSearchChange,
        resetAll,
    }
}
