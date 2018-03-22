'use strict'
let	mongoose		= require('mongoose'),
	bcrypt			= require('bcrypt-nodejs'),
	Schema			= mongoose.Schema,
	userSchema;


// Schema
userSchema 	= new Schema(
{
	provider:
	{
		required: true,
		type : String,
		enum: ['google', '42', 'local']
	},
	provider_user_id:
	{
		type : String,
	},
	given_name:
	{
		required: true,
		type: String,
		lowercase: true,
		trim: true,
		validate: (str) => str.length > 2 && str.indexOf('$') < 0
	},
	family_name:
	{
		required: true,
		type: String,
		lowercase: true,
		trim: true,
		validate: (str) => str.length > 2 && str.indexOf('$') < 0
	},
	password:
	{
		type : String,
		validate: (str) => str.length > 2
	},
	email:
	{
		required: true,
		type : String,
		index: {unique: true},
		validate:
		{
			validator: (email) =>  /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email),
			message : 'Invalid adress mail'
		},
	},
	picture:
	{
		required: true,
		type : String
	},
	reset_pass:
	{
		type : String,
		default: null
	}
});

userSchema.methods.generateHash = function(password)
{
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password)
{

	if (password != null)
	{
    	return bcrypt.compareSync(password, this.password);
	}
    else
    	return (false);
};

module.exports = mongoose.model('Users', userSchema);
