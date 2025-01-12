const KEY = "yum-BAPUdN5hTPLuk3iN";
const url = "https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/";
const ID = "b1on";

async function getMenu() {
    const options = {
        method: "GET",
        headers: {
            "x-zocom": KEY,
        },
    };
    try {
        const response = await fetch(url + "menu", options);
        const data = await response.json();
        return data.items;
    } catch (error) {
        console.log("Fel:", response.status, error);
    }
}

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
        const response = await fetch(url + ID + "/orders", options);

        if (!response.ok) {
            console.error(
                `Fel vid anrop: ${response.status} ${response.statusText}`
            );
            return;
        }

        const data = await response.json();
        console.log(data);
        console.log(response.status);
        return data;
    } catch (error) {
        console.log("Fel:", error.message);
    }
}

async function getReceipt(orderId) {
    const options = {
        method: "GET",
        headers: {
            "x-zocom": KEY,
        },
    };
    try {
        const response = await fetch(url + "receipts/" + orderId, options);
        const data = await response.json();
        console.log(data);
        return data.receipt;
    } catch (error) {
        console.log("Fel:", response.status, error);
    }
}

export { sendCart, getMenu, getReceipt };
