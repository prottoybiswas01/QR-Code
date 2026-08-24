import crypto from 'crypto';
import { UAParser } from 'ua-parser-js';

/**
 * Parse request headers to extract device, OS, browser, and anonymized IP
 * @param {import('express').Request} req 
 * @returns {object}
 */
export const parseScanRequest = (req) => {
  const userAgentString = req.headers['user-agent'] || '';
  const parser = new UAParser(userAgentString);
  const result = parser.getResult();

  // Extract Device Type
  let deviceType = 'desktop';
  if (result.device && result.device.type) {
    deviceType = result.device.type; // mobile, tablet, etc.
  } else if (/mobile/i.test(userAgentString)) {
    deviceType = 'mobile';
  } else if (/tablet|ipad/i.test(userAgentString)) {
    deviceType = 'tablet';
  }

  // Extract OS
  const os = result.os && result.os.name ? `${result.os.name} ${result.os.version || ''}`.trim() : 'Unknown OS';

  // Extract Browser
  const browser = result.browser && result.browser.name ? `${result.browser.name} ${result.browser.version || ''}`.trim() : 'Unknown Browser';

  // Anonymized IP hash
  const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  const ip = Array.isArray(rawIp) ? rawIp[0] : rawIp.split(',')[0].trim();
  const ipHash = crypto.createHash('sha256').update(ip + (process.env.IP_SALT || 'qr-salt-2026')).digest('hex').substring(0, 16);

  // Referer
  const referer = req.headers['referer'] || req.headers['referrer'] || 'Direct / Scanner';

  return {
    deviceType,
    os,
    browser,
    ipHash,
    referer,
    userAgent: userAgentString.substring(0, 255),
    country: req.headers['cf-ipcountry'] || req.headers['x-country-code'] || 'Unknown',
  };
};
