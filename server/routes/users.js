const express = require('express');
const userController = require('../controllers/user');
const router = express.Router();

router.post("/register", async (req, res, next) => {
  const body = req.body;
  const result = await userController.register(body)
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
    res.json(result);
  } else {
    next(result);
  }
});

router.post('/follow/:id', async function (req, res, next) {
  const { id } = req.params;
  //Hard code
  const userID = 1;
  const result = await userController.followUser(1, id);
  if (result.success) {
    res.json(result);
  } else {
    next(result)
  }
});

router.post('/unfollow/:id', async function (req, res, next) {
  const { id } = req.params;
  //Hard code
  const userID = 1;
  const result = await userController.unfollowUser('5e3494ad2ff05016cc0a540e', id);
  if (result.success) {
    res.json(result);
  } else {
    next(result)
  }
});

router.get('/following', async (req, res, next) => {
  const fakeUser = '5e3494ad2ff05016cc0a540e';
  const followings = await userController.getFollowing(fakeUser);
  if (followings.success) {
    res.json(followings);
  } else {
    next(followings)
  }
});

router.get('/follower', async (req, res, next) => {
  const fakeUser = '5e3494ad2ff05016cc0a540f';
  const followers = await userController.getFollower(fakeUser);
  if (followers.success) {
    res.json(followers);
  } else {
    next(followers)
  }
});

module.exports = router;
