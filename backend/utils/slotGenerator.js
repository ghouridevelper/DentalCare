const Appointment = require("../models/Appointment");

function toMinutes(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function toHHMM(mins) {
  const h = Math.floor(mins / 60)
    .toString()
    .padStart(2, "0");
  const m = (mins % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

/**
 * Generates all bookable slots for a doctor on a given date, minus slots
 * already taken by a confirmed appointment. Also strips past slots if the
 * date requested is today.
 */
async function getAvailableSlots(doctor, dateStr) {
  const dateObj = new Date(dateStr + "T00:00:00");
  const dayOfWeek = dateObj.getDay();

  const workingHour = doctor.workingHours.find((wh) => wh.dayOfWeek === dayOfWeek);
  if (!workingHour) return []; // doctor doesn't work this day

  const duration = doctor.slotDurationMinutes || 30;
  const start = toMinutes(workingHour.startTime);
  const end = toMinutes(workingHour.endTime);

  const allSlots = [];
  for (let t = start; t + duration <= end; t += duration) {
    allSlots.push(toHHMM(t));
  }

  const booked = await Appointment.find({
    doctor: doctor._id,
    date: dateStr,
    status: "confirmed",
  }).select("time");
  const bookedTimes = new Set(booked.map((b) => b.time));

  let available = allSlots.filter((s) => !bookedTimes.has(s));

  // If date is today, drop slots already in the past.
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  if (dateStr === todayStr) {
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    available = available.filter((s) => toMinutes(s) > nowMinutes);
  }

  return available;
}

module.exports = { getAvailableSlots, toMinutes, toHHMM };
