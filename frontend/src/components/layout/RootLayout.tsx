import { Outlet } from "react-router-dom"

import { Navbar } from "@/components/layout/Navbar"

export function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F9FAFB]">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  )
}
