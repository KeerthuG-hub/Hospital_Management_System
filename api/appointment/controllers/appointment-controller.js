const Appointment = require('../models/appointment');

function normalizeDate(value) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

async function hasDoctorConflict({ doctorName, appointmentDate, excludeId }) {
  const normalizedDate = normalizeDate(appointmentDate);

  if (!doctorName || !normalizedDate) {
    return false;
  }

  const query = {
    doctorName,
    appointmentDate: normalizedDate,
    status: { $ne: 'Cancelled' }
  };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  const existing = await Appointment.findOne(query);
  return Boolean(existing);
}

module.exports.appointmentList = (req, res) => {
  Appointment.find({})
    .sort({ appointmentDate: 1, createdAt: -1 })
    .then((data) => {
      res.status(200).send({ success: true, payload: data });
    })
    .catch(() => {
      res.status(200).send({ success: true, payload: [] });
    });
};

module.exports.fetchSingleAppointment = (req, res) => {
  Appointment.find({ _id: req.params.id })
    .then((data) => {
      res.status(200).send({ success: true, payload: data });
    })
    .catch(() => {
      res.status(200).send({ success: true, payload: [] });
    });
};

module.exports.addAppointment = (req, res) => {
  const appointmentInfo = {
    ...req.body,
    appointmentDate: normalizeDate(req.body.appointmentDate)
  };

  if (!appointmentInfo.appointmentDate) {
    res.status(400).send({ success: false, error: { message: 'Please provide a valid appointment date and time.' } });
    return;
  }

  hasDoctorConflict(appointmentInfo)
    .then((conflict) => {
      if (conflict) {
        return res.status(409).send({
          success: false,
          error: { message: 'This doctor already has an appointment at the selected time.' }
        });
      }

      return Appointment.create(appointmentInfo)
        .then((doc) => {
          res.status(201).send({ success: true, payload: doc });
        });
    })
    .catch((err) => {
      res.status(400).send({ success: false, error: { message: err.message } });
    });
};

module.exports.updateAppointment = (req, res) => {
  const appointmentInfo = {
    ...req.body,
    appointmentDate: normalizeDate(req.body.appointmentDate)
  };

  if (!appointmentInfo.appointmentDate) {
    res.status(400).send({ success: false, error: { message: 'Please provide a valid appointment date and time.' } });
    return;
  }

  hasDoctorConflict({
    doctorName: appointmentInfo.doctorName,
    appointmentDate: appointmentInfo.appointmentDate,
    excludeId: req.params.id
  })
    .then((conflict) => {
      if (conflict) {
        return res.status(409).send({
          success: false,
          error: { message: 'This doctor already has another appointment at the selected time.' }
        });
      }

      return Appointment.updateOne({ _id: req.params.id }, appointmentInfo)
        .then((dbData) => {
          res.status(200).send({ success: true, payload: dbData });
        });
    })
    .catch((err) => {
      res.status(400).send({ success: false, error: { message: err.message } });
    });
};

module.exports.deleteAppointment = (req, res) => {
  Appointment.deleteOne({ _id: req.params.id })
    .then((dbInfo) => {
      res.status(200).send({ success: true, payload: dbInfo });
    })
    .catch((err) => {
      res.status(400).send({ success: false, error: { message: err.message } });
    });
};
