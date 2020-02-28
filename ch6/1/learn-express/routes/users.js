var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get(`/flash`, (req,res) => {
	req.session.message = `세션 메세지 내가 날리는거여~`;
	req.flash(`message`, `flash Message`);
	// `message` 는 위에서 정의된 req.session.message 를 말하는듯?
	// flash 는 한번만 보이고 그 다음으로는 안보이는거임.
	res.redirect(`/users/flash/result`);
});

router.get(`/flash/result`, (req,res) => {
	res.send(`${req.session.message} ${req.flash(`message`)}`);
});

module.exports = router;
