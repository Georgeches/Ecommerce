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
let categories = document.querySelector('.categories').querySelectorAll('p')
let resultsDiv = document.querySelector('.results-list')

function updateCart(obj){
    
}

fetch(`https://my-json-server.typicode.com/Georgeches/electrommerce/smartphones`)
.then(res=>res.json())
.then(data => displayProducts(data))

fetch(`http://localhost:3000/cart`)
.then(res=>res.json())
.then(data => {            
    document.querySelector('.circle-cont').innerHTML = data.length

    document.querySelector('.la-shopping-cart').onclick = ()=>{
        let cartDiv = document.querySelector('.cart-list')
        while (cartDiv.firstChild) {
            cartDiv.removeChild(cartDiv.firstChild);
        }
            for(let i of data){
                let cart = document.createElement('li')
                cart.classList.add('cart')
                cart.innerHTML = `
                    <img src="${i.image}" alt="${i.name}" height="150">
                    <div class="cart-texts">
                        <p>${i.name}</p>
                        <p>Ksh. ${i.price}</p>
                        <div id="number_order" style="display: flex; align-items: center;">
                        </div>
                    </div>
                `
                let removeButton = document.createElement('button')
                removeButton.classList.add('remove-from-cart')
                removeButton.innerHTML = 'remove'
                cart.querySelector('div').appendChild(removeButton)

                removeButton.addEventListener('click', ()=>{
                    fetch(`http://localhost:3000/cart/${i.id}`,{
                        method: 'DELETE',
                        headers: {
                            "Content-Type": "application/json"
                        }
                    })
                    cart.remove()
                })
                cartDiv.appendChild(cart)
            }
    }
})

document.querySelector('#search-form').addEventListener('submit', (e)=>{
    e.preventDefault()
    while (resultsDiv.firstChild) {
        resultsDiv.removeChild(resultsDiv.firstChild);
    }
    let jsonArrays = ['Smartphones', 'Phone-accessories', 'Computers', 'Computer-accessories']
    for(let arr of jsonArrays){
        fetch(`https://my-json-server.typicode.com/Georgeches/electrommerce/${arr}`)
        .then(res=>res.json())
        .then((data) => {
            let searchedProduct = document.getElementById('search').value
            for(obj of data){
                let theSearch = searchedProduct.toLowerCase()
                let objLower = obj['name'].toLowerCase()
                if(objLower.search(theSearch) > -1){
                    let searchResult = document.createElement('li')
                    searchResult.classList.add('search-result')
                    searchResult.innerHTML = `
                        <img src="${obj.image}" alt="${obj.name}" height="150">
                        <div class="result-texts">
                            <p>${obj.name}</p>
                            <p>Ksh. ${obj.price}</p>
                        </div>
                    `
                    resultsDiv.appendChild(searchResult)
                }
            }
        })
    }
    
})

for(let i = 0; i<productsCategories.length; i++){
    productsCategories[i].addEventListener('click', ()=>{
        let categoryName = productsCategories[i].innerHTML
        fetch(`https://my-json-server.typicode.com/Georgeches/electrommerce/${categoryName}`)
        .then(res=>res.json())
        .then(data => displayProducts(data))
    })
}

for(let i = 0; i<categories.length; i++){
    categories[i].addEventListener('click', ()=>{
        let categoryName = categories[i].innerHTML
        fetch(`https://my-json-server.typicode.com/Georgeches/electrommerce/${categoryName}`)
        .then(res=>res.json())
        .then(data => displayProducts(data))
    })
}

function displayProducts(arr){
    while (productsDiv.firstChild) {
        productsDiv.removeChild(productsDiv.firstChild);
    }
    for(let obj of arr){ 
        let productDiv = document.createElement('div')
        productDiv.innerHTML = `
            <img src="${obj.image}"alt="${obj.name}" height="200">
            <p>${obj.name}</p>
            <p>Ksh. ${obj.price}</p>
        `
        productDiv.classList.add('product')
        productsDiv.appendChild(productDiv)
        let cartButton = document.createElement('button')
        cartButton.innerHTML = 'Add to cart'
        cartButton.addEventListener('click', (event) => {
            event.preventDefault()
            let newCart = {
                name: obj.name,
                price: obj.price,
                number_ordered: 1,
                image: obj.image
            }
            fetch(`http://localhost:3000/cart`,{
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify(newCart)
            })
            .then(res=>res.json())
            .then(update=>console.log(update))
            alert('successfully added to cart')
            location.reload()
        })
        productDiv.appendChild(cartButton)
    }
}
