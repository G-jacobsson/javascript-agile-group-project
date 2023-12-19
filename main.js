import { products } from './products.js';
const productsContainer = document.getElementById('products-container');
const cartContainer = document.getElementById('cart-container');

let cart = [];

function renderProducts() {
  products.map((product) => {
    const productDiv = document.createElement('div');
    const productName = document.createElement('h3');
    const productPrice = document.createElement('p');
    const productImg = document.createElement('img');
    const productBtn = document.createElement('button');

    productDiv.appendChild(productImg);
    productDiv.appendChild(productName);
    productDiv.appendChild(productPrice);
    productDiv.appendChild(productBtn);
    productsContainer.appendChild(productDiv);

    productName.innerText = product.name;
    productPrice.innerText = product.price;
    productImg.src = product.imgUrl;
    productImg.width = 200;
    productBtn.innerText = 'Buy';

    productBtn.addEventListener('click', function () {
      addProduct(product.id);
    });

    // productsContainer.innerHTML += `
    // <div>
    //   <h3>${product.name}</h3>
    //   <p>Pris: ${product.price}</p>
    //   <img src="${product.imgUrl}" alt="g" width="100px"/>
    //   <button onclick="addProduct(${product.id})">Add</button>
    // </div>`;
  });
}

function renderCart() {
  // Hämtar från LS och parsar tillbaka till array
  const getCart = JSON.parse(localStorage.getItem('savedCart'));
  let totalSum = 0;

  getCart.map((cartItem) => {
    const cartTitle = document.createElement('h2');
    const cartProduct = document.createElement('div');
    const cartPartialSum = document.createElement('p');
    const cartQuantity = document.createElement('p');
    const cartTotalSum = document.createElement('div');

    cartContainer.appendChild(cartTitle);
    cartContainer.appendChild(cartProduct);
    cartContainer.appendChild(cartPartialSum);
    cartContainer.appendChild(cartQuantity);
    cartContainer.appendChild(cartTotalSum);

    totalSum += cartItem.price;

    cartProduct.innerText = cartItem.name;
    cartPartialSum.innerText = cartItem.price;
    cartQuantity.innerText = cartItem.quantity;
    cartTotalSum.innerText = totalSum;
  });
}
if (cartContainer) {
  renderCart();
}

function addProduct(id) {
  const item = products.find((product) => product.id === id);
  cart.push(item);

  // Lägg till funktionalitet för kvantitet här

  console.log(`you added ${id}`);
  // updateCart();
  console.log(cart);

  // Sparar i LocalStorage och stringifierar
  // key=cart, value=JSON.stringify(cart)
  localStorage.setItem('savedCart', JSON.stringify(cart));
}

if (productsContainer) {
  renderProducts();
}

function updateCart() {
  cartContainer.innerHTML = '';
  cart.map((product) => {
    cartContainer.innerHTML += `Product: ${product.name} Price:${product.price}`;
  });
}
