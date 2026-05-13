import axios from "axios";

export const sendWhatsappMessage = async (phone, message) => {
  if (!process.env.PHONE_ID) {
    throw new Error('Missing env var: PHONE_ID');
  }
  if (!process.env.WHATSAPP_TOKEN) {
    throw new Error('Missing env var: WHATSAPP_TOKEN');
  }

  if (!phone || typeof phone !== 'string') {
    throw new Error('Invalid "phone". Expected string');
  }
  if (!message || typeof message !== 'string') {
    throw new Error('Invalid "message". Expected string');
  }

  try {
    const { data } = await axios.post(
      `https://graph.facebook.com/v25.0/${process.env.PHONE_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: phone,
        type: 'text',
        text: {
          body: message,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return data;
  } catch (error) {
    const fbError = error?.response?.data;
    const payload = {
      fb: fbError || null,
      message: error?.message,
    };

    console.error('WhatsApp Graph error:', payload);

    // Lanzar un error estructurado para que el controller lo devuelva claro
    const err = new Error('WhatsApp Graph request failed');
    err.details = payload;
    throw err;
  }
};

