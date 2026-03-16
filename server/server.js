const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// app.use(cors({
//     origin: process.env.FRONTEND_URL , // frontend URL from .env
//     credentials: true
// }));
const frontendUrl = process.env.FRONTEND_URL?.replace(/\/$/, ''); // remove trailing slash if any

app.use(cors({
    origin: function(origin, callback) {
        if (!origin) return callback(null, true); // allow server-to-server requests
        if (origin.replace(/\/$/, '') === frontendUrl) { // compare without trailing slash
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});