"STRICT MODE"

let bcrypt				= require('bcrypt-nodejs'),
		localStrategy	= require('passport-local').Strategy,
		User 					= require('../Models/User/user.js'),
		userUtils			= require('../Utils/userDataValidator'),
		dataUtils			= require('../Utils/dataValidator');


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
        User.findById(id)
					.then((user)=>next(null, user))
					.catch((err)=> next(err, null));
    });


    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
	passport.use('local-signin', new localStrategy(
	{
		usernameField: 'loginOrEmail',
		passwordField: 'password',
		passReqToCallback : true // allows us to pass back the entire request to the callback

	},
	function(req, loginOrEmail, password, next)
	{
		User.findByLoginOrEmail(loginOrEmail, loginOrEmail)
		.then((user)=>
		{
			if (!user || !user[0])
				return next({message: 'Incorrect login or email.' });

			if (user[0].is_lock == 'true')
				return next({ message: 'Sorry but your account is lock.' });

			bcrypt.compare(password, user[0].password, (err, res)=>
			{
				if (err)
					return next({ message: 'Password error.' });

				if (res == false)
					return next({ message: 'Oops! Wrong password.'});

				return next(null, user[0]);
			})
		})
		.catch((err)=>next({message: 'Incorrect login or email.'}))
	}));

    // =========================================================================
    // LOCAL Register =============================================================
    // =========================================================================
	passport.use('local-signup', new localStrategy(
	{
		// by default, local strategy uses username and password, we will override with email
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true
	},
	function(req, email, password, next)
	{
		// asynchronous
		// User.findOne wont fire unless data is sent back
		process.nextTick(function()
		{
			// create the user
			let new_user = userUtils.cleanNewUser(req.body);

			if (!dataUtils.is_new_user_valid(new_user))
				return next(null, false, 'Invalid data');


			User.findByLoginOrEmail(new_user.login, new_user.email)
			.then((err)=>{next(null, false, { message: 'The email or login provided is already taken.' })})
			.catch((user)=>
			{
				new_user.status = 'online';

				bcrypt.hash(new_user.password, bcrypt.genSaltSync(8), null, (err, salt)=>
				{
					if (err)
						return next(null, false, { message: 'Error.' });

						new_user.password = salt;

						// save the new user
						User.add(new_user)
						.then((new_user_id)=>
						{
							new_user.id = new_user_id;

							return next(null, new_user);
						})
						.catch((err)=> next(err, false, { message: 'User insertion Error.' }));
				})
			})
		})
	}))
}
