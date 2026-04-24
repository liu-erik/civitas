import axios from "axios"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"

import { CategoryGrid } from "@/components/topics/CategoryGrid"
import { TopicExplanation } from "@/components/topics/TopicExplanation"
import { TopicList } from "@/components/topics/TopicList"
import { useLanguage } from "@/hooks/useLanguage"
import {
  getCategories,
  getTopicsForCategory,
  type CategoryApi,
  type TopicSummaryApi,
} from "@/lib/api"

export function Topics() {
  const { t } = useTranslation()
  const { category, topic } = useParams<{
    category?: string
    topic?: string
  }>()
  const { code } = useLanguage()

  const [categories, setCategories] = useState<CategoryApi[]>([])
  const [catLoading, setCatLoading] = useState(!category && !topic)
  const [catError, setCatError] = useState<string | null>(null)

  const [topics, setTopics] = useState<TopicSummaryApi[]>([])
  const [topicsLoading, setTopicsLoading] = useState(Boolean(category && !topic))
  const [topicsError, setTopicsError] = useState<string | null>(null)

  useEffect(() => {
    if (topic) return
    let cancelled = false
    const isRoot = !category
    if (isRoot) {
      setCatLoading(true)
      setCatError(null)
    }
    void getCategories(code)
      .then((rows) => {
        if (cancelled) return
        setCategories(rows)
      })
      .catch(() => {
        if (cancelled) return
        if (isRoot) setCatError(t("pages.topics.loadCategoriesError"))
      })
      .finally(() => {
        if (!cancelled && isRoot) setCatLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [category, topic, code, t])

  useEffect(() => {
    if (!category || topic) return
    let cancelled = false
    setTopicsLoading(true)
    setTopicsError(null)
    void getTopicsForCategory(category, code)
      .then((rows) => {
        if (cancelled) return
        setTopics(rows)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setTopicsError(t("pages.topics.categoryNotFound"))
          return
        }
        setTopicsError(t("pages.topics.loadTopicsError"))
      })
      .finally(() => {
        if (!cancelled) setTopicsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [category, topic, code, t])

  const categoryMeta = useMemo(() => {
    if (!category) return null
    return categories.find((c) => c.slug === category) ?? null
  }, [categories, category])

  const categoryTitle = useMemo(() => {
    if (categoryMeta?.name) return categoryMeta.name
    if (category) return category.replace(/-/g, " ")
    return ""
  }, [categoryMeta, category])

  if (!category && !topic) {
    return (
      <div className="flex flex-1 flex-col px-6 py-10 md:px-12">
        <div className="mx-auto w-full max-w-[960px]">
          <h1 className="text-3xl font-semibold text-gray-900">
            {t("pages.topics.title")}
          </h1>
          <p className="mt-4 text-base leading-[1.7] text-gray-600">
            {t("pages.topics.intro")}
          </p>
          <div className="mt-10">
            {catLoading ? (
              <p className="text-base text-gray-600" role="status">
                {t("pages.topics.loadingCategories")}
              </p>
            ) : catError ? (
              <p className="text-base text-red-600">{catError}</p>
            ) : (
              <CategoryGrid categories={categories} />
            )}
          </div>
        </div>
      </div>
    )
  }

  if (category && !topic) {
    return (
      <div className="flex flex-1 flex-col px-6 py-10 md:px-12">
        <div className="mx-auto w-full max-w-[720px]">
          {topicsLoading ? (
            <p className="text-base text-gray-600" role="status">
              {t("pages.topics.loadingTopics")}
            </p>
          ) : topicsError ? (
            <p className="text-base text-red-600">{topicsError}</p>
          ) : (
            <TopicList
              categorySlug={category}
              categoryTitle={categoryTitle}
              topics={topics}
            />
          )}
        </div>
      </div>
    )
  }

  if (category && topic) {
    return (
      <div className="flex flex-1 flex-col px-6 py-10 md:px-12">
        <div className="mx-auto w-full max-w-[720px]">
          <TopicExplanation
            categorySlug={category}
            topicSlug={topic}
            languageCode={code}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col px-6 py-10 md:px-12">
      <p className="text-base text-gray-600">{t("pages.topics.unexpectedState")}</p>
    </div>
  )
}
