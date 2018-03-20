'use strict'

const mongoose  = require('mongoose'),
      dotenv    = require('dotenv').config(),
      url       = 'mongodb://'+process.env.DB_USER+':'+process.env.DB_PASSWORD+'@ds159187.mlab.com:59187/hypertube';

module.exports	=
{
	connect : ()=>
  {
     return new Promise((resolve, reject) =>
     {
       //return (resolve())
       mongoose.connect(url, (err)=>
       {
         	if (err)
         		return (reject(err))

          return (resolve())
      })
    })
  }
}
