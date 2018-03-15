'use strict'

let mkdirp        = require('mkdirp'),
    multer  		  = require('multer'),
    profile_path   = process.cwd() + '/www/public/img/profiles/',
    fs            = require('fs'),
    storage,
    fileFilter,
    tmp,
    len;


fileFilter = (req, file, cb)=>
{
  tmp = file.originalname.split('.'),
  len = tmp ? tmp.length : 0;

	if (!tmp || isNaN(file.fieldname) || !req.user || !req.user.login)
		return (cb(null, false));

  fs.access(profile_path + req.user.login, fs.constants.R_OK | fs.constants.W_OK, (err)=>
  {
      if (err)
        return (cb(null, false));

      return (cb(null, true));
  })
}

storage = multer.diskStorage(
{
    destination: function (req, file, cb)
  	{
      cb(null, profile_path + req.user.login)
    },

    filename: function (req, file, cb)
  	{
  		tmp = file.originalname.split('.');
			len = tmp.length;

      cb(null, file.fieldname+'.'+tmp[len - 1])
    }
})



module.exports =
{
  upload: multer({fileFilter, storage}),

  createUserFolder: (login)=>
  {
    return new Promise((resolve, reject)=>
    {
        if (!login)
          return (reject('no login provided'));

        mkdirp(profile_path + login, (err)=>
        {
          if (err)
            return (reject('no login provided'));

          return (resolve());
        })
    })
  }
}
