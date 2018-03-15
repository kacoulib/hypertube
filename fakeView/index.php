<!DOCTYPE html>
<html>
  <head>
      <title>Fake view</title>
  </head>
  <body>

  <h1>My First Heading</h1>

  <p>My first paragraph.</p>

  <script type="text/javascript" src="./assets/js/axios.min.js"></script>
  <script type="text/javascript">
    (function()
    {
      axios({
        method:'get',
        url:'http://localhost:3000/',
        responseType:'stream'
      })
      .then((res)=>
      {
        console.group('Axios request test')
        console.log(res.data)
      })
      .catch((err)=>console.error(err))

    })()
  </script>
  </body>
</html>
