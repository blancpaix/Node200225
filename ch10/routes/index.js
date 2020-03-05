const express = require(`express`);
const uuid = require(`uuid/v4`);
const { User, Domain } = require(`../models`);

const router = express.Router();

router.get(`/`, (req, res, next) => {
	User.findOne({
		where : {id : req.user && req.user.id || null},
		include : { model : Domain},
	})
		.then ((user) => {
			res.render(`login`, {
				user,
				loginError : req.flash('loginError'),
				domains : user && user.domains,
			});
		})
		.catch ((error) => {
			next(error);
		});
});

router.post(`/domain`, (req, res, next) => {
	Domain.create ({
		userId : req.user.id,
		host : req.body.host,
		type : req.body.type,
		clientSecret : uuid(),
	})
		.then(() => {
			res.redirect(`/`);
		})
		.catch((err) => {
			next(err);
		});
});

module.exports = router;
