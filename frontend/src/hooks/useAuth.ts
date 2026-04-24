import type { Session, User } from "@supabase/supabase-js"
import { useEffect, useState } from "react"

import { getSupabaseClient } from "@/lib/supabase"

function displayNameFromUser(user: User | null): string | null {
  if (!user) return null
  const meta = user.user_metadata as Record<string, unknown> | undefined
  const full =
    typeof meta?.full_name === "string"
      ? meta.full_name.trim()
      : typeof meta?.name === "string"
        ? meta.name.trim()
        : ""
  if (full) return full
  if (user.email) return user.email.split("@")[0] ?? user.email
  return null
}

export function useAuth() {
  const supabase = getSupabaseClient()
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(Boolean(supabase))

  useEffect(() => {
    if (!supabase) {
      setSession(null)
      setIsLoading(false)
      return
    }

    let cancelled = false

    void supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return
      setSession(data.session ?? null)
      setIsLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next)
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [supabase])

  const dn = displayNameFromUser(session?.user ?? null)

  return {
    user: dn ? { displayName: dn } : null,
    session,
    isLoading,
  }
}
