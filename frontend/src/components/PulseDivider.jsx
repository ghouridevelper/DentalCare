import { motion } from "framer-motion";

/**
 * The page's signature element: an ECG-style pulse line that doubles as a
 * scheduling timeline. It draws itself on scroll-into-view, tying together
 * the clinical (heartbeat) and operational (appointment timeline) halves of
 * the product in one motif.
 */
export default function PulseDivider({ color = "#0F5257", height = 60 }) {
  return (
    <div className="w-full flex justify-center" style={{ height }}>
      <svg viewBox="0 0 1200 60" className="w-full max-w-5xl" preserveAspectRatio="none">
        <motion.path
          d="M0,30 L280,30 L310,10 L335,50 L360,30 L400,30 L420,15 L440,30 L1200,30"
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}
