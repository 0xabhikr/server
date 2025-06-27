import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const update = req.body;
  console.log('Received update:', update);

  if (!update.message) {
    return res.status(200).json({ message: 'No message to process' });
  }

  const chatId = update.message.chat.id;
  const text = update.message.text || '';
  const token = process.env.BOT_TOKEN;

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: `You said: ${text}`,
      }),
    });

    const data = await response.json();
    console.log('Telegram API response:', data);

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
