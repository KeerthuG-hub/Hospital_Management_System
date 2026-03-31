const User = require('../models/user');

module.exports.login = (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username, password })
    .then((user) => {
      if (!user) {
        return res.status(401).send({
          success: false,
          error: { message: 'Invalid username or password' }
        });
      }
      if (!user.active) {
        return res.status(403).send({
          success: false,
          error: { message: 'This account is inactive. Please contact admin.' }
        });
      }
      res.status(200).send({
        success: true,
        payload: {
          role: user.role,
          displayName: user.displayName,
          userId: user._id,
          active: user.active
        }
      });
    })
    .catch((err) => {
      res.status(500).send({ success: false, error: { message: err.message } });
    });
};

module.exports.userList = (req, res) => {
  const query = req.query.role ? { role: req.query.role } : {};
  User.find(query)
    .sort({ createdAt: -1 })
    .then((data) => {
      res.status(200).send({ success: true, payload: data });
    })
    .catch(() => {
      res.status(200).send({ success: true, payload: [] });
    });
};

module.exports.registerUser = (req, res) => {
  User.create(req.body)
    .then((doc) => {
      res.status(201).send({ success: true, payload: doc });
    })
    .catch((err) => {
      res.status(400).send({ success: false, error: { message: err.message } });
    });
};

module.exports.updateUser = (req, res) => {
  User.updateOne({ _id: req.params.id }, req.body)
    .then((dbData) => {
      res.status(200).send({ success: true, payload: dbData });
    })
    .catch((err) => {
      res.status(400).send({ success: false, error: { message: err.message } });
    });
};
