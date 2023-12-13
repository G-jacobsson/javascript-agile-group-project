import { products } from './products.js';
const productsContainer = document.getElementById('products-container');

// hämta från en klass
const cartContainer = document.querySelector('.cart-container');

export let cart = [];

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

function addProduct(id) {
  const item = products.find((product) => product.id === id);
  cart.push(item);

  // Lägg till funktionalitet för kvantitet

  console.log(`you added ${id}`);
  // updateCart();
  console.log(cart);
}
renderProducts();
function updateCart() {
  cartContainer.innerHTML = '';
  cart.map((product) => {
    cartContainer.innerHTML += `Product: ${product.name} Price:${product.price}`;
  });
}
