import styles from "./styles.module.css"

type LoaderProps = {
  /** Optional label under the spinner */
  label?: string
}

const Loader = ({ label = "Loading…" }: LoaderProps) => {
  return (
    <div className={styles.root} role="status" aria-live="polite" aria-busy="true">
      <div className={styles.spinner} />
      <span className={styles.label}>{label}</span>
    </div>
  )
}

export default Loader