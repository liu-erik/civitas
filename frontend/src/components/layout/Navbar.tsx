import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Globe, LogIn, Settings, UserRound } from "lucide-react"
import { NavLink } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/useAuth"
import { useLanguage } from "@/hooks/useLanguage"
import {
  SUPPORTED_LANGUAGE_CODES,
  type SupportedLanguageCode,
} from "@/i18n/storage"
import { cn } from "@/lib/utils"

const LANGUAGE_FLAGS: Record<SupportedLanguageCode, string> = {
  en: "🇺🇸",
  es: "🇪🇸",
  zh: "🇨🇳",
}

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "inline-flex min-h-11 shrink-0 items-center justify-center rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-150",
    isActive
      ? "border-blue-200 bg-blue-50 text-blue-600"
      : "border-transparent text-gray-600 hover:bg-gray-50",
  )

export function Navbar() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { code, setLanguage } = useLanguage()
  const [languageQuery, setLanguageQuery] = useState("")

  const filteredCodes = useMemo(() => {
    const q = languageQuery.trim().toLowerCase()
    if (!q) return [...SUPPORTED_LANGUAGE_CODES]
    return SUPPORTED_LANGUAGE_CODES.filter((c) => {
      const name = t(`languages.${c}`).toLowerCase()
      return name.includes(q) || c.includes(q)
    })
  }, [languageQuery, t])

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-3 px-6 md:gap-6">
        <NavLink
          to="/"
          className="flex min-h-11 min-w-11 shrink-0 items-center gap-2 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          end
        >
          <Globe
            className="h-7 w-7 text-blue-500"
            aria-hidden
            strokeWidth={2}
          />
          <span className="text-lg font-semibold text-blue-500">
            {t("common.appName")}
          </span>
        </NavLink>

        <nav
          className="flex flex-1 justify-center overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label={t("nav.mainNav")}
        >
          <div className="flex items-center gap-1 px-1">
            <NavLink to="/" className={navLinkClass} end>
              {t("nav.home")}
            </NavLink>
            <NavLink to="/topics" className={navLinkClass}>
              {t("nav.topics")}
            </NavLink>
            <NavLink to="/rights" className={navLinkClass}>
              {t("nav.rights")}
            </NavLink>
            <NavLink to="/get-involved" className={navLinkClass}>
              {t("nav.getInvolved")}
            </NavLink>
            <NavLink to="/politics" className={navLinkClass}>
              {t("nav.politics")}
            </NavLink>
          </div>
        </nav>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                className="h-11 gap-2 px-3 text-sm font-medium text-gray-700"
                aria-label={t("language.menuLabel")}
              >
                <span className="text-lg leading-none" aria-hidden>
                  {LANGUAGE_FLAGS[code]}
                </span>
                <span className="hidden max-w-[8rem] truncate sm:inline">
                  {t(`languages.${code}`)}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>{t("language.menuLabel")}</DropdownMenuLabel>
              <div className="px-1.5 pb-2">
                <Input
                  type="search"
                  value={languageQuery}
                  onChange={(e) => setLanguageQuery(e.target.value)}
                  placeholder={t("language.searchPlaceholder")}
                  className="h-9 min-h-11 text-sm"
                  aria-label={t("language.searchPlaceholder")}
                />
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={code}
                onValueChange={(v) =>
                  setLanguage(v as SupportedLanguageCode)
                }
              >
                {filteredCodes.map((c) => (
                  <DropdownMenuRadioItem key={c} value={c}>
                    <span className="mr-2" aria-hidden>
                      {LANGUAGE_FLAGS[c]}
                    </span>
                    {t(`languages.${c}`)}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11 shrink-0"
            asChild
          >
            <NavLink to="/settings" aria-label={t("nav.openSettings")}>
              <Settings className="h-5 w-5 text-gray-600" aria-hidden />
            </NavLink>
          </Button>

          {user ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-11 w-11 shrink-0"
              asChild
            >
              <NavLink to="/settings" aria-label={user.displayName}>
                <UserRound className="h-5 w-5 text-gray-600" aria-hidden />
              </NavLink>
            </Button>
          ) : (
            <Button
              variant="ghost"
              className="h-11 gap-1.5 px-3 text-sm font-medium text-gray-700"
              asChild
            >
              <NavLink to="/settings">
                <LogIn className="h-4 w-4" aria-hidden />
                <span className="hidden sm:inline">{t("nav.login")}</span>
              </NavLink>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
