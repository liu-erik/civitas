import { Navigate } from "react-router-dom"

/** Curated category from seeded taxonomy (rights-and-protections). */
export function Rights() {
  return <Navigate to="/topics/rights-and-protections" replace />
}
