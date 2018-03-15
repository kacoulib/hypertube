'use strict'

const	express			= require('express'),
		session				= require('express-session'),
		app						= express(),
		router				= express.Router(),
		database			= require('./Models/database.js'),
		cookieParser	= require('cookie-parser'),
		bodyParser		= require('body-parser'),
		passport			= require('passport'),
		server				= require('http').createServer(app),
		jwt						= require('jsonwebtoken');



// Database login ==============================================================


database.connect()
.then(()=>
{
	console.log('Db connected...')


	// configuration =============================================================

	app.use((req, res,next)=>
	{
		//res.setHeader('Access-Control-Allow-Origin',  'http://localhost:3001');
		res.setHeader('Access-Control-Allow-Origin',  '*', 'http://localhost:8080');
		res.header('Access-Control-Allow-Credentials', true);
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
		next();
	});


	// set up our express application
	app.use(bodyParser.json())
	app.use(bodyParser.urlencoded({extended: true, limit: '550mb'}));
	app.use(cookieParser());

	// required for passport
	app.use(session(
	{
		secret: 'theHypertubeSuperSessionSESSid0rNot',
		resave: false,
		saveUninitialized: true,
		cookie:
		{
			secure: false,
			maxAge: 1000 * 60 * 60 * 24
		}
	}));
	app.use(passport.initialize());
	app.use(passport.session());


	app.use(function(req, res, next)
	{
	   // check header or url parameters or post parameters for token
	   var token = req.headers['authorization'],
		 		not_loged_user_acess_page = ['/sign_in'];

		 if (not_loged_user_acess_page.indexOf(req.originalUrl) > -1)
			 return next();

		 if (!token)
		 	return next(); //if no token, continue

		 token = token.replace('Bearer ', '');

	   jwt.verify(token, process.env.JWT_SECRET, function(err, user)
		 {
	     if (err) {
	       return res.status(401).json({
	         success: false,
	         message: 'Invalid token provided'
	       });
	     } else {
	       req.user = user; //set the user to req so other routes can use it
	       next();
	     }
	   });
	});

	// routes ====================================================================

	require('./Middlewares/auth.js')(passport);
	require('./Routes/users.js')(app, passport);
})
.catch((err)=>{console.log('______________');throw err})



// Launch ======================================================================
server.listen(3000)
