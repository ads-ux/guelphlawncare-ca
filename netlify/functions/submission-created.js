exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') return { statusCode: 200, body: '' };

  let payload;
  try {
    const body = JSON.parse(event.body);
    payload = body.payload;
  } catch (e) {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  const RESEND_KEY = 're_7bTWREUo_P1cRtEgUHB8hyXtyfCXWQ3io';
  const TO_EMAIL = 'ads@vrume.com';
  const FROM_EMAIL = 'noreply@overhauled.ai';

  const data = payload.data || {};
  const name = data.name || payload.name || 'Unknown';
  const email = data.email || payload.email || 'Not provided';
  const phone = data.phone || 'Not provided';
  const service = data.service || 'Not provided';
  const address = data.address || 'Not provided';
  const message = data.message || 'No message';

  const htmlBody = `
    <h2>New Contact Form Submission — Guelph Lawn Care</h2>
    <table cellpadding="8" style="border-collapse:collapse">
      <tr><td><strong>Name</strong></td><td>${name}</td></tr>
      <tr><td><strong>Email</strong></td><td>${email}</td></tr>
      <tr><td><strong>Phone</strong></td><td>${phone}</td></tr>
      <tr><td><strong>Service</strong></td><td>${service}</td></tr>
      <tr><td><strong>Address</strong></td><td>${address}</td></tr>
      <tr><td><strong>Message</strong></td><td>${message}</td></tr>
    </table>
  `;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: TO_EMAIL,
        subject: `New Lead: ${name} — Guelph Lawn Care`,
        html: htmlBody
      })
    });
    const resData = await res.json();
    console.log('Resend response:', JSON.stringify(resData));
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error('Email error:', err);
    return { statusCode: 500, body: 'Email send failed' };
  }
};
