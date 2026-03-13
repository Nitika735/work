const express = require('express');
const sequelize = require('./config/db');
const authRoutes = require('./modules/auth/auth.routes');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

const PORT = 5000;
sequelize.sync().then(() => {
    console.log("Database synced");
    app.listen(PORT, () => console.log("Server running on port " + PORT));
}).catch(err => console.log("Sync Error: " + err));
