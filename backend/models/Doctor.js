const mongoose = require("mongoose");

// Working hours per weekday. dayOfWeek: 0=Sunday ... 6=Saturday
const workingHourSchema = new mongoose.Schema(
  {
    dayOfWeek: { type: Number, required: true, min: 0, max: 6 },
    startTime: { type: String, required: true }, // "10:00"
    endTime: { type: String, required: true }, // "18:00"
  },
  { _id: false }
);

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    specialization: { type: String, required: true, trim: true },
    photoUrl: { type: String, default: "" },
    bio: { type: String, default: "" },
    branches: [{ type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true }],
    slotDurationMinutes: { type: Number, default: 30 },
    workingHours: [workingHourSchema],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
