require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose'); // Add this line
const blockchainRoutes = require('./routes/blockchainRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

app.use(express.json());
app.use(cors()); 
app.use('/api/blockchain/', blockchainRoutes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});