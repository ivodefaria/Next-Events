import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    email: String
});

module.exports = mongoose.models.Subscription || mongoose.model('Subscription', subscriptionSchema)