const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');
const { ensureAuth } = require('../middleware/auth');

// View all workouts (public)
router.get('/', async (req, res) => {
  const workouts = await Workout.find().lean();
  res.render('workouts/index', { workouts });
});

// New workout form (protected)
router.get('/new', ensureAuth, (req, res) => {
  res.render('workouts/new');
});

// Create workout (protected)
router.post('/', ensureAuth, async (req, res) => {
  try {
    await Workout.create({ ...req.body, user: req.user.id });
    res.redirect('/workouts');
  } catch (err) {
    console.log(err);
    res.send('Error');
  }
});

// Edit workout (protected)
router.get('/:id/edit', ensureAuth, async (req, res) => {
  const workout = await Workout.findById(req.params.id).lean();
  res.render('workouts/edit', { workout });
});

// Update workout (protected)
router.put('/:id', ensureAuth, async (req, res) => {
  await Workout.findByIdAndUpdate(req.params.id, req.body);
  res.redirect('/workouts');
});

// Delete workout (protected)
router.delete('/:id', ensureAuth, async (req, res) => {
  await Workout.findByIdAndDelete(req.params.id);
  res.redirect('/workouts');
});

module.exports = router;
