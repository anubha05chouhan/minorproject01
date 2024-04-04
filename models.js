// Import Mongoose
const mongoose = require('mongoose');

// Define Schema for User
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true }
});

// Define Schema for FoodItem
const foodItemSchema = new mongoose.Schema({
    price: { type: Number, required: true },
    name: { type: String, required: true },
    time: { type: Date, default: Date.now }
});

// Define Schema for Order
const orderSchema = new mongoose.Schema({
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem' }],
    totalPrice: { type: Number, required: true },
    estTime: { type: Date, required: true },
    orderBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

// Define Schema for Reservation
const reservationSchema = new mongoose.Schema({
    time: { type: Date, required: true },
    madeBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

// Define Schema for Menu
const menuSchema = new mongoose.Schema({
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem' }],
    stock: { type: Boolean, required: true }
});

// Create Models
const User = mongoose.model('User', userSchema);
const FoodItem = mongoose.model('FoodItem', foodItemSchema);
const Order = mongoose.model('Order', orderSchema);
const Reservation = mongoose.model('Reservation', reservationSchema);
const Menu = mongoose.model('Menu', menuSchema);

module.exports = { User, FoodItem, Order, Reservation, Menu };
