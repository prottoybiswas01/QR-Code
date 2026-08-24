import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to Database
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`
🚀===================================================🚀
   Dynamic QR Code Platform Server is Running!
   - Port: ${PORT}
   - Mode: ${process.env.NODE_ENV || 'development'}
   - API URL: http://localhost:${PORT}/api
   - Dynamic Scan Endpoint: http://localhost:${PORT}/q/:slug
🚀===================================================🚀
    `);
  });

  // Handle Unhandled Promise Rejections
  process.on('unhandledRejection', (err) => {
    console.error(`[Unhandled Rejection] ${err.message}`);
  });

  // Handle Uncaught Exceptions
  process.on('uncaughtException', (err) => {
    console.error(`[Uncaught Exception] ${err.message}`);
  });
};

startServer();
