const express = require('express');
const controller = require('../controllers/notification');
const router = express.Router();

router.get('/', async (req, res, next) => {
  const result = await controller.getNewNotifications(req.user._id);
  returnResult(result, res, next);
});

router.get('/markAsRead/:notificationId', async (req, res, next) => {
  const result = await controller.markAsRead(req.params.notificationId, req.user._id);
  returnResult(result, res, next);
});

router.get('/markAllAsRead', async (req, res, next) => {
  const result = await controller.markAllAsRead(req.user._id);
  returnResult(result, res, next);
});

function returnResult(result, res, next) {
    if (result.success) {
      res.json(result);
    } else {
      next(result)
    }
  }
  
  module.exports = router;
  