import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  try {
    await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: 'amuchiri040@gmail.com',
      replyTo: email,
      subject: `New message from ${name} — Portfolio`,
      html: `
        <div style="font-family: 'Courier New', monospace; max-width: 600px; margin: 0 auto; background: #0d0d0d; color: #f5f2ec; padding: 40px; border-left: 3px solid #c8860a;">
          <p style="color: #c8860a; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 30px;">New Portfolio Message</p>
          <h2 style="font-family: Georgia, serif; font-size: 24px; margin-bottom: 24px; color: #fafaf8;">You have a new message from your portfolio.</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #2a2a2a;">
              <td style="padding: 12px 0; color: #7a7468; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; width: 80px;">Name</td>
              <td style="padding: 12px 0; color: #fafaf8;">${name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #2a2a2a;">
              <td style="padding: 12px 0; color: #7a7468; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase;">Email</td>
              <td style="padding: 12px 0; color: #c8860a;"><a href="mailto:${email}" style="color: #c8860a;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 12px 0; color: #7a7468; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; vertical-align: top;">Message</td>
              <td style="padding: 12px 0; color: #fafaf8; line-height: 1.7;">${message.replace(/\n/g, '<br>')}</td>
            </tr>
          </table>
          <p style="margin-top: 30px; color: #7a7468; font-size: 11px;">Hit reply to respond directly to ${name}.</p>
        </div>
      `,
    });

    return res.status(200).json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Email send error:', error);
    return res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
}
