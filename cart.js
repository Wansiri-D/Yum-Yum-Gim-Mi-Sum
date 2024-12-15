import { sendCart } from "./api.js";
import { renderEta } from "./eta.js";

const cartSection = document.querySelector(".cart");
const etaSection = document.querySelector(".eta");
const cartItems = document.querySelector(".cart-items");
const cartSum = document.querySelector("#cart-sum");
const buyButton = document.querySelector("#buy-button");

let cart = [];
let cartToSend = [];

export function renderCart(cart, cartToSend) {
    cartItems.innerHTML = "";
    let total = [];
    cart.forEach((item) => {
        const itemContainer = document.createElement("div");
        const itemTilteContainer = document.createElement("div");
        const itemTitle = document.createElement("h3");
        const itemPrice = document.createElement("h3");
        const dotBox = document.createElement("div");
        const quantityContainer = document.createElement("div");
        const plusButton = document.createElement("button");
        const minusButton = document.createElement("button");
        const quantity = document.createElement("p");

        dotBox.classList.add("dot-box");
        itemContainer.classList.add("item-container");
        quantity.classList.add("quantity");
        plusButton.classList.add("quantity-buttons");
        minusButton.classList.add("quantity-buttons");

        itemTitle.innerText = item.name.toUpperCase();
        itemPrice.innerText = item.price * item.quantity + " SEK";
        plusButton.innerText = "+";
        minusButton.innerText = "-";
        quantity.innerText = item.quantity + " stycken";
        total.push(item.price * item.quantity);

        cartItems.append(itemContainer);
        itemContainer.append(itemTilteContainer, quantityContainer);
        itemTilteContainer.append(itemTitle, dotBox, itemPrice);
        quantityContainer.append(plusButton, quantity, minusButton);

        plusButton.addEventListener("click", () => plusItem(item));
        minusButton.addEventListener("click", () => removeItem(item));
    });

    if (cartToSend.length === 0) {
        buyButton.classList.add("empty");
    } else {
        buyButton.classList.remove("empty");
    }

    cartSum.innerText = total.reduce((a, b) => a + b, 0) + " SEK";
}

function removeItem(item) {
    const index = cartToSend.indexOf(item.id);
    const cartIndex = cart.indexOf(item);
    if (item.quantity > 1) {
        item.quantity--;
        cartToSend.splice(index, 1);
    } else {
        cartToSend.splice(index, 1);
        cart.splice(cartIndex, 1);
    }
    renderCart(cart, cartToSend);
    console.log(cart, cartToSend);
}

function plusItem(item) {
    item.quantity++;
    cartToSend.push(item.id);
    renderCart(cart, cartToSend);
    console.log(cart, cartToSend);
}

buyButton.addEventListener("click", async () => {
    if (cartToSend.length === 0) {
        console.log("listan är tom");
    } else {
        const order = await sendCart(cartToSend);
        renderEta(order);
        etaSection.classList.toggle("hidden");
        cartSection.classList.add("hidden");
    }
});

export { cart, cartToSend };
