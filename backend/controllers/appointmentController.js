const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const Branch = require("../models/Branch");
const { getAvailableSlots } = require("../utils/slotGenerator");
const { sendConfirmationWebhook } = require("../utils/zapierWebhook");

// POST /api/appointments  (public booking + manual receptionist entry)
exports.createAppointment = async (req, res, next) => {
  try {
    const { patientName, patientPhone, patientEmail, doctorId, branchId, date, time, source, notes } =
      req.body;

    if (!patientName || !patientPhone || !doctorId || !branchId || !date || !time) {
      return res.status(400).json({ message: "Missing required booking fields." });
    }

    const doctor = await Doctor.findById(doctorId);
    const branch = await Branch.findById(branchId);
    if (!doctor || !branch) {
      return res.status(404).json({ message: "Doctor or branch not found." });
    }

    // Re-verify the slot is still free right before insert (belt-and-braces —
    // the unique DB index below is the actual source of truth).
    const available = await getAvailableSlots(doctor, date);
    if (!available.includes(time)) {
      return res.status(409).json({
        message: "That slot is no longer available. Please choose another time.",
      });
    }

    const appointment = await Appointment.create({
      patientName,
      patientPhone,
      patientEmail,
      doctor: doctorId,
      branch: branchId,
      date,
      time,
      source: source === "phone" ? "phone" : "online",
      notes,
    });

    const sent = await sendConfirmationWebhook(appointment, doctor, branch);
    if (sent) {
      appointment.confirmationSent = true;
      await appointment.save();
    }

    const populated = await appointment.populate([
      { path: "doctor", select: "name specialization" },
      { path: "branch", select: "name city" },
    ]);

    res.status(201).json(populated);
  } catch (err) {
    next(err); // duplicate key (11000) => double-booking, handled by errorHandler
  }
};

// GET /api/appointments?date=&branch=&doctor=&status=
exports.getAppointments = async (req, res, next) => {
  try {
    const { date, branch, doctor, status, from, to } = req.query;
    const filter = {};
    if (date) filter.date = date;
    if (from && to) filter.date = { $gte: from, $lte: to };
    if (branch) filter.branch = branch;
    if (doctor) filter.doctor = doctor;
    if (status) filter.status = status;

    // Receptionists only see their own branch
    if (req.user && req.user.role === "receptionist" && req.user.branch) {
      filter.branch = req.user.branch;
    }

    const appointments = await Appointment.find(filter)
      .populate("doctor", "name specialization")
      .populate("branch", "name city")
      .sort({ date: 1, time: 1 });

    res.json(appointments);
  } catch (err) {
    next(err);
  }
};

exports.updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
      .populate("doctor", "name specialization")
      .populate("branch", "name city");
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });
    res.json(appointment);
  } catch (err) {
    next(err);
  }
};

exports.deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    );
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });
    res.json({ message: "Appointment cancelled" });
  } catch (err) {
    next(err);
  }
};

// GET /api/appointments/stats/today  (dashboard summary card)
exports.getTodayStats = async (req, res, next) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const filter = { date: today, status: "confirmed" };
    if (req.user && req.user.role === "receptionist" && req.user.branch) {
      filter.branch = req.user.branch;
    }
    const count = await Appointment.countDocuments(filter);
    const total = await Appointment.countDocuments({ status: "confirmed" });
    res.json({ today: count, totalUpcoming: total });
  } catch (err) {
    next(err);
  }
};
