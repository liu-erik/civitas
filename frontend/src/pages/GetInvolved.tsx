import { useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { EventCard } from "@/components/local/EventCard"
import { OrganizationCard } from "@/components/local/OrganizationCard"
import { RepresentativeCard } from "@/components/local/RepresentativeCard"
import { Button } from "@/components/ui/button"
import { useGeoPlace } from "@/hooks/useLocation"
import { getLocalListings, type LocalDataApi } from "@/lib/api"

const PRESETS = [
  { city: "Seattle", state: "WA", label: "Seattle, WA" },
  { city: "Bellevue", state: "WA", label: "Bellevue, WA" },
] as const

export function GetInvolved() {
  const { t } = useTranslation()
  const geo = useGeoPlace()
  const [listings, setListings] = useState<LocalDataApi[]>([])
  const [activeCity, setActiveCity] = useState("")
  const [activeState, setActiveState] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadForPlace = useCallback(
    async (city: string, state: string) => {
      setLoading(true)
      setError(null)
      setActiveCity(city)
      setActiveState(state)
      try {
        const rows = await getLocalListings(city, state)
        setListings(rows)
      } catch {
        setError(t("pages.getInvolved.loadError"))
        setListings([])
      } finally {
        setLoading(false)
      }
    },
    [t],
  )

  useEffect(() => {
    if (geo.status === "ready" && geo.place) {
      void loadForPlace(geo.place.city, geo.place.state)
    }
  }, [geo.status, geo.place, loadForPlace])

  return (
    <div className="flex flex-1 flex-col px-6 py-10 md:px-12">
      <div className="mx-auto w-full max-w-[960px]">
        <h1 className="text-3xl font-semibold text-gray-900">
          {t("pages.getInvolved.title")}
        </h1>
        <p className="mt-4 text-base leading-[1.7] text-gray-600">
          {t("pages.getInvolved.intro")}
        </p>

        <div className="mt-8 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-[0_4px_12px_rgba(0,0,0,0.06)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-gray-900">
              {t("pages.getInvolved.locationHeading")}
            </p>
            {geo.status === "ready" && geo.place ? (
              <p className="text-base text-gray-700">{geo.place.label}</p>
            ) : geo.message ? (
              <p className="text-base text-red-600">{geo.message}</p>
            ) : (
              <p className="text-base text-gray-600">
                {t("pages.getInvolved.locationHint")}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              className="min-h-11 rounded-lg"
              onClick={() => void geo.resolve()}
              disabled={
                geo.status === "locating" ||
                geo.status === "geocoding" ||
                geo.status === "unsupported"
              }
            >
              {geo.status === "locating" || geo.status === "geocoding"
                ? t("pages.getInvolved.locating")
                : t("pages.getInvolved.useMyLocation")}
            </Button>
            {PRESETS.map((p) => (
              <Button
                key={p.label}
                type="button"
                variant="outline"
                className="min-h-11 rounded-lg"
                onClick={() => void loadForPlace(p.city, p.state)}
              >
                {p.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-10">
          {loading ? (
            <p className="text-base text-gray-600" role="status">
              {t("pages.getInvolved.loadingListings")}
            </p>
          ) : error ? (
            <p className="text-base text-red-600">{error}</p>
          ) : !activeCity ? (
            <p className="text-base text-gray-600">
              {t("pages.getInvolved.pickLocation")}
            </p>
          ) : listings.length === 0 ? (
            <p className="text-base text-gray-600">
              {t("pages.getInvolved.noListings", {
                city: activeCity,
                state: activeState,
              })}
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {listings.map((row) => {
                const data = row.data as Record<string, unknown>
                if (row.type === "representative") {
                  return <RepresentativeCard key={row.id} data={data} />
                }
                if (row.type === "organization") {
                  return <OrganizationCard key={row.id} data={data} />
                }
                return <EventCard key={row.id} data={data} />
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
