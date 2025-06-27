import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const update = req.body;

  if (!update.message) {
    return res.status(200).json({ message: 'No message to process' });
  }

  const chatId = update.message.chat.id;
  const text = update.message.text || '';
  const token = process.env.BOT_TOKEN;
  const yourChatId = process.env.YOUR_CHAT_ID;  // Put your own Telegram user chat ID here in env

  if (!token) {
    console.error('BOT_TOKEN not set in environment variables.');
    return res.status(500).json({ error: 'Bot token is not configured.' });
  }
  if (!yourChatId) {
    console.error('YOUR_CHAT_ID not set in environment variables.');
    // Not critical, so continue anyway
  }

  try {
    // Reply to the user
    const userMsg = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: `You said: ${text}`,
      }),
    });

    const userData = await userMsg.json();
    if (!userData.ok) {
      console.error('Telegram API error replying to user:', userData);
      return res.status(500).json({ error: 'Failed to send message to user' });
    }

    // Also send a notification message to yourself (optional)
    if (yourChatId) {
      const adminMsg = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: yourChatId,
          text: `New message from chat ${chatId}: ${text}`,
        }),
      });

      const adminData = await adminMsg.json();
      if (!adminData.ok) {
        console.error('Telegram API error sending admin message:', adminData);
      }
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
