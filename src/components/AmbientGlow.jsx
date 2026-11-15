import { motion } from 'framer-motion'

const ORBS = [
  { className: 'left-[6%] top-[12%] h-40 w-40 sm:h-56 sm:w-56', delay: 0 },
  { className: 'right-[4%] top-[18%] h-32 w-32 sm:h-44 sm:w-44', delay: 1.2 },
  { className: 'bottom-[10%] left-[28%] h-36 w-36 sm:h-48 sm:w-48', delay: 2.4 },
]

/** Soft floating light orbs behind the journal — decorative only. */
export default function AmbientGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {ORBS.map((orb, i) => (
        <motion.div
          key={i}
          className={`ambient-orb absolute rounded-full blur-3xl ${orb.className}`}
          initial={{ opacity: 0.35, scale: 0.92 }}
          animate={{
            opacity: [0.28, 0.48, 0.32],
            scale: [0.95, 1.08, 0.98],
            y: [0, -18, 0],
            x: i % 2 === 0 ? [0, 10, 0] : [0, -12, 0],
          }}
          transition={{
            duration: 14 + i * 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: orb.delay,
          }}
        />
      ))}
      <div className="ambient-vignette absolute inset-0" />
    </div>
  )
}
