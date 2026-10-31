import assert from 'node:assert/strict';
import { test } from 'node:test';
import { UPGRADE_LIMITS, isUpgradeQuantityValid, normalizeUpgradeQuantity, prepareVpsUpgrade, resolveUpgradeLimits } from './vpsUpgrade.js';

const vps = {
  id: 'vps-demo', name: 'Demo VPS', ip: '192.0.2.10',
  cpu: 2, ram: 4, disk: 50, upgradeMonthlyCost: 10000,
  daysLeft: 9, rootPass: 'demo-only', basePrice: 169000,
  pricingTiers: { m1: 169000 }, ownerEmail: 'admin@example.test'
};
const order = {
  id: 'ord-upgrade-demo', orderType: 'upgrade', status: 'Pending', vpsId: vps.id,
  amountPaid: 125000,
  upgradeData: { vps: { ...vps }, addCpu: 1, addRam: 2, addDisk: 20, monthlyUpgradeCost: 125000 }
};

test('approval changes only hardware and recurring upgrade cost on the existing VPS', () => {
  const { upgradedVps, fulfilledInfo } = prepareVpsUpgrade(order, [vps]);
  assert.deepEqual(upgradedVps, { ...vps, cpu: 3, ram: 6, disk: 70, upgradeMonthlyCost: 135000 });
  assert.equal(fulfilledInfo.vpsId, vps.id);
  assert.equal(fulfilledInfo.ip, vps.ip);
  assert.equal(fulfilledInfo.isUpgrade, true);
  assert.deepEqual(fulfilledInfo.previousConfig, { cpu: 2, ram: 4, disk: 50 });
  assert.equal(vps.cpu, 2);
  assert.equal(order.status, 'Pending');
});

test('uses live VPS configuration rather than the snapshot in the order', () => {
  const liveVps = { ...vps, cpu: 8, ram: 16, disk: 120, upgradeMonthlyCost: 50000 };
  const { upgradedVps } = prepareVpsUpgrade(order, [liveVps]);
  assert.deepEqual([upgradedVps.cpu, upgradedVps.ram, upgradedVps.disk, upgradedVps.upgradeMonthlyCost], [9, 18, 140, 175000]);
});

test('completed orders cannot be approved again', () => {
  assert.throws(() => prepareVpsUpgrade({ ...order, status: 'Completed' }, [vps]), /đã được xử lý/);
});

test('missing VPS and proxy targets cannot be approved', () => {
  assert.throws(() => prepareVpsUpgrade(order, []), /Không tìm thấy VPS/);
  assert.throws(() => prepareVpsUpgrade(order, [{ ...vps, itemType: 'proxy' }]), /Không tìm thấy VPS/);
});

test('invalid increments or costs are rejected without changing state', () => {
  for (const patch of [
    { addCpu: -1 }, { addRam: 'invalid' }, { addDisk: 0.5 },
    { addCpu: 0, addRam: 0, addDisk: 0 },
    { monthlyUpgradeCost: -1 }, { monthlyUpgradeCost: undefined }
  ]) {
    assert.throws(() => prepareVpsUpgrade({ ...order, upgradeData: { ...order.upgradeData, ...patch } }, [vps]), /không hợp lệ/);
  }
  assert.throws(() => prepareVpsUpgrade({ ...order, upgradeData: undefined }, [vps]), /không hợp lệ/);
  assert.equal(vps.cpu, 2);
});

test('numeric storage strings are added numerically, not concatenated', () => {
  const storedVps = { ...vps, cpu: '2', ram: '4', disk: '50', upgradeMonthlyCost: '10000' };
  const storedOrder = { ...order, upgradeData: { ...order.upgradeData, addCpu: '1', addRam: '2', addDisk: '20', monthlyUpgradeCost: '125000' } };
  const { upgradedVps } = prepareVpsUpgrade(storedOrder, [storedVps]);
  assert.deepEqual([upgradedVps.cpu, upgradedVps.ram, upgradedVps.disk, upgradedVps.upgradeMonthlyCost], [3, 6, 70, 135000]);
});

test('older orders can find the VPS through the stored snapshot id', () => {
  const { upgradedVps } = prepareVpsUpgrade({ ...order, vpsId: undefined }, [{ ...vps, upgradeMonthlyCost: undefined }]);
  assert.equal(upgradedVps.id, vps.id);
  assert.equal(upgradedVps.upgradeMonthlyCost, 125000);
});

