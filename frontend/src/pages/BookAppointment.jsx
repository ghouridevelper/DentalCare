import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Stethoscope, CalendarDays, User, CheckCircle2, Loader2 } from "lucide-react";
import api from "../api/axios";
import StepIndicator from "../components/StepIndicator";

const STEPS = ["Branch", "Doctor", "Date & Time", "Your Details", "Confirmed"];

function nextDays(n) {
  const days = [];
  for (let i = 0; i < n; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push(d);
  }
  return days;
}

export default function BookAppointment() {
  const [params] = useSearchParams();
  const [step, setStep] = useState(1);

  const [branches, setBranches] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmedAppt, setConfirmedAppt] = useState(null);

  const [branchId, setBranchId] = useState("");
  const [doctorId, setDoctorId] = useState(params.get("doctor") || "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [patient, setPatient] = useState({ patientName: "", patientPhone: "", patientEmail: "" });

  const days = useMemo(() => nextDays(14), []);

  useEffect(() => {
    api.get("/branches").then((res) => setBranches(res.data));
  }, []);

  useEffect(() => {
    if (!branchId) return;
    api.get(`/doctors?branch=${branchId}`).then((res) => setDoctors(res.data));
  }, [branchId]);

  // If a doctor was pre-selected via ?doctor=, infer their branch automatically.
  useEffect(() => {
    if (doctorId && !branchId) {
      api.get(`/doctors/${doctorId}`).then((res) => {
        setBranchId(res.data.branches?.[0]?._id || "");
      });
    }
  }, [doctorId, branchId]);

  useEffect(() => {
    if (!doctorId || !date) return;
    setLoadingSlots(true);
    setTime("");
    api
      .get(`/doctors/${doctorId}/availability`, { params: { date } })
      .then((res) => setSlots(res.data.slots))
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [doctorId, date]);

  const goNext = () => setStep((s) => Math.min(s + 1, STEPS.length));
  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await api.post("/appointments", {
        ...patient,
        doctorId,
        branchId,
        date,
        time,
        source: "online",
      });
      setConfirmedAppt(res.data);
      setStep(5);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try a different slot.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-display text-3xl md:text-4xl font-semibold text-teal-dark text-center mb-2">
        Book Your Appointment
      </h1>
      <p className="text-center text-muted mb-10">Pick a branch, a doctor, and a time that works for you.</p>

      <StepIndicator steps={STEPS} current={step} />

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="1" {...fade} className="grid sm:grid-cols-2 gap-4">
            {branches.map((b) => (
              <button
                key={b._id}
                onClick={() => {
                  setBranchId(b._id);
                  setDoctorId("");
                  goNext();
                }}
                className={`text-left p-5 rounded-2xl border-2 transition-colors bg-white hover:border-teal ${
                  branchId === b._id ? "border-teal" : "border-teal/10"
                }`}
              >
                <Building2 className="w-6 h-6 text-teal-dark mb-3" />
                <p className="font-display font-semibold text-teal-dark">{b.name}</p>
                <p className="text-sm text-muted mt-1">{b.address}</p>
              </button>
            ))}
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="2" {...fade} className="grid sm:grid-cols-2 gap-4">
            {doctors.map((d) => (
              <button
                key={d._id}
                onClick={() => {
                  setDoctorId(d._id);
                  goNext();
                }}
                className={`text-left p-5 rounded-2xl border-2 transition-colors bg-white hover:border-teal ${
                  doctorId === d._id ? "border-teal" : "border-teal/10"
                }`}
              >
                <Stethoscope className="w-6 h-6 text-teal-dark mb-3" />
                <p className="font-display font-semibold text-teal-dark">{d.name}</p>
                <p className="text-sm text-coral">{d.specialization}</p>
              </button>
            ))}
            {doctors.length === 0 && (
              <p className="text-sm text-muted col-span-2">No doctors found for this branch yet.</p>
            )}
            <button onClick={goBack} className="text-sm text-muted hover:text-teal-dark col-span-2 mt-2 text-left">
              ← Back to branches
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="3" {...fade}>
            <div className="flex gap-2 overflow-x-auto pb-3 mb-6">
              {days.map((d) => {
                const iso = d.toISOString().slice(0, 10);
                const isSelected = date === iso;
                return (
                  <button
                    key={iso}
                    onClick={() => setDate(iso)}
                    className={`shrink-0 w-16 py-3 rounded-xl border-2 text-center transition-colors ${
                      isSelected ? "border-teal bg-teal text-white" : "border-teal/10 bg-white hover:border-teal"
                    }`}
                  >
                    <p className="text-[10px] uppercase font-mono opacity-70">
                      {d.toLocaleDateString(undefined, { weekday: "short" })}
                    </p>
                    <p className="font-display font-semibold">{d.getDate()}</p>
                  </button>
                );
              })}
            </div>

            {date && (
              <div>
                {loadingSlots ? (
                  <p className="flex items-center gap-2 text-muted text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" /> Checking live availability…
                  </p>
                ) : slots.length === 0 ? (
                  <p className="text-sm text-muted">No open slots this day — try another date.</p>
                ) : (
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {slots.map((s) => (
                      <button
                        key={s}
                        onClick={() => setTime(s)}
                        className={`py-2.5 rounded-xl border-2 font-mono text-sm transition-colors ${
                          time === s ? "border-teal bg-teal text-white" : "border-teal/10 bg-white hover:border-teal"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between mt-8">
              <button onClick={goBack} className="text-sm text-muted hover:text-teal-dark">
                ← Back
              </button>
              <button
                disabled={!time}
                onClick={goNext}
                className="bg-coral disabled:opacity-40 hover:bg-coral-dark text-white font-semibold px-6 py-2.5 rounded-full transition-colors"
              >
                Continue
              </button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.form key="4" {...fade} onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-teal-light rounded-2xl p-4 flex items-center gap-3 text-sm text-teal-dark mb-2">
              <CalendarDays className="w-5 h-5 shrink-0" />
              <span>
                {date} at {time}
              </span>
            </div>
            <div>
              <label className="text-sm font-medium text-ink block mb-1">Full name</label>
              <input
                required
                value={patient.patientName}
                onChange={(e) => setPatient({ ...patient, patientName: e.target.value })}
                className="w-full border-2 border-teal/10 focus:border-teal rounded-xl px-4 py-3 outline-none transition-colors"
                placeholder="e.g. Sara Malik"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ink block mb-1">WhatsApp number</label>
              <input
                required
                value={patient.patientPhone}
                onChange={(e) => setPatient({ ...patient, patientPhone: e.target.value })}
                className="w-full border-2 border-teal/10 focus:border-teal rounded-xl px-4 py-3 outline-none transition-colors"
                placeholder="03xx-xxxxxxx"
              />
              <p className="text-xs text-muted mt-1">We'll send your confirmation and reminder here.</p>
            </div>
            <div>
              <label className="text-sm font-medium text-ink block mb-1">Email (optional)</label>
              <input
                type="email"
                value={patient.patientEmail}
                onChange={(e) => setPatient({ ...patient, patientEmail: e.target.value })}
                className="w-full border-2 border-teal/10 focus:border-teal rounded-xl px-4 py-3 outline-none transition-colors"
                placeholder="you@example.com"
              />
            </div>

            {error && <p className="text-sm text-coral-dark bg-coral/10 px-4 py-3 rounded-xl">{error}</p>}

            <div className="flex justify-between pt-2">
              <button type="button" onClick={goBack} className="text-sm text-muted hover:text-teal-dark">
                ← Back
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-coral disabled:opacity-50 hover:bg-coral-dark text-white font-semibold px-6 py-2.5 rounded-full transition-colors flex items-center gap-2"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Confirm Appointment
              </button>
            </div>
          </motion.form>
        )}

        {step === 5 && confirmedAppt && (
          <motion.div key="5" {...fade} className="text-center py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 12 }}
            >
              <CheckCircle2 className="w-16 h-16 text-teal mx-auto mb-5" />
            </motion.div>
            <h2 className="font-display text-2xl font-semibold text-teal-dark mb-2">You're all set!</h2>
            <p className="text-muted mb-6">
              {confirmedAppt.patientName}, your appointment with {confirmedAppt.doctor?.name} is confirmed
              for <strong>{confirmedAppt.date}</strong> at <strong>{confirmedAppt.time}</strong>.
            </p>
            <p className="text-sm text-muted bg-teal-light inline-flex items-center gap-2 px-4 py-2 rounded-full">
              <User className="w-4 h-4" /> A WhatsApp confirmation is on its way to {confirmedAppt.patientPhone}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const fade = {
  initial: { opacity: 0, x: 16 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -16 },
  transition: { duration: 0.3 },
};
