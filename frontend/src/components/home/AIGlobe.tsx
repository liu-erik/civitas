import { motion, useReducedMotion } from "framer-motion"
import { Globe } from "lucide-react"

type AIGlobeProps = {
  isProcessing?: boolean
}

export function AIGlobe({ isProcessing = false }: AIGlobeProps) {
  const reduceMotion = useReducedMotion()

  return (
    <div
      className="relative flex h-20 w-20 items-center justify-center"
      aria-hidden
    >
      {!reduceMotion ? (
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 opacity-25 blur-md"
          animate={{
            scale: isProcessing ? [1, 1.12, 1] : [1, 1.06, 1],
            opacity: isProcessing ? [0.25, 0.45, 0.25] : [0.2, 0.32, 0.2],
          }}
          transition={{
            duration: isProcessing ? 1.2 : 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ) : null}
      <motion.div
        className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 text-white shadow-card"
        animate={reduceMotion ? {} : { rotate: 360 }}
        transition={
          reduceMotion
            ? {}
            : { duration: 20, repeat: Infinity, ease: "linear" }
        }
      >
        <Globe className="h-10 w-10" strokeWidth={1.75} />
      </motion.div>
    </div>
  )
}
