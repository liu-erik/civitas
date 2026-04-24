import { useCallback, useEffect, useState } from "react"

export type ResolvedPlace = {
  city: string
  state: string
  label: string
}

type Status = "idle" | "locating" | "geocoding" | "ready" | "error" | "unsupported"

/** Browser geolocation + OpenCage reverse geocode (not React Router `useLocation`). */
export function useGeoPlace() {
  const [status, setStatus] = useState<Status>("idle")
  const [place, setPlace] = useState<ResolvedPlace | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const reset = useCallback(() => {
    setStatus("idle")
    setPlace(null)
    setMessage(null)
  }, [])

  const resolve = useCallback(async () => {
    setMessage(null)
    if (!("geolocation" in navigator)) {
      setStatus("unsupported")
      setMessage("Location is not supported in this browser.")
      return
    }

    setStatus("locating")
    const key = import.meta.env.VITE_OPENCAGE_API_KEY as string | undefined
    if (!key?.trim()) {
      setStatus("error")
      setMessage("OpenCage API key is not configured.")
      return
    }

    const pos = await new Promise<GeolocationPosition>((resolvePos, reject) => {
      navigator.geolocation.getCurrentPosition(resolvePos, reject, {
        enableHighAccuracy: false,
        maximumAge: 60_000,
        timeout: 15_000,
      })
    }).catch(() => null)

    if (!pos) {
      setStatus("error")
      setMessage("Could not read your location. Check permissions and try again.")
      return
    }

    setStatus("geocoding")
    const lat = pos.coords.latitude
    const lng = pos.coords.longitude
    const url = new URL("https://api.opencagedata.com/geocode/v1/json")
    url.searchParams.set("q", `${lat}+${lng}`)
    url.searchParams.set("key", key.trim())
    url.searchParams.set("no_annotations", "1")

    const res = await fetch(url.toString())
    if (!res.ok) {
      setStatus("error")
      setMessage("Geocoding service returned an error.")
      return
    }

    const json = (await res.json()) as {
      results?: Array<{ formatted?: string; components?: Record<string, string> }>
    }
    const first = json.results?.[0]
    const c = first?.components ?? {}
    const city =
      c.city ||
      c.town ||
      c.village ||
      c.hamlet ||
      c.county ||
      c.state_district ||
      ""
    const state = c.state_code || c.state || ""
    if (!city || !state) {
      setStatus("error")
      setMessage("Could not determine city and state from your location.")
      return
    }

    setPlace({
      city: city.trim(),
      state: state.trim(),
      label: (first?.formatted ?? `${city}, ${state}`).trim(),
    })
    setStatus("ready")
  }, [])

  useEffect(() => {
    return () => {
      /* no-op */
    }
  }, [])

  return { status, place, message, resolve, reset }
}
