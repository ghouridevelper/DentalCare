const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "clinic-booking-demo-secret");
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User no longer exists" });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized, token invalid or expired" });
  }
};

const requireOwner = (req, res, next) => {
  if (req.user.role !== "owner") {
    return res.status(403).json({ message: "Owner access only" });
  }
  next();
};

// Verifies incoming requests actually came from Zapier using a shared secret header.
const verifyZapierSecret = (req, res, next) => {
  const secret = req.headers["x-zapier-secret"];
  if (!secret || secret !== process.env.ZAPIER_SHARED_SECRET) {
    return res.status(401).json({ message: "Invalid or missing Zapier secret" });
  }
  next();
};

module.exports = { protect, requireOwner, verifyZapierSecret };
