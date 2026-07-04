const express = require("express");
const router = express.Router();
const { getDueReminders, markReminderSent } = require("../controllers/zapierController");
const { verifyZapierSecret } = require("../middleware/auth");

router.get("/reminders/due", verifyZapierSecret, getDueReminders);
router.post("/reminders/:id/mark-sent", verifyZapierSecret, markReminderSent);

module.exports = router;
