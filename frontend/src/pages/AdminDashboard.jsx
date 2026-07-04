import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Plus, X, Loader2, Building2, RefreshCw } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [branches, setBranches] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [stats, setStats] = useState({ today: 0, totalUpcoming: 0 });
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().slice(0, 10));
  const [showModal, setShowModal] = useState(false);

  const loadAppointments = async () => {
    setLoading(true);
    const res = await api.get("/appointments", { params: { date: dateFilter } });
    setAppointments(res.data);
    setLoading(false);
  };

  useEffect(() => {
    api.get("/branches?all=true").then((res) => setBranches(res.data));
    api.get("/doctors?all=true").then((res) => setDoctors(res.data));
    api.get("/appointments/stats/today").then((res) => setStats(res.data));
  }, []);

  useEffect(() => {
    loadAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateFilter]);

  const cancelAppointment = async (id) => {
    await api.patch(`/appointments/${id}/status`, { status: "cancelled" });
    loadAppointments();
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl font-semibold text-teal-dark">
            Welcome back, {user?.name?.split(" ")[0]}
          </h1>
          <p className="text-sm text-muted">
            {user?.role === "owner" ? "Viewing all branches" : `Viewing ${user?.branch?.name || "your branch"}`}
          </p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm text-muted hover:text-coral-dark transition-colors"
        >
          <LogOut className="w-4 h-4" /> Log out
        </button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Today's appointments" value={stats.today} />
        <StatCard label="Total upcoming" value={stats.totalUpcoming} />
        <StatCard label="Branches" value={branches.length} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border-2 border-teal/10 focus:border-teal rounded-xl px-3 py-2 text-sm outline-none"
          />
          <button onClick={loadAppointments} className="p-2 rounded-xl border-2 border-teal/10 hover:border-teal">
            <RefreshCw className="w-4 h-4 text-teal-dark" />
          </button>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-coral hover:bg-coral-dark text-white text-sm font-semibold px-4 py-2.5 rounded-full transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Phone Booking
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-teal/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-teal-light text-teal-dark text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Time</th>
              <th className="px-4 py-3 font-medium">Patient</th>
              <th className="px-4 py-3 font-medium">Doctor</th>
              <th className="px-4 py-3 font-medium">Branch</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="text-center py-8 text-muted">
                  <Loader2 className="w-5 h-5 animate-spin inline" />
                </td>
              </tr>
            )}
            {!loading && appointments.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-8 text-muted">
                  No appointments for this date.
                </td>
              </tr>
            )}
            {appointments.map((a) => (
              <tr key={a._id} className="border-t border-teal-light/60">
                <td className="px-4 py-3 font-mono">{a.time}</td>
                <td className="px-4 py-3">{a.patientName}</td>
                <td className="px-4 py-3">{a.doctor?.name}</td>
                <td className="px-4 py-3">{a.branch?.name}</td>
                <td className="px-4 py-3 font-mono">{a.patientPhone}</td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      a.status === "confirmed"
                        ? "bg-teal-light text-teal-dark"
                        : "bg-coral/10 text-coral-dark"
                    }`}
                  >
                    {a.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {a.status === "confirmed" && (
                    <button
                      onClick={() => cancelAppointment(a._id)}
                      className="text-xs text-muted hover:text-coral-dark"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showModal && (
          <ManualBookingModal
            branches={branches}
            doctors={doctors}
            onClose={() => setShowModal(false)}
            onCreated={() => {
              setShowModal(false);
              loadAppointments();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-2xl border border-teal/10 p-5">
      <p className="text-xs uppercase tracking-wide text-muted mb-1">{label}</p>
      <p className="font-display text-3xl font-semibold text-teal-dark">{value}</p>
    </div>
  );
}

function ManualBookingModal({ branches, doctors, onClose, onCreated }) {
  const [form, setForm] = useState({
    patientName: "",
    patientPhone: "",
    branchId: "",
    doctorId: "",
    date: new Date().toISOString().slice(0, 10),
    time: "",
    notes: "",
  });
  const [slots, setSlots] = useState([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const filteredDoctors = doctors.filter((d) => !form.branchId || d.branches?.some((b) => b._id === form.branchId));

  useEffect(() => {
    if (!form.doctorId || !form.date) return;
    api.get(`/doctors/${form.doctorId}/availability`, { params: { date: form.date } }).then((res) => setSlots(res.data.slots));
  }, [form.doctorId, form.date]);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api.post("/appointments", { ...form, source: "phone" });
      onCreated();
    } catch (err) {
      setError(err.response?.data?.message || "Could not create booking.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center p-6 z-50"
      onClick={onClose}
    >
      <motion.form
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="bg-white rounded-2xl p-6 w-full max-w-md space-y-3"
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display font-semibold text-lg text-teal-dark flex items-center gap-2">
            <Building2 className="w-5 h-5" /> Add Phone Booking
          </h3>
          <button type="button" onClick={onClose}>
            <X className="w-5 h-5 text-muted" />
          </button>
        </div>

        <input
          required
          placeholder="Patient name"
          value={form.patientName}
          onChange={(e) => setForm({ ...form, patientName: e.target.value })}
          className="w-full border-2 border-teal/10 focus:border-teal rounded-xl px-3 py-2 text-sm outline-none"
        />
        <input
          required
          placeholder="Phone number"
          value={form.patientPhone}
          onChange={(e) => setForm({ ...form, patientPhone: e.target.value })}
          className="w-full border-2 border-teal/10 focus:border-teal rounded-xl px-3 py-2 text-sm outline-none"
        />
        <select
          required
          value={form.branchId}
          onChange={(e) => setForm({ ...form, branchId: e.target.value, doctorId: "" })}
          className="w-full border-2 border-teal/10 focus:border-teal rounded-xl px-3 py-2 text-sm outline-none"
        >
          <option value="">Select branch</option>
          {branches.map((b) => (
            <option key={b._id} value={b._id}>
              {b.name}
            </option>
          ))}
        </select>
        <select
          required
          value={form.doctorId}
          onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
          className="w-full border-2 border-teal/10 focus:border-teal rounded-xl px-3 py-2 text-sm outline-none"
        >
          <option value="">Select doctor</option>
          {filteredDoctors.map((d) => (
            <option key={d._id} value={d._id}>
              {d.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          required
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="w-full border-2 border-teal/10 focus:border-teal rounded-xl px-3 py-2 text-sm outline-none"
        />
        <select
          required
          value={form.time}
          onChange={(e) => setForm({ ...form, time: e.target.value })}
          className="w-full border-2 border-teal/10 focus:border-teal rounded-xl px-3 py-2 text-sm outline-none"
        >
          <option value="">Select time slot</option>
          {slots.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {error && <p className="text-sm text-coral-dark bg-coral/10 px-3 py-2 rounded-xl">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-teal hover:bg-teal-dark text-white font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          Save Booking
        </button>
      </motion.form>
    </motion.div>
  );
}
