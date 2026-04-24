import { ExternalLink } from "lucide-react"
import { useTranslation } from "react-i18next"

import type { ChatMessage } from "@/lib/types"
import { cn } from "@/lib/utils"

type ChatResponseProps = {
  message: ChatMessage
  className?: string
}

export function ChatResponse({ message, className }: ChatResponseProps) {
  const { t } = useTranslation()

  if (message.role !== "assistant") {
    return (
      <div
        className={cn(
          "rounded-xl border border-gray-200 bg-white px-4 py-3 text-base leading-[1.7] text-gray-900 shadow-card",
          className,
        )}
      >
        {message.content}
      </div>
    )
  }

  return (
    <article
      className={cn(
        "rounded-xl border border-gray-200 border-l-[3px] border-l-blue-500 bg-white px-4 py-3 text-base leading-[1.7] text-gray-900 shadow-card",
        className,
      )}
      aria-label={t("chat.assistantLabel")}
    >
      <p className="whitespace-pre-wrap">{message.content}</p>
      {message.sources && message.sources.length > 0 ? (
        <ul className="mt-4 flex flex-col gap-2">
          {message.sources.map((source, index) => (
            <li key={`${source.url}-${source.title}-${index}`}>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 w-full max-w-full items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 transition-colors hover:border-blue-200 hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
              >
                <ExternalLink
                  className="h-4 w-4 shrink-0 text-blue-500"
                  aria-hidden
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{source.title}</span>
                  {source.summary ? (
                    <span className="mt-1 block text-xs font-normal leading-snug text-gray-500">
                      {source.summary}
                    </span>
                  ) : null}
                </span>
                <span className="sr-only">{t("chat.sourceLink")}</span>
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  )
}
