const axios = require("axios");

/**
 * Fires an outgoing webhook to Zapier's "Catch Hook" trigger the instant an
 * appointment is created. Zapier then sends the WhatsApp confirmation.
 * This never throws — a Zapier hiccup should never fail the booking itself.
 */
async function sendConfirmationWebhook(appointment, doctor, branch) {
  const url = process.env.ZAPIER_CONFIRMATION_WEBHOOK_URL;
  if (!url) {
    console.warn("ZAPIER_CONFIRMATION_WEBHOOK_URL not set — skipping WhatsApp confirmation.");
    return false;
  }
  try {
    await axios.post(url, {
      event: "appointment_confirmed",
      appointmentId: appointment._id,
      patientName: appointment.patientName,
      patientPhone: appointment.patientPhone,
      doctorName: doctor.name,
      branchName: branch.name,
      branchAddress: branch.address,
      date: appointment.date,
      time: appointment.time,
      message: `Hi ${appointment.patientName}, your appointment with ${doctor.name} at ${branch.name} is confirmed for ${appointment.date} at ${appointment.time}.`,
    });
    return true;
  } catch (err) {
    console.error("Zapier confirmation webhook failed:", err.message);
    return false;
  }
}

module.exports = { sendConfirmationWebhook };
