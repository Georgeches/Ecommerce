document.addEventListener('DOMContentLoaded', ()=>{
    document.querySelector('.navbar').style.width = (screen.width + 50).toString()+'px'
    let hero_section = document.querySelector('.hero-section')
    let productsDiv = document.querySelector('.all-products')
    let discountDiv = document.querySelector('.discounts')
    hero_section.style.height = (screen.height - 180).toString()+'px'
    hero_section.style.width = (screen.width + 50).toString()+'px'
    productsDiv.style.width = (screen.width * 0.90).toString()+'px'
    discountDiv.style.width = (screen.width * 0.90).toString()+'px'
})

let productsDiv = document.querySelector('.products')
let productsNav = document.querySelector('.products-nav')
let productsCategories = document.querySelectorAll('.category')

function updateCart(obj){
    fetch(`https://my-json-server.typicode.com/Georgeches/Ecommerce/cart`,{
        method: 'POST',
        headers: {
            "Context-Type" : "application/json"
        },
        body: JSON.stringify(obj)
    })
    .then(res=>res.json())
    .then(update=>console.log(update))
}

fetch(`https://my-json-server.typicode.com/Georgeches/Ecommerce/smartphones`)
.then(res=>res.json())
.then(data => displayProducts(data))

for(let i = 0; i<productsCategories.length; i++){
    productsCategories[i].addEventListener('click', ()=>{
        let categoryName = productsCategories[i].innerHTML
        fetch(`https://my-json-server.typicode.com/Georgeches/Ecommerce/${categoryName}`)
        .then(res=>res.json())
        .then(data => displayProducts(data))
    })
}

function displayProducts(arr){
    while (productsDiv.firstChild) {
        productsDiv.removeChild(productsDiv.firstChild);
    }
    for(let obj of arr){ 
        productsDiv.innerHTML += `
            <div class="product">
                <img src="${obj.image}"alt="${obj.name}" height="200">
                <div class="product-texts">
                    <p>${obj.name}</p>
                    <p>${obj.price}</p>
                    <button class="add-to-cart">Add to cart</button>
                </div>
            </div>
        `
    }
}