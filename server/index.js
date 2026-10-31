import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import {
  getBankHistory,
  getBankTransaction,
  normalizeBankTransaction,
  verifyWebhookSecret
} from './bankApi.js';

const app = express();
const port = Number(process.env.PORT || 3001);

const allowedOrigins = (process.env.FRONTEND_ORIGIN || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: allowedOrigins.length ? allowedOrigins : false,
  credentials: true
}));
app.use(express.json({ limit: '32kb' }));

function requireNotificationSecret(secretName) {
  const value = process.env[secretName];
  if (!value) throw new Error(`Chưa cấu hình biến môi trường ${secretName}.`);
  return value;
}

app.get('/api/bank/health', (_req, res) => {
  res.json({
    ok: true,
    provider: 'sieuthicode',
    apiTokenConfigured: Boolean(process.env.BANK_API_TOKEN),
    webhookConfigured: Boolean(process.env.BANK_WEBHOOK_SECRET)
  });
});

app.get('/api/bank/transactions', async (req, res) => {
  try {
    const payload = await getBankHistory(req.query.limit);
    res.json({ ...payload, data: (payload.data || []).map(normalizeBankTransaction) });
  } catch (error) {
    console.error('Bank history request failed:', error);
    res.status(502).json({ message: error.message || 'Không thể lấy lịch sử giao dịch ngân hàng.' });
  }
});

app.get('/api/bank/transactions/:transId', async (req, res) => {
  try {
    const payload = await getBankTransaction(req.params.transId);
    res.json({ ...payload, data: normalizeBankTransaction(payload) });
  } catch (error) {
    console.error('Bank transaction request failed:', error);
    res.status(502).json({ message: error.message || 'Không thể kiểm tra giao dịch ngân hàng.' });
  }
});

app.post('/api/bank/webhook', (req, res) => {
  try {
    if (!verifyWebhookSecret(req)) return res.status(401).json({ message: 'Webhook secret không hợp lệ.' });
    const transaction = normalizeBankTransaction(req.body);
    if (!transaction.transId || transaction.amount === null || transaction.amount <= 0) {
      return res.status(422).json({ message: 'Payload webhook thiếu trans_id hoặc amount hợp lệ.' });
    }

    // Chưa cộng tiền ở đây: cần nối transaction database + unique(provider, trans_id)
    // trước khi bật tự động ghi có cho tài khoản khách hàng.
    res.status(202).json({
      ok: true,
      status: 'received',
      provider: 'sieuthicode',
      transaction
    });
  } catch (error) {
    console.error('Bank webhook failed:', error);
    res.status(503).json({ message: error.message || 'Webhook ngân hàng chưa được cấu hình.' });
  }
});

app.get('/api/notifications/health', (_req, res) => {
  res.json({
    ok: true,
    smtpConfigured: Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS),
    telegramConfigured: Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID)
  });
});

app.post('/api/notifications/test-email', async (req, res) => {
  try {
    const smtpHost = requireNotificationSecret('SMTP_HOST');
    const smtpUser = requireNotificationSecret('SMTP_USER');
    const smtpPass = requireNotificationSecret('SMTP_PASS');
    const to = String(req.body?.to || process.env.SMTP_TEST_TO || smtpUser).trim();
    if (!to) return res.status(400).json({ message: 'Thiếu địa chỉ email nhận thử.' });

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE).toLowerCase() === 'true',
      auth: { user: smtpUser, pass: smtpPass }
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || smtpUser,
      to,
      subject: 'TLCloud - Kiểm tra cấu hình SMTP',
      text: 'Email kiểm tra SMTP đã được gửi thành công từ hệ thống TLCloud.'
    });
    res.json({ ok: true, message: `Đã gửi email kiểm tra tới ${to}.` });
  } catch (error) {
    console.error('SMTP test failed:', error);
    res.status(500).json({ message: error.message || 'Không thể gửi email kiểm tra.' });
  }
});

app.post('/api/notifications/test-telegram', async (req, res) => {
  try {
    const token = requireNotificationSecret('TELEGRAM_BOT_TOKEN');
    const chatId = String(process.env.TELEGRAM_CHAT_ID || '').trim();
    if (!chatId) return res.status(500).json({ message: 'Chưa cấu hình biến môi trường TELEGRAM_CHAT_ID.' });

    const response = await fetch(`https://api.telegram.org/bot${encodeURIComponent(token)}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: String(req.body?.message || '🔔 TLCloud: kiểm tra kết nối Telegram thành công.')
      })
    });
    const result = await response.json();
    if (!response.ok || !result.ok) throw new Error(result.description || 'Telegram từ chối yêu cầu.');
    res.json({ ok: true, message: 'Đã gửi tin nhắn kiểm tra Telegram.' });
  } catch (error) {
    console.error('Telegram test failed:', error);
    res.status(500).json({ message: error.message || 'Không thể gửi tin nhắn Telegram.' });
  }
});

app.listen(port, () => console.log(`Notification API listening on http://localhost:${port}`));
