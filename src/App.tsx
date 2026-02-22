import styles from "./App.module.css"
import Loader from "./components/Loader"
import Search from "./components/Search"
import FilterPanel from "./components/FilterPanel"
import Table from "./components/Table"
import { parseAthletes } from "./utils/parseAthletes"
import { useAthleteTable } from "./hooks/useAthleteTable"
import athletesJson from "./data/athletes.json"

const athletes = parseAthletes(athletesJson)

function App() {
  const {
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
  } = useAthleteTable(athletes)

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1>Athletes</h1>
        <button
          type="button"
          onClick={resetAll}
          disabled={!hasActiveFilters}
          className={styles.resetFiltersButton}
        >
          Reset all
        </button>
      </div>

      <div className={styles.toolbar}>
        <Search state={search} onSearchChange={handleSearchChange} />
      </div>

      <FilterPanel
        onApply={handleApplyFilters}
        appliedFilters={columnFilters}
        onClear={handleClearFilters}
      />

      <div className={styles.tableContainer}>
        {isPending && (
          <div className={styles.loaderContainer}>
            <Loader label="Updating…" />
          </div>
        )}
        <Table
          athletes={filteredAthletes}
          maxRows={100}
          sort={sort}
          onSort={handleSort}
        />
      </div>
    </main>
  )
}

export default App
