const mongoose = require('mongoose');
const { Schema } = mongoose;

const doctorSchema = new Schema(
  {
    doctorName: { type: String, required: true, unique: true },
    specialization: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    shift: { type: String, required: true, enum: ['Morning', 'Evening', 'Night'] },
    availabilitySlots: { type: [String], default: [] }
  },
  { timestamps: true }
);

const Doctor = mongoose.model('doctor', doctorSchema, 'doctors');

module.exports = Doctor;
