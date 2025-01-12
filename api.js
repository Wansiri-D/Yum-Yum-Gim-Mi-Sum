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
        // ใช้ fetch เพื่อร้องขอข้อมูลเมนูจาก URL (เพิ่ม "menu" ต่อท้าย URL หลัก) พร้อมตัวเลือกที่กำหนด
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

        // ตรวจสอบว่าการร้องขอสำเร็จหรือไม่
        if (!response.ok) {
            console.error(
                `Fel vid anrop: ${response.status} ${response.statusText}` // หากไม่สำเร็จให้พิมพ์ข้อผิดพลาดพร้อมสถานะและข้อความ
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

// ดึงใบเสร็จ (receipt) โดยใช้หมายเลขคำสั่งซื้อ (orderId)
async function getReceipt(orderId) {
    const options = {
        method: "GET",
        headers: {
            "x-zocom": KEY,
        },
    };
    try {
        const response = await fetch(url + "receipts/" + orderId, options); // ใช้ fetch เพื่อดึงข้อมูลใบเสร็จจาก URL ที่มี orderId ต่อท้าย
        const data = await response.json(); // แปลงข้อมูลตอบกลับมาเป็น JSON
        console.log(data);
        return data.receipt;
    } catch (error) {
        console.log("Fel:", response.status, error);
    }
}

export { sendCart, getMenu, getReceipt };
