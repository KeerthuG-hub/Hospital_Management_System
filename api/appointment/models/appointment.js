const mongoose = require('mongoose');
const { Schema } = mongoose;

const appointmentSchema = new Schema(
  {
    patientUserId: { type: String, required: true },
    patientName: { type: String, required: true },
    doctorName: { type: String, required: true },
    appointmentDate: { type: Date, required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Pending'
    },
    notes: { type: String, default: '' },
    prescription: { type: String, default: '' }
  },
  { timestamps: true }
);

const Appointment = mongoose.model('appointment', appointmentSchema, 'appointments');

module.exports = Appointment;
