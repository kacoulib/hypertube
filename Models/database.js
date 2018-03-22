'use strict'

const mongoose  = require('mongoose'),
      dotenv    = require('dotenv').config(),
      url       = 'mongodb://'+process.env.DB_USER+':'+process.env.DB_PASSWORD+'@ds111279.mlab.com:11279/hypertube';


module.exports	=
{
	connect : ()=>
  {
     return new Promise((resolve, reject) =>
     {
       mongoose.connect(url, (err)=>
       {
         	if (err)
         		return (reject(err))

          return (resolve())
      })
    })
  } 
}
