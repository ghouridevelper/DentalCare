import { motion } from "framer-motion";
import { Phone, MapPin, Mail } from "lucide-react";

const branches = [
  { name: "Gulberg III", address: "12-A Main Boulevard, Gulberg III, Lahore", phone: "03091292626" },
  { name: "DHA Phase 5", address: "Plot 45, Phase 5, DHA, Lahore", phone: "03091292626" },
];

export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-4xl font-semibold text-teal-dark text-center mb-3"
      >
        Visit or Call Us
      </motion.h1>
      <p className="text-center text-muted mb-12">Prefer to speak to someone? Any branch can help.</p>

      <div className="grid sm:grid-cols-2 gap-6">
        {branches.map((b, i) => (
          <motion.div
            key={b.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-6 border border-teal/10"
          >
            <h3 className="font-display font-semibold text-lg text-teal-dark mb-3">{b.name}</h3>
            <p className="flex items-start gap-2 text-sm text-muted mb-2">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0" /> {b.address}
            </p>
            <p className="flex items-center gap-2 text-sm text-muted">
              <Phone className="w-4 h-4" /> {b.phone}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 bg-teal-light rounded-2xl p-6 flex items-center gap-3 text-sm text-teal-dark">
        <Mail className="w-5 h-5 shrink-0" />
        Email us any time at <strong>hello@dentalcare.pk</strong> — we reply within one business day.
      </div>
    </div>
  );
}
