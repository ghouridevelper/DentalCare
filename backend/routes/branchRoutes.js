const express = require("express");
const router = express.Router();
const { getBranches, createBranch, updateBranch, deleteBranch } = require("../controllers/branchController");
const { protect, requireOwner } = require("../middleware/auth");

router.get("/", getBranches);
router.post("/", protect, requireOwner, createBranch);
router.put("/:id", protect, requireOwner, updateBranch);
router.delete("/:id", protect, requireOwner, deleteBranch);

module.exports = router;
