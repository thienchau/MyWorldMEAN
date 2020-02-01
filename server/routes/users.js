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
    console.log(result);
    return res.json(result);
  } else {
    next(result);
  }
});

router.get('/info', async (req, res, next) => {
  console.log('info');
  
  console.log(req.user);
  
  res.json(req.user);
});

router.get('', (req, res) => {
  res.json({ hello: 'hihi' });
})

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

module.exports = router;
