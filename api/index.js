import app from '../server/src/app.js';
import { connectDB } from '../server/src/config/db.js';

let isDbConnected = false;

export default async function handler(req, res) {
  if (!isDbConnected) {
    await connectDB();
    isDbConnected = true;
  }
  return app(req, res);
}
