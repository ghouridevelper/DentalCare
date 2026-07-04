import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function StepIndicator({ steps, current }) {
  return (
    <div className="flex items-center justify-between max-w-2xl mx-auto mb-12">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const isDone = stepNum < current;
        const isActive = stepNum === current;
        return (
          <div key={label} className="flex-1 flex items-center last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <motion.div
                animate={{
                  backgroundColor: isDone || isActive ? "#0F5257" : "#FFFFFF",
                  color: isDone || isActive ? "#FFFFFF" : "#5C6E6B",
                  borderColor: isDone || isActive ? "#0F5257" : "#D8E4E2",
                }}
                className="w-9 h-9 rounded-full border-2 flex items-center justify-center font-mono text-sm font-medium"
              >
                {isDone ? <Check className="w-4 h-4" /> : stepNum}
              </motion.div>
              <span className={`text-xs font-medium ${isActive ? "text-teal-dark" : "text-muted"}`}>
                {label}
              </span>
            </div>
            {stepNum !== steps.length && (
              <div className="flex-1 h-[2px] mx-2 bg-teal-light relative overflow-hidden -mt-5">
                <motion.div
                  className="absolute inset-0 bg-teal"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isDone ? 1 : 0 }}
                  style={{ originX: 0 }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
