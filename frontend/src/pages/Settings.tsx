import { useState } from "react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/useAuth"
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase"

export function Settings() {
  const { t } = useTranslation()
  const { user, session, isLoading } = useAuth()
  const supabase = getSupabaseClient()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  if (!isSupabaseConfigured()) {
    return (
      <div className="flex flex-1 flex-col px-6 py-10 md:px-12">
        <div className="mx-auto w-full max-w-[520px]">
          <h1 className="text-3xl font-semibold text-gray-900">
            {t("pages.settings.title")}
          </h1>
          <p className="mt-4 text-base leading-[1.7] text-gray-600">
            {t("pages.settings.supabaseMissing")}
          </p>
        </div>
      </div>
    )
  }

  const onSignIn = async () => {
    if (!supabase) return
    setBusy(true)
    setError(null)
    setMessage(null)
    const { error: err } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })
    setBusy(false)
    if (err) {
      setError(err.message)
      return
    }
    setMessage(t("pages.settings.signedIn"))
    setPassword("")
  }

  const onSignUp = async () => {
    if (!supabase) return
    setBusy(true)
    setError(null)
    setMessage(null)
    const { error: err } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    })
    setBusy(false)
    if (err) {
      setError(err.message)
      return
    }
    setMessage(t("pages.settings.checkEmail"))
    setPassword("")
  }

  const onSignOut = async () => {
    if (!supabase) return
    setBusy(true)
    setError(null)
    setMessage(null)
    const { error: err } = await supabase.auth.signOut()
    setBusy(false)
    if (err) {
      setError(err.message)
      return
    }
    setMessage(t("pages.settings.signedOut"))
  }

  return (
    <div className="flex flex-1 flex-col px-6 py-10 md:px-12">
      <div className="mx-auto w-full max-w-[520px]">
        <h1 className="text-3xl font-semibold text-gray-900">
          {t("pages.settings.title")}
        </h1>
        <p className="mt-4 text-base leading-[1.7] text-gray-600">
          {t("pages.settings.intro")}
        </p>

        {isLoading ? (
          <p className="mt-8 text-base text-gray-600" role="status">
            {t("pages.settings.loadingAuth")}
          </p>
        ) : session?.user ? (
          <div className="mt-8 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <p className="text-base text-gray-800">
              {t("pages.settings.signedInAs", {
                email: session.user.email ?? user?.displayName ?? "",
              })}
            </p>
            <Button
              type="button"
              variant="outline"
              className="min-h-11 rounded-lg"
              onClick={() => void onSignOut()}
              disabled={busy}
            >
              {t("pages.settings.signOut")}
            </Button>
          </div>
        ) : (
          <form
            className="mt-8 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
            onSubmit={(e) => {
              e.preventDefault()
            }}
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="settings-email" className="text-sm font-medium text-gray-800">
                {t("pages.settings.email")}
              </label>
              <Input
                id="settings-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="min-h-11 text-base"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="settings-password"
                className="text-sm font-medium text-gray-800"
              >
                {t("pages.settings.password")}
              </label>
              <Input
                id="settings-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="min-h-11 text-base"
              />
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                type="button"
                className="min-h-11 rounded-lg"
                onClick={() => void onSignIn()}
                disabled={busy}
              >
                {t("pages.settings.signIn")}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="min-h-11 rounded-lg"
                onClick={() => void onSignUp()}
                disabled={busy}
              >
                {t("pages.settings.signUp")}
              </Button>
            </div>
          </form>
        )}

        {message ? (
          <p className="mt-6 text-base text-emerald-700" role="status">
            {message}
          </p>
        ) : null}
        {error ? (
          <p className="mt-6 text-base text-red-600" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  )
}
