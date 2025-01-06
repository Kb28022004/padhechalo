const dotenv = require("dotenv");
dotenv.config(); // Load environment variables early

const stripe=require('stripe')(process.env.SECRET_PAYMENT_KEY);

const processPayment=async(req,res)=>{
    try {
        
        const myPayment=await stripe.paymentIntents.create({
            amount:req.body.amount,
            currency:"inr",
            metadata: {
                company: "Padhe Chalo",
              },
        })
        res.status(200).json({ success: true, client_secret: myPayment.client_secret });

    } catch (error) {
        console.error("Stripe Payment Error: ", error);
        res.status(500).json({ success: false, message: "Payment failed" });
    }




}


const sendStripeApiKey=async(req,res)=>{
    try {
        res.status(200).json({stripeApiKey:process.env.STRIPE_API_KEY})

    } catch (error) {
        console.error("Stripe Payment Error: ", error);
        res.status(500).json({ success: false, message: "Payment failed" });
    }
}

module.exports ={sendStripeApiKey,processPayment};