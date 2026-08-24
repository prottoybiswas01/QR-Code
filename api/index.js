import app from '../server/src/app.js';
import { connectDB } from '../server/src/config/db.js';

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (err) {
    console.error('[Serverless Handler] DB connection warning:', err.message);
  }
  return app(req, res);
}

