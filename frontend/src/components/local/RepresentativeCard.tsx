import { ExternalLink, Phone } from "lucide-react"

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

export function RepresentativeCard({ data }: Props) {
  const name = str(data.name) || "Representative"
  const title = str(data.title)
  const office = str(data.office)
  const phone = str(data.phone)
  const website = str(data.website)

  return (
    <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.08)] ring-1 ring-gray-200">
      <CardHeader>
        <CardTitle className="text-lg text-gray-900">{name}</CardTitle>
        {title ? (
          <CardDescription className="text-base text-gray-600">
            {title}
          </CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-3 text-base text-gray-700">
        {office ? <p>{office}</p> : null}
        {phone ? (
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="inline-flex min-h-11 items-center gap-2 text-blue-600 hover:underline"
          >
            <Phone className="h-4 w-4 shrink-0" aria-hidden />
            {phone}
          </a>
        ) : null}
        {website ? (
          <a
            href={website}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center gap-2 text-blue-600 hover:underline"
          >
            <ExternalLink className="h-4 w-4 shrink-0" aria-hidden />
            {website.replace(/^https?:\/\//, "")}
          </a>
        ) : null}
      </CardContent>
    </Card>
  )
}
