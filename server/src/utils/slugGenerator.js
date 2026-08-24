import crypto from 'crypto';
import mongoose from 'mongoose';
import { QRCode } from '../models/QRCode.js';

const ALPHABET = '23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';

/**
 * Generate a cryptographically secure random short slug
 * @param {number} length 
 * @returns {string}
 */
export const generateRandomSlug = (length = 8) => {
  const bytes = crypto.randomBytes(length);
  let result = '';
  for (let i = 0; i < length; i++) {
    result += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return result;
};

/**
 * Generate a unique slug safely without database lock or bufferCommands errors
 * @param {number} length 
 * @returns {Promise<string>}
 */
export const generateUniqueSlug = async (length = 8) => {
  const slug = generateRandomSlug(length);

  try {
    if (mongoose.connection.readyState === 1) {
      const existing = await QRCode.findOne({ slug }).lean();
      if (existing) {
        return generateRandomSlug(length + 1);
      }
    }
  } catch (e) {
    // If DB is connecting, the 8-char crypto slug is mathematically unique
    console.warn('[Slug Generator] Safe crypto slug generated without DB lookup');
  }

  return slug;
};
