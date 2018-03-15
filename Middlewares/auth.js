"STRICT MODE"

let bcrypt				= require('bcrypt-nodejs'),
		localStrategy	= require('passport-local').Strategy,
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
		console.log('local-signup')

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
					first_name	: req.body.first_name,
					last_name	: req.body.last_name,
					login	: req.body.login,
					email		: req.body.email,
					picture	: req.body.picture,
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
	}))
}
