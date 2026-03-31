const Doctor = require('../models/doctor');

module.exports.doctorList = (req, res) => {
  Doctor.find({})
    .then((data) => {
      res.status(200).send({ success: true, payload: data });
    })
    .catch(() => {
      res.status(200).send({ success: true, payload: [] });
    });
};

module.exports.fetchSingleDoctor = (req, res) => {
  Doctor.find({ _id: req.params.id })
    .then((data) => {
      res.status(200).send({ success: true, payload: data });
    })
    .catch(() => {
      res.status(200).send({ success: true, payload: [] });
    });
};

module.exports.addDoctor = (req, res) => {
  const doctorInfo = req.body;
  Doctor.create(doctorInfo)
    .then((doc) => {
      res.status(201).send({ success: true, payload: doc });
    })
    .catch((err) => {
      res.status(400).send({ success: false, error: { message: err.message } });
    });
};

module.exports.updateDoctor = (req, res) => {
  const id = req.params.id;
  const doctorInfo = req.body;
  Doctor.updateOne({ _id: id }, doctorInfo)
    .then((dbData) => {
      res.status(200).send({ success: true, payload: dbData });
    })
    .catch((err) => {
      res.status(400).send({ success: false, error: { message: err.message } });
    });
};

module.exports.deleteDoctor = (req, res) => {
  const id = req.params.id;
  Doctor.deleteOne({ _id: id })
    .then((dbInfo) => {
      res.status(200).send({ success: true, payload: dbInfo });
    })
    .catch((err) => {
      res.status(400).send({ success: false, error: { message: err.message } });
    });
};
