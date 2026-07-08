require("dotenv").config();
const mongoose = require("mongoose");
const Branch = require("../models/Branch");
const Doctor = require("../models/Doctor");
const User = require("../models/User");
const Appointment = require("../models/Appointment");

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected. Seeding demo data...");

  await Promise.all([
    Branch.deleteMany({}),
    Doctor.deleteMany({}),
    User.deleteMany({}),
    Appointment.deleteMany({}),
  ]);

  const [branchA, branchB] = await Branch.create([
    { name: "DentalCare Gulberg", city: "Lahore", address: "12-A Main Boulevard, Gulberg III, Lahore", phone: "0300-1234567" },
    { name: "DentalCare DHA", city: "Lahore", address: "Plot 45, Phase 5, DHA, Lahore", phone: "0300-7654321" },
  ]);

  const workingHours = [1, 2, 3, 4, 5, 6].map((d) => ({ dayOfWeek: d, startTime: "10:00", endTime: "18:00" }));

  const doctors = await Doctor.create([
    {
      name: "Dr. Ayesha Khan",
      specialization: "General Dentistry",
      branches: [branchA._id, branchB._id],
      slotDurationMinutes: 30,
      workingHours,
      bio: "10+ years treating families across Lahore.",
    },
    {
      name: "Dr. Bilal Ahmed",
      specialization: "Orthodontics",
      branches: [branchA._id],
      slotDurationMinutes: 45,
      workingHours,
      bio: "Braces & aligner specialist.",
    },
  ]);

  const owner = await User.create({
    name: process.env.SEED_ADMIN_NAME || "Clinic Owner",
    email: process.env.SEED_ADMIN_EMAIL || "ghouri.dev.784@gmail.com",
    password: process.env.SEED_ADMIN_PASSWORD || "Ghouri@25",
    role: "owner",
  });

  await User.create({
    name: "Receptionist - Gulberg",
    email: "reception.gulberg@clinic.com",
    password: "ChangeMe123!",
    role: "receptionist",
    branch: branchA._id,
  });

  console.log("Seed complete.");
  console.log(`Owner login -> email: ${owner.email}  password: ${process.env.SEED_ADMIN_PASSWORD || "Ghouri@25"}`);
  console.log("Branches:", branchA.name, "/", branchB.name);
  console.log("Doctors:", doctors.map((d) => d.name).join(", "));

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
