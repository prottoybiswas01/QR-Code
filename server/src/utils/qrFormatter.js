/**
 * Format payload based on QR Code type for static encoding
 * @param {string} type 
 * @param {string} destination 
 * @param {object} metadata 
 * @returns {string}
 */
export const formatStaticPayload = (type, destination = '', metadata = {}) => {
  switch (type) {
    case 'url':
    case 'facebook':
    case 'instagram':
      return destination.trim();

    case 'text':
      return destination;

    case 'whatsapp': {
      const phone = (metadata.recipient || destination || '').replace(/[^0-9+]/g, '');
      const msg = encodeURIComponent(metadata.message || '');
      return `https://wa.me/${phone}${msg ? `?text=${msg}` : ''}`;
    }

    case 'email': {
      const email = metadata.recipient || destination || '';
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
      const phone = (metadata.recipient || destination || '').replace(/[^0-9+]/g, '');
      return `tel:${phone}`;
    }

    case 'sms': {
      const phone = (metadata.recipient || destination || '').replace(/[^0-9+]/g, '');
      const body = encodeURIComponent(metadata.message || '');
      return `sms:${phone}${body ? `?body=${body}` : ''}`;
    }

    case 'wifi': {
      const ssid = (metadata.ssid || destination || '').replace(/([\\;,":])/g, '\\$1');
      const password = (metadata.password || '').replace(/([\\;,":])/g, '\\$1');
      const enc = metadata.encryption || 'WPA';
      const hidden = metadata.hidden ? 'H:true;' : '';
      return `WIFI:T:${enc};S:${ssid};P:${password};${hidden};`;
    }

    case 'vcard': {
      const fn = `${metadata.firstName || ''} ${metadata.lastName || ''}`.trim() || 'Contact';
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
      return destination ? `https://www.google.com/maps?q=${encodeURIComponent(destination)}` : '';
    }

    default:
      return destination;
  }
};
