'use strict'

const mongoose  = require('mongoose'),
      dotenv    = require('dotenv').config(),
      url       = 'mongodb://'+dotenv.parsed.DB_USER+':'+dotenv.parsed.DB_PASSWORD+'@ds111279.mlab.com:11279/hypertube';

module.exports	=
{
	connect : ()=>
  {
     return new Promise((resolve, reject) =>
     {
       return (resolve())
       mongoose.connect(url, (err)=>
       {
         	if (err)
         		return (reject(err))

          return (resolve())
      })
    })
  }
}
