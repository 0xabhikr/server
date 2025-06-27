import express from 'express';
import dotenv from 'dotenv';
import webhookHandler from './api/webhook.js'; // Correct path to the webhook

dotenv.config();

const app = express();
app.use(express.json());

app.post('/webhook', webhookHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
