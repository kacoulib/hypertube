'USE STRICT'

let	request		= require('request');


module.exports =
{
	auth42: (params, cb)=>
	{
		console.log(params)
		let data =
		{
			authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
			tokenURL: 'https://api.intra.42.fr/oauth/token',
			clientID: process.env.CLIENT_ID_42,
			clientSecret: process.env.CLIENT_SECRET_42,
			callbackURL: "http://localhost:3000/user/auth/42",
			clientID: process.env.CLIENT_ID_42,
			clientSecret: process.env.CLIENT_SECRET_42,
		};


		request.post('https://api.intra.42.fr/oauth/token', data, cb);
	}
}
