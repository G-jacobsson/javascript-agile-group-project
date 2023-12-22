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
  const cartTitle = document.createElement('h2');
  cartTitle.innerText = 'Din varukorg';
  cartContainer.appendChild(cartTitle);

  const table = document.createElement('table');
  const tableHead = document.createElement('thead');
  const tableBody = document.createElement('tbody');
  table.appendChild(tableHead);
  table.appendChild(tableBody);

  const headerRow = document.createElement('tr');
  ['Produkt', 'Pris', 'Antal', 'Delsumma'].forEach((text) => {
    const th = document.createElement('th');
    this.innerText = text;
    headerRow.appendChild(th);
  });

  tableHead.appendChild(headerRow);

  let totalSum = 0;

  if (cartFromLS.length > 0) {
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

    // Mock button for payment
    const payBtn = document.createElement('button');
    cartContainer.appendChild(payBtn);
    payBtn.innerText = 'Betala';

    // Empties savedcart from LS
    payBtn.addEventListener('click', function () {
      localStorage.removeItem('savedCart');
      cartContainer.innerHTML = '<p>Tack för din beställning!</p>';
    });
  } else {
    cartContainer.innerHTML = '<p>Din varukorg är tom.</p>';
  }
  cartFromLS.map((cartItem) => {
    // const cartTitle = document.createElement('h2');
    // const cartProduct = document.createElement('div');
    // const cartPartialSum = document.createElement('p');
    // const cartQuantity = document.createElement('p');
    // const cartTotalSum = document.createElement('div');
    // cartContainer.appendChild(cartTitle);
    // cartContainer.appendChild(cartProduct);
    // cartContainer.appendChild(cartPartialSum);
    // cartContainer.appendChild(cartQuantity);
    // cartContainer.appendChild(cartTotalSum);
    // totalSum += cartItem.price;
    // cartProduct.innerText = cartItem.name;
    // cartPartialSum.innerText = 'price ' + cartItem.price;
    // cartQuantity.innerText = `Quantity ${cartItem.quantity}`;
    // cartTotalSum.innerText = totalSum;
  });

  cartContainer.appendChild(table);
}

if (productsContainer) {
  renderProducts();
}

if (cartContainer) {
  renderCart();
}
