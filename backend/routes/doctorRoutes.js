const express = require("express");
const router = express.Router();
const {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getAvailability,
} = require("../controllers/doctorController");
const { protect, requireOwner } = require("../middleware/auth");

router.get("/", getDoctors);
router.get("/:id", getDoctorById);
router.get("/:id/availability", getAvailability);
router.post("/", protect, requireOwner, createDoctor);
router.put("/:id", protect, requireOwner, updateDoctor);
router.delete("/:id", protect, requireOwner, deleteDoctor);

module.exports = router;
