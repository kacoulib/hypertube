"STRICT MODE"

let bcrypt				= require('bcrypt-nodejs'),
		localStrategy	= require('passport-local').Strategy,
		GoogleStrategy = require('passport-google-oauth20').Strategy,
		User 					= require('../Models/User/user.js'),
		saltRounds		= 10;


module.exports = function (passport)
{
	// =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    passport.serializeUser(function(user, next)
    {
        next(null, user.id);
    });

    passport.deserializeUser(function(id, next)
    {
        User.findById(id, function(err, user) {
            next(err, user);
        });
    });


    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
	passport.use('local-signin', new localStrategy(
	{
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback : true // allows us to pass back the entire request to the callback

	},
	function(req, email, password, next)
	{
		User.findOne({'email': email}, function(err, user)
		{
			if (err)
				return next(err);

			if (!user)
				return next(null, false, {message: 'Incorrect email.' });

			if (!user.validPassword(password))
				return next(null, false, 'Oops! Wrong password.');

			return next(null, user);
		});
	}));

    // =========================================================================
    // LOCAL Register =============================================================
    // =========================================================================
	passport.use('local-signup', new localStrategy(
	{
		// by default, local strategy uses username and password, we will override with email
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true,
		session: false
	},
	function(req, email, password, next)
	{
		process.nextTick(function()
		{
			User.findOne({'email' :  email}, function(err, user)
			{
				if (err)
					return next(err);

				if (user)
					return next(null, false, 'That email is already taken.');

				let newUser	= new User(
				{
					given_name	: req.body.given_name,
					family_name	: req.body.family_name,
					login		: req.body.login,
					email		: req.body.email,
					provider	: "local",
					picture		: req.body.picture,
				});

				newUser.password = newUser.generateHash(password)
				// save the new user
				newUser.save(function(err)
				{
					if (err)
						throw err;

					console.log('User succefully create');
					return next(null, newUser);
				});
			});
		});
	}));

	passport.use(new GoogleStrategy(
	{
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		callbackURL: '/user/auth/google'
	},
		(accessToken, refreshToken, profile, next) =>
		{
			User.findOne({provider_user_id: profile.id, provider: 'google'}, (err, user) =>
			{
				if (err)
					return next(err, user);
				if (user)
					return next(null, user)

				let newUser,
					photo = (profile._json ? profile._json.image.url: profile.photos ? (profile.photos[0] ? profile.photos[0].value : null) : null),
					email = profile.emails ? profile.emails[0] ? profile.emails[0].value : null : null;


				newUser	= new User(
				{
					given_name			: profile.name.givenName,
					family_name			: profile.name.familyName,
					login				: profile.login,
					email				: email,
					picture				: photo,
					provider			: 'google',
					provider_user_id	: profile.id
				});

				newUser.save((err)=>
				{
					if (err)
						return next(err, user);

					return next(err, newUser);
				})

			});
		}
	));
}














