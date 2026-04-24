import axios from "axios"
import { useCallback, useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

import { AIGlobe } from "@/components/home/AIGlobe"
import { ChatInput } from "@/components/home/ChatInput"
import { ChatResponse } from "@/components/home/ChatResponse"
import { SuggestedQuestions } from "@/components/home/SuggestedQuestions"
import { useAuth } from "@/hooks/useAuth"
import { useLanguage } from "@/hooks/useLanguage"
import { postChat } from "@/lib/api"
import type { ChatMessage } from "@/lib/types"

function useTimeOfDayGreetingKey(): "morning" | "afternoon" | "evening" {
  const hour = new Date().getHours()
  if (hour < 12) return "morning"
  if (hour < 17) return "afternoon"
  return "evening"
}

function newId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
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

export function Home() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { code } = useLanguage()
  const greetingKey = useTimeOfDayGreetingKey()

  const greeting = useMemo(() => {
    const base = t(`home.greeting.${greetingKey}`)
    if (user?.displayName) {
      return `${base}, ${user.displayName}`
    }
    return base
  }, [greetingKey, t, user?.displayName])

  const [draft, setDraft] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isSending, setIsSending] = useState(false)
  const [chatError, setChatError] = useState<string | null>(null)
  const sendingRef = useRef(false)

  const sendQuestion = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || sendingRef.current) return

      sendingRef.current = true
      setIsSending(true)
      setChatError(null)
      setDraft("")
      setMessages((prev) => [
        ...prev,
        { id: newId(), role: "user", content: trimmed },
      ])

      try {
        const data = await postChat(trimmed, code)
        setMessages((prev) => [
          ...prev,
          {
            id: newId(),
            role: "assistant",
            content: data.response,
            sources: data.sources?.length ? data.sources : undefined,
          },
        ])
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const status = err.response?.status
          const retryRaw = err.response?.headers["retry-after"]
          const retrySec =
            typeof retryRaw === "string"
              ? retryRaw
              : Array.isArray(retryRaw)
                ? retryRaw[0]
                : undefined

          if (status === 429) {
            setChatError(
              retrySec
                ? t("chat.rateLimited", { seconds: retrySec })
                : t("chat.rateLimitedGeneric"),
            )
          } else {
            const fromBody = formatHttpDetail(err.response?.data?.detail)
            setChatError(fromBody ?? t("chat.errorGeneric"))
          }
        } else {
          setChatError(t("chat.errorGeneric"))
        }
      } finally {
        sendingRef.current = false
        setIsSending(false)
      }
    },
    [code, t],
  )

  const handleSubmit = useCallback(() => {
    void sendQuestion(draft)
  }, [draft, sendQuestion])

  return (
    <div className="flex flex-1 flex-col px-6 pb-32 pt-10 md:px-12">
      <div className="mx-auto flex w-full max-w-[720px] flex-col items-center gap-8">
        <AIGlobe isProcessing={isSending} />

        <div className="w-full text-center">
          <p className="text-lg text-gray-900 md:text-xl">{greeting}</p>
          <h1 className="mt-2 text-2xl font-semibold text-blue-500 md:text-3xl">
            {t("home.tagline")}
          </h1>
        </div>

        {messages.length > 0 ? (
          <div className="flex w-full flex-col gap-4">
            {messages.map((m) => (
              <ChatResponse key={m.id} message={m} />
            ))}
          </div>
        ) : null}

        {chatError ? (
          <div
            role="alert"
            className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-snug text-red-800"
          >
            {chatError}
          </div>
        ) : null}

        <div className="w-full">
          <SuggestedQuestions
            disabled={isSending}
            onSelect={(q) => {
              void sendQuestion(q)
            }}
          />
        </div>
      </div>

      <ChatInput
        value={draft}
        onChange={setDraft}
        onSubmit={handleSubmit}
        disabled={isSending}
      />
    </div>
  )
}
