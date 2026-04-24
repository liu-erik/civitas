import { ChevronLeft } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import type { TopicSummaryApi } from "@/lib/api"
import { cn } from "@/lib/utils"

type Props = {
  categorySlug: string
  categoryTitle: string
  topics: TopicSummaryApi[]
}

export function TopicList({ categorySlug, categoryTitle, topics }: Props) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Button
          variant="ghost"
          className="mb-2 min-h-11 gap-2 px-0 text-gray-700 hover:bg-transparent"
          asChild
        >
          <Link to="/topics">
            <ChevronLeft className="h-4 w-4" aria-hidden />
            {t("pages.topics.backToCategories")}
          </Link>
        </Button>
        <h2 className="text-2xl font-semibold text-gray-900">{categoryTitle}</h2>
      </div>
      <ul className="flex flex-col gap-2">
        {topics.map((topic) => (
          <li key={topic.id}>
            <Link
              to={`/topics/${encodeURIComponent(categorySlug)}/${encodeURIComponent(topic.slug)}`}
              className={cn(
                "flex min-h-11 items-center rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-900 shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-colors",
                "hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700",
              )}
            >
              {topic.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
