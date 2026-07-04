const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.code === 11000) {
    return res.status(409).json({
      message: "That time slot was just booked by someone else. Please pick another slot.",
    });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({ message: Object.values(err.errors).map((e) => e.message).join(", ") });
  }

  res.status(err.statusCode || 500).json({
    message: err.message || "Something went wrong on our end.",
  });
};

module.exports = errorHandler;
