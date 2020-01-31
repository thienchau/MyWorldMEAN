var express = require('express');
var router = express.Router();
const UserController = require('../controllers/user_controller');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/follow/:id', async function (req, res) {
  const { id } = req.params;
  //Hard code
  const userID = 1;
  const result = await UserController.followUser(1, id);
  if (result.success) res.json(result);
});

module.exports = router;
