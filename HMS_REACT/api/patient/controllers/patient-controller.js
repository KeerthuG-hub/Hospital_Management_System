const Patient = require('../models/patient');

module.exports.patientList = (req, res) => {
  Patient.find({})
    .then((data) => {
      res.status(200).send({ success: true, payload: data });
    })
    .catch(() => {
      res.status(200).send({ success: true, payload: [] });
    });
};

module.exports.fetchSinglePatient = (req, res) => {
  Patient.find({ _id: req.params.id })
    .then((data) => {
      res.status(200).send({ success: true, payload: data });
    })
    .catch(() => {
      res.status(200).send({ success: true, payload: [] });
    });
};

module.exports.addPatient = (req, res) => {
  const patientInfo = req.body;
  Patient.create(patientInfo)
    .then((doc) => {
      res.status(201).send({ success: true, payload: doc });
    })
    .catch((err) => {
      res.status(400).send({ success: false, error: { message: err.message } });
    });
};

module.exports.updatePatient = (req, res) => {
  const id = req.params.id;
  const patientInfo = req.body;
  Patient.updateOne({ _id: id }, patientInfo)
    .then((dbData) => {
      res.status(200).send({ success: true, payload: dbData });
    })
    .catch((err) => {
      res.status(400).send({ success: false, error: { message: err.message } });
    });
};

module.exports.deletePatient = (req, res) => {
  const id = req.params.id;
  Patient.deleteOne({ _id: id })
    .then((dbInfo) => {
      res.status(200).send({ success: true, payload: dbInfo });
    })
    .catch((err) => {
      res.status(400).send({ success: false, error: { message: err.message } });
    });
};
