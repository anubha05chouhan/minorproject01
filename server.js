// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { User } = require('./models'); // Import User model

// Initialize Express app
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/restaurantDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Middleware
app.use(bodyParser.json());

// Route to handle user registration
app.post('/register', async (req, res) => {
    try {
        const { username, password, role } = req.body;
        // Check if username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        // Create new user
        const newUser = new User({ username, password, role });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to handle user login
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        // Check if user exists
        const user = await User.findOne({ username, password });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        // User authenticated, send appropriate response based on role
        if (user.role === 'admin') {
            return res.json({ role: 'admin' });
        } else {
            return res.json({ role: 'customer' });
        }
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to add a new food item
app.post('/fooditems/add', async (req, res) => {
    try {
        const { name, price } = req.body;
        const newFoodItem = new FoodItem({ name, price });
        await newFoodItem.save();
        res.status(201).json({ message: 'Food item added successfully' });
    } catch (error) {
        console.error('Error adding food item:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to delete a food item
app.delete('/fooditems/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedFoodItem = await FoodItem.findByIdAndDelete(id);
        if (!deletedFoodItem) {
            return res.status(404).json({ message: 'Food item not found' });
        }
        res.json({ message: 'Food item deleted successfully' });
    } catch (error) {
        console.error('Error deleting food item:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to update a food item
app.put('/fooditems/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price } = req.body;
        const updatedFoodItem = await FoodItem.findByIdAndUpdate(id, { name, price }, { new: true });
        if (!updatedFoodItem) {
            return res.status(404).json({ message: 'Food item not found' });
        }
        res.json({ message: 'Food item updated successfully', updatedFoodItem });
    } catch (error) {
        console.error('Error updating food item:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
