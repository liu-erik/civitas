import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Outlet, useLocation } from "react-router-dom"

export function PageTransition() {
  const location = useLocation()
  const reduceMotion = useReducedMotion()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        className="min-h-full"
        initial={reduceMotion ? { x: 0, opacity: 1 } : { x: 32, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={reduceMotion ? { x: 0, opacity: 1 } : { x: -32, opacity: 0 }}
        transition={{
          duration: reduceMotion ? 0 : 0.25,
          ease: "easeInOut",
        }}
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  )
}
