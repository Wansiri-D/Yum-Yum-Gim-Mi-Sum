const receiptItems = document.querySelector(".receipt-items");
const receiptSum = document.querySelector("#receipt-sum");
const receiptId = document.querySelector("#receipt-id");

export function renderReceipt(receipt) {
    receiptItems.innerHTML = "";
    receipt.items.forEach((item) => {
        const itemContainer = document.createElement("div");
        const itemTilteContainer = document.createElement("div");
        const itemTitle = document.createElement("h3");
        const itemPrice = document.createElement("h3");
        const dotBox = document.createElement("div");
        const quantityContainer = document.createElement("div");
        const quantity = document.createElement("p");

        dotBox.classList.add("dot-box");
        itemContainer.classList.add("item-container");
        quantity.classList.add("quantity");

        itemTitle.innerText = item.name.toUpperCase();
        itemPrice.innerText = item.price + " SEK";

        quantity.innerText = item.quantity + " stycken";

        receiptItems.append(itemContainer);
        itemContainer.append(itemTilteContainer, quantityContainer);
        itemTilteContainer.append(itemTitle, dotBox, itemPrice);
        quantityContainer.append(quantity);
    });
    receiptSum.innerText = receipt.orderValue + " SEK";
    receiptId.innerText = "#" + receipt.id.toUpperCase();
}
