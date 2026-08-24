import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  const mongoURI =
    process.env.MONGODB_URI ||
    'mongodb+srv://shantodev1670_db_user:PsftPU5JBbuYZJGh@cluster0.ejeb1pp.mongodb.net/qrcode_platform?retryWrites=true&w=majority&appName=Cluster0';


  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose
      .connect(mongoURI, opts)
      .then((m) => {
        console.log(`[Database] MongoDB Connected: ${m.connection.host}`);
        return m;
      })
      .catch((err) => {
        console.error(`[Database] Connection Error: ${err.message}`);
        cached.promise = null;
        return null;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error(`[Database] Connection Error: ${e.message}`);
    return null;
  }

  return cached.conn;
};

