const Appointment = require("../models/Appointment");

/**
 * GET /api/zapier/reminders/due
 * Designed to be polled by a Zapier "Schedule by Zapier" trigger every hour.
 * Returns confirmed appointments happening in roughly the next 24 hours that
 * have not yet had a reminder sent. Zapier then sends WhatsApp reminders and
 * calls the mark-sent endpoint below for each one it successfully messaged.
 */
exports.getDueReminders = async (req, res, next) => {
  try {
    const now = new Date();
    const windowStart = new Date(now.getTime() + 23 * 60 * 60 * 1000);
    const windowEnd = new Date(now.getTime() + 25 * 60 * 60 * 1000);

    const candidates = await Appointment.find({
      status: "confirmed",
      reminderSent: false,
      date: { $gte: windowStart.toISOString().slice(0, 10), $lte: windowEnd.toISOString().slice(0, 10) },
    })
      .populate("doctor", "name")
      .populate("branch", "name address");

    const due = candidates.filter((appt) => {
      const apptDateTime = new Date(`${appt.date}T${appt.time}:00`);
      return apptDateTime >= windowStart && apptDateTime <= windowEnd;
    });

    res.json(
      due.map((appt) => ({
        appointmentId: appt._id,
        patientName: appt.patientName,
        patientPhone: appt.patientPhone,
        doctorName: appt.doctor?.name,
        branchName: appt.branch?.name,
        branchAddress: appt.branch?.address,
        date: appt.date,
        time: appt.time,
        message: `Reminder: Hi ${appt.patientName}, you have an appointment with ${appt.doctor?.name} at ${appt.branch?.name} tomorrow (${appt.date}) at ${appt.time}.`,
      }))
    );
  } catch (err) {
    next(err);
  }
};

// POST /api/zapier/reminders/:id/mark-sent
exports.markReminderSent = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { reminderSent: true },
      { new: true }
    );
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });
    res.json({ message: "Reminder marked as sent", appointmentId: appointment._id });
  } catch (err) {
    next(err);
  }
};
