import mongoose from 'mongoose';

// Set query buffering
mongoose.set('bufferCommands', false);

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  const mongoURI =
    process.env.MONGODB_URI ||
    'mongodb+srv://shantodev1670_db_user:PsftPU5JBbuYZJGh@cluster0.ejeb1pp.mongodb.net/qrcode_platform?retryWrites=true&w=majority&appName=Cluster0';

  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 30000,
      maxPoolSize: 10,
    };

    cached.promise = mongoose
      .connect(mongoURI, opts)
      .then((m) => {
        console.log(`[Database] MongoDB Connected: ${m.connection.host}`);
        cached.conn = m;
        return m;
      })
      .catch((err) => {
        console.error(`[Database] Connection Warning: ${err.message}`);
        cached.promise = null;
        cached.conn = null;
        return null;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    cached.conn = null;
    console.error(`[Database] Connection Error: ${e.message}`);
  }

  return cached.conn;
};
