const PROVIDER_BASE_URL = 'https://cron.sieuthicode.net/api';

function requireBankToken() {
  const token = process.env.BANK_API_TOKEN;
  if (!token) throw new Error('Chưa cấu hình biến môi trường BANK_API_TOKEN.');
  return token;
}

function providerUrl(path, params = {}) {
  const url = new URL(`${PROVIDER_BASE_URL}/${path}`);
  url.searchParams.set('token', requireBankToken());
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, String(value));
  }
  return url;
}

async function getProviderJson(url) {
  const response = await fetch(url, { headers: { accept: 'application/json' } });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.status !== 'success') {
    throw new Error(payload.message || `SieuThiCode trả về HTTP ${response.status}.`);
  }
  return payload;
}

export async function getBankHistory(limit = process.env.BANK_API_LIMIT || 50) {
  return getProviderJson(providerUrl('history.php', { limit }));
}

export async function getBankTransaction(transId) {
  if (!String(transId || '').trim()) throw new Error('Thiếu mã giao dịch trans_id.');
  return getProviderJson(providerUrl('checkhistory.php', { trans_id: transId }));
}

export function normalizeBankTransaction(payload = {}) {
  const source = payload.data && !Array.isArray(payload.data) ? payload.data : payload;
  const transId = source.trans_id || source.transaction_id || source.transactionId || source.id;
  const amount = Number(source.amount ?? source.transaction_amount ?? source.creditAmount ?? source.credit_amount);
  const description = String(source.description ?? source.content ?? source.memo ?? source.narrative ?? '').trim();
  return {
    transId: transId ? String(transId).trim() : '',
    amount: Number.isFinite(amount) ? amount : null,
    description,
    accountNumber: String(source.account_number ?? source.accountNumber ?? '').trim(),
    transactionTime: source.transaction_time ?? source.transactionTime ?? source.created_at ?? null,
    raw: source
  };
}

export function verifyWebhookSecret(request) {
  const expected = String(process.env.BANK_WEBHOOK_SECRET || '').trim();
  if (!expected) throw new Error('Chưa cấu hình BANK_WEBHOOK_SECRET; webhook đang bị khóa.');
  const received = String(request.get('x-bank-webhook-secret') || request.body?.secret || '').trim();
  return received.length === expected.length && received === expected;
}
