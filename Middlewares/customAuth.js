'USE STRICT'

let	request		= require('request');


module.exports =
{
	auth42: (params, cb)=>
	{
		let authorization_url = 'https://api.intra.42.fr/oauth/authoriz',
			client_id = process.env.CLIENT_ID_42,
			clientSecret = process.env.CLIENT_SECRET_42,
			redirect_uri = "http://localhost:3000/user/auth/42",
			tokenURL = 'https://api.intra.42.fr/oauth/token',
			scope = 'public',
			response_type = 'code';

		if (!params.code)
		{
			console.log(params)
			return request.get(authorization_url, {client_id, redirect_uri, scope, response_type}, cb)
		}


		return request.post('https://api.intra.42.fr/oauth/token', data, cb);
	}
}
