'USE STRICT'

let nodemailer	= require('nodemailer'),
    auth = {},
    transport;




module.exports =
{
  reset_pass: (data, reset_key)=>
  {
    return new Promise((resolve, reject)=>
    {
      if (!reset_key)
        return (reject('reset key not found'));

      if (!data)
        data = {};

      auth.user = data.user || process.env.MAIL_ADDRR;
      auth.pass = data.pass || process.env.MAIL_PASS;

      transport = nodemailer.createTransport({
        service: 'Gmail',
        auth
      });

      let to = 'liliv@mailtrix.net';

      transport.sendMail({
          from: "kacoulib ✔ <kaoculib@student.42.fr>", // sender address
          to, // list of receivers
          subject: "Matcha password reset", // Subject line
          html: "<b><a href='http://localhost:3001/pass_reset/"+ reset_key +"'>Link ✔</a></b>" // html body
      }, function(err, response)
      {
          if (err)
              return (reject());

          transport.close();

          return (resolve(response));
      });
    })
  }
}
