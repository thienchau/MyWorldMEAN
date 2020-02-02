const express = require('express');
const userController = require('../controllers/user');
const router = express.Router();
const User = require('../models/user');

router.post("/register", async (req, res, next) => {
  const result = await userController.register(req)
  if (result.success) {
    res.json(result);
  } else {
    next(result);
  }
});

router.post('/login', async (req, res, next) => {
  const body = req.body;
  const result = await userController.login(body)
  if (result.success) {
    return res.json(result);
  } else {
    next(result);
  }
});

router.get('/notifications', async (req, res, next) => {
  const result = await userController.getAllNotifications(req);
  if(result.success) {
    res.json(result);
  } else {
    next(result);
  }
});

router.get('/marlAsRead/:notificationId', async (req, res, next) => {
  const result = await userController.markAsRead(req.params.notificationId, req.user._id);
  if(result.success) {
    res.json(result);
  } else {
    next(result);
  }
});

router.get('/info', async (req, res, next) => {
  res.json(req.user);
});

router.get('', (req, res) => {
  res.json({ hello: 'hihi' });
})

router.post('/follow/:id', async function (req, res, next) {
  const { id } = req.params;
  const result = await userController.followUser(req.user._id, id);
  if (result.success) {
    res.json(result);
  } else {
    next(result)
  }
});

router.post('/unfollow/:id', async function (req, res, next) {
  const { id } = req.params;
  const result = await userController.unfollowUser(req.user._id, id);
  if (result.success) {
    res.json(result);
  } else {
    next(result)
  }
});

router.get('/following', async (req, res, next) => {
  const followings = await userController.getFollowing(req.user._id);
  if (followings.success) {
    res.json(followings);
  } else {
    next(followings)
  }
});

router.get('/follower', async (req, res, next) => {
  const followers = await userController.getFollower(req.user._id);
  if (followers.success) {
    res.json(followers);
  } else {
    next(followers)
  }
});

router.get('/:id', async (req, res, next) => {
  if (req.params.id === req.user.id) {
    res.json(req.user);
  } else {
    const user = await userController.getUserById(req.params.id);
    if (user.success) {
      res.json(user);
    } else {
      next(user);
    }
  }
});

router.post('/update', async (req, res, next) => {
  req.user.password = undefined;
  let updateData = {};
  Object.keys(req.body).forEach(key => {
    updateData[key] = req.body[key] ? req.body[key] : req.user[key]
  });
  await User.findByIdAndUpdate(req.user._id, updateData);
  res.json();
});

router.post('/lang/:lang', async (req, res, next) => {
  req.user.lang = req.params.lang;
  await req.user.save();
  res.json(req.user);
});

module.exports = router;
