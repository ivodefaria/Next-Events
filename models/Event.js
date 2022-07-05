import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title: String,
    description: String,
    location: String,
    date: String,
    image: String,
    isFeatured: Boolean,
    year: String,
    month: String
});


module.exports = mongoose.models.Event || mongoose.model("Event", eventSchema);
