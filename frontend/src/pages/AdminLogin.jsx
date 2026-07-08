import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HeartPulse, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "ghouri.dev.784@gmail.com",
    password: "Ghouri@25",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(form.email, form.password);
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl shadow-xl shadow-teal-dark/10 p-8 w-full max-w-sm border border-teal/10"
      >
        <div className="flex items-center gap-2 justify-center mb-6 text-teal-dark font-display font-semibold text-lg">
          <HeartPulse className="w-6 h-6 text-coral" /> Staff Login
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border-2 border-teal/10 focus:border-teal rounded-xl px-4 py-2.5 outline-none transition-colors"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border-2 border-teal/10 focus:border-teal rounded-xl px-4 py-2.5 outline-none transition-colors"
              placeholder="Enter your password"
            />
          </div>
          {error && <p className="text-sm text-coral-dark bg-coral/10 px-4 py-2.5 rounded-xl">{error}</p>}
          <p className="text-xs text-muted">Use the owner credentials to access the dashboard.</p>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal hover:bg-teal-dark text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Sign In
          </button>
        </div>
      </motion.form>
    </div>
  );
}
