const express = require("express");
const router = express.Router();
const {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
  deleteAppointment,
  getTodayStats,
} = require("../controllers/appointmentController");
const { protect } = require("../middleware/auth");

router.post("/", createAppointment);
router.get("/", protect, getAppointments);
router.get("/stats/today", protect, getTodayStats);
router.patch("/:id/status", protect, updateAppointmentStatus);
router.delete("/:id", protect, deleteAppointment);

module.exports = router;
