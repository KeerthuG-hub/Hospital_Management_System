const mongoose = require('mongoose');
const { Schema } = mongoose;

const patientSchema = new Schema(
  {
    patientName: { type: String, required: true, minlength: 2 },
    age: { type: Number, required: true, min: 1, max: 120 },
    gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
    bloodGroup: { type: String, required: true, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
    phone: { type: String, required: true, match: [/^\d{10}$/, 'Phone must be exactly 10 digits'] },
    address: { type: String, required: false },
    diagnosis: { type: String, required: true, default: 'Pending consultation' },
    doctorAssigned: { type: String, required: true, default: 'Not Assigned' },
    admissionDate: { type: Date, required: true, default: Date.now }
  },
  { timestamps: true }
);

const Patient = mongoose.model('patient', patientSchema, 'patients');

module.exports = Patient;
