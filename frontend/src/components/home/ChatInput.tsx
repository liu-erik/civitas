import { ArrowUp } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type ChatInputProps = {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  disabled?: boolean
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled = false,
}: ChatInputProps) {
  const { t } = useTranslation()

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-200 bg-white px-4 py-3 md:px-8">
      <form
        className="mx-auto flex max-w-[720px] items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit()
        }}
      >
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t("home.chatPlaceholder")}
          disabled={disabled}
          className="min-h-11 flex-1 rounded-lg border-gray-200 text-base md:text-base"
          aria-label={t("home.chatPlaceholder")}
        />
        <Button
          type="submit"
          disabled={disabled || !value.trim()}
          className="h-11 w-11 shrink-0 rounded-full bg-blue-500 p-0 hover:bg-blue-700"
          aria-label={t("home.send")}
        >
          <ArrowUp className="h-5 w-5" aria-hidden />
        </Button>
      </form>
    </div>
  )
}
