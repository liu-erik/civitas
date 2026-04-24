import { MessageCircleQuestion } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const QUESTION_KEYS = [
  "q1",
  "q2",
  "q3",
  "q4",
  "q5",
  "q6",
] as const

type SuggestedQuestionsProps = {
  onSelect: (question: string) => void
  disabled?: boolean
}

export function SuggestedQuestions({
  onSelect,
  disabled = false,
}: SuggestedQuestionsProps) {
  const { t } = useTranslation()

  return (
    <Card className="rounded-2xl border border-gray-200 shadow-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium text-gray-900">
          {t("home.suggestedIntro")}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {QUESTION_KEYS.map((key) => {
            const label = t(`home.questions.${key}`)
            return (
              <button
                key={key}
                type="button"
                disabled={disabled}
                onClick={() => onSelect(label)}
                className={cn(
                  "flex min-h-11 w-full items-start gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 text-left text-sm leading-snug text-gray-800 shadow-none transition-colors duration-150",
                  "hover:border-blue-200 hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                )}
              >
                <MessageCircleQuestion
                  className="mt-0.5 h-5 w-5 shrink-0 text-blue-500"
                  aria-hidden
                />
                <span>{label}</span>
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
