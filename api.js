const KEY = "";
const url = "https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/";
const ID = "";

//hämtar menyn som lista
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
        //returnerar menyn dirr till .items
        return data.items;
        //vet inte hur error funkar, LÄS PÅ OM DET
    } catch (error) {
        console.log("Fel:", response.status, error);
    }
}
//skicka cart till api
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
