const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  googleId: { type: String, default: null },
  githubId: { type: String, default: null },
  name: { type: String, required: true },
  email: { type: String, default: null },
  avatar: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
