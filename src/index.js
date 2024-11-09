const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const nurseryRoutes = require('./routes/nurseryRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // to parse JSON bodies

// Connect to MongoDB
connectDB();

// Root route to handle GET requests to "/"
app.get('/', (req, res) => {
  res.send('Server is ON!'); // You can replace this message as needed
});

// Use user routes
app.use('/api/users', userRoutes);
app.use('/api/nursery', nurseryRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
