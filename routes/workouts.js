// routes/workouts.js

const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');

// List all workouts
router.get('/', async (req, res) => {
  try {
    const workouts = await Workout.find().sort({ createdAt: -1 });
    res.render('workouts/list', { title: 'All Workouts', workouts });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error Loading Workouts');
  }
});

// Show form to create new workout
router.get('/new', (req, res) => {
  res.render('workouts/new', { title: 'Add Workout' });
});

// Create a new workout
router.post('/', async (req, res) => {
  try {
    const { title, type, duration, intensity, notes } = req.body;
    await Workout.create({ title, type, duration, intensity, notes });
    res.redirect('/workouts');
  } catch (err) {
    console.error(err);
    res.status(400).send('Error creating workout');
  }
});

// Show edit form
router.get('/:id/edit', async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) return res.status(404).send('Workout not found');
    res.render('workouts/edit', { title: 'Edit Workout', workout });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading workout');
  }
});

// Update workout
router.put('/:id', async (req, res) => {
  try {
    const { title, type, duration, intensity, notes } = req.body;
    await Workout.findByIdAndUpdate(req.params.id, {
      title,
      type,
      duration,
      intensity,
      notes
    });
    res.redirect('/workouts');
  } catch (err) {
    console.error(err);
    res.status(400).send('Error updating workout');
  }
});

// Delete workout
router.delete('/:id', async (req, res) => {
  try {
    await Workout.findByIdAndDelete(req.params.id);
    res.redirect('/workouts');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting workout');
  }
});

module.exports = router;
