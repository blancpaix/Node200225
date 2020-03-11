const local = require('./localStrategy');
const { User } = require(`../models`) ;

module.exports = (passport) => {
	passport.serializeUser((User, done) => {
		done (null, User.id);
	});

	passport.deserializeUser((id, done) => {
		User.findOne({ where : { id } })
			.then(user => done(null, user))
			.catch(err => done(err))
	});

	local(passport);
}