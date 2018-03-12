'USE STRICT'


module.exports =
{
  all: ['id', 'first_name', 'last_name', 'login', 'password', 'email', 'age', 'nb_image', 'profile_image', 'gender', 'orientation', 'bio', 'status', 'is_lock', 'reset_pass'],

  single:
  {
    gender:         {value: ['female', 'male', 'other'], default: 'female'},
    orientation:    {value: ['heterosexual','bisexual','homosexual'], default: 'bisexual'},
    nb_image:       {default: 0},
    profile_image:  {default: null},
    bio:            {default: ''},
    status:         {value: ['online','offline'], default: 'offline'},
    is_lock:        {default: 'false'},
    reset_pass:     {default: null}
  }
}
