'use strict'

const jwt 		= require('../Middlewares/jwt.js');


module.exports = function (app)
{


		/*	====================================
			============= USER CRUD ============
			====================================  */


	app.post('/stream', (req, res, next) =>
	{
		res.json({message: 'Steam added'});
	})
	.get('/stream/:id', (req, res, next) =>
	{
		res.json({message: 'Steam get'});
	})
	.put('/stream', (req, res, next)=>
	{
		res.json({message: 'Steam updated'});
	})
	.delete('/stream/:id', (req, res, next) =>
	{
		res.json({message: 'Steam deleted'});
	})
}
