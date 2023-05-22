// Get elements
const cartButton = document.querySelector(".cart-button");
const cartBadge = document.querySelector(".cart-badge");
const modal = document.querySelector(".modal");
const modalClose = document.querySelector(".close");
const buyButton = document.querySelector(".buy-btn");
const cartItemsList = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const itemsGrid = document.querySelector(".items-grid");
const modalCart = document.querySelector(".modal-cart");
const closeBtn = document.querySelector(".close-btn");
const emptyCartMsg = document.querySelector(".empty-cart-msg");
const walletAmount = document.querySelector(".wallet-amount");
const notEnoughMoney = document.querySelector(".not-enough-money");
let cart = [];
let wallet = 100;
// An example function that creates HTML elements using the DOM.
function fillItemsGrid() {
  for (const item of items) {
    let itemElement = document.createElement("div");
    itemElement.classList.add("item");
    itemElement.innerHTML = `
            <img src="https://picsum.photos/200/300?random=${item.id}" alt="${item.name}">
            <h2>${item.name}</h2>
            <p>$${item.price}</p>
            <button class="add-to-cart-btn" data-id="${item.id}">Add to cart</button>
        `;
    itemsGrid.appendChild(itemElement);
  }
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");

  addToCartButtons.forEach((button) => {
    //get the id from the data-id attribute
    let itemid = button.getAttribute("data-id");
    button.addEventListener("click", () => addToCart(itemid));
  });
}

// Adding the .show-modal class to an element will make it visible
// because it has the CSS property display: block; (which overrides display: none;)
// See the CSS file for more details.
function toggleModal() {
  modal.classList.toggle("show-modal");
}

// Call fillItemsGrid function when page loads
fillItemsGrid();

// Example of DOM methods for adding event handling
cartButton.addEventListener("click", toggleModal);
modalClose.addEventListener("click", toggleModal);

function addToCart(id) {
  // Find the item in the items array
  let item = items.find((item) => item.id == id);
  cart.push(item);
  cartBadge.innerText = cart.length;
  updateCartItemsList();
  updateCartTotal();
}
function updateCartItemsList() {

  cartItemsList.innerHTML = "";
  for (const item of cart) {
    let itemElement = document.createElement("div");
    itemElement.classList.add("cart-item");
    itemElement.innerHTML = `
            <h2>${item.name}</h2>
            <p>$${item.price}</p>
            <button class="remove-from-cart-btn" data-id="${item.id}">Remove</button>
        `;
    cartItemsList.appendChild(itemElement);
  }
  const removeFromCartButton = document.querySelectorAll(
    ".remove-from-cart-btn"
  );

  removeFromCartButton.forEach((button) => {
    let itemid = button.getAttribute("data-id");
    button.addEventListener("click", () => removeFromCart(itemid));
  });
}
function calculateTotal() {
  let total = 0;
  for (const item of cart) {
    total += item.price;
  }
  return total;
}

function updateCartTotal() {
  let totalPrice = calculateTotal();
  cartTotal.innerText = totalPrice.toFixed(2);
}

function removeFromCart(id) {
  let index = cart.findIndex((item) => item.id == id);
  cart.splice(index, 1);
  cartBadge.innerText = cart.length;
  updateCartItemsList();
  updateCartTotal();
}
const purchaseMessage = document.getElementById("purchase-message");

buyButton.addEventListener("click", () => {
  if (cart.length == 0) {
    emptyCartMsg.style.display = "block";

    setTimeout(() => {
      emptyCartMsg.style.display = "none"; 
    }, 3000);
    return;
  }
  
  if (wallet < calculateTotal()) {
    notEnoughMoney.style.display = "block"; 
    setTimeout(() => {
      notEnoughMoney.style.display = "none"; 
    }, 3000);
    return;
  }
  cart.forEach((item) => {
    wallet -= item.price;
  });
  walletAmount.innerText = wallet.toFixed(2);
  cart = [];

  cartBadge.innerText = cart.length;
  updateCartItemsList();
  updateCartTotal();
  modalCart.style.display = "none"; 
  purchaseMessage.style.display = "block"; 
});
closeBtn.addEventListener("click", () => {
  purchaseMessage.style.display = "none"; 
  toggleModal();
  modalCart.style.display = "block"; 
});

const sortButton = document.querySelector(".sort-button");
const dropdownContent = document.querySelector(".dropdown-content");
const currentSort = document.querySelector(".current-sort");

sortButton.addEventListener("click", function () {
  dropdownContent.classList.toggle("show");
});

dropdownContent.addEventListener("click", function (event) {
  if (event.target.tagName === "A") {
    const sortBy = event.target.getAttribute("data-sort");
    sortItems(sortBy);
    dropdownContent.classList.remove("show");
  }
});

function sortItems(sortBy) {
  if (sortBy === "a-z") {
    items.sort((a, b) => a.name.localeCompare(b.name));
    currentSort.innerHTML = `A-Z`;
  } else if (sortBy === "z-a") {
    items.sort((a, b) => b.name.localeCompare(a.name));
    currentSort.innerHTML = `Z-A`;
  } else if (sortBy === "price-low-to-high") {
    items.sort((a, b) => a.price - b.price);
    currentSort.innerHTML = "Low to High $";
  } else if (sortBy === "price-high-to-low") {
    items.sort((a, b) => b.price - a.price);
    currentSort.innerHTML = "High to Low $";
  }

  itemsGrid.innerHTML = "";

  fillItemsGrid();
}
