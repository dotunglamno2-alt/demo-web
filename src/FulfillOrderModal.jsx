import { useState } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { prepareVpsUpgrade } from './vpsUpgrade.js';

export default function FulfillOrderModal({ order, locations = [], proxyStockPool = [], userVps = [], upgradeLimits, formatVND, onClose, onFulfill }) {
  const isProxy = order.orderType === 'proxy';
  const isUpgrade = order.orderType === 'upgrade';
  const isCompleted = order.status === 'Completed';

  const [proxyString, setProxyString] = useState(order.fulfilledInfo?.proxyString || '');
  const [protocol, setProtocol] = useState(order.fulfilledInfo?.protocol || order.protocol || 'HTTP');
  const [country, setCountry] = useState(order.fulfilledInfo?.country || order.country || order.requestedLocation || 'Việt Nam 🇻🇳');
  const [vpsName, setVpsName] = useState(() => order.fulfilledInfo?.vpsName || order.hostname || `vps-${Math.floor(1000 + Math.random() * 9000)}`);
  const [activationCode, setActivationCode] = useState(() => order.fulfilledInfo?.activationCode || `ACT-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`);
  const [ip, setIp] = useState(order.fulfilledInfo?.ip || '');
  const [username, setUsername] = useState(order.fulfilledInfo?.username || 'root');
  const [password, setPassword] = useState(order.fulfilledInfo?.password || '');
  const [panelUrl, setPanelUrl] = useState(order.fulfilledInfo?.panelUrl || '');
  const [os, setOs] = useState(order.fulfilledInfo?.os || order.requestedOs || 'Ubuntu 22.04 LTS');
  const [vpsCountry, setVpsCountry] = useState(order.fulfilledInfo?.country || order.requestedLocation || locations[0]?.name || 'Hà Nội (Viettel IDC)');
  const [totalDays, setTotalDays] = useState(order.fulfilledInfo?.totalDays || order.periodDays || 30);

  const calculateExpiry = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + Number(days));
    return date.toLocaleDateString('vi-VN');
  };
  const [expiryDate, setExpiryDate] = useState(() => order.fulfilledInfo?.expiryDate || calculateExpiry(order.periodDays || 30));

  let upgradePreview = null;
  let upgradeError = '';
  if (isUpgrade && !isCompleted) {
    try {
      upgradePreview = prepareVpsUpgrade(order, userVps, upgradeLimits);
    } catch (error) {
      upgradeError = error.message;
    }
  }

  const handleProxySubmit = (event) => {
    event.preventDefault();
    if (!proxyString.trim()) return;
    const parts = proxyString.trim().split(':');
    onFulfill({
      isProxy: true,
      proxyString: proxyString.trim(),
      ip: parts[0] || '127.0.0.1',
      port: parts[1] || '8080',
      username: parts[2] || 'user',
      password: parts[3] || 'pass',
      protocol,
      country
    });
  };

  const handleVpsSubmit = (event) => {
    event.preventDefault();
    if (!ip.trim() || !vpsName.trim()) return;
    onFulfill({
      isProxy: false,
      vpsName: vpsName.trim(),
      ip: ip.trim(),
      username: username.trim(),
      password: password.trim(),
      activationCode: activationCode.trim(),
      panelUrl: panelUrl.trim(),
      os: os.trim(),
      country: vpsCountry.trim(),
      totalDays,
      expiryDate
    });
  };

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="fulfill-order-title" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 id="fulfill-order-title" className="font-black text-base text-white">
              {isUpgrade ? 'Duyệt Yêu Cầu Nâng Cấp VPS' : isProxy ? 'Cấp Phát Đơn Hàng Proxy Thủ Công' : 'Cấp Phát Đơn Hàng Cloud VPS'}
            </h3>
            <p className="text-xs text-slate-400">Đơn hàng #{order.id} • Khách: {order.customerName} ({order.customerEmail})</p>
          </div>
          <button type="button" aria-label="Đóng" onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        {isUpgrade ? (
          <div className="space-y-4 text-xs">
            {isCompleted ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                Đơn nâng cấp đã được duyệt. Không cộng lại cấu hình hoặc trừ thêm tiền.
                {order.fulfilledInfo && (
                  <div className="mt-2 font-mono">{order.fulfilledInfo.ip} • {order.fulfilledInfo.cpu} vCPU • {order.fulfilledInfo.ram}GB RAM • {order.fulfilledInfo.disk}GB NVMe</div>
                )}
              </div>
            ) : upgradeError ? (
              <div role="alert" className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{upgradeError}</span>
              </div>
            ) : (
              <>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="font-bold text-white">{upgradePreview.upgradedVps.name}</div>
                  <div className="text-purple-300 font-mono">IP: {upgradePreview.upgradedVps.ip}</div>
                  <div className="text-slate-400">Yêu cầu: +{order.upgradeData.addCpu} vCPU • +{order.upgradeData.addRam}GB RAM • +{order.upgradeData.addDisk}GB NVMe</div>
                  <div className="text-slate-400">Hiện tại: {upgradePreview.fulfilledInfo.previousConfig.cpu} vCPU • {upgradePreview.fulfilledInfo.previousConfig.ram}GB RAM • {upgradePreview.fulfilledInfo.previousConfig.disk}GB NVMe</div>
                  <div className="text-emerald-300 font-bold">Sau nâng cấp: {upgradePreview.upgradedVps.cpu} vCPU • {upgradePreview.upgradedVps.ram}GB RAM • {upgradePreview.upgradedVps.disk}GB NVMe</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between"><span className="text-slate-400">Đã thanh toán:</span><strong className="text-emerald-400 font-mono">{formatVND(order.amountPaid)}</strong></div>
                  <div className="flex justify-between"><span className="text-slate-400">Phí nâng cấp cộng thêm / tháng:</span><strong className="text-amber-300 font-mono">{formatVND(upgradePreview.fulfilledInfo.monthlyUpgradeCost)}</strong></div>
                  <p className="text-slate-400">Giữ nguyên IP, tài khoản và hạn dùng. Chỉ cập nhật cấu hình VPS hiện có trong bản demo, không tạo VPS mới và không trừ tiền lần nữa.</p>
                </div>
              </>
            )}
            <button
              type="button"
              disabled={isCompleted || !upgradePreview}
              onClick={() => onFulfill({ isUpgrade: true })}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-black"
            >
              {isCompleted ? 'Đã Duyệt Nâng Cấp' : 'Chấp Nhận & Duyệt Nâng Cấp VPS'}
            </button>
          </div>
        ) : isProxy ? (
          <form onSubmit={handleProxySubmit} className="space-y-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-2">
              <label className="text-cyan-300 font-semibold block">Proxy dạng IP:Port:User:Pass:</label>
              <input type="text" required value={proxyString} onChange={event => setProxyString(event.target.value)} placeholder="IP:Port:User:Pass" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold" />
              <div className="flex flex-wrap gap-1.5">
                {proxyStockPool.slice(0, 3).map(stock => (
                  <button key={stock.id} type="button" onClick={() => { setProxyString(stock.proxyString); setProtocol(stock.protocol || 'HTTP'); setCountry(stock.country || country); }} className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-[10px] font-mono">
                    Bốc: {stock.ip}:{stock.port}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 block mb-1">Giao thức:</label>
                <select value={protocol} onChange={event => setProtocol(event.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"><option>HTTP</option><option>SOCKS5</option></select>
              </div>
              <div>
                <label className="text-slate-300 block mb-1">Quốc gia:</label>
                <input type="text" required value={country} onChange={event => setCountry(event.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white" />
              </div>
            </div>
            <button type="submit" className="w-full py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-black">Xác Nhận Bàn Giao Proxy Cho Khách</button>
          </form>
        ) : (
          <form onSubmit={handleVpsSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-slate-300 block mb-1">Tên VPS:</label><input type="text" required value={vpsName} onChange={event => setVpsName(event.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono" /></div>
              <div><label className="text-slate-300 block mb-1">Địa chỉ IPv4:</label><input type="text" required value={ip} onChange={event => setIp(event.target.value)} className="w-full bg-slate-950 border border-purple-500/50 rounded-xl px-3 py-2 text-purple-300 font-mono" /></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div><label className="text-slate-300 block mb-1">Mã kích hoạt:</label><input type="text" value={activationCode} onChange={event => setActivationCode(event.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-amber-300 font-mono" /></div>
              <div><label className="text-slate-300 block mb-1">Username:</label><input type="text" required value={username} onChange={event => setUsername(event.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono" /></div>
              <div><label className="text-slate-300 block mb-1">Mật khẩu:</label><input type="text" required value={password} onChange={event => setPassword(event.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-mono" /></div>
            </div>
            <div><label className="text-slate-300 block mb-1">Link quản lý (có thể để trống):</label><input type="text" value={panelUrl} onChange={event => setPanelUrl(event.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-blue-400 font-mono" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-slate-300 block mb-1">Hệ điều hành:</label><input type="text" required value={os} onChange={event => setOs(event.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white" /></div>
              <div><label className="text-slate-300 block mb-1">Quốc gia / Data Center:</label><input type="text" required value={vpsCountry} onChange={event => setVpsCountry(event.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-slate-300 block mb-1">Số ngày:</label><input type="number" min="1" required value={totalDays} onChange={event => { const days = Math.max(1, Number(event.target.value) || 1); setTotalDays(days); setExpiryDate(calculateExpiry(days)); }} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white" /></div>
              <div><label className="text-slate-300 block mb-1">Ngày hết hạn:</label><input type="text" required value={expiryDate} onChange={event => setExpiryDate(event.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white" /></div>
            </div>
            <button type="submit" className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black">Xác Nhận Bàn Giao VPS Cho Khách Hàng</button>
          </form>
        )}
      </div>
    </div>
  );
}
