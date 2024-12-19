const KEY = "yum-BAPUdN5hTPLuk3iN";
const url = "https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/";
const ID = "b1on";
const namn = "Wansiri Dilokthiprat";

const menuWontons = document.querySelector(".wontons");
const menuDips = document.querySelector(".dips");
const menuDrinks = document.querySelector(".drinks");
const notification = document.querySelector("#notification");

const cartSection = document.querySelector(".cart");
const etaSection = document.querySelector(".eta");
const cartItems = document.querySelector(".cart-items");
const cartSum = document.querySelector("#cart-sum");
const buyButton = document.querySelector("#buy-button");

const etaTime = document.querySelector("#eta-time");
const etaOrderId = document.querySelector("#eta-order-id");
const resetButtons = document.querySelectorAll(".reset-button");
const receiptButton = document.querySelector("#receipt-button");

const receiptItems = document.querySelector(".receipt-items");
const receiptSum = document.querySelector("#receipt-sum");
const receiptId = document.querySelector("#receipt-id");

const allSections = document.querySelectorAll("section");

let cart = [];
let cartToSend = [];
let orderID = "";

// Helper to handle errors
function handleError(message, error = null) {
    console.error(message, error || "");
}

// Fetch menu
async function getMenu() {
    const options = {
        method: "GET",
        headers: { "x-zocom": KEY },
    };

    try {
        const response = await fetch(`${url}menu`, options);
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        return data.items;
    } catch (error) {
        handleError("Failed to fetch menu.", error);
    }
}

// Send cart to API
async function sendCart(cart) {
    const bodyToSend = { items: cart };
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-zocom": KEY,
        },
        body: JSON.stringify(bodyToSend),
    };

    try {
        const response = await fetch(`${url}${ID}/orders`, options);
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        return data;
    } catch (error) {
        handleError("Failed to send cart.", error);
    }
}

// Get receipt
async function getReceipt(orderId) {
    const options = {
        method: "GET",
        headers: { "x-zocom": KEY },
    };

    try {
        const response = await fetch(`${url}receipts/${orderId}`, options);
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        return data.receipt;
    } catch (error) {
        handleError("Failed to fetch receipt.", error);
    }
}

// Hide all sections
export function hideAll() {
    allSections.forEach((section) => section.classList.add("hidden"));
}

// Render menu
export function renderMenu(menu) {
    if (!menuWontons || !menuDips || !menuDrinks) {
        handleError("Menu containers not found.");
        return;
    }

    const wontons = menu.filter((item) => item.type === "wonton");
    const dips = menu.filter((item) => item.type === "dip");
    const drinks = menu.filter((item) => item.type === "drink");

    // Render wontons
    wontons.forEach((wonton) => {
        const container = document.createElement("div");
        container.classList.add("dish-container");

        container.innerHTML = `
            <div>
                <h3>${wonton.name.toUpperCase()}</h3>
                <div class="dot-box"></div>
                <h3>${wonton.price} SEK</h3>
            </div>
            <p>${wonton.ingredients.join(", ")}</p>
        `;

        menuWontons.append(container);

        container.addEventListener("click", () => addToCart(wonton, container));
    });

    // Render dips
    renderCategory(menuDips, dips, "DIPSÅS");

    // Render drinks
    renderCategory(menuDrinks, drinks, "DRICKA");
}

function renderCategory(container, items, title) {
    if (!container) {
        handleError(`Container for ${title} not found.`);
        return;
    }

    const itemContainer = document.createElement("div");
    itemContainer.classList.add("dish-container");
    itemContainer.innerHTML = `
        <div>
            <h3>${title}</h3>
            <div class="dot-box"></div>
            <h3>${items[0]?.price || "N/A"} SEK</h3>
        </div>
        <div class="flavour-container"></div>
    `;

    const flavourContainer = itemContainer.querySelector(".flavour-container");

    items.forEach((item) => {
        const name = document.createElement("p");
        name.innerText = item.name;
        flavourContainer.append(name);

        name.addEventListener("click", () => addToCart(item, name));
    });

    container.append(itemContainer);
}

// Add item to cart
function addToCart(item, element) {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...item, quantity: 1 });
        element.classList.add("chosen");
    }
    cartToSend.push(item.id);
    updateNotification();
}

// Update cart notification
export function updateNotification() {
    notification.innerText = cartToSend.length;
    notification.classList.toggle("hidden", cartToSend.length === 0);
}

// Render cart
export function renderCart(cart, cartToSend) {
    cartItems.innerHTML = "";
    let total = cart.reduce((sum, item) => {
        const itemContainer = createCartItem(item);
        cartItems.append(itemContainer);
        return sum + item.price * item.quantity;
    }, 0);

    cartSum.innerText = `${total} SEK`;
    buyButton.classList.toggle("empty", cartToSend.length === 0);
}

function createCartItem(item) {
    const container = document.createElement("div");
    container.classList.add("item-container");
    container.innerHTML = `
        <div>
            <h3>${item.name.toUpperCase()}</h3>
            <div class="dot-box"></div>
            <h3>${item.price * item.quantity} SEK</h3>
        </div>
        <div>
            <button class="quantity-buttons">+</button>
            <p class="quantity">${item.quantity} stycken</p>
            <button class="quantity-buttons">-</button>
        </div>
    `;

    const plusButton = container.querySelector("button:nth-child(1)");
    const minusButton = container.querySelector("button:nth-child(3)");

    plusButton.addEventListener("click", () => plusItem(item));
    minusButton.addEventListener("click", () => removeItem(item));

    return container;
}

// Adjust item quantity
function removeItem(item) {
    const index = cartToSend.indexOf(item.id);
    const cartIndex = cart.indexOf(item);

    if (item.quantity > 1) {
        item.quantity--;
    } else {
        cart.splice(cartIndex, 1);
    }

    cartToSend.splice(index, 1);
    renderCart(cart, cartToSend);
}

function plusItem(item) {
    item.quantity++;
    cartToSend.push(item.id);
    renderCart(cart, cartToSend);
}

// Buy button
buyButton.addEventListener("click", async () => {
    if (cartToSend.length === 0) {
        console.log("Cart is empty.");
        return;
    }

    const order = await sendCart(cartToSend);
    if (order) {
        renderEta(order);
        etaSection.classList.toggle("hidden");
        cartSection.classList.add("hidden");
    }
});

// Render ETA
export function renderEta(order) {
    const etaDate = new Date(order.order.eta);
    const timeStamp = new Date(order.order.timestamp);

    orderID = order.order.id;
    const timeLeft = Math.floor((etaDate - timeStamp) / (1000 * 60));

    etaTime.innerText = `ETA ${timeLeft} MIN`;
    etaOrderId.innerText = `#${orderID.toUpperCase()}`;
}

// Reset to start
resetButtons.forEach((button) => {
    button.addEventListener("click", () => {
        hideAll();
        // Reset logic here...
    });
});

// Receipt button
receiptButton.addEventListener("click", async () => {
    const receipt = await getReceipt(orderID);
    if (receipt) {
        renderReceipt(receipt);
    }
});

// Render receipt
export function renderReceipt(receipt) {
    receiptItems.innerHTML = "";

    let total = receipt.reduce((sum, item) => {
        const receiptRow = document.createElement("div");
        receiptRow.innerHTML = `
            <p>${item.quantity} x ${item.name}</p>
            <p>${item.price * item.quantity} SEK</p>
        `;
        receiptItems.append(receiptRow);
        return sum + item.price * item.quantity;
    }, 0);

    receiptSum.innerText = `${total} SEK`;
    receiptId.innerText = `#${orderID.toUpperCase()}`;
}
