import { sendWhatsappMessage } from "./whatsapp.services.js";

export const sendMessage = async (req, res) => {
  const { phone, message } = req.body;

  try {
    const data = await sendWhatsappMessage(phone, message);
    return res.status(200).json({
      ok: true,
      data,
      phoneSent: phone,
      messageSent: message,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      text: 'error en el servidor',
      err: {
        message: error?.message,
        details: error?.details || null,
      },
    });
  }
};

