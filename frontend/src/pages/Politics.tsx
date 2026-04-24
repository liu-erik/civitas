import { Navigate } from "react-router-dom"

/** Curated category from seeded taxonomy (current-political-issues). */
export function Politics() {
  return <Navigate to="/topics/current-political-issues" replace />
}
