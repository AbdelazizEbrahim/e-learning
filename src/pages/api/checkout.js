// pages/api/checkout.js
export default async function handler(req, res) {
    const chapaSecretKey = process.env.CHAPA_SECRET_KEY; 

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${chapaSecretKey}`);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        amount: req.body.amount,
        currency: "ETB",
        email: req.body.email,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        phone_number: req.body.phone_number,
        tx_ref: req.body.tx_ref,
        callback_url: "https://webhook.site/your-callback-url",
        return_url: "http://localhost:3000/success",
        customization: {
            title: "Payment for my favourite merchant",
            description: "I love online payments",
        },
    });

    try {
        const response = await fetch("https://api.chapa.co/v1/hosted/pay", {
            method: 'POST',
            headers: myHeaders,
            body: raw,
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Payment initiation failed", error });
    }
}
