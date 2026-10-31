import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createWalletTransaction } from './walletTransactions.js';

const user = { id: 'u-1', name: 'Demo', email: 'demo@example.test', balance: 100000 };

test('creates a signed ledger entry with before and after balances', () => {
  assert.deepEqual(createWalletTransaction(user, {
    id: 'txn-1', createdAt: '2026-10-30T10:00:00.000Z', type: 'purchase_vps', amount: -59000,
    description: 'Thuê VPS', referenceId: 'ord-1', actorEmail: 'demo@example.test'
  }), {
    id: 'txn-1', createdAt: '2026-10-30T10:00:00.000Z', userId: 'u-1', userName: 'Demo',
    userEmail: 'demo@example.test', type: 'purchase_vps', amount: -59000,
    balanceBefore: 100000, balanceAfter: 41000, description: 'Thuê VPS', referenceId: 'ord-1', actorEmail: 'demo@example.test'
  });
});

test('accepts credits and rejects invalid or overdraft entries', () => {
  assert.equal(createWalletTransaction(user, { amount: 50000, type: 'topup' }).balanceAfter, 150000);
  assert.throws(() => createWalletTransaction(user, { amount: -100001, type: 'purchase_vps' }), /không đủ/);
  assert.throws(() => createWalletTransaction(user, { amount: 1.5, type: 'topup' }), /số nguyên/);
  assert.equal(createWalletTransaction(user, { amount: 0, type: 'topup' }), null);
});
