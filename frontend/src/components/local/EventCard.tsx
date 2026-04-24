import { Calendar, ExternalLink, MapPin } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type Props = {
  data: Record<string, unknown>
}

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : ""
}

export function EventCard({ data }: Props) {
  const title = str(data.title) || "Event"
  const datetime = str(data.datetime)
  const location = str(data.location)
  const url = str(data.url)

  return (
    <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.08)] ring-1 ring-gray-200">
      <CardHeader>
        <CardTitle className="text-lg text-gray-900">{title}</CardTitle>
        {datetime ? (
          <CardDescription className="inline-flex min-h-11 items-start gap-2 text-base text-gray-600">
            <Calendar className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <span>{datetime}</span>
          </CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-3 text-base text-gray-700">
        {location ? (
          <p className="inline-flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" aria-hidden />
            <span>{location}</span>
          </p>
        ) : null}
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center gap-2 text-blue-600 hover:underline"
          >
            <ExternalLink className="h-4 w-4 shrink-0" aria-hidden />
            {url.replace(/^https?:\/\//, "")}
          </a>
        ) : null}
      </CardContent>
    </Card>
  )
}
