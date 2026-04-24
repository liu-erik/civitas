import { createClient, type SupabaseClient } from "@supabase/supabase-js"

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

let client: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient | null {
  if (!url?.trim() || !anonKey?.trim()) {
    return null
  }
  if (!client) {
    client = createClient(url.trim(), anonKey.trim())
  }
  return client
}

export function isSupabaseConfigured(): boolean {
  return Boolean(url?.trim() && anonKey?.trim())
}