test('quantity inputs clamp to the fixed range and use whole units', () => {
  for (const limit of Object.values(UPGRADE_LIMITS)) {
    assert.equal(normalizeUpgradeQuantity(-10, limit), 0);
    assert.equal(normalizeUpgradeQuantity(limit.max + 10, limit), limit.max);
    assert.equal(normalizeUpgradeQuantity(2.9, limit), 2);
    assert.equal(normalizeUpgradeQuantity('', limit), 0);
    assert.equal(normalizeUpgradeQuantity('invalid', limit), 0);
    assert.equal(normalizeUpgradeQuantity(Infinity, limit), 0);
    assert.equal(normalizeUpgradeQuantity('3', limit), 3);
    assert.equal(isUpgradeQuantityValid(0, limit), true);
    assert.equal(isUpgradeQuantityValid(limit.max, limit), true);
    for (const value of [-1, limit.max + 1, 1.5, '', ' ', null, undefined, false, NaN, Infinity]) {
      assert.equal(isUpgradeQuantityValid(value, limit), false, `Invalid quantity: ${String(value)}`);
    }
  }
});

test('approval rejects requests above the fixed limits', () => {
  for (const patch of [{ addCpu: 5 }, { addRam: 9 }, { addDisk: 101 }]) {
    assert.throws(() => prepareVpsUpgrade({ ...order, upgradeData: { ...order.upgradeData, ...patch } }, [vps]), /không hợp lệ/);
  }
});

test('approval accepts the maximum increments and values between the old presets', () => {
  for (const quantities of [[4, 8, 100], [3, 5, 37]]) {
    const [addCpu, addRam, addDisk] = quantities;
    const { upgradedVps } = prepareVpsUpgrade({ ...order, upgradeData: { ...order.upgradeData, addCpu, addRam, addDisk } }, [vps]);
    assert.deepEqual([upgradedVps.cpu, upgradedVps.ram, upgradedVps.disk], [vps.cpu + addCpu, vps.ram + addRam, vps.disk + addDisk]);
  }
});

test('saved admin limits are normalized with safe defaults and permit zero', () => {
  assert.deepEqual(resolveUpgradeLimits(), UPGRADE_LIMITS);
  assert.deepEqual(resolveUpgradeLimits(null), UPGRADE_LIMITS);
  for (const max of [-1, 0.5, '', '8', null, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
    assert.equal(resolveUpgradeLimits({ cpu: { max } }).cpu.max, UPGRADE_LIMITS.cpu.max);
  }
  assert.deepEqual(resolveUpgradeLimits({ cpu: { min: 2, max: 0, step: 10 } }).cpu, { min: 0, max: 0, step: 1 });
  assert.equal(resolveUpgradeLimits({ ram: { max: 32 } }).ram.max, 32);
});

test('approval uses configurable admin limits for orders without a snapshot', () => {
  const limits = resolveUpgradeLimits({ cpu: { max: 6 }, ram: { max: 12 }, disk: { max: 150 } });
  const largerOrder = { ...order, upgradeData: { ...order.upgradeData, addCpu: 5, addRam: 9, addDisk: 101 } };
  const { upgradedVps } = prepareVpsUpgrade(largerOrder, [vps], limits);
  assert.deepEqual([upgradedVps.cpu, upgradedVps.ram, upgradedVps.disk], [7, 13, 151]);
  assert.throws(() => prepareVpsUpgrade(largerOrder, [vps]), /không hợp lệ/);
  assert.throws(() => prepareVpsUpgrade(order, [vps], resolveUpgradeLimits({ cpu: { max: 0 } })), /không hợp lệ/);
});

test('paid orders retain their original limits when admin lowers the current limits', () => {
  const paidOrder = { ...order, upgradeData: { ...order.upgradeData, limits: resolveUpgradeLimits() } };
  const disabledLimits = resolveUpgradeLimits({ cpu: { max: 0 }, ram: { max: 0 }, disk: { max: 0 } });
  const { upgradedVps } = prepareVpsUpgrade(paidOrder, [vps], disabledLimits);
  assert.deepEqual([upgradedVps.cpu, upgradedVps.ram, upgradedVps.disk], [3, 6, 70]);
  const invalidOrder = { ...paidOrder, upgradeData: { ...paidOrder.upgradeData, addCpu: 5 } };
  assert.throws(() => prepareVpsUpgrade(invalidOrder, [vps], resolveUpgradeLimits({ cpu: { max: 10 } })), /không hợp lệ/);
});

test('other order types and invalid live configuration are rejected', () => {
  assert.throws(() => prepareVpsUpgrade({ ...order, orderType: 'proxy' }, [vps]), /không phải/);
  assert.throws(() => prepareVpsUpgrade(order, [{ ...vps, cpu: 'invalid' }]), /không hợp lệ/);
});
