require('./../config/config.js');

var {User} = require('./../models/user');
var {authenticate} = require('./../middleware/authenticate');

// var {mongoose} = require('./db/mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const router = express.Router();
const lodash = require('lodash');

const port = process.env.PORT;
router.use(bodyParser.json());


// POST /users
router.post('/users', (req, res) => {
  var body = lodash.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })
});

router.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

router.post('/users/login', (req, res) => {
  var body = lodash.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

router.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

module.exports = router;
