document.addEventListener('DOMContentLoaded', ()=>{
    document.querySelector('.navbar').style.width = (screen.width + 50).toString()+'px'
    let hero_section = document.querySelector('.hero-section')
    let productsDiv = document.querySelector('.all-products')
    let discountDiv = document.querySelector('.discount')
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
let jsonArrays = ['Smartphones', 'Phone-accessories', 'Computers', 'Computer-accessories']

fetch(`https://my-json-server.typicode.com/Georgeches/electrommerce/smartphones`)
.then(res=>res.json())
.then(data => displayProducts(data))

fetch(`http://localhost:3000/cart`)
.then(res=>res.json())
.then(data => {    
    document.querySelector('.la-shopping-cart').onclick = ()=>{
        let cartDiv = document.querySelector('.cart-list')
            while (cartDiv.firstChild) {
                cartDiv.removeChild(cartDiv.firstChild);
            }
    
            let total_price = 0
            let dataLength = 0
            for(let i of data){
                    dataLength+=1
                    document.querySelector('.circle-cont').innerHTML = dataLength
                    total_price += i.price*i.number_ordered
                    document.querySelector('.show-total').innerHTML = 'Total :' + total_price   
                    
                    let cart = document.createElement('li')
                    cart.classList.add('cart')
                    cart.innerHTML = `
                        <img src="${i.image}" alt="${i.name}" height="150">
                        <div class="cart-texts">
                            <p>${i.name}</p>
                            <p>${i.number_ordered}</p>
                            <p>Total: Ksh. ${i.price * i.number_ordered}</p>
                            </div>
                        </div>
                    `
        
                    let updateButton = document.createElement('button')
                    updateButton.classList.add('remove-from-cart')
                    updateButton.innerHTML = 'update'
                    cart.querySelector('div').appendChild(updateButton)
        
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
        
                    updateButton.addEventListener('click', ()=>{
                        let numberOrdered = prompt(`Enter number of ${i.name} to order`)
                        if(numberOrdered == 0){
                            alert('number cannot be 0')
                        }
        
                        else{
                            i.number_ordered = numberOrdered
                            fetch(`http://localhost:3000/cart/${i.id}`,{
                                method: 'PATCH',
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify(i)
                            })
                            .then(res=>res.json())
                            .then(update=>console.log(update))
                            location.reload()
                        }
        
                            
                    })
                
            }
        }
    }
})

document.querySelector('#search-form').addEventListener('submit', (event)=>{
    event.preventDefault()
    while (resultsDiv.firstChild) {
        resultsDiv.removeChild(resultsDiv.firstChild);
    }
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
                    image: obj.image,
                    user: loggedInUser.username
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
                fetch(`http://localhost:3000/cart`)
                .then(res=>res.json())
                .then(data => {  
                    document.querySelector('.circle-cont').innerHTML = data.length
                })
            
        })
        productDiv.appendChild(cartButton)
    }
}
