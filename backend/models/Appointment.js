const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patientName: { type: String, required: true, trim: true },
    patientPhone: { type: String, required: true, trim: true },
    patientEmail: { type: String, trim: true, default: "" },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    date: { type: String, required: true }, // "2026-07-10"
    time: { type: String, required: true }, // "10:30"
    status: {
      type: String,
      enum: ["confirmed", "cancelled", "completed", "no-show"],
      default: "confirmed",
    },
    source: { type: String, enum: ["online", "phone"], default: "online" },
    notes: { type: String, default: "" },
    reminderSent: { type: Boolean, default: false },
    confirmationSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// A doctor cannot have two confirmed appointments at the same date+time.
// This is the core double-booking guard at the database level.
appointmentSchema.index(
  { doctor: 1, date: 1, time: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "confirmed" },
  }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
