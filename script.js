fetch('https://my-json-server.typicode.com/Georgeches/Ecommerce/bestselling')
.then(res=>res.json())
.then(data=> console.log(data))