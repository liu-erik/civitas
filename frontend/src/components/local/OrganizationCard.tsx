import { ExternalLink } from "lucide-react"

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

export function OrganizationCard({ data }: Props) {
  const name = str(data.name) || "Organization"
  const mission = str(data.mission)
  const url = str(data.url)

  return (
    <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.08)] ring-1 ring-gray-200">
      <CardHeader>
        <CardTitle className="text-lg text-gray-900">{name}</CardTitle>
        {mission ? (
          <CardDescription className="text-base leading-relaxed text-gray-600">
            {mission}
          </CardDescription>
        ) : null}
      </CardHeader>
      {url ? (
        <CardContent>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center gap-2 text-base text-blue-600 hover:underline"
          >
            <ExternalLink className="h-4 w-4 shrink-0" aria-hidden />
            {url.replace(/^https?:\/\//, "")}
          </a>
        </CardContent>
      ) : null}
    </Card>
  )
}
