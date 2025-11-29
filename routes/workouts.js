const express = require("express");
const router = express.Router();
const Workout = require("../models/Workout");
const { ensureAuth } = require("../middleware/auth");

// ---------------------------------------------
// VIEW ALL WORKOUTS (PUBLIC)
// ---------------------------------------------
router.get("/", async (req, res) => {
  try {
    const workouts = await Workout.find().lean();
    res.render("workouts/index", {
      title: "All Workouts",
      workouts,
      user: req.user || null
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error Loading Workouts");
  }
});

// ---------------------------------------------
// NEW WORKOUT PAGE (PROTECTED)
// ---------------------------------------------
router.get("/new", ensureAuth, (req, res) => {
  res.render("workouts/new", {
    title: "Add Workout",
    user: req.user
  });
});

// ---------------------------------------------
// CREATE WORKOUT (PROTECTED)
// ---------------------------------------------
router.post("/", ensureAuth, async (req, res) => {
  try {
    await Workout.create({
      ...req.body,
      user: req.user.id
    });

    res.redirect("/workouts");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating workout");
  }
});

// ---------------------------------------------
// EDIT WORKOUT PAGE (PROTECTED)
// ---------------------------------------------
router.get("/:id/edit", ensureAuth, async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id).lean();
    res.render("workouts/edit", {
      title: "Edit Workout",
      workout,
      user: req.user
    });
  } catch (err) {
    console.error(err);
    res.redirect("/workouts");
  }
});

// ---------------------------------------------
// UPDATE WORKOUT (PROTECTED)
// ---------------------------------------------
router.put("/:id", ensureAuth, async (req, res) => {
  try {
    await Workout.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/workouts");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating workout");
  }
});

// ---------------------------------------------
// DELETE WORKOUT (PROTECTED)
// ---------------------------------------------
router.delete("/:id", ensureAuth, async (req, res) => {
  try {
    await Workout.findByIdAndDelete(req.params.id);
    res.redirect("/workouts");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting workout");
  }
});

module.exports = router;
