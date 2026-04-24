import { motion, useReducedMotion } from "framer-motion"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { CategoryApi } from "@/lib/api"
import { cn } from "@/lib/utils"

type Props = {
  categories: CategoryApi[]
}

export function CategoryGrid({ categories }: Props) {
  const { t } = useTranslation()
  const reduceMotion = useReducedMotion()

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {categories.map((c, i) => (
        <motion.div
          key={c.id}
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduceMotion ? 0 : 0.25,
            delay: reduceMotion ? 0 : Math.min(i * 0.04, 0.24),
          }}
        >
          <Card
            className={cn(
              "h-full shadow-[0_4px_12px_rgba(0,0,0,0.08)] ring-gray-200",
              c.color === "green" ? "ring-green-100" : "ring-blue-100",
            )}
          >
            <CardHeader>
              <CardTitle className="text-lg text-gray-900">{c.name}</CardTitle>
              <CardDescription className="text-base leading-relaxed text-gray-600">
                {c.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="text-sm text-gray-500">
                {t("pages.topics.topicCount", { count: c.topic_count })}
              </p>
              <Button asChild className="min-h-11 w-full rounded-lg">
                <Link to={`/topics/${encodeURIComponent(c.slug)}`}>
                  {t("pages.topics.browseCategory")}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
