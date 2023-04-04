fetch('https://my-json-server.typicode.com/Georgeches/Ecommerce/smartphones')
.then(res=>res.json())
.then(data=> console.log(data))