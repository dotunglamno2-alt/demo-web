// Sinh ID duy nhất cho các bản ghi nghiệp vụ (đơn hàng, VPS, proxy, giao dịch...).
// `crypto.randomUUID` chỉ tồn tại trên secure context (HTTPS hoặc localhost), nên khi chạy
// bằng http://<ip>:<port> nó là undefined. Luồng thanh toán bắt buộc phải có fallback để
// không crash giữa chừng và không sinh ra ID trùng giữa các khách hàng.

const FALLBACK_LENGTH = 16;

function randomSuffix() {
  const cryptoObj = globalThis.crypto;
  if (cryptoObj && typeof cryptoObj.getRandomValues === 'function') {
    const buffer = new Uint32Array(2);
    cryptoObj.getRandomValues(buffer);
    return `${buffer[0].toString(36)}${buffer[1].toString(36)}`.slice(0, FALLBACK_LENGTH);
  }
  return `${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`.slice(0, FALLBACK_LENGTH);
}

export function createId(prefix) {
  const cryptoObj = globalThis.crypto;
  if (cryptoObj && typeof cryptoObj.randomUUID === 'function') {
    return `${prefix}-${cryptoObj.randomUUID()}`;
  }
  return `${prefix}-${randomSuffix()}`;
}