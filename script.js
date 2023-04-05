let productsDiv = document.querySelector('.products')
let productsNav = document.querySelector('.products-nav')
let productsCategories = document.querySelectorAll('.category')

for(let i = 0; i<productsCategories.length; i++){
    productsCategories[i].addEventListener('click', ()=>{
        let categoryName = productsCategories[i].innerHTML
        fetch(`https://my-json-server.typicode.com/Georgeches/Ecommerce/${categoryName}`)
        .then(res=>res.json())
        .then(data => displayProducts(data))
    })
}

function displayProducts(arr){
    for(let obj of arr){ 
        let product = document.createElement('li')
        product.innerHTML = `
            <img src="${obj.image}"alt="${obj.name}" height="200">
            <div class="product-texts">
                <p>${obj.name}</p>
                <p>${obj.price}</p>
                <button class="add-to-cart">Add to cart</button>
            </div>
        `
        productsDiv.appendChild(product)
    }
}