import dbConnect from "../../../lib/dbConnect";
import Event from "../../../models/Event";

export default async function handler (req, res) {
    const { method } = req

    try {
        await dbConnect()
    }catch(error) {
        res.status(500).json({ message: 'Connecting to the database failed!' });
    }
    
    switch (method) {
        case 'GET':
            try {
                const events = await Event.find({}).sort({ _id: -1 });
                res.status(200).json({ success: true, events: events })
            } catch (error) {
                res.status(400).json({ success: false })
            }
            break
        default:
            res.status(400).json({ success: false })
            break
    }
}