'use strict'

let jwt		= require('jsonwebtoken'),
	dotenv	= require('dotenv').config(),
	userUtils	= require('../Utils/userDataValidator');


module.exports =
{
	generateToken: (user)=>
	{
		user  = userUtils.tokenazableUser(user);

		return (jwt.sign(user, process.env.JWT_SECRET, {expiresIn: '24h'}));
	},

	verify: (token, calb)=>
	{
		jwt.verify(token, process.env.JWT_SECRET, calb)
	}
}
