import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Stethoscope, MapPin } from "lucide-react";
import api from "../api/axios";
import PulseDivider from "../components/PulseDivider";

export default function Services() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/doctors")
      .then((res) => setDoctors(res.data))
      .catch(() => setError("Couldn't load doctors right now. Please try again shortly."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl mx-auto mb-12"
      >
        <h1 className="font-display text-4xl font-semibold text-teal-dark mb-4">Our Doctors & Services</h1>
        <p className="text-muted">
          Every doctor below works across one or more of our branches. Pick the one that suits you and
          book directly into their live calendar.
        </p>
      </motion.div>

      <PulseDivider height={40} />

      {loading && <p className="text-center text-muted font-mono text-sm mt-10">Loading doctors…</p>}
      {error && <p className="text-center text-coral-dark text-sm mt-10">{error}</p>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {doctors.map((doc, i) => (
          <motion.div
            key={doc._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="bg-white rounded-2xl p-6 border border-teal/10 flex flex-col"
          >
            <div className="w-14 h-14 rounded-full bg-teal-light flex items-center justify-center mb-4">
              <Stethoscope className="w-7 h-7 text-teal-dark" />
            </div>
            <h3 className="font-display font-semibold text-lg text-teal-dark">{doc.name}</h3>
            <p className="text-sm text-coral font-medium mb-3">{doc.specialization}</p>
            <p className="text-sm text-muted mb-4 flex-1">{doc.bio}</p>
            <div className="flex flex-wrap gap-2 mb-5">
              {doc.branches?.map((b) => (
                <span
                  key={b._id}
                  className="inline-flex items-center gap-1 text-xs bg-teal-light text-teal-dark px-2.5 py-1 rounded-full"
                >
                  <MapPin className="w-3 h-3" /> {b.name}
                </span>
              ))}
            </div>
            <Link
              to={`/book?doctor=${doc._id}`}
              className="text-center bg-teal hover:bg-teal-dark text-white text-sm font-semibold py-2.5 rounded-full transition-colors"
            >
              Book with {doc.name.split(" ")[1] || doc.name}
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
