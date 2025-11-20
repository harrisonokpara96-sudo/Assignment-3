// models/Workout.js
// Mongoose schema for a Workout document

const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      required: true,
      enum: ['Cardio', 'Strength', 'Flexibility', 'Other'],
      default: 'Other'
    },
    duration: {
      type: Number, // in minutes
      required: true,
      min: 1
    },
    intensity: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    notes: {
      type: String,
      trim: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true // createdAt, updatedAt
  }
);

module.exports = mongoose.model('Workout', workoutSchema);
