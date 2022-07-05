import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    email: String,
    name: String,
    text: String,
    event_id: String
});


module.exports = mongoose.models.Comment || mongoose.model("Comment", commentSchema);

