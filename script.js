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
let jsonArrays = ['Smartphones', 'Phone-accessories', 'Computers', 'Computer-accessories']
let createUserForm = document.querySelector('.create-user-form')
let loginForm = document.querySelector('.login-form')

let loggedInUser = {
    username: ''
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

        let total_price = 0

        for(let i of data){

            total_price += i.price*i.number_ordered
            document.querySelector('.show-total').innerHTML = total_price   

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
            if(loggedInUser.name = ''){
                alert('please log in first')
            }
            else{
                let newCart = {
                    name: obj.name,
                    price: obj.price,
                    number_ordered: 1,
                    image: obj.image,
                    user: loggedInUser.name
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
            }
            
        })
        productDiv.appendChild(cartButton)
    }
}

function createUser(){
    let newUser = {
        username: document.querySelector("#username").value,
        password: document.querySelector("#password").value,
        email: document.querySelector("#email").value
    }

    fetch(`http://localhost:3000/Users`,{
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify(newUser)
    })
    .then(res=>res.json())
    .then(update=>console.log(update))

    alert('Account created. You can now log in')
}

function login(){
    let userName = document.querySelector('#login-username').value
    let userPassword = document.querySelector('#login-password').value
    fetch(`http://localhost:3000/Users`)
    .then(res=>res.json())
    .then(users => {
        for(let user of users){
            if(user.username == userName && user.password == userPassword){
                loggedInUser.username = user.username
            }
        }
        if(loggedInUser.name == ''){
            alert('username or password is not correct')
        }
        else{
            alert('You are now logged in')
        }
    })
}

createUserForm.addEventListener('submit', (event)=>{
    event.preventDefault()
    createUser()
    createUserForm.reset()
})

loginForm.addEventListener('submit', (event)=>{
    event.preventDefault()
    login()
    loginForm.reset()
})