'use strict'

let  dataValidator = require('../Utils/dataValidator'),
		user_struct = require('../Models/User/struct/columns');


module.exports =
{
	tokenazableUser: (user)=> dataValidator.exclude_data(user_struct , user, ['id', 'password', 'is_lock', 'reset_pass', 'status']),

	cleanNewUser: (user)=> dataValidator.exclude_data(user_struct , user, ['id']),

	cleanUpdateUser: (user)=> dataValidator.extract_data_and_exclude(user_struct , user, ['id'])
}
