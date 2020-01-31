const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userController = require('../controllers/user');

const User = require('../models/user');

const router = express.Router();

router.post("/register", (req, res, next) => {
  const body = req.body;
  console.log(body);
  
  const result = userController.register(body)
  if (result.success) {
    res.json(result);
  } else {
    next(result);
  }
});

router.post('/login', (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: 'Auth failed'
        })
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      console.log(result);
      if (!result) {
        return res.status(401).json({
          message: 'Auth failed'
        })
      }
      const token = jwt.sign({ email: fetchedUser.email, userId: fetchedUser._id },
        process.env.SECRETE_KEY,
        { expiresIn: '1h' });
      res.status(200).json({
        token: token
      })
    })
    .catch(err => {
      return res.status(401).json({
        message: 'Auth failed'
      })
    })
});

router.get('', async function (req, res, next) {
  res.json({ hello: 'dsadsa' })
});

router.post('/follow/:id', async function (req, res) {
  const { id } = req.params;
  //Hard code
  const userID = 1;
  const result = await userController.followUser(1, id);
  if (result.success) {
    res.json(result);
  } else {
    next(result);
  }
});

module.exports = router;
