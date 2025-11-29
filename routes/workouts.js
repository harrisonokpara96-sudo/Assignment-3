// routes/workouts.js

const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');
const { ensureAuth } = require('../middleware/auth');

// List all workouts (anyone can see)
router.get('/', async (req, res) => {
  try {
    const workouts = await Workout.find().sort({ createdAt: -1 });
    res.render('workouts/list', { title: 'All Workouts', workouts });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error Loading Workouts');
  }
});

// Show form to create new workout (only logged in)
router.get('/new', ensureAuth, (req, res) => {
  res.render('workouts/new', { title: 'Add Workout' });
});

// Create new workout (only logged in)
router.post('/', ensureAuth, async (req, res) => {
  try {
    const { title, type, duration, intensity, notes } = req.body;

    await Workout.create({
      title,
      type,
      duration,
      intensity,
      notes,
    });

    res.redirect('/workouts');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating workout');
  }
});

// Show edit form (only logged in)
router.get('/:id/edit', ensureAuth, async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).send('Workout not found');
    }

    res.render('workouts/edit', { title: 'Edit Workout', workout });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading workout');
  }
});

// Update workout (only logged in)
router.put('/:id', ensureAuth, async (req, res) => {
  try {
    const { title, type, duration, intensity, notes } = req.body;

    await Workout.findByIdAndUpdate(req.params.id, {
      title,
      type,
      duration,
      intensity,
      notes,
    });

    res.redirect('/workouts');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating workout');
  }
});

// Delete workout (only logged in)
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    await Workout.findByIdAndDelete(req.params.id);
    res.redirect('/workouts');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting workout');
  }
});

module.exports = router;
