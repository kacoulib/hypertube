'use strict'

let user_struct = require('../Models/User/struct/columns');

function is_major(age)
{
	if (!age)
		return (false);

	let minDate = new Date('1970-01-01 00:00:01'),
			maxDate = new Date('2038-01-19 03:14:07'),
			date = new Date(age);

	return (date > minDate && date < maxDate);
}

function is_valid_email(email)
{
	if (!email)
		return (false);

	return (email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) ? true : false)
}

function is_valid_db_id(id)
{
	if (isNaN(id)|| id < 0)
		return (false);

	return (true);
}

function is_valid_gender(gender)
{
	return (user_struct.single.gender.value.indexOf(gender) >= 0);
}

function is_valid_orientation(orientation)
{
	return (user_struct.single.orientation.value.indexOf(orientation) >= 0);
}

function is_valid_status(status)
{
	return (user_struct.single.status.value.indexOf(status) >= 0);
}

function is_boolean(bool)
{
	if (typeof bool != 'string')
		return (false);

	bool = bool.toString().toLowerCase();
	return (bool === 'true' || bool === 'false')
}

function check_user_field_data(user, required_fields)
{
	let  min_len = 4,
			required_fields_len = required_fields.length,
			key;

	for (key in user)
	{
		if (user.hasOwnProperty(key))
		{
			switch (key)
			{
				case 'id':
					if (!is_valid_db_id(user[key]))
						return (false);
					break;
				case 'first_name':
				case 'last_name':
				case 'login':
				case 'password':
					if (user[key].length < min_len)
						return (false);
					break;
				case 'age':
					if (!is_major(user[key]))
						return (false);
					break;
				case 'email':
					if (!is_valid_email(user[key]))
						return (false);
					break;
				case 'gender':
					if (!is_valid_gender(user[key]))
						return (false);
					break;
				case 'orientation':
					if (!is_valid_orientation(user[key]))
						return (false);
					break;
				case 'status':
					if (!is_valid_status(user[key]))
						return (false);
					break;
				case 'is_lock':
						if (!is_boolean(user[key]))
							return (false);
						break;
				default:
					break;
			}
			required_fields_len--;
		}
	}
	return (required_fields_len == 0);
}

function extract_data_and_exclude(struct, data, excludes)
{
	let keys = struct.all,
			keys_len = keys.length,
			r = {},
			tmp,
			i = 0;

	for (i; i < keys_len; i++)
		if (data.hasOwnProperty(keys[i]) &&  excludes.indexOf(keys[i]) < 0)
					r[keys[i]] = data[keys[i]];

	return r;
}

function exclude_data(struct, data, excludes)
{
	let keys = struct.all,
			keys_len = keys.length,
			r = {},
			tmp,
			i = 0;

	for (i; i < keys_len; i++)
	{
		if (excludes.indexOf(keys[i]) < 0)
		{
			if (struct.single.hasOwnProperty(keys[i]) && (tmp = struct.single[keys[i]].default) !== undefined)
				r[keys[i]] = data[keys[i]] || tmp;
			else
				r[keys[i]] = data[keys[i]];
		}
	}
	return r;
}

module.exports =
{
	is_major: is_major,

	is_valid_email: is_valid_email,

	is_valid_db_id:	is_valid_db_id,

	exclude_data: exclude_data,

	extract_data_and_exclude: extract_data_and_exclude,

	is_new_user_valid: (user) =>
	{
		let required_fields = ['first_name', 'last_name', 'login', 'password', 'email', 'age', 'nb_image', 'profile_image', 'gender', 'orientation', 'bio', 'status', 'is_lock', 'reset_pass'];

		return (check_user_field_data(user, required_fields));
	},

	is_update_user_valid: (user) =>
	{
		let required_fields = Object.keys(user);

		if (required_fields.length < 2 || required_fields.indexOf('login') < 0)
			return (false);

		return (check_user_field_data(user, required_fields));
	}
}
