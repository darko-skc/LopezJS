/*Creamos constantes que contendran las etiquetas del DOM*/
const game_recommendations = document.getElementById('game-recommendations')
const beta = document.getElementById('beta-box')
const total_price_box = document.getElementById('total-price-box')
const templates_recommendations_box = document.getElementById('template-recommendations-box').content
const template_beta_box = document.getElementById('template-beta-box').content
const fragments = document.createDocumentFragment()
const game_on_sale = document.getElementById('game-on-sale')



/*Creamos una variable que contendra todos los productos agregados al carrito*/
let cart = {
}




/*Hacemos que primero se lea todo el DOM y luego lanzado la funcion ftechData*/
document.addEventListener('DOMContentLoaded', () => {
    fetchData();
    
    
    if(localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'))
        templates_cart_beta()
        templates_price_beta()
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
        template_game_on_sale(data)
    } catch (error) {
        console.log(error)
    }
}




/*creamos una funcion que nos ayude a agregar informacion a 
nuestro template de forma dinamica para mostrarlo en nuestro HTML*/
const templates_recommendations = (data) => {
    data.forEach((games) => {      
        templates_recommendations_box.querySelector('.game-recommendations--content--info--name').textContent = games.name
        templates_recommendations_box.querySelector('.game-recommendations--content--info--name--valoration').textContent = games.valoration
        templates_recommendations_box.querySelector('.game-recommendations-img').setAttribute('src',games.frontpage_img)
        templates_recommendations_box.querySelector('.game-recommendations--content--price--text').textContent = games.price_standard
        templates_recommendations_box.querySelector('.cart-buttom').dataset.id = games.id
        templates_recommendations_box.querySelector('.fa-basket-shopping').dataset.id = games.id

        const clone = templates_recommendations_box.cloneNode(true)
        fragments.appendChild(clone)
    })
    game_recommendations.appendChild(fragments)
}





const cart_button = (e) => {
    
    /*if(e.target.classList.contains('cart-buttom')){
        add_cart(e.target.parentElement.parentElement.parentElement)
    }
    e.stopPropagation()*/

    /*Optimizamos el if con una condicinal de variable*/
    e.target.classList.contains('cart-buttom') ? add_cart(e.target.parentElement.parentElement.parentElement) : e.stopPropagation()
}




const add_cart = game_info => {
    const add_game = {
        id: game_info.querySelector('#game-cart-buttom').dataset.id,
        name : game_info.querySelector('#game-cart-name').textContent,
        price : game_info.querySelector('#game-cart-price').textContent,
        valoration : game_info.querySelector('#game-cart-valoration').textContent,
        cantidad : 1,
    }

    /* Una condicional if que verfica si el videojuego ya se encuentra agreado en el carrito, si es asi la cantidad aumenta en uno.
    if(cart.hasOwnProperty(add_game.id)){
        add_game.cantidad = cart[add_game.id].cantidad + 1
    }*/

    /*Una condicinal con AND que verfica si el videojuego ya se encuentra agreado en el carrito, si es asi la cantidad aumenta en uno.*/
    cart.hasOwnProperty(add_game.id) && (add_game.cantidad = cart[add_game.id].cantidad + 1)

    /*Usamos spread para que carrito en su propiedad "id" va a ser una copia de add_game*/
    cart[add_game.id] = {...add_game}

    
    const Toast = Swal.mixin({
        toast: false,
        position: 'top',
        showConfirmButton: false,
        timer: 2000,
        background : '#545454',
        color : '#fff',
    })
      
    Toast.fire({
        icon: 'success',
        title: 'Su producto fue agregado al carrito'
    })

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
    total_price_box.innerHTML = ""
    const total_price = Object.values(cart).reduce((acc, {cantidad, price}) => acc + cantidad * price,0)
    console.log(total_price)

    const total_price_title = document.createElement('span')
    total_price_title.textContent = "Total"

    const total_price_show = document.createElement('span')
    total_price_show.textContent = total_price
    /*template_price_box.querySelector('#beta-price').textContent = 'hola'*/
    
    total_price_box.appendChild(total_price_title)
    total_price_box.appendChild(total_price_show)
}




const template_game_on_sale = (data) =>{
    console.log(data[0])

    game_on_sale.querySelector(".game_on_sale_price").textContent = data[0].price_standard
    
    let game_on_sale_version = document.querySelector(".game-on-sale__version")
    game_on_sale_version.onchange = function () {
        switch(game_on_sale_version.value){
            case 'standard':
                game_on_sale.querySelector(".game_on_sale_price").textContent = data[0].price_standard
                break;
            case 'gold':
                game_on_sale.querySelector(".game_on_sale_price").textContent = data[0].price_gold
                break;
            case 'ultimate':
                game_on_sale.querySelector(".game_on_sale_price").textContent = data[0].price_ultimate
                break;
        }
    }

    game_on_sale.querySelector(".game_on_sale_name").textContent = data[0].name
    game_on_sale.querySelector(".game_on_sale_valoration").textContent = data[0].valoration
    game_on_sale.querySelector(".buttom-on-sale").dataset.id = data[0].id
    game_on_sale.querySelector(".fa-basket-shopping").dataset.id = data[0].id
}

game_on_sale.addEventListener('click', (e) => {
    cart_button(e)
})