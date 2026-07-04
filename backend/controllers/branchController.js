const Branch = require("../models/Branch");

exports.getBranches = async (req, res, next) => {
  try {
    const branches = await Branch.find(req.query.all ? {} : { isActive: true }).sort("name");
    res.json(branches);
  } catch (err) {
    next(err);
  }
};

exports.createBranch = async (req, res, next) => {
  try {
    const branch = await Branch.create(req.body);
    res.status(201).json(branch);
  } catch (err) {
    next(err);
  }
};

exports.updateBranch = async (req, res, next) => {
  try {
    const branch = await Branch.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!branch) return res.status(404).json({ message: "Branch not found" });
    res.json(branch);
  } catch (err) {
    next(err);
  }
};

exports.deleteBranch = async (req, res, next) => {
  try {
    const branch = await Branch.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!branch) return res.status(404).json({ message: "Branch not found" });
    res.json({ message: "Branch deactivated" });
  } catch (err) {
    next(err);
  }
};
