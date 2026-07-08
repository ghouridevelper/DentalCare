import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, HeartPulse } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Doctors & Services" },
  { to: "/admin/login", label: "Admin" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-paper/80 backdrop-blur-md border-b border-teal/10">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-semibold text-teal-dark">
          <HeartPulse className="w-6 h-6 text-coral" strokeWidth={2.2} />
          DentalCare
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-ink/80">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `hover:text-teal-dark transition-colors ${isActive ? "text-teal-dark" : ""}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link
            to="/book"
            className="bg-coral hover:bg-coral-dark text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors shadow-sm shadow-coral/30"
          >
            Book Appointment
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-teal/10 bg-paper"
          >
            <div className="flex flex-col gap-1 p-4">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="py-2 px-2 rounded-lg hover:bg-teal-light font-medium"
                >
                  {l.label}
                </NavLink>
              ))}
              <Link
                to="/book"
                onClick={() => setOpen(false)}
                className="mt-2 bg-coral text-white text-center font-semibold px-5 py-2.5 rounded-full"
              >
                Book Appointment
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
