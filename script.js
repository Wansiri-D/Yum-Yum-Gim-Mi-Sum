import { getMenu, getReceipt } from "./api.js";
import { renderMenu, updateNotification } from "./menu.js";
import { renderCart, cart, cartToSend } from "./cart.js";
import { renderReceipt } from "./receipt.js";

const cartButtons = document.querySelectorAll(".cart-button");
const menuSection = document.querySelector(".menu");
const cartSection = document.querySelector(".cart");
const receiptSection = document.querySelector(".receipt");
const cartItems = document.querySelector(".cart-items");

const allSections = document.querySelectorAll("section");

renderMenu(await getMenu());

cartButtons.forEach((button) => {
    button.addEventListener("click", () => {
        cartItems.innerHTML = "";
        renderCart(cart, cartToSend);
        toggleCart();
    });
});

function toggleCart() {
    menuSection.classList.toggle("hidden");
    cartSection.classList.toggle("hidden");
    updateNotification();
}

function resetToStart() {
    cart.length = 0;
    cartToSend.length = 0;
    hideAll();
    menuSection.classList.remove("hidden");
    updateNotification();
}

async function showReceipt(orderId) {
    hideAll();
    receiptSection.classList.remove("hidden");
    renderReceipt(await getReceipt(orderId));
}

export { resetToStart, showReceipt };

export function hideAll() {
    allSections.forEach((section) => section.classList.add("hidden"));
}
