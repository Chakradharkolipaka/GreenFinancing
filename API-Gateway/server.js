require('dotenv').config();
const express = require('express');
const blockchainRoutes = require('./routes/blockchainRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/blockchain/', blockchainRoutes);

// // Define a root route
// app.get('/', (req, res) => {
//   res.send('Welcome to the Blockchain API! Use /api/blockchain/election-name to get the election name.');
// });

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });