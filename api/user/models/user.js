const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['doctor', 'patient', 'admin'] },
    displayName: { type: String, required: true },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const User = mongoose.model('user', userSchema, 'users');

module.exports = User;
