import { products } from './products.js';

const productsContainer = document.getElementById('products-container');
const cartContainer = document.getElementById('cart-container');
const cartItemCounter = document.getElementById('cart-item-counter');

// Hämta vår sparade "cart" eller en tom array om den inte existerar
const cartFromLS = JSON.parse(localStorage.getItem('savedCart')) || [];

// Renderar produkterna man kan köpa
function renderProducts() {
  updateCartCounter();

  // Loopa igenom varje produkt och skapa ett HTML-element för varje produkt
  products.map((product) => {
    // Skapa produkt korten
    const productDiv = document.createElement('div');
    const productName = document.createElement('h3');
    const productPrice = document.createElement('p');
    const productImg = document.createElement('img');
    const productBtn = document.createElement('button');
    const productDescription = document.createElement('div');

    // Klasser för produktens HTML-element
    productDiv.className = 'product-div';
    productPrice.className = 'product-price';
    productBtn.className = 'product-btn';
    productDescription.className = 'product-description';
    productImg.classList.add('product-img');

    productDiv.appendChild(productImg);
    productDiv.appendChild(productName);
    productDiv.appendChild(productPrice);
    productDiv.appendChild(productBtn);
    productDiv.appendChild(productDescription);
    productsContainer.appendChild(productDiv);

    // Sätt text och attribut för varje produkt
    productName.innerText = product.name;
    productPrice.innerText = product.price.toLocaleString('sv-SE', {
      style: 'currency',
      currency: 'SEK',
    });
    productImg.src = product.imgUrl;
    productBtn.innerText = 'Köp';
    productDescription.innerHTML = `<p>${product.description}</p>`;

    // Event listener för att lägga till produkten i varukorgen vid klick
    productBtn.addEventListener('click', function () {
      addProduct(product.id);
    });

    // Visa produktbeskrivningen när musen är över produkten
    productDiv.addEventListener('mouseenter', function () {
      productDescription.style.display = 'block';
    });

    // Dölj produktbeskrivningen när musen lämnar produkten
    productDiv.addEventListener('mouseleave', function () {
      productDescription.style.display = 'none';
    });
  });
}

// Updaterar antal varor i varukorgen
function updateCartCounter() {
  // Kalkylerar total summan
  const totalCartItems = cartFromLS.reduce((total, cartItem) => total + cartItem.quantity, 0);
  cartItemCounter.innerText = totalCartItems.toString();
}

// Lägg till en produkt i varukorgen baserat på produktens id
function addProduct(idFromBtn) {
  const foundItem = products.find((product) => product.id === idFromBtn);
  const foundCartItem = cartFromLS.find((product) => product.id === idFromBtn);

  // Om produkten redan finns i varukorgen, öka dess kvantitet, annars lägg till den i varukorgen
  if (foundCartItem) {
    foundCartItem.quantity++;
  } else {
    cartFromLS.push(foundItem);
  }

  // Uppdatera antalet varor i varukorgen
  updateCartCounter();

  // Spara den uppdaterade varukorgen i localStorage
  localStorage.setItem('savedCart', JSON.stringify(cartFromLS));
}

// Ta bort en produkt från varukorgen baserat på produktens id
function decreaseProductFromCart(id) {
  // Hitta indexet för produkten i varukorgen
  const productIndex = cartFromLS.findIndex((product) => product.id === id);

  if (productIndex > -1) {
    // Minska kvantiteten om den är större än 1, annars ta bort produkten från varukorgen
    if (cartFromLS[productIndex].quantity > 1) {
      cartFromLS[productIndex].quantity -= 1;
    } else {
      cartFromLS.splice(productIndex, 1);
    }
    // Uppdatera varukorgen som sparas
    localStorage.setItem('savedCart', JSON.stringify(cartFromLS));
    renderCart();
  }
}

// Raderar första barnet i varukorgen
function clearProduct(item) {
  while (item.firstChild) {
    item.removeChild(item.firstChild);
  }
}

// Renderar varukorgen
function renderCart() {
  // Rensa innehållet i varukorgen
  clearProduct(cartContainer);

  const cartTitle = document.createElement('h2');
  cartTitle.innerText = 'Din varukorg';
  cartTitle.className = 'cartTitle';
  cartContainer.appendChild(cartTitle);

  // Tabell för varukorgen
  const table = document.createElement('table');
  const tableHead = document.createElement('thead');
  const tableBody = document.createElement('tbody');
  table.appendChild(tableHead);
  table.appendChild(tableBody);

  // Rad för tabellens rubrik
  const headerRow = document.createElement('tr');
  const tableRows = ['', 'Produkt', 'Pris', 'Delsumma', ''];

  // Skapa tabellrubrikerna
  tableRows.forEach((text) => {
    const th = document.createElement('th');
    th.innerText = text;
    headerRow.appendChild(th);
  });

  tableHead.appendChild(headerRow);

  let totalSum = 0;

  // Loopa igenom varje produkt i varukorgen och skapa en rad i tabellen för varje produkt
  if (cartFromLS.length > 0) {
    cartFromLS.map((cartItem) => {
      const row = document.createElement('tr');

      // Produktbild
      const imgData = document.createElement('td');
      const image = document.createElement('img');
      image.className = 'imgCart';
      image.src = cartItem.imgUrl;
      imgData.appendChild(image);
      row.appendChild(imgData);

      // Produkt
      const cartProduct = document.createElement('td');
      cartProduct.innerText = cartItem.name;
      row.appendChild(cartProduct);

      // Produktpris
      const formattedPrice = document.createElement('td');
      row.appendChild(formattedPrice);

      // Delsumma
      const cartPartialSum = document.createElement('td');
      row.appendChild(cartPartialSum);

      // Delete-knapp utan funktion (ännu)
      const deleteProduct = document.createElement('td');
      const deleteBtn = document.createElement('i');
      deleteBtn.className = 'deleteBtn';
      deleteBtn.classList.add('fa-regular', 'fa-trash-can');
      deleteBtn.onclick = function () {
        decreaseProductFromCart(cartItem.id);
      };

      deleteProduct.appendChild(deleteBtn);
      row.appendChild(deleteProduct);

      // Kalkylerar delsumma för enskilda produkter
      const partialSum = cartItem.price * cartItem.quantity;
      totalSum += partialSum;

      // Formaterar valutan till svenska
      formattedPrice.innerText = cartItem.price.toLocaleString('sv-SE', {
        style: 'currency',
        currency: 'SEK',
      });

      // cartProduct.innerText = cartItem.name;
      cartPartialSum.innerText = ` ${formattedPrice.innerText} x ${cartItem.quantity} = ${partialSum.toLocaleString('sv-SE', {
        style: 'currency',
        currency: 'SEK',
      })}`;

      tableBody.appendChild(row);
    });

    cartContainer.appendChild(table);

    // Element för totalsumman
    const cartTotalSum = document.createElement('div');
    cartTotalSum.className = 'total';
    cartTotalSum.innerText = `Totalt: ${totalSum.toLocaleString('sv-SE', {
      style: 'currency',
      currency: 'SEK',
    })}`;
    cartContainer.appendChild(cartTotalSum);

    // Icke-fungerande knapp för betalning
    const payBtn = document.createElement('button');
    cartContainer.appendChild(payBtn);
    payBtn.innerText = 'Betala';
    payBtn.className = 'payBtn';

    // Tömmer saved cart från Local Stora
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
