import { BrowserRouter, Route, Routes } from "react-router-dom"

import { PageTransition } from "@/components/layout/PageTransition"
import { RootLayout } from "@/components/layout/RootLayout"
import { GetInvolved } from "@/pages/GetInvolved"
import { Home } from "@/pages/Home"
import { Politics } from "@/pages/Politics"
import { Rights } from "@/pages/Rights"
import { Settings } from "@/pages/Settings"
import { Topics } from "@/pages/Topics"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route element={<PageTransition />}>
            <Route index element={<Home />} />
            <Route path="topics" element={<Topics />} />
            <Route path="topics/:category" element={<Topics />} />
            <Route path="topics/:category/:topic" element={<Topics />} />
            <Route path="rights" element={<Rights />} />
            <Route path="get-involved" element={<GetInvolved />} />
            <Route path="politics" element={<Politics />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
