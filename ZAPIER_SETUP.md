# Zapier + WhatsApp Setup

Two Zaps power the automation described in the brief. Both use the free-tier-friendly
"Webhooks by Zapier" app plus a WhatsApp action app of your choice (Twilio WhatsApp,
WhatsApp Business API via a partner app, or "WhatsApp by 360dialog" — whichever your
Zapier plan supports).

## Zap 1 — Instant booking confirmation (push)

1. Trigger: **Webhooks by Zapier → Catch Hook**. Copy the generated URL.
2. Paste that URL into the backend `.env` as `ZAPIER_CONFIRMATION_WEBHOOK_URL`, then restart the API.
3. Book a test appointment on the site — Zapier will capture a sample payload shaped like:
   ```json
   {
     "event": "appointment_confirmed",
     "patientName": "Sara Malik",
     "patientPhone": "0300xxxxxxx",
     "doctorName": "Dr. Ayesha Khan",
     "branchName": "DentalCare Gulberg",
     "date": "2026-07-10",
     "time": "10:30",
     "message": "Hi Sara Malik, your appointment with Dr. Ayesha Khan..."
   }
   ```
4. Action: your WhatsApp app → **Send Message** → map `patientPhone` as the recipient and
   `message` as the body (or build your own template from the individual fields).
5. Turn the Zap on.

## Zap 2 — 24-hour reminder (pull)

1. Trigger: **Schedule by Zapier → Every Hour**.
2. Action: **Webhooks by Zapier → GET**
   - URL: `https://<your-api-domain>/api/zapier/reminders/due`
   - Header: `x-zapier-secret: <value of ZAPIER_SHARED_SECRET in your .env>`
   - This returns a JSON array of appointments happening ~24h from now that haven't been reminded yet.
3. Action: **Looping by Zapier** (or Zapier's built-in array handling) over the response array.
4. Inside the loop, Action: WhatsApp app → **Send Message** using each item's `patientPhone` and `message`.
5. Inside the loop, Action: **Webhooks by Zapier → POST**
   - URL: `https://<your-api-domain>/api/zapier/reminders/{{appointmentId}}/mark-sent`
   - Header: `x-zapier-secret: <same secret>`
   - This flips `reminderSent` to `true` so the appointment is never reminded twice.
6. Turn the Zap on.

## Notes

- The API also has a built-in hourly cron job as a safety net (see `backend/server.js`), but Zapier
  remains the system actually sending WhatsApp messages — the cron job just keeps the reminder
  window warm.
- Rotate `ZAPIER_SHARED_SECRET` any time and update it in both Zap 2's header and your `.env`.
