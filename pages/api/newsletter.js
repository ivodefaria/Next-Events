import dbConnect from "../../lib/dbConnect";
import Subscription from "../../models/Subscription";

export default async function handler (req, res) {
    const { method } = req

    try {
        await dbConnect()
    }catch(error) {
        res.status(500).json({ message: 'Connecting to the database failed!' });
    }

    switch (method) {
        case 'POST':
            const { email } = req.body;

            if(!email || !email.includes("@")){
                res.status(422).json({message: "Invalid email address."});
                return;
            }

            const newSubscription = new Subscription({
                email: email
            });

            try {

                const subscriptionAdded = await newSubscription.save();


                res.status(201).json({ success: true, subscription: subscriptionAdded });
            } catch (error) {
                res.status(400).json({ success: false })
            }
            break
        default:
                res.status(400).json({ success: false })
                break
    }
}