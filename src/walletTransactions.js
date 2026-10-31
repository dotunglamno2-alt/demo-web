export function createWalletTransaction(user, details) {
  if (!user?.id || !user.email) throw new Error('Không tìm thấy tài khoản cần thay đổi số dư.');
  const balanceBefore = Number(user.balance);
  const amount = Number(details.amount);
  const balanceAfter = balanceBefore + amount;
  if (!Number.isSafeInteger(balanceBefore) || balanceBefore < 0 ||
      !Number.isSafeInteger(amount) || !Number.isSafeInteger(balanceAfter)) {
    throw new Error('Số tiền phải là số nguyên VND hợp lệ.');
  }
  if (balanceAfter < 0) throw new Error('Số dư ví không đủ để thực hiện giao dịch.');
  if (amount === 0) return null;
  return {
    id: details.id,
    createdAt: details.createdAt,
    userId: user.id,
    userName: user.name,
    userEmail: user.email.toLowerCase().trim(),
    type: details.type,
    amount,
    balanceBefore,
    balanceAfter,
    description: details.description || '',
    referenceId: details.referenceId || '',
    actorEmail: details.actorEmail || 'system'
  };
}
