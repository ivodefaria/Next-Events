import dbConnect from "../../../lib/dbConnect";
import Comment from "../../../models/Comment";

export default async function handler (req, res) {
    const { method } = req
    const { eventid } = req.query;

    try {
        await dbConnect()
    }catch(error) {
        res.status(500).json({ message: 'Connecting to the database failed!' });
    }
    
    switch (method) {
        case 'GET':
            try {
                const comments = await Comment.find({ "event_id": eventid }).sort({ _id: -1 });
                res.status(200).json({ success: true, comments: comments })
            } catch (error) {
                res.status(400).json({ success: false })
            }
            break
        case 'POST':

            const { email, name, text } = req.body;

            if(
                !email.includes('@') ||
                !name ||
                name.trim() === '' ||
                !text ||
                text.trim() === ''
            ){
                res.status(422).json({message: "Invalid input."});
            }

            const newComment = new Comment({
                email: email,
                name: name,
                text: text,
                event_id: eventid
            });
            
            try {
                
                const commentAdded = await newComment.save();
                
                res.status(201).json({ success: true, comment: commentAdded });
            } catch (error) {
                res.status(400).json({ success: false })
            }
            break
        default:
            res.status(400).json({ success: false })
            break
    }
}