const {jsonSuccess} = require("../utils/system");

const express = require('express');
const controller = require('../controllers/user');
const router = express.Router();
const User = require('../models/user');

const multer = require('multer');
const mime = require('../utils/Mime');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(file.mimetype);
    const isValid = mime.MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "public/avatars");
  },
  filename: (req, file, cb) => {
    const ext = mime.MIME_TYPE_MAP[file.mimetype];
    cb(null, Date.now() + '.' + ext);
  }
});

router.post("/register", async (req, res, next) => {
  const result = await controller.register(req)
  returnResult(result, res, next);
});

router.post('/login', async (req, res, next) => {
  const body = req.body;
  const result = await controller.login(body)
  returnResult(result, res, next);
});

// router.get('/notifications', async (req, res, next) => {
//   const result = await controller.getNewNotifications(req);
//   returnResult(result, res, next);
// });

// router.get('/markAsRead/:notificationId', async (req, res, next) => {
//   const result = await controller.markAsRead(req.params.notificationId, req.user._id);
//   returnResult(result, res, next);
// });

// router.get('/markAllAsRead', async (req, res, next) => {
//   const result = await controller.markAllAsRead(req.user._id);
//   returnResult(result, res, next);
// });

router.get('/info', async (req, res, next) => {
  res.json(req.user);
});

router.get('', (req, res) => {
  res.json({ hello: 'hihi' });
})

router.post('/follow/:id', async function (req, res, next) {
  const { id } = req.params;
  const result = await controller.followUser(req.user._id, id);
  returnResult(result, res, next);
});

router.post('/unfollow/:id', async function (req, res, next) {
  const { id } = req.params;
  const result = await controller.unfollowUser(req.user._id, id);
  returnResult(result, res, next);
});

router.get('/following', async (req, res, next) => {
  const result = await controller.getFollowing(req.user._id);
  returnResult(result, res, next);
});

router.get('/follower', async (req, res, next) => {
  const result = await controller.getFollower(req.user._id);
  returnResult(result, res, next);
});

router.get('/:id', async (req, res, next) => {
  if (req.params.id === req.user.id) {
    res.json(jsonSuccess(req.user));
  } else {
    const result = await controller.getUserById(req.params.id);
    const index = result.data.follower.findIndex(f => f.follower.equals(req.user.id));
    console.log(index);
    result.data.followed = index!==-1;
    result.data.numFollower = result.data.follower.length;
    delete result.data.follower;
    returnResult(result, res, next);
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
  await User.findByIdAndUpdate(req.user._id, { lang: req.params.lang })
  res.json(req.user);
});

router.get('/search/:key', async (req, res, next) => {
  let result = await controller.search(req.user._id, req.params.key);
  returnResult(result, res, next);
});

router.post('/uploadAvatar', multer({ storage: storage }).single("avatar"), async (req, res, next) => {
  let url = req.protocol + '://' + req.get('host');
  if (req.file) {
    url = `${url}/avatars/${req.file.filename}`;
    await User.findByIdAndUpdate(req.user._id, { avatar: url });
    res.json(jsonSuccess(url));
  } else {
    next('Cannot update avatar');
  }
});

function returnResult(result, res, next) {
  if (result.success) {
    res.json(result);
  } else {
    next(result)
  }
}

module.exports = router;
