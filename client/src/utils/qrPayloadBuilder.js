/**
 * Build QR payload for live preview rendering or static generation
 * @param {string} type 
 * @param {string} mode 'dynamic' | 'static'
 * @param {string} destination 
 * @param {object} metadata 
 * @param {string} slug 
 * @param {string} baseUrl 
 * @returns {string}
 */
export const buildQRPayload = (
  type,
  mode = 'dynamic',
  destination = '',
  metadata = {},
  slug = '',
  baseUrl = window.location.origin
) => {
  // In dynamic mode, the QR strictly encodes the permanent slug URL
  if (mode === 'dynamic') {
    if (slug) {
      return `${baseUrl}/q/${slug}`;
    }
    // For fresh preview before creation, show preview placeholder url
    return `${baseUrl}/q/preview-sample`;
  }

  // In static mode, encode raw data directly
  switch (type) {
    case 'url':
    case 'facebook':
    case 'instagram':
      return destination || 'https://example.com';

    case 'text':
      return destination || 'Sample Text Content';

    case 'whatsapp': {
      const phone = (metadata.recipient || destination || '').replace(/[^0-9+]/g, '');
      const msg = encodeURIComponent(metadata.message || '');
      return `https://wa.me/${phone || '1234567890'}${msg ? `?text=${msg}` : ''}`;
    }

    case 'email': {
      const email = metadata.recipient || destination || 'hello@example.com';
      const subject = encodeURIComponent(metadata.subject || '');
      const body = encodeURIComponent(metadata.body || '');
      let mailto = `mailto:${email}`;
      const params = [];
      if (subject) params.push(`subject=${subject}`);
      if (body) params.push(`body=${body}`);
      if (params.length > 0) mailto += `?${params.join('&')}`;
      return mailto;
    }

    case 'phone': {
      const phone = (metadata.recipient || destination || '+1234567890').replace(/[^0-9+]/g, '');
      return `tel:${phone}`;
    }

    case 'sms': {
      const phone = (metadata.recipient || destination || '+1234567890').replace(/[^0-9+]/g, '');
      const body = encodeURIComponent(metadata.message || '');
      return `sms:${phone}${body ? `?body=${body}` : ''}`;
    }

    case 'wifi': {
      const ssid = (metadata.ssid || destination || 'MyWiFi').replace(/([\\;,":])/g, '\\$1');
      const password = (metadata.password || '').replace(/([\\;,":])/g, '\\$1');
      const enc = metadata.encryption || 'WPA';
      const hidden = metadata.hidden ? 'H:true;' : '';
      return `WIFI:T:${enc};S:${ssid};P:${password};${hidden};`;
    }

    case 'vcard': {
      const fn = `${metadata.firstName || ''} ${metadata.lastName || ''}`.trim() || 'John Doe';
      let vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${fn}\nN:${metadata.lastName || ''};${metadata.firstName || ''};;;\n`;
      if (metadata.company) vcard += `ORG:${metadata.company}\n`;
      if (metadata.title) vcard += `TITLE:${metadata.title}\n`;
      if (metadata.phone) vcard += `TEL;TYPE=CELL:${metadata.phone}\n`;
      if (metadata.email) vcard += `EMAIL:${metadata.email}\n`;
      if (metadata.website) vcard += `URL:${metadata.website}\n`;
      if (metadata.address) vcard += `ADR;TYPE=WORK:;;${metadata.address};;;;\n`;
      if (metadata.note) vcard += `NOTE:${metadata.note}\n`;
      vcard += `END:VCARD`;
      return vcard;
    }

    case 'location': {
      if (metadata.latitude && metadata.longitude) {
        return `https://www.google.com/maps?q=${metadata.latitude},${metadata.longitude}`;
      }
      return destination ? `https://www.google.com/maps?q=${encodeURIComponent(destination)}` : 'https://www.google.com/maps?q=0,0';
    }

    default:
      return destination || 'https://example.com';
  }
};
