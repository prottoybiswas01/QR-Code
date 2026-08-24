import crypto from 'crypto';
import { QRCode } from '../models/QRCode.js';

const ALPHABET = '23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';

/**
 * Generate a random short alphanumeric string
 * @param {number} length 
 * @returns {string}
 */
export const generateRandomSlug = (length = 7) => {
  const bytes = crypto.randomBytes(length);
  let result = '';
  for (let i = 0; i < length; i++) {
    result += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return result;
};

/**
 * Generate a guaranteed unique slug for Dynamic QR Code
 * @param {number} length 
 * @returns {Promise<string>}
 */
export const generateUniqueSlug = async (length = 7) => {
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    const slug = generateRandomSlug(length);
    const existing = await QRCode.findOne({ slug }).lean();
    if (!existing) {
      return slug;
    }
    attempts++;
  }
  
  // If collisions happen, increase length by 1
  return generateRandomSlug(length + 1);
};
