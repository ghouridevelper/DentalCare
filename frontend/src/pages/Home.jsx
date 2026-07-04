import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CalendarCheck2, MessageCircle, Building2, ShieldCheck } from "lucide-react";
import PulseDivider from "../components/PulseDivider";

const features = [
  {
    icon: Building2,
    title: "One calendar, every branch",
    desc: "Every receptionist at every branch sees the same live schedule — no more calling around to check what Branch 2 booked.",
  },
  {
    icon: ShieldCheck,
    title: "Double-booking is impossible",
    desc: "The system locks a doctor's slot the instant it's booked, whether it came from the website or a phone call.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp confirmations & reminders",
    desc: "Patients get an instant WhatsApp confirmation, then an automatic reminder 24 hours before their visit.",
  },
  {
    icon: CalendarCheck2,
    title: "Owner sees everything",
    desc: "One dashboard shows every appointment, at every branch, for every doctor — updated in real time.",
  },
];

export default function Home() {
  return (
    <div>
      <section className="max-w-6xl mx-auto px-6 pt-16 md:pt-24 pb-10 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <span className="inline-block text-xs font-mono tracking-widest uppercase text-coral bg-coral/10 px-3 py-1 rounded-full mb-5">
            2 branches · 1 shared schedule
          </span>
          <h1 className="font-display text-5xl md:text-6xl leading-[1.05] font-semibold text-teal-dark">
            Every appointment,
            <br />
            in one place.
          </h1>
          <p className="mt-6 text-lg text-muted max-w-md">
            Stop juggling WhatsApp chats between branches. Patients book online in under a minute, and
            your whole team sees it instantly.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/book"
              className="bg-coral hover:bg-coral-dark text-white font-semibold px-7 py-3.5 rounded-full transition-colors shadow-lg shadow-coral/30"
            >
              Book an Appointment
            </Link>
            <Link
              to="/services"
              className="border-2 border-teal/20 hover:border-teal text-teal-dark font-semibold px-7 py-3.5 rounded-full transition-colors"
            >
              Meet Our Doctors
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="relative"
        >
          <div className="animate-floatSlow bg-white rounded-3xl shadow-2xl shadow-teal-dark/10 p-6 border border-teal/10">
            <div className="flex items-center justify-between mb-4">
              <span className="font-display font-semibold text-teal-dark">Today · Gulberg Branch</span>
              <span className="text-xs font-mono text-coral bg-coral/10 px-2 py-1 rounded-full">Live</span>
            </div>
            {[
              { time: "10:30", name: "Sara Malik", doc: "Dr. Ayesha Khan" },
              { time: "11:15", name: "Hassan Raza", doc: "Dr. Bilal Ahmed" },
              { time: "12:00", name: "Fatima Noor", doc: "Dr. Ayesha Khan" },
            ].map((a, i) => (
              <motion.div
                key={a.time}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.15 }}
                className="flex items-center gap-4 py-3 border-b border-teal-light last:border-0"
              >
                <span className="font-mono text-sm text-teal-dark w-14">{a.time}</span>
                <div>
                  <p className="text-sm font-medium">{a.name}</p>
                  <p className="text-xs text-muted">{a.doc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <PulseDivider />

      <section className="max-w-6xl mx-auto px-6 py-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="bg-white rounded-2xl p-6 border border-teal/10 hover:shadow-lg hover:shadow-teal-dark/5 transition-shadow"
          >
            <f.icon className="w-8 h-8 text-coral mb-4" strokeWidth={1.8} />
            <h3 className="font-display font-semibold text-lg text-teal-dark mb-2">{f.title}</h3>
            <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </section>

      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-teal-dark mb-4">
          Ready to see your next slot?
        </h2>
        <p className="text-muted mb-8">It takes less than a minute — pick a branch, a doctor, and a time.</p>
        <Link
          to="/book"
          className="inline-block bg-coral hover:bg-coral-dark text-white font-semibold px-8 py-4 rounded-full transition-colors shadow-lg shadow-coral/30"
        >
          Book Your Appointment
        </Link>
      </section>
    </div>
  );
}
