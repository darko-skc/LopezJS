const game_recommendations = document.getElementById('game-recommendations')
const beta = document.getElementById('beta-box')
const total_price_box = document.getElementById('total-price-box')
const templates_recommendations_box = document.getElementById('template-recommendations-box').content
const template_beta_box = document.getElementById('template-beta-box').content
const template_price_box = document.getElementById('template-price-box').content




const fragments = document.createDocumentFragment()
let cart = {
    
}

/*Hacemos que primero se lea todo el DOM y luego lanzado la funcion ftechData*/
document.addEventListener('DOMContentLoaded', () => {
    fetchData();
    if(localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'))
        templates_cart_beta()
    }
})

game_recommendations.addEventListener('click', (e) => {
    cart_button(e)
})

const fetchData = async () => {
    try {
        const res = await fetch("api.json")
        const data = await res.json()
        templates_recommendations(data)
    } catch (error) {
        console.log(error)
    }
}

/*creamos una funcion que nos ayude a agregar informacion a 
nuestro template de forma dinamica para mostrarlo en nuestro HTML*/
const templates_recommendations = (data) => {
    data.forEach((games) => {      
        templates_recommendations_box.querySelector('#game-recommendations--content--info--name').textContent = games.name
        templates_recommendations_box.querySelector('#game-recommendations--content--info--name--valoration').textContent = games.valoration
        templates_recommendations_box.querySelector('#game-recommendations-img').setAttribute('src',games.frontpage_img)
        templates_recommendations_box.querySelector('#game-recommendations--content--price--text').textContent = games.price_standard
        templates_recommendations_box.querySelector('.cart-buttom').dataset.id = games.id
        templates_recommendations_box.querySelector('.fa-basket-shopping').dataset.id = games.id

        const clone = templates_recommendations_box.cloneNode(true)
        fragments.appendChild(clone)
    })
    game_recommendations.appendChild(fragments)
}

const cart_button = (e) => {
    
    if(e.target.classList.contains('cart-buttom')){
        add_cart(e.target.parentElement.parentElement.parentElement)
    }
    e.stopPropagation()
}

const add_cart = game_info => {
    const add_game = {
        id: game_info.querySelector('.cart-buttom').dataset.id,
        name : game_info.querySelector('#game-recommendations--content--info--name').textContent,
        price : game_info.querySelector('#game-recommendations--content--price--text').textContent,
        valoration : game_info.querySelector('#game-recommendations--content--info--name--valoration').textContent,
        cantidad : 1,
    }
    if(cart.hasOwnProperty(add_game.id)){
        add_game.cantidad = cart[add_game.id].cantidad + 1
    }

    cart[add_game.id] = {...add_game}
    templates_cart_beta();
    templates_price_beta();
}

const templates_cart_beta = () =>{
    beta.innerHTML = ''
    Object.values(cart).forEach(game_cart =>{
        template_beta_box.querySelector('#beta-cart-box--name').textContent = game_cart.name
        template_beta_box.querySelector('#beta-cart-box--amount').textContent = game_cart.cantidad
        template_beta_box.querySelector('#beta-cart-box--price').textContent = game_cart.price * game_cart.cantidad
        

        const clone = template_beta_box.cloneNode(true)
        fragments.appendChild(clone)
        
    })
    beta.appendChild(fragments)

    localStorage.setItem('cart', JSON.stringify(cart))
}


const templates_price_beta = () =>{
    const total_price = Object.values(cart).reduce((acc, {cantidad, price}) => acc + cantidad * price,0)
    console.log(total_price)
    template_price_box.querySelector('#beta-price').textContent = total_price
    fragments.appendChild(template_price_box)
    total_price_box.appendChild(fragments)
}
