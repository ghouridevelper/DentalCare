require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cron = require("node-cron");
const axios = require("axios");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const branchRoutes = require("./routes/branchRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const zapierRoutes = require("./routes/zapierRoutes");

connectDB();

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || "https://dental-care-nvxr-git-main-ghouri-dev1.vercel.app/",
  credentials: true,
}));
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => res.json({ status: "ok", time: new Date().toISOString() }));

app.use("/api/auth", authRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/zapier", zapierRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Clinic booking API running on port ${PORT}`));

/**
 * Optional built-in fallback scheduler: every hour, ping our own
 * /api/zapier/reminders/due endpoint so appointments are still flagged even
 * before Zapier's own polling Zap is switched on. This does NOT replace
 * Zapier — it just keeps the reminder queue warm. Comment out if not needed.
 */
cron.schedule("0 * * * *", async () => {
  try {
    await axios.get(`http://localhost:${PORT}/api/zapier/reminders/due`, {
      headers: { "x-zapier-secret": process.env.ZAPIER_SHARED_SECRET },
    });
  } catch (err) {
    // silent — this is just a keep-warm check, Zapier is the real trigger
  }
});
