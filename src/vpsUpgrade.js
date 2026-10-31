export const UPGRADE_LIMITS = {
  cpu: { min: 0, max: 4, step: 1 },
  ram: { min: 0, max: 8, step: 1 },
  disk: { min: 0, max: 100, step: 1 }
};

export function resolveUpgradeLimits(saved) {
  return Object.fromEntries(Object.entries(UPGRADE_LIMITS).map(([key, fallback]) => {
    const max = saved?.[key]?.max;
    return [key, { ...fallback, max: typeof max === 'number' && Number.isSafeInteger(max) && max >= 0 ? max : fallback.max }];
  }));
}

export function normalizeUpgradeQuantity(value, limit) {
  const quantity = Number(value);
  if (!Number.isFinite(quantity)) return limit.min;
  return Math.min(limit.max, Math.max(limit.min, Math.trunc(quantity)));
}

export function isUpgradeQuantityValid(value, limit) {
  if (typeof value !== 'number' && typeof value !== 'string') return false;
  if (typeof value === 'string' && !value.trim()) return false;
  const quantity = Number(value);
  return Number.isSafeInteger(quantity) && quantity >= limit.min && quantity <= limit.max;
}

export function prepareVpsUpgrade(order, servers, upgradeLimits = UPGRADE_LIMITS) {
  if (!order || order.orderType !== 'upgrade') {
    throw new Error('Đơn hàng không phải yêu cầu nâng cấp VPS.');
  }
  if (order.status !== 'Pending') {
    throw new Error('Đơn nâng cấp đã được xử lý, không thể duyệt lại.');
  }

  const data = order.upgradeData;
  const vpsId = order.vpsId || data?.vps?.id;
  const vps = servers.find(server => server.id === vpsId);
  if (!vps || vps.itemType === 'proxy' || vps.proxyString) {
    throw new Error('Không tìm thấy VPS cần nâng cấp. Đơn hàng vẫn được giữ ở trạng thái chờ.');
  }

  const quantities = [data?.addCpu, data?.addRam, data?.addDisk];
  // Đơn đã thanh toán giữ giới hạn tại thời điểm khách đặt nâng cấp.
  const appliedLimits = resolveUpgradeLimits(data?.limits || upgradeLimits);
  const limits = [appliedLimits.cpu, appliedLimits.ram, appliedLimits.disk];
  const increments = quantities.map(Number);
  const monthlyUpgradeCost = Number(data?.monthlyUpgradeCost);
  if (quantities.some((value, index) => !isUpgradeQuantityValid(value, limits[index])) ||
      !increments.some(value => value > 0) ||
      !Number.isFinite(monthlyUpgradeCost) || monthlyUpgradeCost < 0) {
    throw new Error('Dữ liệu nâng cấp không hợp lệ. Vui lòng kiểm tra lại đơn hàng.');
  }

  const currentConfig = [vps.cpu, vps.ram, vps.disk].map(Number);
  const currentMonthlyCost = Number(vps.upgradeMonthlyCost ?? 0);
  const nextConfig = currentConfig.map((value, index) => value + increments[index]);
  if (currentConfig.some(value => !Number.isSafeInteger(value) || value < 0) ||
      nextConfig.some(value => !Number.isSafeInteger(value)) ||
      !Number.isFinite(currentMonthlyCost) || currentMonthlyCost < 0 ||
      !Number.isFinite(currentMonthlyCost + monthlyUpgradeCost)) {
    throw new Error('Cấu hình hoặc phí nâng cấp hiện tại của VPS không hợp lệ.');
  }

  const upgradedVps = {
    ...vps,
    cpu: nextConfig[0],
    ram: nextConfig[1],
    disk: nextConfig[2],
    upgradeMonthlyCost: currentMonthlyCost + monthlyUpgradeCost
  };

  return {
    upgradedVps,
    fulfilledInfo: {
      isUpgrade: true,
      vpsId: vps.id,
      vpsName: vps.name,
      ip: vps.ip,
      previousConfig: { cpu: currentConfig[0], ram: currentConfig[1], disk: currentConfig[2] },
      cpu: upgradedVps.cpu,
      ram: upgradedVps.ram,
      disk: upgradedVps.disk,
      monthlyUpgradeCost,
      completedAt: new Date().toISOString()
    }
  };
}
