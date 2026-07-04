const Doctor = require("../models/Doctor");
const { getAvailableSlots } = require("../utils/slotGenerator");

exports.getDoctors = async (req, res, next) => {
  try {
    const filter = req.query.all ? {} : { isActive: true };
    if (req.query.branch) filter.branches = req.query.branch;
    const doctors = await Doctor.find(filter).populate("branches", "name city").sort("name");
    res.json(doctors);
  } catch (err) {
    next(err);
  }
};

exports.getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate("branches", "name city");
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (err) {
    next(err);
  }
};

exports.createDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.create(req.body);
    res.status(201).json(doctor);
  } catch (err) {
    next(err);
  }
};

exports.updateDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (err) {
    next(err);
  }
};

exports.deleteDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json({ message: "Doctor deactivated" });
  } catch (err) {
    next(err);
  }
};

// GET /api/doctors/:id/availability?date=YYYY-MM-DD
exports.getAvailability = async (req, res, next) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: "date query param is required" });
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    const slots = await getAvailableSlots(doctor, date);
    res.json({ date, doctorId: doctor._id, slots });
  } catch (err) {
    next(err);
  }
};
