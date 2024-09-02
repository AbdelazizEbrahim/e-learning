// pages/api/payment.js
export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { totalPrice, email, fullName,phoneNumber } = req.body;
        
        const chapaSecretKey = process.env.CHAPA_SECRET_KEY;

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${chapaSecretKey}`);
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "amount": totalPrice,
            "currency": "ETB",
            "email": email,
            "phone_number": phoneNumber, 
            "first_name": fullName.split(" ")[0],
            "last_name": fullName.split(" ")[1],
            "tx_ref": `tx-${Date.now()}`,
            "callback_url": "https://f02a-109-236-81-168.ngrok-free.app/api/webhook",  
            "return_url": "http://localhost:3000/thankYou",  
            "customization[title]": "Payment for Courses",
            "customization[description]": "E-learning Course Payment",
            "meta[hide_receipt]": "true"
        });
        
        try {
            const response = await fetch("https://api.chapa.co/v1/transaction/initialize", {
                method: 'POST',
                headers: myHeaders,
                body: raw,
            });
            console.log('response: ', response);

            const data = await response.json();
            console.log("data: ", data);
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ message: "Payment initiation failed", error });
        }
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}
