import axios from "axios"
import { ChevronLeft } from "lucide-react"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { getTopicExplanation, type TopicExplanationApi } from "@/lib/api"
import { getSupabaseClient } from "@/lib/supabase"

type Props = {
  categorySlug: string
  topicSlug: string
  languageCode: string
}

function formatHttpDetail(detail: unknown): string | null {
  if (typeof detail === "string" && detail.trim()) return detail
  if (Array.isArray(detail)) {
    const parts = detail
      .map((x) => {
        if (typeof x === "object" && x !== null && "msg" in x) {
          return String((x as { msg: unknown }).msg)
        }
        return null
      })
      .filter(Boolean)
    if (parts.length) return parts.join(" ")
  }
  return null
}

export function TopicExplanation({
  categorySlug,
  topicSlug,
  languageCode,
}: Props) {
  const { t } = useTranslation()
  const { session } = useAuth()
  const [data, setData] = useState<TopicExplanationApi | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    void getTopicExplanation(categorySlug, topicSlug, languageCode)
      .then((res) => {
        if (cancelled) return
        setData(res)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        if (axios.isAxiosError(err)) {
          const status = err.response?.status
          const detail = formatHttpDetail(err.response?.data?.detail)
          if (status === 404) {
            setError(t("pages.topics.topicNotFound"))
            return
          }
          if (status === 503 && detail) {
            setError(detail)
            return
          }
        }
        setError(t("pages.topics.loadTopicError"))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [categorySlug, topicSlug, languageCode, t])

  useEffect(() => {
    if (!data?.id || !session?.user) return
    const sb = getSupabaseClient()
    if (!sb) return
    void sb
      .from("user_progress")
      .upsert(
        { user_id: session.user.id, topic_id: data.id },
        { onConflict: "user_id,topic_id" },
      )
      .then(() => {
        /* ignore errors — progress is best-effort */
      })
  }, [data?.id, session?.user])

  if (loading) {
    return (
      <p className="text-base text-gray-600" role="status">
        {t("pages.topics.loadingTopic")}
      </p>
    )
  }

  if (error || !data) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-base text-red-600">{error ?? t("pages.topics.loadTopicError")}</p>
        <Button asChild variant="outline" className="min-h-11 w-fit rounded-lg">
          <Link to={`/topics/${encodeURIComponent(categorySlug)}`}>
            {t("pages.topics.backToTopics")}
          </Link>
        </Button>
      </div>
    )
  }

  const sections: { key: "what_it_is" | "why_it_matters" | "what_you_can_do"; label: string; body: string | null }[] =
    [
      {
        key: "what_it_is",
        label: t("pages.topics.sectionWhatItIs"),
        body: data.what_it_is,
      },
      {
        key: "why_it_matters",
        label: t("pages.topics.sectionWhyItMatters"),
        body: data.why_it_matters,
      },
      {
        key: "what_you_can_do",
        label: t("pages.topics.sectionWhatYouCanDo"),
        body: data.what_you_can_do,
      },
    ]

  return (
    <article className="flex flex-col gap-8">
      <div>
        <Button
          variant="ghost"
          className="mb-2 min-h-11 gap-2 px-0 text-gray-700 hover:bg-transparent"
          asChild
        >
          <Link to={`/topics/${encodeURIComponent(categorySlug)}`}>
            <ChevronLeft className="h-4 w-4" aria-hidden />
            {t("pages.topics.backToTopics")}
          </Link>
        </Button>
        <h1 className="text-3xl font-semibold text-gray-900">{data.title}</h1>
      </div>

      <div className="flex flex-col gap-8">
        {sections.map((s) =>
          s.body?.trim() ? (
            <section key={s.key} className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold text-gray-900">{s.label}</h2>
              <div className="whitespace-pre-wrap text-base leading-[1.7] text-gray-700">
                {s.body}
              </div>
            </section>
          ) : null,
        )}
      </div>
    </article>
  )
}
