const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserController = require('../controllers/user');

const User = require('../models/user');

const router = express.Router();

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash
    })
    user.save().then(result => {
      res.status(201).json({
        message: 'User created!',
        result: result
      });
    }).catch(err => {
      res.status(500).json({
        error: err
      });
    })
  });
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

router.post('/follow/:id', async function (req, res) {
  const { id } = req.params;
  //Hard code
  const userID = 1;
  const result = await UserController.followUser(1, id);
  if (result.success) res.json(result);
});

router.get('/following', async (req, res) => {
  const fakeUser = '5e3494ad2ff05016cc0a540e';
  const followings = await UserController.getFollowing(fakeUser);
  res.json(followings);
});

router.get('/follower', async (req, res) => {
  const fakeUser = '5e3494ad2ff05016cc0a540f';
  const followers = await UserController.getFollower(fakeUser);
  res.json(followers);
});

module.exports = router;
