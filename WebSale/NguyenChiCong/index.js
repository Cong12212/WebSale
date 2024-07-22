let listProductFeatureHTML = document.querySelector('.listProductsFeature');
let listLastestProductHTML = document.querySelector('.listLastestProducts');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let body = document.querySelector('body');
let closeCart = document.querySelector('.closeCart');
let tabCard=document.querySelector('.cartTab');
let products = [];
let cart = [];
let btnCheckout=document.querySelector('.checkOut');

function findFeaturedProducts(products) {
    let featuredProducts = [];
    products.sort((a,b)=>b.sale-a.sale);
    featuredProducts=products.slice(0,8);
    return featuredProducts;
}

function findLastestProducts(products) {
    let lastestProducts = [];
    products.sort((a,b)=>b.date-a.date);
    lastestProducts=products.slice(0,4);
    return lastestProducts;
}

const tabCart = document.querySelector('.cartTab');

iconCart.addEventListener('click', () => {
    body.classList.add('showCart');
});

closeCart.addEventListener('click', () => {
    body.classList.remove('showCart');
});

btnCheckout.addEventListener('click',()=>{
    window.location.href="checkout.html";
});

document.addEventListener('click', (event) => {
    const isClickInsideCart = tabCard.contains(event.target)||iconCart.contains(event.target) ||event.target.classList.contains('minus')||event.target.classList.contains('plus');
    if (!isClickInsideCart) {
        body.classList.remove('showCart');
    }
});

    const addDataToHTML = () => {
        if(products.length > 0)
        {   
           
            let featuredProducts=findFeaturedProducts(products);
                featuredProducts.forEach(product => {
                let newProduct = document.createElement('div');
                newProduct.dataset.id = product.id;
                newProduct.classList.add('item');
                newProduct.innerHTML = 
                `<img src="${product.image}" alt="">
                <h2>${product.name}</h2>
                <div class="price">${product.price},000đ</div>
                <button class="addCart">Thêm vào giỏ hàng</button>`;
                listProductFeatureHTML.appendChild(newProduct);
            });}
            
            if(products.length > 0)
            {   
            
            let lastestProducts=findLastestProducts(products);
                lastestProducts.forEach(product => {
                let newProduct = document.createElement('div');
                newProduct.dataset.id = product.id;
                newProduct.classList.add('item');
                newProduct.innerHTML = 
                `<img src="${product.image}" alt="">
                <h2>${product.name}</h2>
                <div class="price">${product.price},000đ</div>
                <button class="addCart">Thêm vào giỏ hàng</button>`;
                listLastestProductHTML.appendChild(newProduct);
            });
        }
    }

    listProductFeatureHTML.addEventListener('click', (event) => {
        let positionClick = event.target;
        if(positionClick.classList.contains('addCart')){
            let id_product = positionClick.parentElement.dataset.id;
            addToCart(id_product);
        }
    })

    listLastestProductHTML.addEventListener('click', (event) => {
        let positionClick = event.target;
        if(positionClick.classList.contains('addCart')){
            let id_product = positionClick.parentElement.dataset.id;
            addToCart(id_product);
        }
    })

const addToCart = (product_id) => {
    let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);
    if(cart.length <= 0){
        cart = [{
            product_id: product_id,
            quantity: 1
        }];
    }else if(positionThisProductInCart < 0){
        cart.push({
            product_id: product_id,
            quantity: 1
        });
    }else{
        cart[positionThisProductInCart].quantity = cart[positionThisProductInCart].quantity + 1;
    }
    addCartToHTML();
    addCartToMemory();
}

const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
}

const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    if(cart.length > 0){
        cart.forEach(item => {
            totalQuantity = totalQuantity +  item.quantity;
            let newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.dataset.id = item.product_id;

            let positionProduct = products.findIndex((value) => value.id == item.product_id);
            let info = products[positionProduct];
            listCartHTML.appendChild(newItem);
            newItem.innerHTML = `
            <div class="image">
                    <img src="${info.image}">
                </div>
                <div class="name">
                ${info.name}
                </div>
                <div class="totalPrice">${info.price * item.quantity},000đ</div>
                <div class="quantity">
                    <span class="minus"><</span>
                    <span>${item.quantity}</span>
                    <span class="plus">></span>
                </div>
            `;
        })
    }
    if (iconCartSpan) {
        iconCartSpan.innerText = totalQuantity;
    } else {
        console.error("Phần tử iconCartSpan không tồn tại trong DOM.");
    }
}

listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus')){
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = 'minus';
        if(positionClick.classList.contains('plus')){
            type = 'plus';
        }
        changeQuantityCart(product_id, type);
    }
})

const changeQuantityCart = (product_id, type) => {
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);
    if(positionItemInCart >= 0){
        let info = cart[positionItemInCart];
        switch (type) {
            case 'plus':
                cart[positionItemInCart].quantity = cart[positionItemInCart].quantity + 1;
                break;
        
            default:
                let changeQuantity = cart[positionItemInCart].quantity - 1;
                if (changeQuantity > 0) {
                    cart[positionItemInCart].quantity = changeQuantity;
                }else{
                    cart.splice(positionItemInCart, 1);
                }
                break;
        }
    }
    addCartToHTML();
    addCartToMemory();
}

const initApp = () => {
    fetch('products.json')
    .then(response => response.json())
    .then(data => {
        products = data;
        addDataToHTML();

        if(localStorage.getItem('cart')){
            cart = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();
        }
    })
}
initApp();