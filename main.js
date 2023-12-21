import { products } from './products.js';

const productsContainer = document.getElementById('products-container');
const cartContainer = document.getElementById('cart-container');

// Get from localStorage and parse back to array || if 'savedCart' doesn't exist= empty array
const cartFromLS = JSON.parse(localStorage.getItem('savedCart')) || [];

function renderProducts() {
  products.map((product) => {
    // Product card
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
    productPrice.innerText = product.price.toLocaleString('sv-SE', {
      style: 'currency',
      currency: 'SEK',
    });
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

function addProduct(idFromBtn) {
  const foundItem = products.find((product) => product.id === idFromBtn);
  const foundCartItem = cartFromLS.find((product) => product.id === idFromBtn);

  if (foundCartItem) {
    foundCartItem.quantity++;
  } else {
    cartFromLS.push(foundItem);
  }

  // Saves updated cart in localStorage
  // key = choose a name to save
  // value = serializing because we can't save an object
  localStorage.setItem('savedCart', JSON.stringify(cartFromLS));
}

function renderCart() {
  let totalSum = 0;

  cartFromLS.map((cartItem) => {
    const cartTitle = document.createElement('h2');
    const cartProduct = document.createElement('div');
    const cartPartialSum = document.createElement('p');
    const cartQuantity = document.createElement('p');

    cartContainer.appendChild(cartTitle);
    cartContainer.appendChild(cartProduct);
    cartContainer.appendChild(cartPartialSum);
    cartContainer.appendChild(cartQuantity);

    // Calculate partial sum for separate items
    const partialSum = cartItem.price * cartItem.quantity;
    totalSum += partialSum;

    // Format the price as Swedish currency
    const formattedPrice = cartItem.price.toLocaleString('sv-SE', {
      style: 'currency',
      currency: 'SEK',
    });

    cartProduct.innerText = cartItem.name;
    cartPartialSum.innerText = `Pris ${formattedPrice} x ${
      cartItem.quantity
    } = ${partialSum.toLocaleString('sv-SE', {
      style: 'currency',
      currency: 'SEK',
    })}`;
    // Commented out. Do we really need it?
    //    cartQuantity.innerText = `Antal ${cartItem.quantity}`;
  });

  // Element for the total sum
  const cartTotalSum = document.createElement('div');
  cartTotalSum.innerText = `Totalt: ${totalSum.toLocaleString('sv-SE', {
    style: 'currency',
    currency: 'SEK',
  })}`;
  cartContainer.appendChild(cartTotalSum);
}

if (productsContainer) {
  renderProducts();
}

if (cartContainer) {
  renderCart();
}
