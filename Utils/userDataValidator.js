'use strict'

module.exports =
{
	tokenazableUser: (user)=>
	{
		if (user)
			delete user.id;
		return (user);
	}
}
