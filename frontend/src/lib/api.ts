import axios from "axios"

import type { LocalData, Source } from "@/lib/types"

const baseURL = import.meta.env.VITE_API_URL ?? "http://localhost:8000"

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
})

/** Matches FastAPI `ChatResponseBody` for `POST /chat`. */
export type ChatApiResponse = {
  response: string
  sources: Source[]
}

export type CategoryApi = {
  id: string
  slug: string
  icon: string
  color: string
  name: string
  description: string
  topic_count: number
}

export type TopicSummaryApi = {
  id: string
  slug: string
  title: string
}

export type TopicExplanationApi = {
  id: string
  category_id: string
  slug: string
  title: string
  what_it_is: string | null
  why_it_matters: string | null
  what_you_can_do: string | null
}

export type LocalDataApi = {
  id: string
  type: LocalData["type"]
  city: string | null
  state: string | null
  data: Record<string, unknown>
}

export async function postChat(
  question: string,
  languageCode: string,
): Promise<ChatApiResponse> {
  const { data } = await api.post<ChatApiResponse>("/chat", {
    question,
    language_code: languageCode,
  })
  return data
}

export async function getCategories(
  languageCode: string,
): Promise<CategoryApi[]> {
  const { data } = await api.get<CategoryApi[]>("/topics", {
    params: { lang: languageCode },
  })
  return data
}

export async function getTopicsForCategory(
  categorySlug: string,
  languageCode: string,
): Promise<TopicSummaryApi[]> {
  const { data } = await api.get<TopicSummaryApi[]>(
    `/topics/${encodeURIComponent(categorySlug)}`,
    { params: { lang: languageCode } },
  )
  return data
}

export async function getTopicExplanation(
  categorySlug: string,
  topicSlug: string,
  languageCode: string,
): Promise<TopicExplanationApi> {
  const { data } = await api.get<TopicExplanationApi>(
    `/topics/${encodeURIComponent(categorySlug)}/${encodeURIComponent(topicSlug)}`,
    { params: { lang: languageCode } },
  )
  return data
}

export async function getLocalListings(
  city: string,
  state: string,
): Promise<LocalDataApi[]> {
  const { data } = await api.get<LocalDataApi[]>("/local", {
    params: { city, state },
  })
  return data
}

// Future: attach Supabase JWT for protected routes, e.g.
// api.interceptors.request.use((config) => {
//   const session = ...
//   if (session?.access_token) {
//     config.headers.Authorization = `Bearer ${session.access_token}`
//   }
//   return config
// })
