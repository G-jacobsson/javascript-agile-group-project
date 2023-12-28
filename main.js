import { products } from './products.js';

const productsContainer = document.getElementById('products-container');
const cartContainer = document.getElementById('cart-container');
const cartItemCounter = document.getElementById('cart-item-counter');

// Get from localStorage and parse back to array || if 'savedCart' doesn't exist= empty array
const cartFromLS = JSON.parse(localStorage.getItem('savedCart')) || [];

// Render the products page
function renderProducts() {
  updateCartCounter();

  products.map((product) => {
    // Product card
    const productDiv = document.createElement('div');
    const productName = document.createElement('h3');
    const productPrice = document.createElement('p');
    const productImg = document.createElement('img');
    const productBtn = document.createElement('button');
    const productDescription = document.createElement('div');

    productDiv.appendChild(productImg);
    productDiv.appendChild(productName);
    productDiv.appendChild(productPrice);
    productDiv.appendChild(productBtn);
    productDiv.appendChild(productDescription);
    productsContainer.appendChild(productDiv);

    productDiv.className = 'product-div';
    productPrice.className = 'product-price';
    productBtn.className = 'product-btn';
    productDescription.className = 'product-description';

    productName.innerText = product.name;
    productPrice.innerText = product.price.toLocaleString('sv-SE', {
      style: 'currency',
      currency: 'SEK',
    });
    productImg.src = product.imgUrl;
    productImg.width = 200;
    productImg.classList.add('product-img');
    productBtn.innerText = 'Köp';
    productDescription.innerHTML = `<p>${product.description}</p>`;


    productBtn.addEventListener('click', function () {
      addProduct(product.id);
    });

    productDiv.addEventListener('mouseenter', function () {
      productDescription.style.display = 'block';
    });

    productDiv.addEventListener('mouseleave', function () {
      productDescription.style.display = 'none';
    });

  });
}
function updateCartCounter(){

  // Calculate the total quantity of all items in the cart
  const totalCartItems = cartFromLS.reduce((total, cartItem) => total + cartItem.quantity,0);

  // Update the cart counter number
  cartItemCounter.innerText = totalCartItems.toString();}

function addProduct(idFromBtn) {
  const foundItem = products.find((product) => product.id === idFromBtn);
  const foundCartItem = cartFromLS.find((product) => product.id === idFromBtn);

  if (foundCartItem) {
    foundCartItem.quantity++;
  } else {
    cartFromLS.push(foundItem);
  }

  updateCartCounter();

  // Saves updated cart in localStorage
  localStorage.setItem('savedCart', JSON.stringify(cartFromLS));
}

// Delete product from cart
function decreaseProductFromCart(id) {
  const productIndex = cartFromLS.findIndex((product) => product.id === id);

  if (productIndex > -1) {
    if (cartFromLS[productIndex].quantity > 1) {
      cartFromLS[productIndex].quantity -= 1;
    } else {
      cartFromLS.splice(productIndex, 1);
    }
    localStorage.setItem('savedCart', JSON.stringify(cartFromLS));
    renderCart();
  }
}

function clearProduct(item) {
  while (item.firstChild) {
    item.removeChild(item.firstChild);
  }
}

function renderCart() {
  clearProduct(cartContainer);
  const cartTitle = document.createElement('h2');
  cartTitle.innerText = 'Din varukorg';
  cartTitle.className = 'cartTitle';
  cartContainer.appendChild(cartTitle);
  // Cart table
  const table = document.createElement('table');
  const tableHead = document.createElement('thead');
  const tableBody = document.createElement('tbody');
  table.appendChild(tableHead);
  table.appendChild(tableBody);

  const headerRow = document.createElement('tr');
  const tableRows = ['', 'Produkt', 'Pris', 'Delsumma', ''];
  
  tableRows.forEach((text) => {
    const th = document.createElement('th');
    th.innerText = text;
    headerRow.appendChild(th);
  });

  tableHead.appendChild(headerRow);

  let totalSum = 0;

  if (cartFromLS.length > 0) {
    cartFromLS.map((cartItem) => {
      const row = document.createElement('tr');

      // Product image
      const imgData = document.createElement('td');
      const image = document.createElement('img');
      image.className ='imgCart';
      image.src = cartItem.imgUrl;
      imgData.appendChild(image);
      row.appendChild(imgData);

      // Product
      const cartProduct = document.createElement('td');
      cartProduct.innerText = cartItem.name;
      row.appendChild(cartProduct);

      // Product price
      const formattedPrice = document.createElement('td');
      row.appendChild(formattedPrice);

      // Partial sum
      const cartPartialSum = document.createElement('td');
      row.appendChild(cartPartialSum);

      // Delete button with no functionality yet
      const deleteProduct = document.createElement('td');
      const deleteBtn = document.createElement('i');
      deleteBtn.className = 'deleteBtn';
      deleteBtn.classList.add('fa-regular', 'fa-trash-can');
      deleteBtn.onclick = function () {
        decreaseProductFromCart(cartItem.id);
      };

      deleteProduct.appendChild(deleteBtn);
      row.appendChild(deleteProduct);

      // Calculate partial sum for separate items
      const partialSum = cartItem.price * cartItem.quantity;
      totalSum += partialSum;

      // Format the price as Swedish currency
      formattedPrice.innerText = cartItem.price.toLocaleString('sv-SE', {
        style: 'currency',
        currency: 'SEK',
      });

      // cartProduct.innerText = cartItem.name;
      cartPartialSum.innerText = ` ${formattedPrice.innerText} x ${
        cartItem.quantity
      } = ${partialSum.toLocaleString('sv-SE', {
        style: 'currency',
        currency: 'SEK',
      })}`;
      // Commented out. Do we really need it?
      //    cartQuantity.innerText = `Antal ${cartItem.quantity}`;

      tableBody.appendChild(row);
    });

    cartContainer.appendChild(table);

    // Element for the total sum
    const cartTotalSum = document.createElement('div');
    cartTotalSum.className ='total'
    cartTotalSum.innerText = `Totalt: ${totalSum.toLocaleString('sv-SE', {
      style: 'currency',
      currency: 'SEK',
    })}`;
    cartContainer.appendChild(cartTotalSum);

    // Mock button for payment
    const payBtn = document.createElement('button');
    cartContainer.appendChild(payBtn);
    payBtn.innerText = 'Betala';
    payBtn.className = 'payBtn';

    // Empties savedcart from LS
    payBtn.addEventListener('click', function () {
      localStorage.removeItem('savedCart');
      cartContainer.innerHTML = '<p>Tack för din beställning!</p>';
    });
  } else {
    cartContainer.innerHTML = '<p>Din varukorg är tom.</p>';
  }
}

if (productsContainer) {
  renderProducts();
}

if (cartContainer) {
  renderCart();
}
