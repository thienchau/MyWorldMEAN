const express = require('express');
const userController = require('../controllers/user');
const router = express.Router();

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
    console.log(result);
    return res.json(result);
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
  Object.keys(req.body).forEach(key => {
    console.log(key);
    req.user[key] = req.body[key] ? req.body[key] : req.user[key]
  });
  await req.user.save();
  res.json();
});

router.post('/lang/:lang', async (req, res, next) => {
  req.user.lang = req.params.lang;
  await req.user.save();
  res.json(req.user);
});

module.exports = router;
