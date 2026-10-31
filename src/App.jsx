import { useState, useEffect, useMemo, useRef } from 'react';
import { AdminBalanceHistoryTab, AdminTransactionsTab } from './AdminFinanceTabs.jsx';
import { createWalletTransaction } from './walletTransactions.js';
import { createId } from './ids.js';
import ErrorBoundary from './ErrorBoundary.jsx';
import {
  Server,
  Shield,
  Zap,
  Check,
  Copy,
  ExternalLink,
  RefreshCw,
  Terminal,
  Settings,
  User,
  CreditCard,
  Plus,
  Trash2,
  Search,
  Menu,
  X,
  ChevronDown,
  Globe,
  Activity,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  LifeBuoy,
  Layers,
  Tag,
  LogOut,
  QrCode,
  Wallet,
  DollarSign,
  ArrowRight,
  Edit,
  Eye,
  EyeOff,
  Database,
  MessageSquare,
  SlidersHorizontal,
  AlertTriangle,
  Network,
  ShoppingCart,
  Send,
  Download,
  Minus
} from 'lucide-react';

// =========================================================================
// DỮ LIỆU KHỞI TẠO HỆ THỐNG (INITIAL STORE & STATE)
// =========================================================================

const INITIAL_CATEGORIES = [
  {
    id: 'cat-student',
    name: 'Cloud VPS Học Tập & Giá Rẻ',
    icon: '🎓',
    description: 'Tối ưu chi phí cho học sinh, sinh viên, chạy bot Discord, Telegram, test code web nhẹ.',
    badge: 'Tiết Kiệm Nhất',
    tag: 'Sinh Viên'
  },
  {
    id: 'cat-pro',
    name: 'Cloud VPS NVMe Doanh Nghiệp',
    icon: '⚡',
    description: 'Ổ cứng NVMe Enterprise thế hệ mới, CPU xung nhịp cao chuyên chạy API, Docker, Web sản xuất.',
    badge: 'Hiệu Năng Cao',
    tag: 'Doanh Nghiệp'
  },
  {
    id: 'cat-game',
    name: 'Cloud VPS Gaming & Anti-DDoS',
    icon: '🎮',
    description: 'Băng thông 10Gbps, cổng chống DDoS chuyên dụng tầng 7 cho Minecraft, FiveM, Steam game server.',
    badge: 'Ping 1ms',
    tag: 'Game Server'
  },
  {
    id: 'cat-windows',
    name: 'Cloud VPS Windows Treo Tool',
    icon: '🪟',
    description: 'Kèm giao diện Remote Desktop GUI mượt mà, chuyên auto tool, MMO, SEO, nuôi tài khoản.',
    badge: 'Windows Server',
    tag: 'MMO / Tool'
  }
];

const INITIAL_PLANS = [
  {
    id: 'plan-starter',
    name: 'GenZ Starter',
    tagline: 'Mượt mà cho bot Discord & Web sinh viên',
    badge: 'HSSV Đỉnh Chóp',
    cpu: 1,
    ram: 2,
    disk: 30,
    bandwidth: 'Không giới hạn',
    price: 59000,
    enableDaily: true,
    allowDailyRenew: false,
    pricingTiers: { d1: 3000, d3: 9000, d7: 19000, m1: 59000, m3: 177000, m6: 354000, m12: 708000 },
    supportedOs: ['Ubuntu 22.04 LTS', 'Debian 12', 'Alpine Linux (Siêu nhẹ)'],
    supportedLocations: ['Hà Nội (Viettel IDC)', 'TP.HCM (FPT Data)'],
    customFieldName: 'Môi trường tùy chỉnh',
    customEnvironments: [],
    popular: false,
    color: 'from-blue-500 to-cyan-500',
    category: 'cat-student'
  },
  {
    id: 'plan-pro',
    name: 'Dev Pro Căng Đét',
    tagline: 'Best choice cho Fullstack Dev & Deploy API Docker',
    badge: '🔥 Bán Chạy Nhất',
    cpu: 2,
    ram: 4,
    disk: 60,
    bandwidth: 'Không giới hạn',
    price: 129000,
    enableDaily: true,
    allowDailyRenew: false,
    pricingTiers: { d1: 6000, d3: 18000, d7: 39000, m1: 129000, m3: 387000, m6: 774000, m12: 1548000 },
    supportedOs: ['Ubuntu 22.04 LTS', 'Debian 12', 'AlmaLinux 9', 'Alpine Linux (Siêu nhẹ)'],
    supportedLocations: ['Hà Nội (Viettel IDC)', 'TP.HCM (FPT Data)', 'Singapore (Equinix)'],
    customFieldName: 'Môi trường tùy chỉnh',
    customEnvironments: [],
    popular: true,
    color: 'from-purple-500 to-indigo-600',
    category: 'cat-pro'
  },
  {
    id: 'plan-gamer',
    name: 'Gamer Max Ping',
    tagline: 'Chiến Game Server, Minecraft, FiveM, Bot Auto siêu nuột',
    badge: 'Ping 1ms Nét Căng',
    cpu: 4,
    ram: 8,
    disk: 120,
    bandwidth: '10 Gbps Port',
    price: 249000,
    enableDaily: true,
    allowDailyRenew: false,
    pricingTiers: { d1: 12000, d3: 36000, d7: 75000, m1: 249000, m3: 747000, m6: 1494000, m12: 2988000 },
    supportedOs: ['Ubuntu 22.04 LTS', 'Debian 12', 'Windows Server 2022'],
    supportedLocations: ['Hà Nội (Viettel IDC)', 'Singapore (Equinix)', 'Tokyo (NTT Com Japan)'],
    customFieldName: 'Môi trường tùy chỉnh',
    customEnvironments: [],
    popular: false,
    color: 'from-pink-500 to-rose-600',
    category: 'cat-game'
  },
  {
    id: 'plan-beast',
    name: 'Beast Enterprise',
    tagline: 'Quái vật hiệu năng cho hệ thống chịu tải lớn, AI Model',
    badge: 'Max Công Suất',
    cpu: 8,
    ram: 16,
    disk: 250,
    bandwidth: '10 Gbps Port',
    price: 499000,
    enableDaily: true,
    allowDailyRenew: false,
    pricingTiers: { d1: 25000, d3: 75000, d7: 155000, m1: 499000, m3: 1497000, m6: 2994000, m12: 5988000 },
    supportedOs: ['Ubuntu 22.04 LTS', 'Debian 12', 'AlmaLinux 9', 'Windows Server 2022'],
    supportedLocations: ['Hà Nội (Viettel IDC)', 'Singapore (Equinix)', 'Tokyo (NTT Com Japan)'],
    customFieldName: 'Môi trường tùy chỉnh',
    customEnvironments: [],
    popular: false,
    color: 'from-amber-400 to-orange-500',
    category: 'cat-pro'
  },
  {
    id: 'plan-windows',
    name: 'Windows MMO Turbo',
    tagline: 'Giao diện Remote Desktop mượt mà, chuyên auto tool & MMO',
    badge: 'Windows Server',
    cpu: 2,
    ram: 4,
    disk: 50,
    bandwidth: 'Không giới hạn',
    price: 169000,
    enableDaily: true,
    allowDailyRenew: false,
    pricingTiers: { d1: 8000, d3: 24000, d7: 50000, m1: 169000, m3: 507000, m6: 1014000, m12: 2028000 },
    supportedOs: ['Windows Server 2022', 'Windows Server 2019', 'Windows 10 Pro Lite'],
    supportedLocations: ['Hà Nội (Viettel IDC)', 'TP.HCM (FPT Data)', 'Singapore (Equinix)'],
    customFieldName: 'Môi trường tùy chỉnh',
    customEnvironments: [],
    popular: false,
    color: 'from-emerald-500 to-teal-600',
    category: 'cat-windows'
  }
];

const INITIAL_LOCATIONS = [
  { id: 'loc-hn', name: 'Hà Nội (Viettel IDC)', flag: '🇻🇳', ping: '1ms', nodes: 28, status: 'Online', bandwidth: '100 Gbps' },
  { id: 'loc-hcm', name: 'TP.HCM (FPT Data)', flag: '🇻🇳', ping: '2ms', nodes: 34, status: 'Online', bandwidth: '120 Gbps' },
  { id: 'loc-sg', name: 'Singapore (Equinix)', flag: '🇸🇬', ping: '28ms', nodes: 16, status: 'Online', bandwidth: '80 Gbps' },
  { id: 'loc-jp', name: 'Tokyo (NTT Com Japan)', flag: '🇯🇵', ping: '45ms', nodes: 12, status: 'Online', bandwidth: '60 Gbps' }
];

const INITIAL_PROVIDERS = [
  { id: 'p-1', name: 'Proxmox VE Cluster Viettel IDC', type: 'Proxmox VE', endpoint: 'https://pve1.viettel.tlcloud.net:8006/api2/json', status: 'Online', latency: '1.2ms', activeVps: 42 },
  { id: 'p-2', name: 'Hetzner Cloud Production API', type: 'Hetzner Cloud', endpoint: 'https://api.hetzner.cloud/v1', status: 'Online', latency: '32ms', activeVps: 18 },
  { id: 'p-3', name: 'OpenStack Private Region HN01', type: 'OpenStack', endpoint: 'https://os-hn.tlcloud.net:5000/v3', status: 'Online', latency: '1.8ms', activeVps: 15 }
];

const INITIAL_PROXY_PLANS = [
  {
    id: 'proxy-v4-dc',
    name: 'Proxy IPv4 Datacenter Tĩnh',
    type: 'IPv4 Datacenter',
    protocol: 'HTTP',
    bandwidth: 'Không giới hạn băng thông',
    speed: '1 Gbps Dedicated',
    country: 'Việt Nam 🇻🇳',
    supportedCountries: ['Việt Nam 🇻🇳', 'Hoa Kỳ (USA) 🇺🇸', 'Singapore 🇸🇬'],
    price: 35000,
    priceDaily: 2000,
    enableDaily: true,
    badge: 'Tốc Độ Cao',
    desc: 'IP Dedicated tĩnh 100% riêng tư, chuyên nuôi nick Facebook, Zalo, Tiktok, treo tool MMO mượt mà.',
    tag: 'Nuôi Nick / Tool'
  },
  {
    id: 'proxy-v4-res',
    name: 'Proxy Dân Cư Tĩnh (Residential)',
    type: 'Dân Cư Tĩnh (Residential)',
    protocol: 'SOCKS5',
    bandwidth: '10 GB Băng thông / IP',
    speed: 'Clean IP 99%',
    country: 'Hoa Kỳ (USA) 🇺🇸',
    supportedCountries: ['Hoa Kỳ (USA) 🇺🇸', 'Cộng Hòa Liên Bang Đức 🇩🇪', 'Nhật Bản (Tokyo) 🇯🇵'],
    price: 85000,
    priceDaily: 5000,
    enableDaily: true,
    badge: 'Trust Cao',
    desc: 'Dải IP nhà mạng dân cư thật (AT&T, Comcast), vượt qua các cơ chế kiểm duyệt gắt gao của sàn TMĐT.',
    tag: 'E-Commerce / Ads'
  },
  {
    id: 'proxy-rotating',
    name: 'Proxy Xoay Động (Rotating IP)',
    type: 'Proxy Xoay (Rotating)',
    protocol: 'HTTP',
    bandwidth: 'Theo dung lượng GB',
    speed: 'Hàng Triệu Pool IP',
    country: 'Singapore 🇸🇬',
    supportedCountries: ['Singapore 🇸🇬', 'Hàn Quốc (Seoul) 🇰🇷', 'Việt Nam 🇻🇳'],
    price: 120000,
    priceDaily: 8000,
    enableDaily: false,
    badge: 'Đổi IP Theo Phút',
    desc: 'Tự động xoay IP sau mỗi request hoặc sau 5-10 phút, lý tưởng cho Crawler dữ liệu và Check out tự động.',
    tag: 'Crawl Data / Bot'
  }
];

const INITIAL_PROXY_COUNTRIES = [
  { id: 'vn', name: 'Việt Nam 🇻🇳', code: 'VN' },
  { id: 'us', name: 'Hoa Kỳ (USA) 🇺🇸', code: 'US' },
  { id: 'sg', name: 'Singapore 🇸🇬', code: 'SG' },
  { id: 'jp', name: 'Nhật Bản (Tokyo) 🇯🇵', code: 'JP' },
  { id: 'kr', name: 'Hàn Quốc (Seoul) 🇰🇷', code: 'KR' },
  { id: 'de', name: 'Cộng Hòa Liên Bang Đức 🇩🇪', code: 'DE' }
];

const INITIAL_PROXY_STOCK = [
  { id: 'pst-1', proxyString: '103.142.26.88:8080:tlcloud_user1:PassSecret#99', ip: '103.142.26.88', port: '8080', user: 'tlcloud_user1', pass: 'PassSecret#99', protocol: 'HTTP', country: 'Việt Nam 🇻🇳', status: 'Ready', addedAt: '25/04/2026' },
  { id: 'pst-2', proxyString: '142.250.190.46:1080:tlcloud_socks:ProxyPass_2026', ip: '142.250.190.46', port: '1080', user: 'tlcloud_socks', pass: 'ProxyPass_2026', protocol: 'SOCKS5', country: 'Hoa Kỳ (USA) 🇺🇸', status: 'Ready', addedAt: '26/04/2026' }
];

const INITIAL_USERS = [
  { id: 'u-admin', name: 'Quản Trị Viên', email: 'admin@tlcloud.net', password: 'admin', role: 'Admin', balance: 5000000, servers: 5, tickets: 0, status: 'Hoạt động', joined: '01/01/2026', phone: '0988889999' },
  { id: 'u-1', name: 'Nguyễn Văn Dev', email: 'dev.pro@gmail.com', password: '123', role: 'VIP', balance: 450000, servers: 2, tickets: 1, status: 'Hoạt động', joined: '15/02/2026', phone: '0912345678' },
  { id: 'u-2', name: 'Trần Gamer 2004', email: 'gamerz@yahoo.com', password: '123', role: 'Member', balance: 120000, servers: 1, tickets: 0, status: 'Hoạt động', joined: '20/03/2026', phone: '0977112233' }
];

const INITIAL_VPS = [
  {
    id: 'vps-api-01',
    name: 'Production-API-Worker',
    source: 'api',
    planName: 'Dev Pro Căng Đét',
    ownerEmail: 'dev.pro@gmail.com',
    ownerName: 'Nguyễn Văn Dev',
    ip: '103.142.26.88',
    status: 'Running',
    cpu: 2,
    ram: 4,
    disk: 60,
    os: 'Ubuntu 22.04 LTS',
    location: 'Hà Nội (Viettel IDC)',
    customEnv: 'Docker & Compose',
    autoRenew: false,
    daysLeft: 22,
    basePrice: 129000,
    renewMonths: 1,
    rootPass: 'Secret#Root_2026',
    activationCode: 'ACT-DEV-9921',
    panelUrl: ''
  },
  {
    id: 'vps-man-02',
    name: 'MMO-AutoTool-Dedicated',
    source: 'manual',
    planName: 'Windows MMO Turbo',
    ownerEmail: 'admin@tlcloud.net',
    ownerName: 'Quản Trị Viên',
    ip: '14.225.210.14',
    status: 'Running',
    cpu: 2,
    ram: 4,
    disk: 50,
    os: 'Windows Server 2022',
    location: 'TP.HCM (FPT Data)',
    customEnv: 'Windows RDP GUI Mặc định',
    autoRenew: false,
    daysLeft: 9,
    basePrice: 169000,
    renewMonths: 1,
    rootPass: 'AdminWin#9988',
    activationCode: 'ACT-WIN-8832',
    panelUrl: ''
  }
];

const INITIAL_STOCK_POOL = [
  {
    id: 'stock-101',
    hostname: 'vps-stock-hn-01',
    ip: '103.142.26.101',
    cpu: 2,
    ram: 4,
    disk: 60,
    os: 'Ubuntu 22.04 LTS',
    location: 'Hà Nội (Viettel IDC)',
    planName: 'Dev Pro Căng Đét',
    rootPass: 'Stock#Viettel_101',
    status: 'Ready',
    addedDate: '25/04/2026'
  },
  {
    id: 'stock-102',
    hostname: 'vps-stock-hcm-02',
    ip: '14.225.210.55',
    cpu: 4,
    ram: 8,
    disk: 120,
    os: 'Windows Server 2022',
    location: 'TP.HCM (FPT Data)',
    planName: 'Windows MMO Turbo',
    rootPass: 'Stock#FPT_5521',
    status: 'Ready',
    addedDate: '26/04/2026'
  }
];

const INITIAL_COUPONS = [];

const INITIAL_ORDERS = [
  {
    id: 'ord-8821',
    customerName: 'Nguyễn Văn Dev',
    customerEmail: 'dev.pro@gmail.com',
    planId: 'plan-pro',
    planName: 'Dev Pro Căng Đét',
    billingType: 'monthly',
    periodMonths: 1,
    periodDays: 30,
    requestedOs: 'Ubuntu 22.04 LTS',
    requestedLocation: 'Hà Nội (Viettel IDC)',
    customEnv: 'Docker & Compose',
    amountPaid: 129000,
    status: 'Pending',
    progressStep: 3,
    progressPercent: 70,
    createdAt: 'Hôm nay, 10:15',
    notes: 'Khách thanh toán qua Ví Z-Pay'
  }
];

const INITIAL_TICKETS = [
  { id: 'tk-101', user: 'dev.pro@gmail.com', subject: 'Cần mở port 25565 cho Minecraft server', priority: 'Cao', status: 'Đang xử lý', time: '10 phút trước', vpsId: 'vps-api-01' },
  { id: 'tk-102', user: 'gamerz@yahoo.com', subject: 'Hỏi về cách gia hạn bằng VietQR tự động', priority: 'Trung bình', status: 'Đã giải quyết', time: '2 giờ trước', vpsId: 'vps-man-02' }
];

// Helper tạo ID nghiệp vụ: ưu tiên UUID, có fallback cho môi trường http:// (không secure context).
function nextId(prefix) {
  return createId(prefix);
}

// Helper tạo và tải xuống file cấu hình Remote Desktop (.rdp) an toàn
function downloadRdpFile(vps) {
  try {
    if (!vps) return;
    const ip = vps.ip || '127.0.0.1';
    const username = vps.username || (vps.os?.toLowerCase().includes('win') ? 'Administrator' : 'root');
    const safeFilename = (vps.name || 'vps-server').replace(/[^a-zA-Z0-9_-]/g, '_');

    const rdpConfigLines = [
      `full address:s:${ip}`,
      `username:s:${username}`,
      `prompt for credentials:i:1`,
      `screen mode id:i:2`,
      `use multimon:i:0`,
      `session bpp:i:32`,
      `compression:i:1`,
      `keyboardhook:i:2`,
      `audiomode:i:0`,
      `redirectprinters:i:0`,
      `redirectcomports:i:0`,
      `redirectsmartcards:i:0`,
      `redirectclipboard:i:1`,
      `redirectposdevices:i:0`,
      `displayconnectionbar:i:1`,
      `autoreconnection enabled:i:1`,
      `authentication level:i:2`,
      `enablecredsspsupport:i:1`
    ];

    const blob = new Blob([rdpConfigLines.join('\r\n')], { type: 'application/x-rdp;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${safeFilename}.rdp`;
    document.body.appendChild(anchor);
    anchor.click();
    setTimeout(() => {
      try {
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);
      } catch (err) {}
    }, 100);
  } catch (error) {
    console.warn('Trình duyệt đã chặn tải file hoặc gặp sự cố:', error);
  }
}

// =========================================================================
// MAIN APP COMPONENT (ORCHESTRATOR - ĐIỀU PHỐI TINH GỌN)
// =========================================================================
export default function App() {
  const [view, setView] = useState('store'); // 'store' | 'portal' | 'admin'
  const [adminTab, setAdminTab] = useState('orders');
  const [storeTab, setStoreTab] = useState('vps');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  const [adminViewAllServers, setAdminViewAllServers] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState({});

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('zcloud_currentUser');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_USERS[0];
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('zcloud_users');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_USERS;
  });

  const [vpsCategories, setVpsCategories] = useState(() => {
    const saved = localStorage.getItem('zcloud_vpsCategories');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_CATEGORIES;
  });

  const [plans, setPlans] = useState(() => {
    const saved = localStorage.getItem('zcloud_plans');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_PLANS;
  });

  const [proxyPlans, setProxyPlans] = useState(() => {
    const saved = localStorage.getItem('zcloud_proxyPlans');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_PROXY_PLANS;
  });

  const [proxyCountries, setProxyCountries] = useState(() => {
    const saved = localStorage.getItem('zcloud_proxyCountries');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_PROXY_COUNTRIES;
  });

  const [proxyStockPool, setProxyStockPool] = useState(() => {
    const saved = localStorage.getItem('zcloud_proxyStockPool');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_PROXY_STOCK;
  });

  const [locations, setLocations] = useState(() => {
    const saved = localStorage.getItem('zcloud_locations');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_LOCATIONS;
  });

  const [providers, setProviders] = useState(() => {
    const saved = localStorage.getItem('zcloud_apiProviders');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_PROVIDERS;
  });

  const [userVps, setUserVps] = useState(() => {
    const saved = localStorage.getItem('zcloud_userVps');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_VPS;
  });

  const [stockPool, setStockPool] = useState(() => {
    const saved = localStorage.getItem('zcloud_stockPool');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_STOCK_POOL;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('zcloud_orders');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_ORDERS;
  });

  const [coupons, setCoupons] = useState(() => {
    const saved = localStorage.getItem('zcloud_coupons');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_COUPONS;
  });

  const [tickets, setTickets] = useState(() => {
    const saved = localStorage.getItem('zcloud_tickets');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_TICKETS;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('zcloud_transactions');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  // Bản sao đồng bộ của ví: cho phép đọc số dư / chống trùng giao dịch ngay trong cùng một tick
  // (React chỉ cập nhật state ở lần render kế tiếp nên hai lần gọi liên tiếp sẽ thấy cùng state cũ).
  const walletRef = useRef({ users, transactions });
  useEffect(() => {
    walletRef.current = { users, transactions };
  }, [users, transactions]);

  const changeBalance = ({ userId = currentUser?.id, ...details }) => {
    // Luôn lấy bản ghi mới nhất từ danh sách users; currentUser có thể đang là snapshot cũ.
    const snapshot = walletRef.current;
    const user = snapshot.users.find(u => u.id === userId) || (currentUser?.id === userId ? currentUser : null);
    if (details.referenceId && snapshot.transactions.some(t => t.userId === userId && t.type === details.type && t.referenceId === details.referenceId)) {
      showToast('Giao dịch này đã được ghi nhận trước đó.', 'error');
      return false;
    }
    try {
      const entry = createWalletTransaction(user, {
        ...details,
        id: nextId('txn'),
        createdAt: new Date().toISOString(),
        actorEmail: currentUser?.email || 'system'
      });
      if (!entry) return true;
      // Ghi ngay vào bản sao để lần gọi kế tiếp trong cùng tick thấy số dư mới.
      walletRef.current = {
        users: snapshot.users.map(u => u.id === userId ? { ...u, balance: entry.balanceAfter } : u),
        transactions: [entry, ...snapshot.transactions]
      };
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, balance: entry.balanceAfter } : u));
      if (currentUser?.id === userId) setCurrentUser(prev => ({ ...prev, balance: entry.balanceAfter }));
      setTransactions(prev => [entry, ...prev]);
      return true;
    } catch (error) {
      showToast(error.message, 'error');
      return false;
    }
  };

  // Kênh liên hệ hỗ trợ trực tuyến Zalo & Facebook
  const [supportChannels, setSupportChannels] = useState(() => {
    const saved = localStorage.getItem('zcloud_supportChannels');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      zaloPhone: '0988889999',
      zaloLink: 'https://zalo.me/0988889999',
      fbLink: 'https://facebook.com/tlcloud.official',
      fbMessenger: 'https://m.me/tlcloud.official',
      hotline: '1900 6868'
    };
  });

  const [topupConfig, setTopupConfig] = useState(() => {
    const defaultConfig = {
      banks: [
        { id: 'acb', bankCode: 'ACB', bankName: 'Ngân hàng ACB', accountNumber: '0123456789', accountName: 'NGUYEN VAN QUAN TRI', enabled: true },
        { id: 'mb', bankCode: 'MB', bankName: 'MBBank (Quân Đội)', accountNumber: '0988889999', accountName: 'NGUYEN VAN QUAN TRI', enabled: true }
      ],
      memoTemplate: 'NAP {customer_username}',
      quickAmounts: [50000, 100000, 200000, 500000, 1000000, 2000000]
    };
    const saved = localStorage.getItem('zcloud_topupConfig');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Chuyển cấu hình ngân hàng cũ (chỉ có một MB) sang định dạng mới.
        if (Array.isArray(parsed?.banks)) return { ...defaultConfig, ...parsed, banks: parsed.banks };
        if (parsed?.bankCode) {
          return {
            ...defaultConfig,
            ...parsed,
            banks: [{
              id: String(parsed.bankCode).toLowerCase(),
              bankCode: parsed.bankCode,
              bankName: parsed.bankName,
              accountNumber: parsed.accountNumber,
              accountName: parsed.accountName,
              enabled: true
            }, defaultConfig.banks[0]]
          };
        }
      } catch (e) {}
    }
    return defaultConfig;
  });

  const [upgradePricing, setUpgradePricing] = useState(() => {
    const saved = localStorage.getItem('zcloud_upgradePricing');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return { cpuPricePerCore: 35000, ramPricePerGb: 25000, diskPricePerGb: 2000 };
  });

  // State giới hạn nâng cấp phần cứng cấu hình bởi Admin
  const [upgradeLimits, setUpgradeLimits] = useState(() => {
    const saved = localStorage.getItem('zcloud_upgradeLimits');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return { maxCpu: 4, maxRam: 8, maxDisk: 100 };
  });

  const [provisionMode, setProvisionMode] = useState(() => {
    return localStorage.getItem('zcloud_provisionMode') || 'hybrid';
  });

  const [toast, setToast] = useState(null);
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Xử lý các nghiệp vụ đặc biệt: Hết Hàng, Hủy Đơn, Hủy Đơn Hoàn Tiền
  const handleOrderSpecialAction = (order, actionType, note = '') => {
    const refundAmount = Number(order.amountPaid) || 0;
    const targetEmail = (order.customerEmail || '').toLowerCase().trim();

    // Cả 2 trường hợp 'refund' (Hủy Hoàn Tiền) và 'out_of_stock' (Hết Hàng) đều tự động hoàn tiền vào ví khách
    if (actionType === 'refund' || actionType === 'out_of_stock') {
      const targetUser = users.find(u => (u.email || '').toLowerCase().trim() === targetEmail);
      if (!targetUser) {
        showToast('Không tìm thấy tài khoản để hoàn tiền.', 'error');
        return;
      }
      const transactionRecorded = changeBalance({
        userId: targetUser.id,
        type: 'refund',
        amount: refundAmount,
        description: `Hoàn tiền đơn #${order.id}${actionType === 'out_of_stock' ? ' do hết hàng' : ''}`,
        referenceId: order.id
      });
      if (!transactionRecorded) return;

      if (actionType === 'out_of_stock') {
        // Cập nhật đơn sang OutOfStock kèm ghi chú đã hoàn tiền
        setOrders(prevOrders => prevOrders.map(o => o.id === order.id ? {
          ...o,
          status: 'OutOfStock',
          progressStep: 0,
          progressPercent: 0,
          refundedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ', Hôm nay',
          notes: `Tạm hết tài nguyên/hạ tầng máy chủ. Đã hoàn lại ${formatVND(refundAmount)} vào ví. ${note ? `Lý do: ${note}` : ''}`
        } : o));

        setSelectedOrderForFulfill(null);
        showToast(`📦 Đã báo hết hàng đơn #${order.id} & hoàn lại ${formatVND(refundAmount)} vào ví cho ${order.customerName}!`);
        return;
      }

      // 3. Cập nhật trạng thái đơn hàng sang Refunded
      setOrders(prevOrders => prevOrders.map(o => o.id === order.id ? {
        ...o,
        status: 'Refunded',
        progressStep: 0,
        progressPercent: 0,
        refundedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ', Hôm nay',
        notes: `Đã hủy đơn & Hoàn lại ${formatVND(refundAmount)} vào ví. ${note ? `Lý do: ${note}` : ''}`
      } : o));

      setSelectedOrderForFulfill(null);
      showToast(`💸 Đã hủy đơn #${order.id} và hoàn lại ${formatVND(refundAmount)} vào ví cho ${order.customerName}!`);
    } else if (actionType === 'cancel') {
      setOrders(prevOrders => prevOrders.map(o => o.id === order.id ? {
        ...o,
        status: 'Cancelled',
        progressStep: 0,
        progressPercent: 0,
        notes: `Đã hủy đơn hàng (Không hoàn tiền). ${note ? `Lý do: ${note}` : ''}`
      } : o));

      setSelectedOrderForFulfill(null);
      showToast(`❌ Đã hủy đơn hàng #${order.id}!`);
    }
  };

  // Modals state
  const [selectedPlanForDeploy, setSelectedPlanForDeploy] = useState(null);
  const [selectedProxyForDeploy, setSelectedProxyForDeploy] = useState(null);
  const [selectedVpsForUpgrade, setSelectedVpsForUpgrade] = useState(null);
  const [selectedVpsForRenew, setSelectedVpsForRenew] = useState(null);
  const [editingVps, setEditingVps] = useState(null);

  const [isTopupModalOpen, setIsTopupModalOpen] = useState(false);
  const [topupAmount, setTopupAmount] = useState(100000);
  const openTopupModal = (amount = 100000) => {
    const numericAmount = Number(amount);
    setTopupAmount(Number.isFinite(numericAmount) ? Math.max(2000, Math.ceil(numericAmount)) : 100000);
    setIsTopupModalOpen(true);
  };
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isAccountProfileModalOpen, setIsAccountProfileModalOpen] = useState(false);
  const [isMyPackagesModalOpen, setIsMyPackagesModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login');

  // Admin Modals
  const [selectedOrderForFulfill, setSelectedOrderForFulfill] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [isCreatePlanModalOpen, setIsCreatePlanModalOpen] = useState(false);
  const [editingProxyPlan, setEditingProxyPlan] = useState(null);
  const [isCreateProxyModalOpen, setIsCreateProxyModalOpen] = useState(false);
  const [isManualProxyModalOpen, setIsManualProxyModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [isCreateCouponModalOpen, setIsCreateCouponModalOpen] = useState(false);
  const [isManualVpsModalOpen, setIsManualVpsModalOpen] = useState(false);
  const [isAddProviderModalOpen, setIsAddProviderModalOpen] = useState(false);
  const [isAddLocationModalOpen, setIsAddLocationModalOpen] = useState(false);

  // Sync to storage
  useEffect(() => { localStorage.setItem('zcloud_currentUser', JSON.stringify(currentUser)); }, [currentUser]);
  useEffect(() => { localStorage.setItem('zcloud_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('zcloud_vpsCategories', JSON.stringify(vpsCategories)); }, [vpsCategories]);
  useEffect(() => { localStorage.setItem('zcloud_plans', JSON.stringify(plans)); }, [plans]);
  useEffect(() => { localStorage.setItem('zcloud_proxyPlans', JSON.stringify(proxyPlans)); }, [proxyPlans]);
  useEffect(() => { localStorage.setItem('zcloud_proxyCountries', JSON.stringify(proxyCountries)); }, [proxyCountries]);
  useEffect(() => { localStorage.setItem('zcloud_proxyStockPool', JSON.stringify(proxyStockPool)); }, [proxyStockPool]);
  useEffect(() => { localStorage.setItem('zcloud_locations', JSON.stringify(locations)); }, [locations]);
  useEffect(() => { localStorage.setItem('zcloud_apiProviders', JSON.stringify(providers)); }, [providers]);
  useEffect(() => { localStorage.setItem('zcloud_userVps', JSON.stringify(userVps)); }, [userVps]);
  useEffect(() => { localStorage.setItem('zcloud_stockPool', JSON.stringify(stockPool)); }, [stockPool]);
  useEffect(() => { localStorage.setItem('zcloud_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('zcloud_coupons', JSON.stringify(coupons)); }, [coupons]);
  useEffect(() => { localStorage.setItem('zcloud_tickets', JSON.stringify(tickets)); }, [tickets]);
  useEffect(() => { localStorage.setItem('zcloud_transactions', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem('zcloud_supportChannels', JSON.stringify(supportChannels)); }, [supportChannels]);
  useEffect(() => { localStorage.setItem('zcloud_topupConfig', JSON.stringify(topupConfig)); }, [topupConfig]);
  useEffect(() => { localStorage.setItem('zcloud_upgradePricing', JSON.stringify(upgradePricing)); }, [upgradePricing]);
  useEffect(() => { localStorage.setItem('zcloud_upgradeLimits', JSON.stringify(upgradeLimits)); }, [upgradeLimits]);
  useEffect(() => { localStorage.setItem('zcloud_provisionMode', provisionMode); }, [provisionMode]);

  const formatVND = useMemo(
    () => (num) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num || 0),
    []
  );

  const myServers = useMemo(() => {
    if (!currentUser) return [];
    const curEmail = (currentUser.email || '').toLowerCase().trim();
    return userVps.filter(v => {
      const owner = (v.ownerEmail || v.assignedTo || v.customerEmail || '').toLowerCase().trim();
      if (owner) return owner === curEmail;
      if (currentUser.role === 'Admin') return true;
      return false;
    });
  }, [userVps, currentUser]);

  const displayServers = useMemo(() => {
    if (currentUser?.role === 'Admin' && adminViewAllServers) return userVps;
    return myServers;
  }, [userVps, myServers, currentUser, adminViewAllServers]);

  const myOrders = useMemo(() => {
    if (!currentUser) return [];
    const curEmail = (currentUser.email || '').toLowerCase().trim();
    return orders.filter(o => (o.customerEmail || '').toLowerCase().trim() === curEmail);
  }, [orders, currentUser]);

  const pendingMyOrders = useMemo(() => myOrders.filter(o => o.status === 'Pending'), [myOrders]);
  const pendingOrdersCount = useMemo(() => orders.filter(o => o.status === 'Pending').length, [orders]);

  // Ghi nhận lượt dùng mã giảm giá: trước đây `used` chỉ được tạo bằng 0 và không bao giờ tăng,
  // nên mã khuyến mãi dùng được vô hạn lượt dù Admin đã đặt `maxUses`.
  const consumeCoupon = (coupon) => {
    if (!coupon?.id) return;
    setCoupons(prev => prev.map(c => {
      if (c.id !== coupon.id) return c;
      const used = Number(c.used) || 0;
      const maxUses = Number(c.maxUses) || 100;
      const nextUsed = Math.min(maxUses, used + 1);
      const isExhausted = nextUsed >= maxUses;
      return { ...c, used: nextUsed, status: isExhausted ? 'Disabled' : c.status };
    }));
  };

  const handleDeployVps = (orderData) => {
    const isDailyOrder = orderData.billingType === 'daily';
    const calculatedDays = isDailyOrder ? (orderData.periodDays || 1) : (orderData.periodMonths || 1) * 30;

    const newOrder = {
      id: nextId('ord'),
      customerName: currentUser?.name || 'Khách vãng lai',
      customerEmail: currentUser?.email || 'guest@tlcloud.net',
      planId: orderData.plan.id,
      planName: orderData.plan.name,
      plan: orderData.plan,
      billingType: orderData.billingType || 'monthly',
      periodMonths: orderData.periodMonths || 1,
      periodDays: calculatedDays,
      requestedOs: orderData.os,
      requestedLocation: orderData.location,
      customEnv: orderData.customEnv || 'Mặc định',
      hostname: orderData.hostname,
      amountPaid: orderData.totalPaid,
      couponCode: orderData.appliedCoupon?.code || '',
      status: 'Pending',
      progressStep: 2,
      progressPercent: 50,
      createdAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ', Hôm nay',
      notes: `Khách đã thanh toán ${formatVND(orderData.totalPaid)} qua Ví${orderData.appliedCoupon ? ` (đã áp mã ${orderData.appliedCoupon.code})` : ''}`
    };

    if (!changeBalance({ type: 'purchase_vps', amount: -Number(orderData.totalPaid), description: `Thuê VPS: ${newOrder.planName}`, referenceId: newOrder.id })) return;
    setOrders(prev => [newOrder, ...prev]);
    consumeCoupon(orderData.appliedCoupon);
    setCurrentUser(prev => ({ ...prev, servers: (prev.servers || 0) + 1 }));
    setSelectedPlanForDeploy(null);
    showToast(`🔔 Đặt hàng thành công! Đơn hàng #${newOrder.id} đã gửi tới Admin.`);
    setView('portal');
  };

  const handleToggleAutoRenew = (vpsId) => {
    setUserVps(prev => prev.map(v => {
      if (v.id === vpsId) {
        const nextState = !v.autoRenew;
        showToast(`Tự động gia hạn cho ${v.name}: ${nextState ? 'ĐÃ BẬT' : 'ĐÃ TẮT'}`);
        return { ...v, autoRenew: nextState };
      }
      return v;
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-purple-600 selection:text-white flex flex-col relative overflow-x-hidden">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900 border border-purple-500/40 text-white shadow-2xl shadow-purple-950/60 backdrop-blur-md animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="text-sm font-semibold">{toast.msg}</span>
        </div>
      )}

      {/* Floating Category Drawer Button */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-40 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white py-3.5 px-2.5 rounded-r-2xl shadow-xl shadow-purple-900/40 border border-l-0 border-purple-400/30 flex flex-col items-center gap-1.5 transition-all hover:pl-3 group"
        title="Mở Danh Mục Dịch Vụ"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mb-1" />
        <Layers className="w-4 h-4 text-purple-200 group-hover:scale-110 transition-transform" />
        <span className="text-[10px] font-black tracking-widest uppercase [writing-mode:vertical-rl] rotate-180 text-purple-100">
          Danh Mục
        </span>
      </button>

      {/* 1. COMPONENT THANH ĐIỀU HƯỚNG TOPBAR */}
      <HeaderNavbar
        currentUser={currentUser}
        myServersCount={myServers.length}
        view={view}
        setView={setView}
        formatVND={formatVND}
        isAccountMenuOpen={isAccountMenuOpen}
        setIsAccountMenuOpen={setIsAccountMenuOpen}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        onOpenTopup={() => openTopupModal()}
        onOpenProfile={() => setIsAccountProfileModalOpen(true)}
        onOpenMyPackages={() => setIsMyPackagesModalOpen(true)}
        onOpenTickets={() => setIsTicketModalOpen(true)}
        onOpenAuth={(tab) => { setAuthTab(tab); setIsAuthModalOpen(true); }}
        onLogout={() => {
          setCurrentUser(null);
          setView('store');
          showToast('Đã đăng xuất thành công');
        }}
      />

      {/* 2. COMPONENT NGĂN KÉO DANH MỤC */}
      {isSidebarOpen && (
        <DrawerSidebar
          vpsCategories={vpsCategories}
          plans={plans}
          proxyPlans={proxyPlans}
          locations={locations}
          myServersCount={myServers.length}
          selectedCategoryFilter={selectedCategoryFilter}
          storeTab={storeTab}
          onClose={() => setIsSidebarOpen(false)}
          onSelectCategory={(catId) => {
            setSelectedCategoryFilter(catId);
            setStoreTab('vps');
            setView('store');
            setIsSidebarOpen(false);
          }}
          onSelectProxyStore={() => {
            setStoreTab('proxy');
            setView('store');
            setIsSidebarOpen(false);
          }}
          onGoPortal={() => {
            setView('portal');
            setIsSidebarOpen(false);
          }}
        />
      )}

      {/* 3. KHU VỰC NỘI DUNG CHÍNH (MAIN VIEWS) */}
      <main className="flex-1">
        {view === 'store' && (
          <StorefrontView
            storeTab={storeTab}
            setStoreTab={setStoreTab}
            selectedCategoryFilter={selectedCategoryFilter}
            setSelectedCategoryFilter={setSelectedCategoryFilter}
            vpsCategories={vpsCategories}
            plans={plans}
            proxyPlans={proxyPlans}
            pendingMyOrders={pendingMyOrders}
            myServers={myServers}
            formatVND={formatVND}
            onSelectPlanForDeploy={setSelectedPlanForDeploy}
            onSelectProxyForDeploy={setSelectedProxyForDeploy}
            onSelectVpsForRenew={setSelectedVpsForRenew}
            onToggleAutoRenew={handleToggleAutoRenew}
            onSelectVpsForUpgrade={setSelectedVpsForUpgrade}
            onGoPortal={() => setView('portal')}
            showToast={showToast}
          />
        )}

        {view === 'portal' && (
          <ClientPortalView
            currentUser={currentUser}
            myServers={myServers}
            displayServers={displayServers}
            pendingMyOrders={pendingMyOrders}
            adminViewAllServers={adminViewAllServers}
            setAdminViewAllServers={setAdminViewAllServers}
            totalVpsCount={userVps.length}
            formatVND={formatVND}
            onGoStore={() => setView('store')}
            onSelectVpsForRenew={setSelectedVpsForRenew}
            onToggleAutoRenew={handleToggleAutoRenew}
            onSelectVpsForUpgrade={setSelectedVpsForUpgrade}
            showToast={showToast}
          />
        )}

        {view === 'admin' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <AdminSidebar
                adminTab={adminTab}
                setAdminTab={setAdminTab}
                vpsCount={userVps.length}
                stockCount={stockPool.length}
                categoriesCount={vpsCategories.length}
                locationsCount={locations.length}
                pendingOrdersCount={pendingOrdersCount}
                totalOrdersCount={orders.length}
                usersCount={users.length}
                plansCount={plans.length}
                proxyPlansCount={proxyPlans.length}
                couponsCount={coupons.length}
                ticketsCount={tickets.length}
                transactionsCount={transactions.length}
              />

              <div className="flex-1 min-w-0">
                {adminTab === 'transactions' && (
                  <AdminTransactionsTab transactions={transactions} formatVND={formatVND} />
                )}

                {adminTab === 'balance-history' && (
                  <AdminBalanceHistoryTab transactions={transactions} formatVND={formatVND} />
                )}

                {adminTab === 'orders' && (
                  <AdminOrdersTab
                    orders={orders}
                    setOrders={setOrders}
                    pendingOrdersCount={pendingOrdersCount}
                    formatVND={formatVND}
                    onFulfillOrder={setSelectedOrderForFulfill}
                    showToast={showToast}
                  />
                )}

                {adminTab === 'vps' && (
                  <AdminVpsTab
                    userVps={userVps}
                    setUserVps={setUserVps}
                    onOpenManualVps={() => setIsManualVpsModalOpen(true)}
                    onEditVps={setEditingVps}
                    onSelectVpsForRenew={setSelectedVpsForRenew}
                    showToast={showToast}
                  />
                )}

                {adminTab === 'providers' && (
                  <AdminProvidersTab
                    provisionMode={provisionMode}
                    setProvisionMode={setProvisionMode}
                    providers={providers}
                    stockPool={stockPool}
                    setStockPool={setStockPool}
                    userVps={userVps}
                    setUserVps={setUserVps}
                    onOpenAddProvider={() => setIsAddProviderModalOpen(true)}
                    onOpenManualVps={() => setIsManualVpsModalOpen(true)}
                    showToast={showToast}
                  />
                )}

                {adminTab === 'categories' && (
                  <AdminCategoriesTab
                    vpsCategories={vpsCategories}
                    setVpsCategories={setVpsCategories}
                    plans={plans}
                    onOpenCreateCategory={() => setIsCreateCategoryModalOpen(true)}
                    onEditCategory={setEditingCategory}
                    showToast={showToast}
                  />
                )}

                {adminTab === 'locations' && (
                  <AdminLocationsTab
                    locations={locations}
                    setLocations={setLocations}
                    onOpenAddLocation={() => setIsAddLocationModalOpen(true)}
                    showToast={showToast}
                  />
                )}

                {adminTab === 'users' && (
                  <AdminUsersTab
                    users={users}
                    setUsers={setUsers}
                    currentUser={currentUser}
                    setCurrentUser={setCurrentUser}
                    onAdjustBalance={(userId, amount, description) => changeBalance({ userId, amount, type: 'admin_adjustment', description, referenceId: nextId(`admin-adjust-${userId}`) })}
                    formatVND={formatVND}
                    onOpenCreateUser={() => setIsCreateUserModalOpen(true)}
                    onEditUser={setEditingUser}
                    showToast={showToast}
                  />
                )}

                {adminTab === 'plans' && (
                  <AdminPlansTab
                    plans={plans}
                    upgradePricing={upgradePricing}
                    setUpgradePricing={setUpgradePricing}
                    upgradeLimits={upgradeLimits}
                    setUpgradeLimits={setUpgradeLimits}
                    formatVND={formatVND}
                    onOpenCreatePlan={() => setIsCreatePlanModalOpen(true)}
                    onEditPlan={setEditingPlan}
                    showToast={showToast}
                  />
                )}

                {adminTab === 'proxy' && (
                  <AdminProxyTab
                    proxyPlans={proxyPlans}
                    setProxyPlans={setProxyPlans}
                    proxyStockPool={proxyStockPool}
                    setProxyStockPool={setProxyStockPool}
                    formatVND={formatVND}
                    onOpenCreateProxyPlan={() => setIsCreateProxyModalOpen(true)}
                    onOpenManualProxy={() => setIsManualProxyModalOpen(true)}
                    onEditProxyPlan={setEditingProxyPlan}
                    showToast={showToast}
                  />
                )}

                {adminTab === 'coupons' && (
                  <AdminCouponsTab
                    coupons={coupons}
                    setCoupons={setCoupons}
                    vpsCategories={vpsCategories}
                    plans={plans}
                    proxyPlans={proxyPlans}
                    onOpenCreateCoupon={() => setIsCreateCouponModalOpen(true)}
                    showToast={showToast}
                  />
                )}

                {adminTab === 'tickets' && (
                  <AdminTicketsTab
                    tickets={tickets}
                    setTickets={setTickets}
                    supportChannels={supportChannels}
                    setSupportChannels={setSupportChannels}
                    showToast={showToast}
                  />
                )}

                {adminTab === 'settings' && (
                  <AdminSettingsTab
                    vpsCategories={vpsCategories}
                    plans={plans}
                    proxyPlans={proxyPlans}
                    proxyCountries={proxyCountries}
                    proxyStockPool={proxyStockPool}
                    locations={locations}
                    providers={providers}
                    userVps={userVps}
                    stockPool={stockPool}
                    orders={orders}
                    coupons={coupons}
                    tickets={tickets}
                    users={users}
                    upgradePricing={upgradePricing}
                    topupConfig={topupConfig}
                    setTopupConfig={setTopupConfig}
                    showToast={showToast}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 4. FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-purple-500" />
            <span className="font-bold text-slate-300">TLCloud.Net</span>
            <span>• Nền tảng Cloud VPS tốc độ cao cho GenZ & Developers</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <a
              href={supportChannels.zaloLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 flex items-center gap-1 font-bold transition"
            >
              <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
              <span>Zalo: {supportChannels.zaloPhone}</span>
            </a>
            <a
              href={supportChannels.fbLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-400 flex items-center gap-1 font-bold transition"
            >
              <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
              <span>Facebook Page</span>
            </a>
          </div>
          <div>© 2026 TLCloud. All rights reserved. Hệ thống đám mây tự động.</div>
        </div>
      </footer>

      {/* 4.1. NÚT NỔI LIÊN HỆ ZALO & FACEBOOK NHANH (FLOATING SUPPORT WIDGET) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2.5 items-end">
        {/* Nút Zalo */}
        <a
          href={supportChannels.zaloLink}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 px-3 py-2 rounded-full bg-[#0068FF] hover:bg-[#0055d4] text-white shadow-xl shadow-blue-900/50 transition-all hover:scale-105 active:scale-95 border border-blue-400/30"
          title="Chat Zalo Kỹ Thuật 24/7"
        >
          <div className="w-6 h-6 rounded-full bg-white text-[#0068FF] font-black text-[11px] flex items-center justify-center font-sans shadow">
            Z
          </div>
          <span className="text-xs font-bold pr-1 hidden group-hover:inline-block transition-all">
            Chat Zalo 24/7
          </span>
        </a>

        {/* Nút Facebook Messenger */}
        <a
          href={supportChannels.fbMessenger || supportChannels.fbLink}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-600 text-white shadow-xl shadow-indigo-900/50 transition-all hover:scale-105 active:scale-95 border border-indigo-400/30"
          title="Chat Facebook Messenger"
        >
          <div className="w-6 h-6 rounded-full bg-white text-indigo-600 font-black text-[11px] flex items-center justify-center font-sans shadow">
            f
          </div>
          <span className="text-xs font-bold pr-1 hidden group-hover:inline-block transition-all">
            Messenger
          </span>
        </a>
      </div>

      {/* 5. CÁC CỬA SỔ MODAL (MODALS DIALOGS) */}
      {selectedPlanForDeploy && (
        <CheckoutModal
          item={selectedPlanForDeploy}
          coupons={coupons}
          currentUser={currentUser}
          userBalance={currentUser?.balance || 0}
          formatVND={formatVND}
          onRequestTopup={(shortage) => {
            setSelectedPlanForDeploy(null);
            openTopupModal(shortage);
          }}
          onClose={() => setSelectedPlanForDeploy(null)}
          onSuccess={handleDeployVps}
        />
      )}

      {selectedProxyForDeploy && (
        <DeployProxyModal
          proxy={selectedProxyForDeploy}
          proxyCountries={proxyCountries}
          proxyStockPool={proxyStockPool}
          currentUser={currentUser}
          formatVND={formatVND}
          onRequestTopup={(shortage) => {
            setSelectedProxyForDeploy(null);
            openTopupModal(shortage);
          }}
          onClose={() => setSelectedProxyForDeploy(null)}
          onSuccess={(orderData) => {
            const newOrder = {
              id: nextId('ord-prx'),
              orderType: 'proxy',
              customerName: currentUser?.name || 'Khách vãng lai',
              customerEmail: currentUser?.email || 'guest@tlcloud.net',
              planId: orderData.proxyId,
              planName: `${orderData.proxyName} (${orderData.quantity} IP)`,
              protocol: orderData.protocol,
              country: orderData.country,
              requestedLocation: orderData.country,
              billingType: orderData.billingCycle,
              periodMonths: orderData.billingCycle === 'monthly' ? 1 : 0,
              periodDays: orderData.billingCycle === 'daily' ? 1 : 30,
              quantity: orderData.quantity,
              amountPaid: orderData.totalCost,
              status: 'Pending',
              progressStep: 2,
              progressPercent: 50,
              createdAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ', Hôm nay',
              notes: `Proxy ${orderData.protocol} - Quốc gia: ${orderData.country}`
            };

            if (!changeBalance({ type: 'purchase_proxy', amount: -Number(orderData.totalCost), description: `Mua Proxy: ${newOrder.planName}`, referenceId: newOrder.id })) return;
            setOrders(prev => [newOrder, ...prev]);
            setSelectedProxyForDeploy(null);
            showToast(`🔔 Đặt mua thành công! Đơn Proxy #${newOrder.id} đã gửi tới Admin.`);
            setView('portal');
          }}
        />
      )}

      {selectedVpsForUpgrade && (
        <UpgradeVpsModal
          vps={selectedVpsForUpgrade}
          upgradePricing={upgradePricing}
          upgradeLimits={upgradeLimits}
          currentUser={currentUser}
          formatVND={formatVND}
          onRequestTopup={(shortage) => {
            setSelectedVpsForUpgrade(null);
            openTopupModal(shortage);
          }}
          onClose={() => setSelectedVpsForUpgrade(null)}
          onSuccess={(upgradeOrderData) => {
            const targetVpsId = upgradeOrderData.vps?.id || upgradeOrderData.vpsId;
            const newOrder = {
              id: nextId('ord-upg'),
              orderType: 'upgrade',
              customerName: currentUser?.name || 'Khách hàng',
              customerEmail: currentUser?.email || 'guest@tlcloud.net',
              vpsId: targetVpsId,
              targetVpsId: targetVpsId,
              planName: `Nâng Cấp VPS: ${upgradeOrderData.vps?.name || 'Máy chủ'}`,
              requestedOs: upgradeOrderData.vps?.os,
              requestedLocation: upgradeOrderData.vps?.location,
              customEnv: `Thêm: +${upgradeOrderData.addCpu} vCPU, +${upgradeOrderData.addRam}GB RAM, +${upgradeOrderData.addDisk}GB NVMe`,
              amountPaid: upgradeOrderData.totalCost,
              status: 'Pending',
              progressStep: 2,
              progressPercent: 50,
              upgradeData: {
                ...upgradeOrderData,
                vpsId: targetVpsId
              },
              createdAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ', Hôm nay',
              notes: `Yêu cầu nâng cấp phần cứng - Trừ ví ${formatVND(upgradeOrderData.totalCost)}`
            };

            if (!changeBalance({ type: 'upgrade', amount: -Number(upgradeOrderData.totalCost), description: `Nâng cấp VPS: ${upgradeOrderData.vps?.name || targetVpsId}`, referenceId: newOrder.id })) return;
            setOrders(prev => [newOrder, ...prev]);
            setSelectedVpsForUpgrade(null);
            showToast(`🔔 Đã gửi yêu cầu nâng cấp! Đơn #${newOrder.id} đang chờ Admin phê duyệt.`);
            setView('portal');
          }}
        />
      )}

      {selectedVpsForRenew && (
        <RenewVpsModal
          vps={selectedVpsForRenew}
          currentUser={currentUser}
          formatVND={formatVND}
          onRequestTopup={(shortage) => {
            setSelectedVpsForRenew(null);
            openTopupModal(shortage);
          }}
          onClose={() => setSelectedVpsForRenew(null)}
          onSuccess={(renewedVps, cost) => {
            if (!changeBalance({ type: 'renewal', amount: -Number(cost), description: `Gia hạn dịch vụ: ${renewedVps.name}`, referenceId: nextId(`renew-${renewedVps.id}`) })) return;
            setUserVps(userVps.map(v => v.id === renewedVps.id ? renewedVps : v));
            setSelectedVpsForRenew(null);
            showToast(`Đã gia hạn thành công dịch vụ ${renewedVps.name}!`);
          }}
        />
      )}

      {isAccountProfileModalOpen && (
        <AccountProfileModal
          currentUser={currentUser}
          formatVND={formatVND}
          onClose={() => setIsAccountProfileModalOpen(false)}
          onUpdateUser={(updated) => {
            setCurrentUser(updated);
            setUsers(users.map(u => u.id === updated.id ? updated : u));
            setIsAccountProfileModalOpen(false);
            showToast('Đã cập nhật thông tin tài khoản!');
          }}
        />
      )}

      {isMyPackagesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-black text-lg text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-400" />
                <span>Gói Cước Đã Mua Của Bạn ({myServers.length})</span>
              </h3>
              <button onClick={() => setIsMyPackagesModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              {myServers.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  Tài khoản của bạn hiện chưa có gói cước nào hoạt động.
                </div>
              ) : (
                myServers.map((vps) => {
                  const isProxyItem = vps.itemType === 'proxy' || Boolean(vps.proxyString);
                  if (isProxyItem) {
                    const proxyDisplayStr = vps.proxyString || `${vps.ip}:${vps.port || '8080'}:${vps.username || 'user'}:${vps.rootPass || 'pass'}`;
                    return (
                      <div key={vps.id} className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-bold text-white text-sm flex items-center gap-2">
                              <span>{vps.name}</span>
                              <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 text-[10px] font-bold">
                                {vps.protocol}
                              </span>
                            </div>
                            <div className="text-xs text-cyan-400 font-mono mt-0.5">
                              {vps.country} • Còn {vps.daysLeft} ngày
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => { setIsMyPackagesModalOpen(false); setSelectedVpsForRenew(vps); }}
                              className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs"
                            >
                              Gia Hạn
                            </button>
                            <button
                              onClick={() => handleToggleAutoRenew(vps.id)}
                              className={`px-3 py-1.5 rounded-xl font-bold text-xs border transition ${
                                vps.autoRenew
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                              }`}
                            >
                              Auto: {vps.autoRenew ? 'BẬT' : 'TẮT'}
                            </button>
                          </div>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs flex items-center justify-between font-mono">
                          <span className="text-emerald-400 font-bold select-all break-all">{proxyDisplayStr}</span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(proxyDisplayStr);
                              showToast('Đã sao chép Proxy: IP:Port:User:Pass!');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-cyan-600 text-white font-bold text-[11px] flex items-center gap-1 flex-shrink-0"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </button>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div key={vps.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-white text-sm">{vps.name}</div>
                          <div className="text-xs text-purple-400 font-mono">
                            {vps.ip} • Còn {vps.daysLeft} ngày {vps.expiryDisplay ? `(${vps.expiryDisplay})` : ''}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => { setIsMyPackagesModalOpen(false); setSelectedVpsForRenew(vps); }}
                            className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs"
                          >
                            Gia Hạn
                          </button>
                          <button
                            onClick={() => handleToggleAutoRenew(vps.id)}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs border transition ${
                              vps.autoRenew
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                            }`}
                          >
                            Auto: {vps.autoRenew ? 'BẬT' : 'TẮT'}
                          </button>
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 text-xs space-y-1.5 font-mono text-[11px]">
                        <div className="flex justify-between items-center text-slate-300">
                          <span className="text-slate-400">User / Pass:</span>
                          <span className="font-bold">
                            <span className="text-white">{vps.username || 'root'}</span> / <span className="text-emerald-400">{vps.rootPass || 'Chờ cấp'}</span>
                          </span>
                        </div>
                        {vps.activationCode && (
                          <div className="flex justify-between items-center text-slate-300">
                            <span className="text-slate-400">Mã kích hoạt:</span>
                            <span className="text-amber-300 font-bold">{vps.activationCode}</span>
                          </div>
                        )}
                        {vps.panelUrl && (
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-1 border-t border-slate-800">
                            <span className="text-slate-400">Link Quản Lý:</span>
                            <a
                              href={vps.panelUrl.startsWith('http') ? vps.panelUrl : `https://${vps.panelUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 underline inline-flex items-center gap-1 font-bold"
                            >
                              <span>{vps.panelUrl}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                        <div className="pt-2 border-t border-slate-800">
                          <button
                            type="button"
                            onClick={() => {
                              downloadRdpFile(vps);
                              showToast(`Đã tải file ${vps.name}.rdp!`);
                            }}
                            className="w-full py-1.5 px-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 font-bold text-xs flex items-center justify-center gap-1.5 transition font-sans"
                          >
                            <Download className="w-3.5 h-3.5 text-blue-400" />
                            <span>Tải File Remote (.rdp)</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {isTopupModalOpen && (
        <TopupModal
          currentUser={currentUser}
          topupConfig={topupConfig}
          initialAmount={topupAmount}
          formatVND={formatVND}
          onClose={() => setIsTopupModalOpen(false)}
          onSuccess={(amount) => {
            const numericAmount = Number(amount);
            if (!Number.isSafeInteger(numericAmount) || numericAmount < 2000) {
              showToast('Số tiền nạp tối thiểu là 2.000 VNĐ.', 'error');
              return;
            }
            if (!changeBalance({ type: 'topup', amount: numericAmount, description: 'Nạp tiền vào ví qua VietQR', referenceId: nextId('topup') })) return;
            setIsTopupModalOpen(false);
            showToast(`Nạp thành công ${formatVND(numericAmount)} vào ví!`);
          }}
        />
      )}

      {isTicketModalOpen && (
        <SupportTicketModal
          currentUser={currentUser}
          supportChannels={supportChannels}
          onClose={() => setIsTicketModalOpen(false)}
          onSuccess={(newTk) => {
            setTickets(prev => [newTk, ...prev]);
            setIsTicketModalOpen(false);
            showToast('Ticket đã được gửi tới đội ngũ kỹ thuật 24/7!');
          }}
        />
      )}

      {isAuthModalOpen && (
        <AuthModal
          initialTab={authTab}
          users={users}
          setUsers={setUsers}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={(user) => {
            setCurrentUser(user);
            setIsAuthModalOpen(false);
            if (user.role === 'Admin') {
              setView('admin');
              setAdminTab('orders');
              showToast(`Chào mừng Quản trị viên ${user.name}!`);
            } else {
              setView('store');
              showToast(`Đăng nhập thành công! Chào mừng ${user.name}`);
            }
          }}
          showToast={showToast}
        />
      )}

      {editingPlan && (
        <EditPlanModal
          plan={editingPlan}
          vpsCategories={vpsCategories}
          locations={locations}
          formatVND={formatVND}
          onClose={() => setEditingPlan(null)}
          onSave={(savedPlan) => {
            setPlans(plans.map(p => p.id === savedPlan.id ? savedPlan : p));
            setEditingPlan(null);
            showToast(`Đã lưu cấu hình gói ${savedPlan.name}!`);
          }}
        />
      )}

      {isCreatePlanModalOpen && (
        <CreatePlanModal
          vpsCategories={vpsCategories}
          locations={locations}
          formatVND={formatVND}
          onClose={() => setIsCreatePlanModalOpen(false)}
          onAdd={(newPlan) => {
            setPlans(prev => [...prev, newPlan]);
            setIsCreatePlanModalOpen(false);
            showToast(`Đã tạo gói VPS ${newPlan.name}!`);
          }}
        />
      )}

      {editingProxyPlan && (
        <EditProxyPlanModal
          plan={editingProxyPlan}
          proxyCountries={proxyCountries}
          formatVND={formatVND}
          onClose={() => setEditingProxyPlan(null)}
          onSave={(saved) => {
            setProxyPlans(proxyPlans.map(p => p.id === saved.id ? saved : p));
            setEditingProxyPlan(null);
            showToast(`Đã lưu gói proxy ${saved.name}!`);
          }}
        />
      )}

      {isCreateProxyModalOpen && (
        <CreateProxyPlanModal
          proxyCountries={proxyCountries}
          formatVND={formatVND}
          onClose={() => setIsCreateProxyModalOpen(false)}
          onAdd={(newProxy) => {
            setProxyPlans(prev => [...prev, newProxy]);
            setIsCreateProxyModalOpen(false);
            showToast(`Đã thêm gói proxy ${newProxy.name}!`);
          }}
        />
      )}

      {isManualProxyModalOpen && (
        <ManualProxyModal
          proxyCountries={proxyCountries}
          onClose={() => setIsManualProxyModalOpen(false)}
          onAddBatch={(newProxies) => {
            setProxyStockPool(prev => [...newProxies, ...prev]);
            setIsManualProxyModalOpen(false);
            showToast(`🎉 Đã nhập thành công ${newProxies.length} Proxy thủ công!`);
          }}
        />
      )}

      {isCreateCategoryModalOpen && (
        <CreateCategoryModal
          onClose={() => setIsCreateCategoryModalOpen(false)}
          onAdd={(newCat) => {
            setVpsCategories(prev => [...prev, newCat]);
            setIsCreateCategoryModalOpen(false);
            showToast(`Đã tạo danh mục ${newCat.name}!`);
          }}
        />
      )}

      {editingCategory && (
        <EditCategoryModal
          category={editingCategory}
          onClose={() => setEditingCategory(null)}
          onSave={(savedCat) => {
            setVpsCategories(vpsCategories.map(c => c.id === savedCat.id ? savedCat : c));
            setEditingCategory(null);
            showToast('Đã lưu danh mục thành công!');
          }}
        />
      )}

      {editingUser && (
        <EditUserModal
          user={editingUser}
          formatVND={formatVND}
          onClose={() => setEditingUser(null)}
          onSave={(savedUser) => {
            const balanceDelta = Number(savedUser.balance) - (Number(editingUser.balance) || 0);
            if (balanceDelta !== 0 && !changeBalance({ userId: savedUser.id, type: 'admin_adjustment', amount: balanceDelta, description: 'Admin cập nhật số dư trực tiếp', referenceId: nextId(`admin-adjust-${savedUser.id}`) })) return;
            setUsers(prev => prev.map(u => u.id === savedUser.id ? savedUser : u));
            if (currentUser?.id === savedUser.id) setCurrentUser(savedUser);
            setEditingUser(null);
            showToast('Đã cập nhật thông tin thành viên!');
          }}
          showToast={showToast}
        />
      )}

      {isCreateUserModalOpen && (
        <CreateUserModal
          onClose={() => setIsCreateUserModalOpen(false)}
          onAdd={(newUser) => {
            setUsers(prev => [...prev, newUser]);
            setIsCreateUserModalOpen(false);
            showToast(`Đã thêm thành viên ${newUser.name}!`);
          }}
        />
      )}

      {isCreateCouponModalOpen && (
        <CreateCouponModal
          vpsCategories={vpsCategories}
          plans={plans}
          proxyPlans={proxyPlans}
          onClose={() => setIsCreateCouponModalOpen(false)}
          onAdd={(newCoupon) => {
            setCoupons(prev => [newCoupon, ...prev]);
            setIsCreateCouponModalOpen(false);
            showToast(`🎉 Đã tạo mã giảm giá ${newCoupon.code} (-${newCoupon.discount}%) thành công!`);
          }}
        />
      )}

      {selectedOrderForFulfill && (
        <FulfillOrderModal
          order={selectedOrderForFulfill}
          locations={locations}
          proxyStockPool={proxyStockPool}
          formatVND={formatVND}
          onClose={() => setSelectedOrderForFulfill(null)}
          onSpecialAction={(actionType, note) => handleOrderSpecialAction(selectedOrderForFulfill, actionType, note)}
          onFulfill={(fulfilledData) => {
            if (fulfilledData.isUpgrade) {
              const targetVpsId = fulfilledData.upgradeData?.vpsId || fulfilledData.upgradeData?.vps?.id || selectedOrderForFulfill.vpsId || selectedOrderForFulfill.targetVpsId;
              const addCpu = Number(fulfilledData.upgradeData?.addCpu || 0);
              const addRam = Number(fulfilledData.upgradeData?.addRam || 0);
              const addDisk = Number(fulfilledData.upgradeData?.addDisk || 0);
              const monthlyUpgradeCost = Number(fulfilledData.upgradeData?.monthlyUpgradeCost || 0);

              let updatedVpsName = '';
              let newCpu = 0, newRam = 0, newDisk = 0;

              setUserVps(prev => prev.map(v => {
                if (v.id === targetVpsId) {
                  updatedVpsName = v.name;
                  newCpu = (Number(v.cpu) || 0) + addCpu;
                  newRam = (Number(v.ram) || 0) + addRam;
                  newDisk = (Number(v.disk) || 0) + addDisk;
                  return {
                    ...v,
                    cpu: newCpu,
                    ram: newRam,
                    disk: newDisk,
                    upgradeMonthlyCost: (Number(v.upgradeMonthlyCost) || 0) + monthlyUpgradeCost
                  };
                }
                return v;
              }));

              setOrders(prev => prev.map(o => o.id === selectedOrderForFulfill.id ? {
                ...o,
                status: 'Completed',
                progressStep: 4,
                progressPercent: 100,
                fulfilledInfo: {
                  ip: 'Đã nâng cấp phần cứng VPS thành công',
                  activationCode: 'UPGRADE-APPROVED',
                  details: `+${addCpu} vCPU, +${addRam}GB RAM, +${addDisk}GB NVMe`
                }
              } : o));

              setSelectedOrderForFulfill(null);
              showToast(`🎉 Đã duyệt nâng cấp VPS [${updatedVpsName || 'Máy chủ'}] thành công! Cấu hình mới: ${newCpu} vCPU / ${newRam}GB RAM / ${newDisk}GB NVMe.`);
              return;
            }

            if (fulfilledData.isProxy) {
              setOrders(prev => prev.map(o => o.id === selectedOrderForFulfill.id ? {
                ...o,
                status: 'Completed',
                progressStep: 4,
                progressPercent: 100,
                fulfilledInfo: fulfilledData
              } : o));

              const createdProxy = {
                id: nextId('prx'),
                name: `Proxy Dedicated - ${fulfilledData.country}`,
                itemType: 'proxy',
                source: 'manual',
                orderId: selectedOrderForFulfill.id,
                ownerEmail: selectedOrderForFulfill.customerEmail,
                ownerName: selectedOrderForFulfill.customerName,
                assignedTo: selectedOrderForFulfill.customerEmail,
                planName: selectedOrderForFulfill.planName,
                protocol: fulfilledData.protocol,
                country: fulfilledData.country,
                proxyString: fulfilledData.proxyString,
                ip: fulfilledData.ip,
                port: fulfilledData.port,
                username: fulfilledData.username,
                rootPass: fulfilledData.password,
                status: 'Running',
                daysLeft: 30,
                basePrice: selectedOrderForFulfill.amountPaid,
                allowRenew: true
              };

              setUserVps(prev => [createdProxy, ...prev]);
              setSelectedOrderForFulfill(null);
              showToast(`🎉 Bàn giao Proxy thành công cho ${selectedOrderForFulfill.customerEmail}!`);
              return;
            }

            setOrders(prev => prev.map(o => o.id === selectedOrderForFulfill.id ? {
              ...o,
              status: 'Completed',
              progressStep: 4,
              progressPercent: 100,
              fulfilledInfo: fulfilledData
            } : o));

            const matchedPlan = plans.find(p => p.id === selectedOrderForFulfill.planId) || selectedOrderForFulfill.plan;
            const standardOneMonthPrice = matchedPlan?.price || (
              selectedOrderForFulfill.periodMonths > 0
                ? Math.round(selectedOrderForFulfill.amountPaid / selectedOrderForFulfill.periodMonths)
                : selectedOrderForFulfill.amountPaid
            );

            const createdVps = {
              id: nextId('vps'),
              name: fulfilledData.vpsName,
              source: 'manual',
              orderId: selectedOrderForFulfill.id,
              ownerEmail: selectedOrderForFulfill.customerEmail,
              ownerName: selectedOrderForFulfill.customerName,
              assignedTo: selectedOrderForFulfill.customerEmail,
              planId: selectedOrderForFulfill.planId,
              planName: selectedOrderForFulfill.planName,
              plan: matchedPlan,
              pricingTiers: matchedPlan?.pricingTiers || selectedOrderForFulfill.plan?.pricingTiers,
              billingType: selectedOrderForFulfill.billingType || 'monthly',
              allowRenew: selectedOrderForFulfill.billingType === 'daily'
                ? Boolean(matchedPlan?.allowDailyRenew)
                : true,
              ip: fulfilledData.ip,
              status: 'Running',
              cpu: matchedPlan?.cpu || selectedOrderForFulfill.plan?.cpu || 2,
              ram: matchedPlan?.ram || selectedOrderForFulfill.plan?.ram || 4,
              disk: matchedPlan?.disk || selectedOrderForFulfill.plan?.disk || 50,
              os: fulfilledData.os,
              location: fulfilledData.country,
              customEnv: selectedOrderForFulfill.customEnv || 'Mặc định',
              autoRenew: false,
              daysLeft: fulfilledData.totalDays,
              expiryDisplay: fulfilledData.expiryDate,
              basePrice: standardOneMonthPrice,
              upgradeMonthlyCost: 0,
              renewMonths: 1,
              username: fulfilledData.username,
              rootPass: fulfilledData.password,
              activationCode: fulfilledData.activationCode,
              panelUrl: fulfilledData.panelUrl
            };

            setUserVps(prev => [createdVps, ...prev]);
            setSelectedOrderForFulfill(null);
            showToast(`🎉 Bàn giao VPS [${createdVps.name}] thành công!`);
          }}
        />
      )}

      {editingVps && (
        <EditVpsModal
          vps={editingVps}
          users={users}
          locations={locations}
          onClose={() => setEditingVps(null)}
          onSave={(updatedVps) => {
            setUserVps(userVps.map(v => v.id === updatedVps.id ? updatedVps : v));
            setEditingVps(null);
            showToast(`✅ Đã cập nhật thành công máy chủ [${updatedVps.name}]!`);
          }}
        />
      )}

      {isAddProviderModalOpen && (
        <AddProviderModal
          onClose={() => setIsAddProviderModalOpen(false)}
          onAdd={(newP) => {
            setProviders(prev => [...prev, newP]);
            setIsAddProviderModalOpen(false);
            showToast(`Đã thêm cụm API ${newP.name}!`);
          }}
        />
      )}

      {isAddLocationModalOpen && (
        <AddLocationModal
          onClose={() => setIsAddLocationModalOpen(false)}
          onAdd={(newL) => {
            setLocations(prev => [...prev, newL]);
            setIsAddLocationModalOpen(false);
            showToast(`Đã thêm Data Center ${newL.name}!`);
          }}
        />
      )}

      {isManualVpsModalOpen && (
        <ManualVpsModal
          users={users}
          plans={plans}
          locations={locations}
          formatVND={formatVND}
          onClose={() => setIsManualVpsModalOpen(false)}
          onSuccess={(newVps) => {
            setUserVps(prev => [newVps, ...prev]);
            setIsManualVpsModalOpen(false);
            showToast(`🎉 Đã cấp phát VPS [${newVps.name}] cho ${newVps.ownerEmail}!`);
          }}
        />
      )}
    </div>
  );
}

// =========================================================================
// CÁC PHÂN HỆ GIAO DIỆN CHÍNH (HEADER, SIDEBAR, STOREFRONT, PORTAL, ADMIN)
// =========================================================================

function HeaderNavbar({
  currentUser,
  myServersCount,
  view,
  setView,
  formatVND,
  isAccountMenuOpen,
  setIsAccountMenuOpen,
  onOpenSidebar,
  onOpenTopup,
  onOpenProfile,
  onOpenMyPackages,
  onOpenTickets,
  onOpenAuth,
  onLogout
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-900 bg-slate-950/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSidebar}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-purple-500/40 transition"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div
            onClick={() => setView('store')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-900/40">
              <Server className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base tracking-tight text-white">TLCloud</span>
                <span className="px-1.5 py-0.5 rounded-md bg-purple-500/20 border border-purple-500/30 text-[10px] font-bold text-purple-300">
                  PRO
                </span>
              </div>
              <div className="text-[10px] text-slate-400 hidden sm:block">Cloud VPS & Proxy Tốc Độ Cao</div>
            </div>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setView('store')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              view === 'store' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Cửa Hàng Dịch Vụ</span>
          </button>
          <button
            onClick={() => setView('portal')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              view === 'portal' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Máy Chủ Của Tôi ({myServersCount})</span>
          </button>
          {currentUser?.role === 'Admin' && (
            <button
              onClick={() => setView('admin')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                view === 'admin'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-amber-400 hover:bg-amber-500/10'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
            </button>
          )}
        </nav>

        <div className="flex items-center gap-2.5">
          {currentUser ? (
            <>
              <div
                onClick={onOpenTopup}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-emerald-500/30 cursor-pointer hover:border-emerald-400 transition"
              >
                <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {formatVND(currentUser.balance)}
                </span>
                <Plus className="w-3.5 h-3.5 text-emerald-300 bg-emerald-500/20 rounded" />
              </div>

              <div className="relative">
                <button
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-bold text-white"
                >
                  <User className="w-3.5 h-3.5 text-purple-400" />
                  <span className="max-w-[110px] truncate">{currentUser.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isAccountMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50 text-xs">
                    <div className="px-4 py-2 border-b border-slate-800">
                      <div className="font-bold text-white">{currentUser.name}</div>
                      <div className="text-[11px] text-slate-400 truncate">{currentUser.email}</div>
                    </div>
                    <button
                      onClick={() => { setIsAccountMenuOpen(false); onOpenProfile(); }}
                      className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                    >
                      <User className="w-3.5 h-3.5 text-purple-400" />
                      <span>Hồ Sơ Tài Khoản</span>
                    </button>
                    <button
                      onClick={() => { setIsAccountMenuOpen(false); onOpenMyPackages(); }}
                      className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                    >
                      <Layers className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Gói Cước Đã Mua ({myServersCount})</span>
                    </button>
                    <button
                      onClick={() => { setIsAccountMenuOpen(false); onOpenTopup(); }}
                      className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                    >
                      <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Nạp Tiền Tự Động</span>
                    </button>
                    <button
                      onClick={() => { setIsAccountMenuOpen(false); onOpenTickets(); }}
                      className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                    >
                      <LifeBuoy className="w-3.5 h-3.5 text-amber-400" />
                      <span>Hỗ Trợ Kỹ Thuật 24/7</span>
                    </button>
                    <div className="border-t border-slate-800 mt-1 pt-1">
                      <button
                        onClick={() => { setIsAccountMenuOpen(false); onLogout(); }}
                        className="w-full px-4 py-2 text-left text-rose-400 hover:bg-slate-800 flex items-center gap-2 font-bold"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Đăng Xuất</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 hover:text-white"
              >
                Đăng Nhập
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white"
              >
                Đăng Ký
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function DrawerSidebar({
  vpsCategories,
  plans,
  proxyPlans,
  myServersCount,
  selectedCategoryFilter,
  storeTab,
  onClose,
  onSelectCategory,
  onSelectProxyStore,
  onGoPortal
}) {
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-80 max-w-[85vw] bg-slate-900 border-r border-slate-800 h-full p-5 flex flex-col justify-between overflow-y-auto z-10">
        <div className="space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="font-black text-base text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-400" />
              <span>Danh Mục Dịch Vụ</span>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2">
              Cloud Server & VPS
            </div>
            <button
              onClick={() => onSelectCategory('all')}
              className={`w-full px-3 py-2.5 rounded-xl text-left font-bold flex items-center justify-between transition ${
                storeTab === 'vps' && selectedCategoryFilter === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>🌟 Tất Cả Danh Mục VPS</span>
              <span className="text-[11px] font-mono opacity-80">{plans.length}</span>
            </button>
            {vpsCategories.map(cat => {
              const count = plans.filter(p => p.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`w-full px-3 py-2.5 rounded-xl text-left font-bold flex items-center justify-between transition ${
                    storeTab === 'vps' && selectedCategoryFilter === cat.id
                      ? 'bg-purple-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="truncate">{cat.icon} {cat.name}</span>
                  <span className="text-[11px] font-mono opacity-80">{count}</span>
                </button>
              );
            })}
          </div>

          <div className="space-y-1.5 text-xs pt-2 border-t border-slate-800">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2">
              Proxy Chuyên Dụng
            </div>
            <button
              onClick={onSelectProxyStore}
              className={`w-full px-3 py-2.5 rounded-xl text-left font-bold flex items-center justify-between transition ${
                storeTab === 'proxy' ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>🌐 Gian Hàng Proxy IPv4/SOCKS5</span>
              <span className="text-[11px] font-mono opacity-80">{proxyPlans.length}</span>
            </button>
          </div>
        </div>

        <button
          onClick={onGoPortal}
          className="w-full py-3 rounded-2xl bg-slate-950 border border-purple-500/40 text-purple-300 font-bold text-xs flex items-center justify-center gap-2 hover:bg-purple-600 hover:text-white transition"
        >
          <Terminal className="w-4 h-4" />
          <span>Quản Lý Máy Chủ Của Tôi ({myServersCount})</span>
        </button>
      </div>
    </div>
  );
}

function StorefrontView({
  storeTab,
  setStoreTab,
  selectedCategoryFilter,
  setSelectedCategoryFilter,
  vpsCategories,
  plans,
  proxyPlans,
  pendingMyOrders,
  myServers,
  formatVND,
  onSelectPlanForDeploy,
  onSelectProxyForDeploy,
  onSelectVpsForRenew,
  onToggleAutoRenew,
  onSelectVpsForUpgrade,
  onGoPortal,
  showToast
}) {
  const representativePlans = useMemo(() => {
    return vpsCategories.map(cat => {
      const catPlans = plans.filter(p => p.category === cat.id);
      return {
        category: cat,
        plan: catPlans[0] || null,
        totalCount: catPlans.length
      };
    }).filter(item => item.plan !== null);
  }, [vpsCategories, plans]);

  const filteredPlans = useMemo(() => {
    if (selectedCategoryFilter === 'all') return plans;
    return plans.filter(p => p.category === selectedCategoryFilter);
  }, [plans, selectedCategoryFilter]);

  const activeCategoryObj = useMemo(() => {
    return vpsCategories.find(c => c.id === selectedCategoryFilter);
  }, [vpsCategories, selectedCategoryFilter]);

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Hero Gen Z / Tech */}
      <section className="relative overflow-hidden rounded-[2rem] border border-purple-500/25 bg-gradient-to-br from-[#17113b] via-slate-950 to-[#062d3c] p-6 sm:p-10 shadow-2xl shadow-purple-950/30">
        <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(139,92,246,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,.14)_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="relative grid items-center gap-8 lg:grid-cols-[1.3fr_.7fr]">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.18em] text-emerald-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> Infrastructure online · 99.99% uptime
            </div>
            <h1 className="max-w-3xl text-3xl font-black leading-tight text-white sm:text-5xl">
              Build nhanh hơn.<br /><span className="bg-gradient-to-r from-fuchsia-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent">Deploy ngầu hơn.</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">Cloud VPS NVMe và Proxy chuyên dụng cho dev, bot, game server và mọi project đang cần tốc độ. Bật máy trong vài phút, quản lý cực chill.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={() => { setStoreTab('vps'); setSelectedCategoryFilter('all'); }} className="group inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-xs font-black text-slate-950 shadow-lg shadow-purple-950/40 transition hover:-translate-y-0.5 hover:bg-cyan-100">
                <Zap className="h-4 w-4 text-purple-600" /> Khám phá VPS <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
              <button onClick={() => setStoreTab('proxy')} className="inline-flex items-center gap-2 rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-3 text-xs font-black text-cyan-200 transition hover:-translate-y-0.5 hover:bg-cyan-300/20">
                <Globe className="h-4 w-4" /> Mở kho Proxy
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            {[
              { icon: Activity, value: '1ms', label: 'Ping nội địa', color: 'text-emerald-300' },
              { icon: Server, value: `${plans.length + proxyPlans.length}+`, label: 'Gói sẵn sàng', color: 'text-purple-300' },
              { icon: Shield, value: '24/7', label: 'Support online', color: 'text-cyan-300' },
              { icon: Sparkles, value: '10Gbps', label: 'Network speed', color: 'text-fuchsia-300' }
            ].map(({ icon: Icon, value, label, color }) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[.06] p-4 backdrop-blur-sm">
                <Icon className={`mb-3 h-4 w-4 ${color}`} />
                <div className={`font-mono text-xl font-black ${color}`}>{value}</div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {pendingMyOrders.length > 0 && (
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-amber-500/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-300 font-black text-sm">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Đơn Hàng Đang Xử Lý & Cấu Hình ({pendingMyOrders.length})</span>
            </div>
            <button onClick={onGoPortal} className="text-xs text-purple-400 hover:underline font-bold">
              Xem chi tiết tại Bảng điều khiển &rarr;
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingMyOrders.map(ord => (
              <div key={ord.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">#{ord.id} • {ord.planName}</span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                    ⏳ Chờ Admin Duyệt
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-purple-500 w-2/3 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chuyển tab VPS / Proxy */}
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-800/80 bg-slate-900/60 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <div className="mb-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-[.2em] text-purple-300"><span className="h-1.5 w-1.5 rounded-full bg-purple-400" /> Store / {storeTab === 'vps' ? 'Compute' : 'Network'}</div>
          <h2 className="text-xl font-black text-white sm:text-2xl">
            {storeTab === 'vps' ? 'Cloud Server & VPS NVMe' : 'Proxy IPv4 & Residential'}
          </h2>
          <p className="mt-1 text-xs text-slate-400">Chọn stack của bạn · thanh toán bằng ví · nhận bàn giao nhanh</p>
        </div>
        <div className="flex w-full gap-1 rounded-2xl border border-slate-800 bg-slate-950 p-1.5 sm:w-auto">
          <button onClick={() => setStoreTab('vps')} className={`flex-1 rounded-xl px-4 py-2.5 text-xs font-black transition sm:flex-none ${storeTab === 'vps' ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg shadow-purple-950/50' : 'text-slate-500 hover:text-white'}`}>
            <span className="mr-1.5">⚡</span> Cloud VPS <span className="ml-1 font-mono opacity-70">{plans.length}</span>
          </button>
          <button onClick={() => setStoreTab('proxy')} className={`flex-1 rounded-xl px-4 py-2.5 text-xs font-black transition sm:flex-none ${storeTab === 'proxy' ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-950/50' : 'text-slate-500 hover:text-white'}`}>
            <span className="mr-1.5">◎</span> Proxy <span className="ml-1 font-mono opacity-70">{proxyPlans.length}</span>
          </button>
        </div>
      </div>

      {storeTab === 'vps' ? (
        <div className="space-y-6">
          {/* Thanh chọn danh mục */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategoryFilter('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
                selectedCategoryFilter === 'all'
                  ? 'bg-purple-600 text-white border-purple-500'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              🌟 Đại Diện Các Danh Mục
            </button>
            {vpsCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryFilter(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
                  selectedCategoryFilter === cat.id
                    ? 'bg-purple-600 text-white border-purple-500'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>

          {selectedCategoryFilter === 'all' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {representativePlans.map(({ category, plan, totalCount }) => (
                <div
                  key={category.id}
                  className="rounded-3xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 p-5 flex flex-col justify-between gap-4 transition group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{category.icon}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[10px] font-bold">
                        {totalCount} Gói Cước
                      </span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-purple-400">{category.name}</div>
                      <h3 className="text-base font-black text-white mt-0.5">{plan.name}</h3>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{category.description}</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Vi xử lý:</span>
                        <strong className="text-white">{plan.cpu} vCPU Core</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Bộ nhớ RAM:</span>
                        <strong className="text-cyan-300">{plan.ram} GB DDR4</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Ổ cứng:</span>
                        <strong className="text-amber-300">{plan.disk} GB NVMe</strong>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-2 border-t border-slate-800">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[11px] text-slate-400">Giá khởi điểm:</span>
                      <span className="text-lg font-black text-emerald-400 font-mono">
                        {formatVND(plan.price)}<span className="text-xs text-slate-500 font-normal">/th</span>
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedCategoryFilter(category.id)}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow"
                    >
                      <span>Khám Phá Tất Cả {totalCount} Gói</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onSelectPlanForDeploy(plan)}
                      className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
                    >
                      Thuê Nhanh Gói Này
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-900 p-4 rounded-2xl border border-slate-800">
                <div>
                  <h2 className="font-black text-base text-white">
                    {activeCategoryObj?.icon} {activeCategoryObj?.name}
                  </h2>
                  <p className="text-xs text-slate-400">{activeCategoryObj?.description}</p>
                </div>
                <button
                  onClick={() => setSelectedCategoryFilter('all')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200"
                >
                  &larr; Quay Lại Tất Cả Danh Mục
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {filteredPlans.map(plan => (
                  <div
                    key={plan.id}
                    className="rounded-3xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 p-6 flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                          {plan.badge || 'Cloud NVMe'}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">{plan.bandwidth}</span>
                      </div>
                      <h3 className="text-lg font-black text-white">{plan.name}</h3>
                      <p className="text-xs text-slate-400">{plan.tagline}</p>
                      <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">CPU:</span>
                          <strong className="text-white">{plan.cpu} vCPU</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">RAM:</span>
                          <strong className="text-cyan-300">{plan.ram} GB</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">NVMe:</span>
                          <strong className="text-amber-300">{plan.disk} GB</strong>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3 pt-2 border-t border-slate-800">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs text-slate-400">Đơn giá:</span>
                        <span className="text-xl font-black text-emerald-400 font-mono">
                          {formatVND(plan.price)}<span className="text-xs text-slate-500 font-normal">/tháng</span>
                        </span>
                      </div>
                      <button
                        onClick={() => onSelectPlanForDeploy(plan)}
                        className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg"
                      >
                        Cấu Hình & Thuê Ngay
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {proxyPlans.map(prx => (
            <div
              key={prx.id}
              className="rounded-3xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 p-6 flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">
                    {prx.protocol}
                  </span>
                  <span className="text-xs text-slate-400">{prx.country}</span>
                </div>
                <h3 className="text-lg font-black text-white">{prx.name}</h3>
                <p className="text-xs text-slate-400">{prx.desc}</p>
              </div>
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-400">Đơn giá:</span>
                  <span className="text-xl font-black text-emerald-400 font-mono">
                    {formatVND(prx.price)}<span className="text-xs text-slate-500 font-normal">/tháng</span>
                  </span>
                </div>
                <button
                  onClick={() => onSelectProxyForDeploy(prx)}
                  className="w-full py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs"
                >
                  Mua Proxy Ngay
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ClientPortalView({
  currentUser,
  myServers,
  displayServers,
  pendingMyOrders,
  adminViewAllServers,
  setAdminViewAllServers,
  totalVpsCount,
  formatVND,
  onGoStore,
  onSelectVpsForRenew,
  onToggleAutoRenew,
  onSelectVpsForUpgrade,
  showToast
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-purple-400" />
            <span>Bảng Điều Khiển Máy Chủ & Proxy Cá Nhân</span>
          </h1>
          <p className="text-xs text-slate-400">
            Tài khoản: <strong className="text-white">{currentUser?.email}</strong> • Hiển thị đúng dịch vụ thuộc sở hữu của bạn
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentUser?.role === 'Admin' && (
            <button
              onClick={() => setAdminViewAllServers(!adminViewAllServers)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
                adminViewAllServers
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              {adminViewAllServers ? `Đang xem Toàn Hệ Thống (${totalVpsCount})` : `Đang xem Của Tôi (${myServers.length})`}
            </button>
          )}
          <button
            onClick={onGoStore}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Thuê Thêm VPS / Proxy</span>
          </button>
        </div>
      </div>

      {/* Tiến trình đơn hàng đang chờ (ẩn hoàn toàn khi đã bàn giao) */}
      {pendingMyOrders.length > 0 && (
        <div className="p-5 rounded-3xl bg-slate-900 border border-amber-500/40 space-y-3">
          <div className="text-sm font-black text-amber-300 flex items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Tiến Trình Đơn Hàng Đang Chờ Phê Duyệt ({pendingMyOrders.length})</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingMyOrders.map(ord => (
              <div key={ord.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                <div className="flex justify-between">
                  <strong className="text-white">#{ord.id} • {ord.planName}</strong>
                  <span className="text-emerald-400 font-mono font-bold">{formatVND(ord.amountPaid)}</span>
                </div>
                <div className="text-slate-400">{ord.customEnv || ord.notes}</div>
                <div className="text-[11px] text-amber-300 font-semibold">
                  Trạng thái: Đang chờ Admin kiểm tra & cấp phát...
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {displayServers.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
          <Server className="w-10 h-10 text-slate-600 mx-auto" />
          <div className="text-sm font-bold text-white">Chưa Có Máy Chủ Hoặc Proxy Nào</div>
          <p className="text-xs text-slate-400">Hãy chọn một gói Cloud VPS hoặc Proxy tại cửa hàng để bắt đầu.</p>
          <button
            onClick={onGoStore}
            className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs"
          >
            Tới Cửa Hàng Ngay
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {displayServers.map(vps => {
            const isProxyItem = vps.itemType === 'proxy' || Boolean(vps.proxyString);
            if (isProxyItem) {
              const proxyStr = vps.proxyString || `${vps.ip}:${vps.port || '8080'}:${vps.username || 'user'}:${vps.rootPass || 'pass'}`;
              return (
                <div key={vps.id} className="p-5 rounded-3xl bg-slate-900 border border-cyan-500/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                        <h3 className="font-black text-base text-white">{vps.name}</h3>
                        <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">
                          {vps.protocol || 'HTTP'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {vps.country} • Còn <strong className="text-cyan-300">{vps.daysLeft} ngày</strong>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectVpsForRenew(vps)}
                        className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs"
                      >
                        Gia Hạn
                      </button>
                      <button
                        onClick={() => onToggleAutoRenew(vps.id)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs border ${
                          vps.autoRenew
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        Auto: {vps.autoRenew ? 'BẬT' : 'TẮT'}
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2 font-mono text-xs">
                    <span className="text-emerald-400 font-bold break-all select-all">{proxyStr}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(proxyStr);
                        showToast('Đã sao chép Proxy IP:Port:User:Pass!');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-cyan-600 text-white font-bold text-[11px] flex items-center gap-1 flex-shrink-0"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Sao Chép</span>
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div key={vps.id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      <h3 className="font-black text-base text-white">{vps.name}</h3>
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                        {vps.planName}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {vps.os} • {vps.location} • Còn <strong className="text-amber-300">{vps.daysLeft} ngày</strong>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      onClick={() => onSelectVpsForUpgrade(vps)}
                      className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs"
                    >
                      + Nâng Cấp
                    </button>
                    <button
                      onClick={() => onSelectVpsForRenew(vps)}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                    >
                      Gia Hạn
                    </button>
                    <button
                      onClick={() => onToggleAutoRenew(vps.id)}
                      className={`px-2.5 py-1.5 rounded-xl font-bold text-[11px] border ${
                        vps.autoRenew
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      Auto: {vps.autoRenew ? 'BẬT' : 'TẮT'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Vi xử lý</span>
                    <strong className="text-white font-mono">{vps.cpu} vCPU</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Bộ nhớ RAM</span>
                    <strong className="text-cyan-300 font-mono">{vps.ram} GB</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Ổ cứng NVMe</span>
                    <strong className="text-amber-300 font-mono">{vps.disk} GB</strong>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Địa chỉ IPv4:</span>
                    <div className="flex items-center gap-2">
                      <strong className="text-purple-300">{vps.ip}</strong>
                      <button
                        onClick={() => { navigator.clipboard.writeText(vps.ip); showToast('Đã chép IP!'); }}
                        className="text-slate-400 hover:text-white"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Tài khoản:</span>
                    <span className="text-white">
                      {vps.username || 'root'} / <strong className="text-emerald-400">{vps.rootPass}</strong>
                    </span>
                  </div>
                  {vps.activationCode && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Mã kích hoạt:</span>
                      <strong className="text-amber-300">{vps.activationCode}</strong>
                    </div>
                  )}
                  {vps.panelUrl && (
                    <div className="flex justify-between items-center pt-1 border-t border-slate-800">
                      <span className="text-slate-400">Panel:</span>
                      <a
                        href={vps.panelUrl.startsWith('http') ? vps.panelUrl : `https://${vps.panelUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 underline flex items-center gap-1"
                      >
                        <span>Mở Link Quản Lý</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                  <div className="pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        downloadRdpFile(vps);
                        showToast(`Đã tải file ${vps.name}.rdp!`);
                      }}
                      className="w-full py-1.5 px-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 font-bold text-xs flex items-center justify-center gap-1.5 transition font-sans"
                    >
                      <Download className="w-3.5 h-3.5 text-blue-400" />
                      <span>Tải File Remote (.rdp)</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// =========================================================================
// PHÂN HỆ QUẢN TRỊ: ADMIN SIDEBAR & ORDERS TAB
// =========================================================================

function AdminSidebar({
  adminTab,
  setAdminTab,
  vpsCount,
  stockCount,
  categoriesCount,
  locationsCount,
  pendingOrdersCount,
  totalOrdersCount,
  usersCount,
  plansCount,
  proxyPlansCount,
  couponsCount,
  ticketsCount,
  transactionsCount
}) {
  const menuItems = [
    { id: 'orders', label: 'Quản Lý Đơn Hàng', icon: ShoppingCart, count: totalOrdersCount, highlight: pendingOrdersCount > 0 },
    { id: 'vps', label: 'Quản Lý Máy Chủ VPS', icon: Server, count: vpsCount },
    { id: 'providers', label: 'Cụm Node & Kho Sẵn', icon: Database, count: stockCount },
    { id: 'categories', label: 'Danh Mục Dịch Vụ', icon: Layers, count: categoriesCount },
    { id: 'locations', label: 'Vị Trí Data Center', icon: Globe, count: locationsCount },
    { id: 'transactions', label: 'Lịch Sử Giao Dịch', icon: CreditCard, count: transactionsCount },
    { id: 'balance-history', label: 'Biến Động Số Dư', icon: Wallet, count: transactionsCount },
    { id: 'users', label: 'Quản Lý Thành Viên', icon: User, count: usersCount },
    { id: 'plans', label: 'Cấu Hình Gói VPS', icon: SlidersHorizontal, count: plansCount },
    { id: 'proxy', label: 'Gian Hàng & Kho Proxy', icon: Network, count: proxyPlansCount },
    { id: 'coupons', label: 'Mã Giảm Giá Khuyến Mãi', icon: Tag, count: couponsCount },
    { id: 'tickets', label: 'Hỗ Trợ Kỹ Thuật', icon: MessageSquare },
    { id: 'settings', label: 'Cài Đặt Hệ Thống aaPanel', icon: Settings }
  ];

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-3.5 space-y-1 text-xs sticky top-20 shadow-xl">
        <div className="px-3 py-2 text-[11px] font-black uppercase tracking-wider text-slate-500">
          Menu Quản Trị Hệ Thống
        </div>
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = adminTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setAdminTab(item.id)}
              className={`w-full px-3 py-2.5 rounded-2xl text-left font-bold flex items-center justify-between transition ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-950/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  item.highlight
                    ? 'bg-amber-500 text-slate-950 animate-pulse'
                    : isActive
                    ? 'bg-purple-950/80 text-purple-200'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
}

function AdminOrdersTab({
  orders,
  setOrders,
  pendingOrdersCount,
  formatVND,
  onFulfillOrder,
  showToast
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expiryFilter, setExpiryFilter] = useState('all');
  const [viewMode, setViewMode] = useState('cards');

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchSearch =
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (o.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (o.customerEmail || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (o.planName || '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus =
        statusFilter === 'all' ? true :
        statusFilter === 'Pending' ? o.status === 'Pending' :
        statusFilter === 'Completed' ? o.status === 'Completed' :
        statusFilter === 'OutOfStock' ? o.status === 'OutOfStock' :
        statusFilter === 'Refunded' ? o.status === 'Refunded' :
        statusFilter === 'Cancelled' ? o.status === 'Cancelled' : true;

      const days = Number(o.periodDays) || 30;
      const matchExpiry =
        expiryFilter === 'all' ? true :
        expiryFilter === 'daily' ? days <= 7 :
        expiryFilter === 'm1' ? days > 7 && days <= 35 :
        expiryFilter === 'm2' ? days > 35 && days <= 65 :
        expiryFilter === 'm3' ? days > 65 && days <= 100 :
        expiryFilter === 'm6' ? days > 100 && days <= 200 :
        expiryFilter === 'm12' ? days > 200 : true;

      return matchSearch && matchStatus && matchExpiry;
    });
  }, [orders, searchTerm, statusFilter, expiryFilter]);

  const handleReopenOrder = (orderId) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Pending', progressStep: 2, progressPercent: 50 } : o));
    if (showToast) showToast(`Đã mở lại đơn #${orderId} về trạng thái chờ cấp!`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-purple-400" />
            <span>Quản Lý Đơn Hàng & Cấp Phát ({orders.length})</span>
          </h2>
          <p className="text-xs text-slate-400">
            {pendingOrdersCount > 0 ? (
              <span className="text-amber-400 font-bold">⚠️ Có {pendingOrdersCount} đơn hàng đang chờ duyệt và cấp phát!</span>
            ) : (
              'Tất cả các đơn hàng đã được xử lý hoàn tất.'
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'cards' ? 'table' : 'cards')}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition"
          >
            {viewMode === 'cards' ? 'Dạng Bảng' : 'Dạng Thẻ'}
          </button>
        </div>
      </div>

      {/* Thanh bộ lọc */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Tìm theo mã đơn, khách, email, gói..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
        >
          <option value="all">Tất Cả Trạng Thái</option>
          <option value="Pending">⏳ Chờ Duyệt (Pending)</option>
          <option value="Completed">✅ Đã Bàn Giao (Completed)</option>
          <option value="OutOfStock">📦 Hết Hàng (Hoàn Tiền)</option>
          <option value="Refunded">💸 Đã Hoàn Tiền</option>
          <option value="Cancelled">❌ Đã Hủy</option>
        </select>

        <select
          value={expiryFilter}
          onChange={e => setExpiryFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
        >
          <option value="all">Tất Cả Hạn Sử Dụng</option>
          <option value="daily">Gói Ngày (1 - 7 ngày)</option>
          <option value="m1">1 Tháng (~30 ngày)</option>
          <option value="m2">2 Tháng (~60 ngày)</option>
          <option value="m3">3 Tháng (~90 ngày)</option>
          <option value="m6">6 Tháng (~180 ngày)</option>
          <option value="m12">12 Tháng (~365 ngày)</option>
        </select>
      </div>

      {/* Danh sách đơn hàng */}
      {filteredOrders.length === 0 ? (
        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-500">
          Không tìm thấy đơn hàng nào phù hợp với bộ lọc.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map(order => {
            const isPending = order.status === 'Pending';
            const isCompleted = order.status === 'Completed';
            const isOutOfStock = order.status === 'OutOfStock';
            const isRefunded = order.status === 'Refunded';
            const isCancelled = order.status === 'Cancelled';

            return (
              <div
                key={order.id}
                className={`p-4 rounded-2xl bg-slate-900 border transition space-y-3 text-xs ${
                  isPending
                    ? 'border-amber-500/50 shadow-lg shadow-amber-950/20'
                    : isOutOfStock
                    ? 'border-orange-500/40'
                    : isRefunded
                    ? 'border-rose-500/40'
                    : 'border-slate-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-white text-sm">#{order.id}</span>
                    <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-bold text-[11px]">
                      {order.planName}
                    </span>
                    {order.orderType === 'upgrade' && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                        ⚡ Nâng Cấp VPS
                      </span>
                    )}
                    {order.orderType === 'proxy' && (
                      <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-bold text-[10px]">
                        🌐 Proxy
                      </span>
                    )}
                    <span className="text-slate-500 text-[11px] font-mono">{order.createdAt}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-mono font-black text-sm">
                      {formatVND(order.amountPaid)}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      isPending ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                      isCompleted ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                      isOutOfStock ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40' :
                      isRefunded ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {isPending ? '⏳ Chờ Duyệt' :
                       isCompleted ? '✅ Đã Bàn Giao' :
                       isOutOfStock ? '📦 Hết Hàng (Đã Hoàn Tiền)' :
                       isRefunded ? '💸 Đã Hoàn Tiền' : '❌ Đã Hủy'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-slate-400">
                  <div>
                    <span className="block text-[10px] text-slate-500">Khách Hàng:</span>
                    <strong className="text-white">{order.customerName}</strong>
                    <div className="text-slate-500 text-[11px] truncate">{order.customerEmail}</div>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500">Hạn Thuê:</span>
                    <strong className="text-cyan-300 font-mono">{order.periodDays || 30} ngày</strong>
                    <span className="text-[10px] text-slate-500 ml-1">
                      ({order.billingType === 'daily' ? 'Gói ngày' : `${order.periodMonths || 1} tháng`})
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500">Khu Vực & OS:</span>
                    <strong className="text-slate-300">{order.requestedLocation || 'Việt Nam'}</strong>
                    <div className="text-slate-500 text-[11px] truncate">{order.requestedOs || 'Linux'}</div>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500">Ghi Chú Đơn:</span>
                    <span className="text-slate-300 line-clamp-1">{order.notes || order.customEnv || 'Không có'}</span>
                  </div>
                </div>

                {order.fulfilledInfo && (
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span>IP: <strong className="text-purple-300">{order.fulfilledInfo.ip}</strong></span>
                      {order.fulfilledInfo.activationCode && (
                        <span>Mã: <strong className="text-amber-300">{order.fulfilledInfo.activationCode}</strong></span>
                      )}
                      {order.fulfilledInfo.proxyString && (
                        <span>Proxy: <strong className="text-emerald-400">{order.fulfilledInfo.proxyString}</strong></span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-1">
                  {isPending && (
                    <button
                      onClick={() => onFulfillOrder(order)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-950/40"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>{order.orderType === 'upgrade' ? 'Duyệt Nâng Cấp' : 'Cấu Hình & Cấp Phát'}</span>
                    </button>
                  )}

                  {isCompleted && (
                    <>
                      <button
                        onClick={() => onFulfillOrder(order)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1"
                        title="Chỉnh sửa lại thông tin bàn giao"
                      >
                        <Edit className="w-3.5 h-3.5 text-purple-400" />
                        <span>Chỉnh Sửa</span>
                      </button>
                      <button
                        onClick={() => handleReopenOrder(order.id)}
                        className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold text-xs flex items-center gap-1"
                        title="Mở lại đơn hàng về trạng thái chờ xử lý"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Khôi Phục Về Chờ Duyệt</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AdminVpsTab({ userVps, setUserVps, onOpenManualVps, onEditVps, onSelectVpsForRenew, showToast }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expiryFilter, setExpiryFilter] = useState('all');

  const filteredVps = useMemo(() => {
    return userVps.filter(v => {
      const term = searchTerm.toLowerCase().trim();
      const matchSearch = !term ||
        (v.name || '').toLowerCase().includes(term) ||
        (v.ip || '').toLowerCase().includes(term) ||
        (v.ownerEmail || '').toLowerCase().includes(term) ||
        (v.assignedTo || '').toLowerCase().includes(term) ||
        (v.planName || '').toLowerCase().includes(term) ||
        (v.os || '').toLowerCase().includes(term) ||
        (v.location || '').toLowerCase().includes(term) ||
        (v.activationCode || '').toLowerCase().includes(term);

      const currentStatus = v.status || 'Running';
      const matchStatus =
        statusFilter === 'all' ? true :
        statusFilter === 'Running' ? currentStatus === 'Running' :
        statusFilter === 'Stopped' ? currentStatus === 'Stopped' :
        statusFilter === 'Expired' ? currentStatus === 'Expired' : true;

      const days = Number(v.daysLeft) || 0;
      const matchExpiry =
        expiryFilter === 'all' ? true :
        expiryFilter === 'urgent' ? days > 0 && days <= 7 :
        expiryFilter === 'half_month' ? days > 0 && days <= 15 :
        expiryFilter === 'month' ? days > 15 && days <= 30 :
        expiryFilter === 'safe' ? days > 30 :
        expiryFilter === 'expired' ? days <= 0 : true;

      return matchSearch && matchStatus && matchExpiry;
    });
  }, [userVps, searchTerm, statusFilter, expiryFilter]);

  return (
    <div className="space-y-4">
      {/* Tiêu đề & Nút cấp VPS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Server className="w-5 h-5 text-purple-400" />
            <span>Danh Sách Máy Chủ Đang Hoạt Động ({filteredVps.length}/{userVps.length})</span>
          </h2>
          <p className="text-xs text-slate-400">
            Tra cứu máy chủ theo tên, IP, email khách hàng, lọc theo trạng thái và chu kỳ hạn dùng.
          </p>
        </div>
        <button
          onClick={onOpenManualVps}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-950/40 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Cấp VPS Thủ Công</span>
        </button>
      </div>

      {/* Thanh tìm kiếm & Bộ lọc tương tự Quản Lý Đơn Hàng */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên VPS, IP, email khách, OS..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white outline-none focus:border-purple-500 transition"
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500 transition font-bold"
        >
          <option value="all">Tất Cả Trạng Thái</option>
          <option value="Running">🟢 Đang Hoạt Động (Running)</option>
          <option value="Stopped">⏸️ Tạm Dừng (Stopped)</option>
          <option value="Expired">🔴 Đã Hết Hạn (Expired)</option>
        </select>

        <select
          value={expiryFilter}
          onChange={e => setExpiryFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500 transition"
        >
          <option value="all">Tất Cả Hạn Sử Dụng</option>
          <option value="urgent">⚠️ Khẩn Cấp: Còn ≤ 7 ngày</option>
          <option value="half_month">⏳ Cần Chú Ý: Còn ≤ 15 ngày</option>
          <option value="month">📅 Tiêu Chuẩn: Còn 15 - 30 ngày</option>
          <option value="safe">✨ An Toàn: Còn &gt; 30 ngày</option>
          <option value="expired">🔴 Đã Hết Hạn (0 ngày)</option>
        </select>
      </div>

      {/* Danh sách máy chủ VPS */}
      {filteredVps.length === 0 ? (
        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-500">
          Không tìm thấy máy chủ VPS nào phù hợp với bộ lọc tìm kiếm.
        </div>
      ) : (
        <div className="space-y-2.5 text-xs">
          {filteredVps.map(v => (
            <div key={v.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="font-bold text-white text-sm flex items-center gap-2 flex-wrap">
                  <span>{v.name}</span>
                  <span className="text-purple-400 font-mono">({v.ip})</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    v.status === 'Running' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    v.status === 'Stopped' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}>
                    {v.status || 'Running'}
                  </span>
                  {v.os && (
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                      {v.os}
                    </span>
                  )}
                </div>
                <div className="text-slate-400 mt-1 flex flex-wrap items-center gap-x-2">
                  <span>Chủ sở hữu: <strong className="text-slate-200">{v.ownerEmail || v.assignedTo}</strong></span>
                  <span>•</span>
                  <span>{v.cpu} vCPU / {v.ram}GB RAM / {v.disk}GB NVMe</span>
                  <span>•</span>
                  <span>Còn <strong className={v.daysLeft <= 7 ? 'text-rose-400 font-bold' : 'text-amber-300'}>{v.daysLeft} ngày</strong></span>
                </div>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                <button
                  onClick={() => onEditVps(v)}
                  className="px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 font-bold flex items-center gap-1 transition"
                  title="Chỉnh sửa thông số máy chủ"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Sửa</span>
                </button>
                <button onClick={() => onSelectVpsForRenew(v)} className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition">
                  Gia Hạn
                </button>
                <button
                  onClick={() => {
                    setUserVps(userVps.filter(item => item.id !== v.id));
                    showToast('Đã xóa máy chủ!');
                  }}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-rose-600/20 text-rose-400 transition"
                  title="Xóa máy chủ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// =========================================================================
// SUB-COMPONENT: EDIT VPS MODAL (CHỈNH SỬA TOÀN DIỆN MÁY CHỦ VPS)
// =========================================================================
function EditVpsModal({ vps, users = [], locations = [], onClose, onSave }) {
  const [name, setName] = useState(vps.name || '');
  const [ownerEmail, setOwnerEmail] = useState(vps.ownerEmail || vps.assignedTo || '');
  const [ip, setIp] = useState(vps.ip || '');
  const [status, setStatus] = useState(vps.status || 'Running');
  const [cpu, setCpu] = useState(vps.cpu || 2);
  const [ram, setRam] = useState(vps.ram || 4);
  const [disk, setDisk] = useState(vps.disk || 50);
  const [os, setOs] = useState(vps.os || 'Ubuntu 22.04 LTS');
  const [location, setLocation] = useState(vps.location || 'Hà Nội (Viettel IDC)');
  const [username, setUsername] = useState(vps.username || 'root');
  const [rootPass, setRootPass] = useState(vps.rootPass || '');
  const [activationCode, setActivationCode] = useState(vps.activationCode || '');
  const [panelUrl, setPanelUrl] = useState(vps.panelUrl || '');
  const [daysLeft, setDaysLeft] = useState(vps.daysLeft ?? 30);

  const calculateExpiry = (days) => {
    const d = new Date();
    d.setDate(d.getDate() + Number(days));
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
  };

  const [expiryDisplay, setExpiryDisplay] = useState(() => vps.expiryDisplay || calculateExpiry(daysLeft));

  const handleDaysChange = (newDays) => {
    const d = Math.max(0, parseInt(newDays, 10) || 0);
    setDaysLeft(d);
    setExpiryDisplay(calculateExpiry(d));
  };

  const handleAddPresetMonths = (m) => {
    const nextDays = Number(daysLeft) + m * 30;
    setDaysLeft(nextDays);
    setExpiryDisplay(calculateExpiry(nextDays));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const matchedUser = users.find(u => u.email === ownerEmail);
    onSave({
      ...vps,
      name: name.trim(),
      ownerEmail: ownerEmail.trim(),
      ownerName: matchedUser?.name || vps.ownerName,
      assignedTo: ownerEmail.trim(),
      ip: ip.trim(),
      status,
      cpu: parseInt(cpu, 10) || 1,
      ram: parseInt(ram, 10) || 1,
      disk: parseInt(disk, 10) || 10,
      os: os.trim(),
      location: location.trim(),
      username: username.trim(),
      rootPass: rootPass.trim(),
      activationCode: activationCode.trim(),
      panelUrl: panelUrl.trim(),
      daysLeft: parseInt(daysLeft, 10) || 0,
      expiryDisplay
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 max-h-[92vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-black text-base text-white flex items-center gap-2">
              <Edit className="w-4 h-4 text-purple-400" />
              <span>Chỉnh Sửa Thông Tin Máy Chủ VPS</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Mã VPS: <span className="font-mono text-purple-300">{vps.id}</span></p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Thông tin cơ bản & chủ sở hữu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Tên Máy Chủ (VPS Name):</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-purple-300 block mb-1 font-semibold">Chủ Sở Hữu (Email Khách):</label>
              <input
                type="email"
                required
                value={ownerEmail}
                onChange={e => setOwnerEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full bg-slate-900 border border-purple-500/40 rounded-xl px-3 py-2 text-purple-200 font-mono"
              />
            </div>
          </div>

          {/* Mạng & Trạng thái */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Địa Chỉ IPv4:</label>
              <input
                type="text"
                required
                value={ip}
                onChange={e => setIp(e.target.value)}
                className="w-full bg-slate-950 border border-purple-500/50 rounded-xl px-3 py-2 text-purple-300 font-mono font-bold"
              />
            </div>
            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Trạng Thái Máy Chủ:</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
              >
                <option value="Running">🟢 Hoạt Động (Running)</option>
                <option value="Stopped">⏸️ Tạm Dừng (Stopped)</option>
                <option value="Expired">🔴 Đã Hết Hạn (Expired)</option>
              </select>
            </div>
          </div>

          {/* Cấu hình phần cứng */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-slate-300 font-semibold">Cấu Hình Phần Cứng:</div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-slate-400 block mb-1 text-[11px]">vCPU Cores:</label>
                <input
                  type="number"
                  min="1"
                  value={cpu}
                  onChange={e => setCpu(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1 text-[11px]">RAM (GB):</label>
                <input
                  type="number"
                  min="1"
                  value={ram}
                  onChange={e => setRam(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-cyan-300 font-mono font-bold"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1 text-[11px]">NVMe (GB):</label>
                <input
                  type="number"
                  min="10"
                  value={disk}
                  onChange={e => setDisk(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-amber-300 font-mono font-bold"
                />
              </div>
            </div>
          </div>

          {/* Thông tin tài khoản đăng nhập */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Mã Kích Hoạt:</label>
              <input
                type="text"
                value={activationCode}
                onChange={e => setActivationCode(e.target.value)}
                className="w-full bg-slate-950 border border-amber-500/40 rounded-xl px-3 py-2 text-amber-300 font-mono font-bold"
              />
            </div>
            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Username:</label>
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Mật Khẩu Root/Admin:</label>
              <input
                type="text"
                required
                value={rootPass}
                onChange={e => setRootPass(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold"
              />
            </div>
          </div>

          {/* Link quản lý Panel */}
          <div>
            <label className="text-slate-300 block mb-1 font-semibold">Link Quản Lý (Panel URL):</label>
            <input
              type="text"
              value={panelUrl}
              onChange={e => setPanelUrl(e.target.value)}
              placeholder="VD: https://panel.tlcloud.net:8443/... (để trống nếu không dùng)"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-blue-400 underline font-mono"
            />
          </div>

          {/* Hệ điều hành & IDC */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Hệ Điều Hành:</label>
              <input
                type="text"
                value={os}
                onChange={e => setOs(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Data Center / Quốc Gia:</label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          {/* Hạn sử dụng & gia hạn ngày */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 font-mono">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-semibold font-sans">Thời Hạn Còn Lại (Số Ngày):</label>
              <div className="flex gap-1.5 font-sans">
                {[1, 2, 3, 6, 12].map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => handleAddPresetMonths(m)}
                    className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-purple-600 hover:text-white border border-slate-700 text-slate-300 text-[10px] font-bold transition"
                  >
                    +{m}T
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0"
                value={daysLeft}
                onChange={e => handleDaysChange(e.target.value)}
                className="w-32 bg-slate-900 border border-purple-500/50 rounded-xl px-3 py-2 text-cyan-300 font-bold text-sm outline-none"
              />
              <span className="text-slate-400 text-xs">ngày còn lại</span>
              <span className="ml-auto text-emerald-400 text-xs font-bold font-mono">Hạn: {expiryDisplay}</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-950/40 transition"
          >
            Lưu Toàn Bộ Cập Nhật Cho Máy Chủ
          </button>
        </form>
      </div>
    </div>
  );
}

function AdminProvidersTab({ providers, onOpenAddProvider }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-white">Cụm Node API ({providers.length})</h2>
        <button onClick={onOpenAddProvider} className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs">+ Thêm Node API</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {providers.map(p => (
          <div key={p.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="font-bold text-white">{p.name}</div>
            <div className="text-slate-400 font-mono">{p.endpoint}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminCategoriesTab({ vpsCategories, onOpenCreateCategory, onEditCategory }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-white">Danh Mục VPS ({vpsCategories.length})</h2>
        <button onClick={onOpenCreateCategory} className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs">+ Thêm Danh Mục</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {vpsCategories.map(c => (
          <div key={c.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex justify-between items-center">
            <div>
              <div className="font-bold text-white text-sm">{c.icon} {c.name}</div>
              <div className="text-slate-400 mt-1">{c.description}</div>
            </div>
            <button onClick={() => onEditCategory(c)} className="px-3 py-1.5 rounded-xl bg-slate-800 text-white font-bold">Sửa</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminLocationsTab({ locations, onOpenAddLocation }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-white">Vị Trí Data Center ({locations.length})</h2>
        <button onClick={onOpenAddLocation} className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs">+ Thêm Vị Trí</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {locations.map(l => (
          <div key={l.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="font-bold text-white text-sm">{l.flag} {l.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminUsersTab({ users, setUsers, currentUser, setCurrentUser, onAdjustBalance, formatVND, onOpenCreateUser, onEditUser, showToast }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showPasswordMap, setShowPasswordMap] = useState({});
  const [quickAdjustUser, setQuickAdjustUser] = useState(null); // user being adjusted
  const [quickAdjustType, setQuickAdjustType] = useState('add'); // 'add' | 'sub'
  const [quickAdjustAmount, setQuickAdjustAmount] = useState(100000);

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchSearch =
        (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.phone || '').includes(searchTerm);
      const matchRole = roleFilter === 'all' ? true : u.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [users, searchTerm, roleFilter]);

  const toggleShowPassword = (userId) => {
    setShowPasswordMap(prev => ({ ...prev, [userId]: !prev[userId] }));
  };

  const handleApplyQuickAdjust = (e) => {
    e.preventDefault();
    if (!quickAdjustUser) return;
    const amount = Math.max(0, parseInt(quickAdjustAmount, 10) || 0);
    if (amount <= 0) return;

    const currentBal = Number(users.find(u => u.id === quickAdjustUser.id)?.balance) || 0;
    const delta = quickAdjustType === 'add' ? amount : -Math.min(currentBal, amount);
    if (!onAdjustBalance(quickAdjustUser.id, delta, `Admin ${quickAdjustType === 'add' ? 'cộng' : 'trừ'} tiền ví`)) return;

    if (showToast) {
      const label = quickAdjustType === 'add' ? 'Đã cộng' : 'Đã trừ';
      showToast(`${label} ${formatVND(amount)} cho ${quickAdjustUser.name}!`);
    }
    setQuickAdjustUser(null);
  };

  return (
    <div className="space-y-4">
      {/* Header & Nút thêm thành viên */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <User className="w-5 h-5 text-purple-400" />
            <span>Quản Lý Thành Viên ({users.length})</span>
          </h2>
          <p className="text-xs text-slate-400">
            Điều chỉnh thông tin, đổi mật khẩu, cộng/trừ tiền ví và phân quyền thành viên.
          </p>
        </div>

        <button
          onClick={onOpenCreateUser}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto shadow-lg shadow-purple-950/40 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Thành Viên Mới</span>
        </button>
      </div>

      {/* Thanh tìm kiếm & bộ lọc */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên thành viên, email hoặc số điện thoại..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white outline-none focus:border-purple-500"
          />
        </div>

        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
        >
          <option value="all">Tất Cả Phân Quyền</option>
          <option value="Admin">Admin (Quản Trị)</option>
          <option value="VIP">VIP</option>
          <option value="Member">Member (Thường)</option>
        </select>
      </div>

      {/* Danh sách thành viên */}
      <div className="space-y-3 text-xs">
        {filteredUsers.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-500">
            Không tìm thấy thành viên nào phù hợp.
          </div>
        ) : (
          filteredUsers.map(u => {
            const isShowPass = Boolean(showPasswordMap[u.id]);
            const isSelf = currentUser?.id === u.id;

            return (
              <div
                key={u.id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition space-y-3"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  {/* Cột 1: Thông tin thành viên & Mật khẩu */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white text-sm">{u.name}</span>
                      <span className="text-slate-400 font-mono text-xs">({u.email})</span>
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                        u.role === 'Admin' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                        u.role === 'VIP' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {u.role}
                      </span>
                      {isSelf && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                          Bạn
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-400 text-[11px]">
                      {u.phone && <span>SĐT: <strong className="text-slate-300">{u.phone}</strong></span>}
                      <span>Tham gia: <strong className="text-slate-300">{u.joined || 'Mới'}</strong></span>
                      <div className="flex items-center gap-1.5 font-mono">
                        <span>Pass:</span>
                        <strong className="text-purple-300">
                          {isShowPass ? (u.password || '123') : '••••••••'}
                        </strong>
                        <button
                          type="button"
                          onClick={() => toggleShowPassword(u.id)}
                          className="p-1 text-slate-400 hover:text-white"
                          title={isShowPass ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                        >
                          {isShowPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(u.password || '');
                            if (showToast) showToast('Đã sao chép mật khẩu!');
                          }}
                          className="p-1 text-slate-400 hover:text-white"
                          title="Sao chép mật khẩu"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Cột 2: Số dư ví & Các nút thao tác */}
                  <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
                    {/* Số dư ví */}
                    <div className="px-3.5 py-2 rounded-xl bg-slate-950 border border-emerald-500/30 text-right">
                      <div className="text-[10px] text-slate-400">Số dư ví:</div>
                      <div className="text-emerald-400 font-mono font-black text-sm">
                        {formatVND(u.balance || 0)}
                      </div>
                    </div>

                    {/* Nút Cộng Tiền nhanh */}
                    <button
                      type="button"
                      onClick={() => {
                        setQuickAdjustUser(u);
                        setQuickAdjustType('add');
                        setQuickAdjustAmount(100000);
                      }}
                      className="px-3 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1 transition"
                      title="Cộng tiền vào ví"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Cộng Tiền</span>
                    </button>

                    {/* Nút Trừ Tiền nhanh */}
                    <button
                      type="button"
                      onClick={() => {
                        setQuickAdjustUser(u);
                        setQuickAdjustType('sub');
                        setQuickAdjustAmount(50000);
                      }}
                      className="px-3 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 font-bold flex items-center gap-1 transition"
                      title="Trừ tiền ví"
                    >
                      <Minus className="w-3.5 h-3.5" />
                      <span>Trừ Tiền</span>
                    </button>

                    {/* Nút Sửa & Đổi Pass */}
                    <button
                      type="button"
                      onClick={() => onEditUser(u)}
                      className="px-3 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 font-bold flex items-center gap-1 transition"
                      title="Chỉnh sửa thông tin & đổi mật khẩu"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Sửa & Pass</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal / Popup Nhanh: Cộng / Trừ tiền trực tiếp */}
      {quickAdjustUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-black text-sm text-white flex items-center gap-2">
                {quickAdjustType === 'add' ? (
                  <Plus className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Minus className="w-4 h-4 text-rose-400" />
                )}
                <span>
                  {quickAdjustType === 'add' ? 'Cộng Tiền Vào Ví' : 'Trừ Tiền Từ Ví'}: {quickAdjustUser.name}
                </span>
              </h3>
              <button onClick={() => setQuickAdjustUser(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplyQuickAdjust} className="space-y-3">
              <div>
                <label className="text-slate-400 block mb-1 text-[11px]">
                  Số tiền cần {quickAdjustType === 'add' ? 'cộng' : 'trừ'} (VNĐ):
                </label>
                <input
                  type="number"
                  min="1000"
                  step="10000"
                  required
                  value={quickAdjustAmount}
                  onChange={e => setQuickAdjustAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-purple-500/50 rounded-xl px-3 py-2 text-emerald-400 font-mono font-black text-base outline-none"
                />
              </div>

              {/* Gợi ý mệnh giá nhanh */}
              <div className="grid grid-cols-3 gap-1.5 font-mono text-[11px]">
                {[50000, 100000, 200000, 500000, 1000000, 2000000].map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setQuickAdjustAmount(v)}
                    className="py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-purple-500 text-slate-300 font-bold transition"
                  >
                    {formatVND(v)}
                  </button>
                ))}
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Số dư hiện tại:</span>
                  <span className="text-white font-bold">{formatVND(quickAdjustUser.balance || 0)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Sau khi {quickAdjustType === 'add' ? 'cộng' : 'trừ'}:</span>
                  <span className="text-emerald-400 font-bold">
                    {formatVND(
                      quickAdjustType === 'add'
                        ? (Number(quickAdjustUser.balance) || 0) + (Number(quickAdjustAmount) || 0)
                        : Math.max(0, (Number(quickAdjustUser.balance) || 0) - (Number(quickAdjustAmount) || 0))
                    )}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-2.5 rounded-xl text-white font-bold text-xs transition ${
                  quickAdjustType === 'add'
                    ? 'bg-emerald-600 hover:bg-emerald-500'
                    : 'bg-rose-600 hover:bg-rose-500'
                }`}
              >
                Xác Nhận {quickAdjustType === 'add' ? 'Cộng Tiền' : 'Trừ Tiền'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Modal Chỉnh Sửa Thành Viên & Mật Khẩu Chuyên Sâu
function EditUserModal({ user, formatVND, onClose, onSave, showToast }) {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [role, setRole] = useState(user?.role || 'Member');
  const [status, setStatus] = useState(user?.status || 'Hoạt động');
  const [password, setPassword] = useState(user?.password || '');
  const [showPassword, setShowPassword] = useState(false);

  // Bộ điều chỉnh số dư: 'keep' | 'adjust' | 'set'
  const [balanceMode, setBalanceMode] = useState('keep');
  const [adjustType, setAdjustType] = useState('add');
  const [adjustAmount, setAdjustAmount] = useState(100000);
  const [newFixedBalance, setNewFixedBalance] = useState(user?.balance || 0);

  const calculatedBalance = useMemo(() => {
    const cur = Number(user?.balance) || 0;
    if (balanceMode === 'keep') return cur;
    if (balanceMode === 'set') return Math.max(0, parseInt(newFixedBalance, 10) || 0);
    const delta = Math.max(0, parseInt(adjustAmount, 10) || 0);
    return adjustType === 'add' ? cur + delta : Math.max(0, cur - delta);
  }, [user?.balance, balanceMode, adjustType, adjustAmount, newFixedBalance]);

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let result = '';
    for (let i = 0; i < 10; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(`TLCloud#${result}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...user,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      role,
      status,
      password: password.trim(),
      balance: calculatedBalance
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 max-h-[92vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-black text-base text-white flex items-center gap-2">
              <User className="w-4 h-4 text-purple-400" />
              <span>Chỉnh Sửa Thành Viên & Mật Khẩu</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Tài khoản: <strong className="text-white">{user?.email}</strong></p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Thông tin cá nhân */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Họ và Tên:</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Email:</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Số Điện Thoại:</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="09..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Phân Quyền:</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
              >
                <option value="Member">Member (Thường)</option>
                <option value="VIP">VIP</option>
                <option value="Admin">Admin (Quản Trị)</option>
              </select>
            </div>
            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Trạng Thái:</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
              >
                <option value="Hoạt động">🟢 Hoạt động</option>
                <option value="Tạm khóa">🔴 Tạm khóa</option>
              </select>
            </div>
          </div>

          {/* Đổi Mật Khẩu */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-purple-300 font-bold block">
                Đổi Mật Khẩu Đăng Nhập:
              </label>
              <button
                type="button"
                onClick={generateRandomPassword}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
              >
                <Zap className="w-3 h-3" />
                <span>⚡ Tạo Ngẫu Nhiên</span>
              </button>
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-purple-500/50 rounded-xl pl-3 pr-10 py-2 text-white font-mono font-bold"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Điều Chỉnh Số Dư Ví */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-emerald-400 font-bold">Điều Chỉnh Số Dư Ví:</label>
              <span className="font-mono text-slate-400 text-[11px]">
                Hiện tại: <strong className="text-white">{formatVND(user?.balance || 0)}</strong>
              </span>
            </div>

            {/* Chế độ chỉnh */}
            <div className="grid grid-cols-3 gap-1.5 font-bold">
              <button
                type="button"
                onClick={() => setBalanceMode('keep')}
                className={`py-1.5 rounded-xl border transition ${
                  balanceMode === 'keep' ? 'bg-purple-600 border-purple-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                Giữ Nguyên
              </button>
              <button
                type="button"
                onClick={() => setBalanceMode('adjust')}
                className={`py-1.5 rounded-xl border transition ${
                  balanceMode === 'adjust' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                Cộng / Trừ
              </button>
              <button
                type="button"
                onClick={() => setBalanceMode('set')}
                className={`py-1.5 rounded-xl border transition ${
                  balanceMode === 'set' ? 'bg-cyan-600 border-cyan-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                Đặt Số Mới
              </button>
            </div>

            {balanceMode === 'adjust' && (
              <div className="space-y-2 pt-1 animate-fadeIn">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustType('add')}
                    className={`py-1.5 rounded-xl font-bold border ${adjustType === 'add' ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
                  >
                    + Cộng Thêm
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType('sub')}
                    className={`py-1.5 rounded-xl font-bold border ${adjustType === 'sub' ? 'bg-rose-600/30 border-rose-500 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
                  >
                    − Trừ Bớt
                  </button>
                </div>
                <input
                  type="number"
                  min="0"
                  step="10000"
                  value={adjustAmount}
                  onChange={e => setAdjustAmount(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold"
                />
              </div>
            )}

            {balanceMode === 'set' && (
              <div className="pt-1 animate-fadeIn">
                <label className="text-slate-400 block mb-1 text-[11px]">Số dư mới mong muốn:</label>
                <input
                  type="number"
                  min="0"
                  step="10000"
                  value={newFixedBalance}
                  onChange={e => setNewFixedBalance(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold"
                />
              </div>
            )}

            <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-850 font-mono">
              <span className="text-slate-400">Số dư sau khi lưu:</span>
              <strong className="text-emerald-400 text-sm font-black">{formatVND(calculatedBalance)}</strong>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-purple-950/40 transition"
          >
            Lưu Thay Đổi Cho Thành Viên
          </button>
        </form>
      </div>
    </div>
  );
}

function AdminCouponsTab({ coupons, setCoupons, vpsCategories = [], plans = [], proxyPlans = [], onOpenCreateCoupon, showToast }) {
  const handleDeleteCoupon = (couponId, couponCode) => {
    setCoupons(prev => prev.filter(c => c.id !== couponId));
    if (showToast) showToast(`Đã xóa mã giảm giá ${couponCode}!`);
  };

  const handleClearAllCoupons = () => {
    setCoupons([]);
    localStorage.removeItem('zcloud_coupons');
    if (showToast) showToast('Đã xóa sạch toàn bộ các mã khuyến mãi!');
  };

  const handleToggleStatus = (couponId) => {
    setCoupons(prev => prev.map(c => {
      if (c.id === couponId) {
        const nextStatus = c.status === 'Active' ? 'Disabled' : 'Active';
        if (showToast) showToast(`Mã ${c.code}: ${nextStatus === 'Active' ? 'ĐÃ KÍCH HOẠT' : 'ĐÃ TẠM DỪNG'}`);
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  const getScopeBadge = (coupon) => {
    if (coupon.scope === 'category') {
      const cat = vpsCategories.find(c => c.id === coupon.targetCategoryId);
      return {
        label: `📁 Danh mục: ${cat?.name || 'Danh mục cụ thể'}`,
        color: 'bg-purple-500/15 text-purple-300 border-purple-500/30'
      };
    }
    if (coupon.scope === 'plan') {
      const plan = plans.find(p => p.id === coupon.targetPlanId);
      return {
        label: `⚡ Gói: ${plan?.name || coupon.targetPlanName || 'Gói VPS cụ thể'}`,
        color: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
      };
    }
    if (coupon.scope === 'proxy') {
      return {
        label: '🌐 Chỉ Dành Cho Proxy',
        color: 'bg-amber-500/15 text-amber-300 border-amber-500/30'
      };
    }
    return {
      label: '🌟 Tất Cả Dịch Vụ',
      color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
    };
  };

  return (
    <div className="space-y-4">
      {/* Tiêu đề & Nút thao tác Admin */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Tag className="w-5 h-5 text-purple-400" />
            <span>Mã Giảm Giá Khuyến Mãi ({coupons.length})</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Admin có thể chỉ định mã áp dụng cho toàn bộ dịch vụ, theo danh mục hoặc đích danh từng gói VPS.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {coupons.length > 0 && (
            <button
              type="button"
              onClick={handleClearAllCoupons}
              className="px-3.5 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 transition"
              title="Xóa tất cả các mã khuyến mãi hiện có"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Xóa Hết Mã Cũ</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenCreateCoupon}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-950/40 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Mã Giảm Giá</span>
          </button>
        </div>
      </div>

      {/* Danh sách mã giảm giá */}
      {coupons.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
          <Tag className="w-10 h-10 text-slate-600 mx-auto" />
          <div className="text-sm font-bold text-white">Chưa Có Mã Giảm Giá Nào</div>
          <p className="text-xs text-slate-400">
            Hệ thống hiện chưa có mã khuyến mãi nào hoạt động. Bấm "Thêm Mã Giảm Giá" để tạo mã mới.
          </p>
          <button
            type="button"
            onClick={onOpenCreateCoupon}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg transition"
          >
            + Tạo Mã Giảm Giá Đầu Tiên
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {coupons.map(coupon => {
            const scopeInfo = getScopeBadge(coupon);
            const isActive = coupon.status === 'Active';
            const usedCount = coupon.used || 0;
            const maxUses = coupon.maxUses || 100;

            return (
              <div
                key={coupon.id}
                className={`p-4 rounded-2xl bg-slate-900 border transition space-y-3 flex flex-col justify-between ${
                  isActive ? 'border-slate-800 hover:border-purple-500/50' : 'border-slate-800/60 opacity-70'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-base font-black text-amber-300 tracking-wider">
                      {coupon.code}
                    </span>
                    <span className="text-base font-black text-emerald-400 font-mono">
                      -{coupon.discount}%
                    </span>
                  </div>

                  {/* Huy hiệu chỉ định phạm vi khuyến mãi */}
                  <div>
                    <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold border ${scopeInfo.color}`}>
                      {scopeInfo.label}
                    </span>
                  </div>

                  <p className="text-slate-400 text-[11px] line-clamp-2">
                    {coupon.desc || 'Chương trình khuyến mãi áp dụng khi thanh toán.'}
                  </p>

                  <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono pt-1 border-t border-slate-800">
                    <span>Lượt sử dụng:</span>
                    <strong className="text-white">{usedCount} / {maxUses}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(coupon.code);
                      if (showToast) showToast(`Đã sao chép mã ${coupon.code}!`);
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    title="Sao chép mã"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(coupon.id)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition border ${
                        isActive
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                      }`}
                    >
                      {isActive ? 'Đang chạy' : 'Tạm dừng'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCoupon(coupon.id, coupon.code)}
                      className="p-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 transition"
                      title="Xóa mã này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// =========================================================================
// SUB-COMPONENT: CREATE COUPON MODAL (TẠO MÃ GIẢM GIÁ & CHỈ ĐỊNH PHẠM VI)
// =========================================================================
function CreateCouponModal({ vpsCategories = [], plans = [], proxyPlans = [], onClose, onAdd }) {
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState(20);
  const [maxUses, setMaxUses] = useState(50);
  const [desc, setDesc] = useState('');
  const [scope, setScope] = useState('all'); // 'all' | 'category' | 'plan' | 'proxy'
  const [targetCategoryId, setTargetCategoryId] = useState(() => vpsCategories[0]?.id || '');
  const [targetPlanId, setTargetPlanId] = useState(() => plans[0]?.id || '');

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let rand = '';
    for (let i = 0; i < 5; i++) {
      rand += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCode(`PROMO${discount}_${rand}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    const matchedCat = vpsCategories.find(c => c.id === targetCategoryId);
    const matchedPlan = plans.find(p => p.id === targetPlanId);

    onAdd({
      id: `cp-${Date.now()}`,
      code: code.trim().toUpperCase(),
      discount: Math.max(1, Math.min(99, parseInt(discount, 10) || 10)),
      maxUses: Math.max(1, parseInt(maxUses, 10) || 50),
      used: 0,
      desc: desc.trim() || `Giảm ngay ${discount}% khi thanh toán đơn hàng.`,
      scope,
      targetCategoryId: scope === 'category' ? targetCategoryId : null,
      targetCategoryName: scope === 'category' ? matchedCat?.name : '',
      targetPlanId: scope === 'plan' ? targetPlanId : null,
      targetPlanName: scope === 'plan' ? matchedPlan?.name : '',
      status: 'Active'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 max-h-[92vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-black text-base text-white flex items-center gap-2">
              <Tag className="w-4 h-4 text-purple-400" />
              <span>Tạo Mã Giảm Giá Mới</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Thiết lập mã code, % giảm và chỉ định phạm vi dịch vụ áp dụng.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Mã Code & Nút random */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-bold">Mã Khuyến Mãi (Code):</label>
              <button
                type="button"
                onClick={generateRandomCode}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
              >
                <Zap className="w-3 h-3" />
                <span>⚡ Tạo Ngẫu Nhiên</span>
              </button>
            </div>
            <input
              type="text"
              required
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              placeholder="VD: GIAM20K, DEVPRO50, GAMING..."
              className="w-full bg-slate-950 border border-purple-500/50 rounded-xl px-3 py-2 text-amber-300 font-mono font-black text-sm uppercase outline-none"
            />
          </div>

          {/* % Giảm giá */}
          <div>
            <label className="text-slate-300 block mb-1 font-bold">Mức Giảm Giá (%):</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="99"
                required
                value={discount}
                onChange={e => setDiscount(e.target.value)}
                className="w-24 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold text-sm outline-none"
              />
              <span className="text-slate-400 text-sm font-bold">%</span>
              <div className="flex gap-1.5 ml-auto">
                {[10, 20, 30, 50, 70].map(pct => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setDiscount(pct)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition ${
                      Number(discount) === pct
                        ? 'bg-purple-600 text-white border-purple-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Phạm vi áp dụng */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <label className="text-purple-300 font-bold block">
              Chỉ Định Phạm Vi Áp Dụng:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setScope('all')}
                className={`py-2 px-2.5 rounded-xl font-bold text-left border transition ${
                  scope === 'all'
                    ? 'bg-purple-600/20 border-purple-500 text-purple-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                🌟 Tất Cả Dịch Vụ
              </button>
              <button
                type="button"
                onClick={() => setScope('category')}
                className={`py-2 px-2.5 rounded-xl font-bold text-left border transition ${
                  scope === 'category'
                    ? 'bg-purple-600/20 border-purple-500 text-purple-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                📁 Theo Danh Mục
              </button>
              <button
                type="button"
                onClick={() => setScope('plan')}
                className={`py-2 px-2.5 rounded-xl font-bold text-left border transition ${
                  scope === 'plan'
                    ? 'bg-purple-600/20 border-purple-500 text-purple-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                ⚡ Chỉ 1 Gói VPS
              </button>
              <button
                type="button"
                onClick={() => setScope('proxy')}
                className={`py-2 px-2.5 rounded-xl font-bold text-left border transition ${
                  scope === 'proxy'
                    ? 'bg-purple-600/20 border-purple-500 text-purple-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                🌐 Dành Cho Proxy
              </button>
            </div>

            {/* Menu phụ khi chọn Theo Danh Mục */}
            {scope === 'category' && (
              <div className="pt-2 animate-fadeIn">
                <label className="text-slate-400 block mb-1 text-[11px]">Chọn danh mục được hưởng giảm giá:</label>
                <select
                  value={targetCategoryId}
                  onChange={e => setTargetCategoryId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                >
                  {vpsCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Menu phụ khi chọn Chỉ 1 Gói VPS */}
            {scope === 'plan' && (
              <div className="pt-2 animate-fadeIn">
                <label className="text-slate-400 block mb-1 text-[11px]">Chọn đích danh gói VPS được giảm giá:</label>
                <select
                  value={targetPlanId}
                  onChange={e => setTargetPlanId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                >
                  {plans.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.cpu}C/{p.ram}G)</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Giới hạn số lượt dùng */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Số Lượt Dùng Tối Đa:</label>
              <input
                type="number"
                min="1"
                required
                value={maxUses}
                onChange={e => setMaxUses(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Mô Tả Mã (Tùy chọn):</label>
              <input
                type="text"
                value={desc}
                onChange={e => setDesc(e.target.value)}
                placeholder="VD: Tri ân khách hàng..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-purple-950/40 transition"
          >
            Tạo & Kích Hoạt Mã Giảm Giá
          </button>
        </form>
      </div>
    </div>
  );
}

function SupportTicketModal({ currentUser, supportChannels, onClose, onSuccess }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl animate-fadeIn">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="font-black text-base text-white flex items-center gap-2">
            <LifeBuoy className="w-4 h-4 text-purple-400" />
            <span>Kênh Hỗ Trợ Kỹ Thuật 24/7</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <p className="text-xs text-slate-400">
          Đội ngũ kỹ thuật của <strong className="text-white">TLCloud</strong> luôn trực tuyến hỗ trợ bạn cài đặt OS, mở port, cấu hình panel hoặc giải quyết sự cố 24/7. Vui lòng chọn kênh kết nối trực tiếp:
        </p>

        {/* CÁC KÊNH KẾT NỐI TRỰC TIẾP */}
        <div className="space-y-3 text-xs">
          <a
            href={supportChannels?.zaloLink || `https://zalo.me/${supportChannels?.zaloPhone || '0988889999'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full p-4 rounded-2xl bg-[#0068FF] hover:bg-[#0055d4] text-white font-bold flex items-center justify-between transition shadow-xl shadow-blue-950/50 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white text-[#0068FF] font-black text-base flex items-center justify-center font-sans shadow">
                Z
              </div>
              <div className="text-left">
                <span className="font-black text-sm block">Chat Trực Tiếp Qua Zalo</span>
                <span className="text-[11px] text-blue-100 font-mono">Hotline/Zalo: {supportChannels?.zaloPhone || '0988889999'}</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>

          <a
            href={supportChannels?.fbMessenger || supportChannels?.fbLink || 'https://facebook.com/tlcloud.official'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full p-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-600 hover:opacity-95 text-white font-bold flex items-center justify-between transition shadow-xl shadow-indigo-950/50 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white text-indigo-600 font-black text-base flex items-center justify-center font-sans shadow">
                f
              </div>
              <div className="text-left">
                <span className="font-black text-sm block">Facebook Messenger / Fanpage</span>
                <span className="text-[11px] text-indigo-100">Cộng đồng & CSKH TLCloud</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 text-center font-mono">
          ⚡ Thời gian phản hồi trung bình: <strong className="text-emerald-400">1 – 3 phút</strong>
        </div>
      </div>
    </div>
  );
}

function AdminTicketsTab({ supportChannels = {}, setSupportChannels, showToast }) {
  const [isEditingChannels, setIsEditingChannels] = useState(false);
  const [localChannels, setLocalChannels] = useState({
    zaloPhone: supportChannels?.zaloPhone || '0988889999',
    zaloLink: supportChannels?.zaloLink || 'https://zalo.me/0988889999',
    fbLink: supportChannels?.fbLink || 'https://facebook.com/tlcloud.official',
    fbMessenger: supportChannels?.fbMessenger || 'https://m.me/tlcloud.official',
    hotline: supportChannels?.hotline || '1900 6868'
  });

  const handleSaveChannels = (e) => {
    e.preventDefault();
    if (setSupportChannels) {
      setSupportChannels(localChannels);
    }
    setIsEditingChannels(false);
    if (showToast) showToast('✅ Đã cập nhật kênh hỗ trợ Zalo & Facebook thành công!');
  };

  return (
    <div className="space-y-5">
      {/* KHỐI CẤU HÌNH & KẾT NỐI HỖ TRỢ ZALO & FACEBOOK */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-400" />
              <span>Kênh Hỗ Trợ Trực Tuyến 24/7 (Zalo & Facebook)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Khách hàng có thể bấm liên hệ ngay trên Website hoặc qua nút nổi ở góc màn hình.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsEditingChannels(!isEditingChannels)}
            className="px-3.5 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-bold flex items-center gap-1.5 transition self-start sm:self-auto"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>{isEditingChannels ? 'Đóng Chỉnh Sửa' : 'Chỉnh Sửa Kênh'}</span>
          </button>
        </div>

        {isEditingChannels ? (
          <form onSubmit={handleSaveChannels} className="space-y-3.5 text-xs animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-blue-300 font-bold block mb-1">Số Điện Thoại Zalo:</label>
                <input
                  type="text"
                  required
                  value={localChannels.zaloPhone}
                  onChange={e => setLocalChannels({ ...localChannels, zaloPhone: e.target.value })}
                  placeholder="0988..."
                  className="w-full bg-slate-950 border border-blue-500/40 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-blue-300 font-bold block mb-1">Đường Dẫn Zalo (URL):</label>
                <input
                  type="text"
                  required
                  value={localChannels.zaloLink}
                  onChange={e => setLocalChannels({ ...localChannels, zaloLink: e.target.value })}
                  placeholder="https://zalo.me/..."
                  className="w-full bg-slate-950 border border-blue-500/40 rounded-xl px-3 py-2 text-blue-300 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-indigo-300 font-bold block mb-1">Link Fanpage Facebook:</label>
                <input
                  type="text"
                  required
                  value={localChannels.fbLink}
                  onChange={e => setLocalChannels({ ...localChannels, fbLink: e.target.value })}
                  placeholder="https://facebook.com/..."
                  className="w-full bg-slate-950 border border-indigo-500/40 rounded-xl px-3 py-2 text-indigo-300 font-mono"
                />
              </div>

              <div>
                <label className="text-indigo-300 font-bold block mb-1">Link Facebook Messenger:</label>
                <input
                  type="text"
                  required
                  value={localChannels.fbMessenger}
                  onChange={e => setLocalChannels({ ...localChannels, fbMessenger: e.target.value })}
                  placeholder="https://m.me/..."
                  className="w-full bg-slate-950 border border-indigo-500/40 rounded-xl px-3 py-2 text-indigo-300 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsEditingChannels(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-950/40"
              >
                Lưu Thay Đổi Kênh
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            {/* Thẻ Kênh Zalo */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-blue-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#0068FF] text-white font-black text-sm flex items-center justify-center font-sans shadow-lg shadow-blue-950/60">
                    Z
                  </div>
                  <div>
                    <span className="font-bold text-white block">Hỗ Trợ Qua Zalo CSKH</span>
                    <span className="text-[11px] text-blue-400 font-mono">{localChannels.zaloPhone}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-300 text-[10px] font-bold border border-blue-500/20">
                  Online 24/7
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-850">
                <span className="text-slate-400 font-mono text-[11px] truncate">{localChannels.zaloLink}</span>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(localChannels.zaloLink);
                      if (showToast) showToast('Đã sao chép link Zalo!');
                    }}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 transition"
                    title="Sao chép link"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <a
                    href={localChannels.zaloLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-[#0068FF] hover:bg-[#0055d4] text-white font-bold text-[11px] flex items-center gap-1 transition"
                  >
                    <span>Mở Zalo</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Thẻ Kênh Facebook */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center font-sans shadow-lg shadow-indigo-950/60">
                    f
                  </div>
                  <div>
                    <span className="font-bold text-white block">Fanpage & Messenger</span>
                    <span className="text-[11px] text-indigo-400">Hỗ trợ cộng đồng Facebook</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 text-[10px] font-bold border border-indigo-500/20">
                  Phản Hồi Nhanh
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-850">
                <span className="text-slate-400 font-mono text-[11px] truncate">{localChannels.fbLink}</span>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(localChannels.fbLink);
                      if (showToast) showToast('Đã sao chép link Facebook!');
                    }}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 transition"
                    title="Sao chép link"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <a
                    href={localChannels.fbMessenger || localChannels.fbLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-[11px] flex items-center gap-1 transition"
                  >
                    <span>Mở Fanpage</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AdminSettingsTab({ showToast, topupConfig, setTopupConfig }) {
  const defaultSmtp = {
    enabled: true,
    host: 'smtp.gmail.com',
    encryption: 'tls',
    port: '587',
    email: '',
    password: '',
    subject: 'Thông tin bàn giao đơn hàng #{order_id}',
    body: 'Xin chào {customer_name},\n\nĐơn hàng {order_id} của bạn đã hoàn thành.\nIP: {ip}\nUsername: {username}\nPassword: {password}\nNgày hết hạn: {expiry_date}\n\nTrân trọng,\nTLCloud'
  };
  const defaultTelegram = {
    enabled: true,
    chatId: '',
    token: '',
    message: '🔔 ĐƠN HÀNG MỚI\nMã đơn: {order_id}\nKhách hàng: {customer_name}\nEmail: {customer_email}\nSố tiền: {amount}\nDịch vụ: {service_name}'
  };

  const [smtp, setSmtp] = useState(() => {
    try { return { ...defaultSmtp, ...(JSON.parse(localStorage.getItem('zcloud_smtpConfig')) || {}) }; } catch (error) { return defaultSmtp; }
  });
  const [telegram, setTelegram] = useState(() => {
    try { return { ...defaultTelegram, ...(JSON.parse(localStorage.getItem('zcloud_telegramConfig')) || {}) }; } catch (error) { return defaultTelegram; }
  });
  const [showSmtpPassword, setShowSmtpPassword] = useState(false);
  const [showTelegramToken, setShowTelegramToken] = useState(false);
  const emailBodyRef = useRef(null);

  useEffect(() => { localStorage.setItem('zcloud_smtpConfig', JSON.stringify(smtp)); }, [smtp]);
  useEffect(() => { localStorage.setItem('zcloud_telegramConfig', JSON.stringify(telegram)); }, [telegram]);

  const updateSmtp = (field, value) => setSmtp(prev => ({ ...prev, [field]: value }));
  const updateTelegram = (field, value) => setTelegram(prev => ({ ...prev, [field]: value }));
  const updateTopupBank = (bankId, field, value) => setTopupConfig(prev => ({
    ...prev,
    banks: (prev.banks || []).map(bank => bank.id === bankId ? { ...bank, [field]: value } : bank)
  }));
  const updateTopupAmount = (index, value) => setTopupConfig(prev => ({
    ...prev,
    quickAmounts: (prev.quickAmounts || []).map((amount, amountIndex) => amountIndex === index ? value : amount)
  }));

  const insertEmailVariable = (variable) => {
    const textarea = emailBodyRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart ?? smtp.body.length;
    const end = textarea.selectionEnd ?? start;
    const nextBody = `${smtp.body.slice(0, start)}${variable}${smtp.body.slice(end)}`;
    updateSmtp('body', nextBody);
    requestAnimationFrame(() => {
      textarea.focus();
      const cursor = start + variable.length;
      textarea.setSelectionRange(cursor, cursor);
    });
  };

  const handleSave = () => {
    updateSmtp('port', String(Math.max(1, Number(smtp.port) || 587)));
    showToast('✅ Đã lưu cấu hình SMTP và Telegram vào bản demo.');
  };

  return (
    <div className="space-y-5">
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-purple-400" />
            <span>Cấu Hình & Giao Diện</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Thiết lập thông báo bàn giao đơn hàng cho email và Telegram. Bản demo lưu cấu hình trên trình duyệt.</p>
        </div>
        <button onClick={handleSave} className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs">Lưu Toàn Bộ Cấu Hình</button>
      </div>

      <section className="p-5 rounded-3xl bg-slate-900 border border-emerald-500/30 space-y-4" aria-labelledby="topup-config-title">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 id="topup-config-title" className="text-base font-black text-white flex items-center gap-2"><Wallet className="w-4 h-4 text-emerald-400" /> CẤU HÌNH NẠP TIỀN</h3>
            <p className="text-xs text-slate-400 mt-1">Thiết lập hai tài khoản ACB và MB hiển thị trong cửa sổ nạp tiền VietQR của khách hàng.</p>
          </div>
          <span className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-300">Lưu tự động</span>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
          {(topupConfig?.banks || []).map((bank, index) => (
            <div key={bank.id || index} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-white">Ngân hàng {bank.bankCode || (index === 0 ? 'ACB' : 'MB')}</h4>
                <button type="button" onClick={() => updateTopupBank(bank.id, 'enabled', bank.enabled === false)} aria-pressed={bank.enabled !== false} className={`px-3 py-1.5 rounded-lg text-[11px] font-black ${bank.enabled !== false ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-500'}`}>
                  {bank.enabled !== false ? 'ĐANG BẬT' : 'ĐANG TẮT'}
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <label><span className="text-slate-300 block mb-1 font-semibold">Mã ngân hàng</span><input type="text" value={bank.bankCode || ''} onChange={e => updateTopupBank(bank.id, 'bankCode', e.target.value.toUpperCase())} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono" /></label>
                <label><span className="text-slate-300 block mb-1 font-semibold">Tên ngân hàng</span><input type="text" value={bank.bankName || ''} onChange={e => updateTopupBank(bank.id, 'bankName', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white" /></label>
                <label><span className="text-slate-300 block mb-1 font-semibold">Số tài khoản</span><input type="text" value={bank.accountNumber || ''} onChange={e => updateTopupBank(bank.id, 'accountNumber', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-emerald-300 font-mono" /></label>
                <label><span className="text-slate-300 block mb-1 font-semibold">Tên chủ tài khoản</span><input type="text" value={bank.accountName || ''} onChange={e => updateTopupBank(bank.id, 'accountName', e.target.value.toUpperCase())} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono" /></label>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <label><span className="text-slate-300 block mb-1 font-semibold">Cú pháp chuyển khoản</span><input type="text" value={topupConfig?.memoTemplate || ''} onChange={e => setTopupConfig(prev => ({ ...prev, memoTemplate: e.target.value }))} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-amber-300 font-mono" /><span className="text-[10px] text-slate-500 mt-1 block">Có thể dùng {`{customer_username}`} hoặc {`{customer_email}`}</span></label>
          <div><span className="text-slate-300 block mb-1 font-semibold">Mệnh giá nhanh (VNĐ)</span><div className="grid grid-cols-3 gap-2">{(topupConfig?.quickAmounts || []).map((amount, index) => <input key={index} type="number" min="1" value={amount} onChange={e => updateTopupAmount(index, e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 text-white font-mono" />)}</div></div>
        </div>
      </section>

      <section className="p-5 rounded-3xl bg-slate-900 border border-blue-500/30 space-y-4" aria-labelledby="smtp-config-title">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 id="smtp-config-title" className="text-base font-black text-white flex items-center gap-2"><Send className="w-4 h-4 text-blue-400" /> SMTP Mail</h3>
            <p className="text-xs text-slate-400 mt-1">Gửi email thông tin bàn giao khi đơn hàng hoàn thành.</p>
          </div>
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800">
            {[[true, 'ON'], [false, 'OFF']].map(([value, label]) => (
              <button key={label} type="button" onClick={() => updateSmtp('enabled', value)} aria-pressed={smtp.enabled === value} className={`px-3 py-1.5 rounded-lg text-xs font-black ${smtp.enabled === value ? (value ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white') : 'text-slate-500 hover:text-white'}`}>{label}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <label className="lg:col-span-2"><span className="text-slate-300 block mb-1 font-semibold">SMTP Host</span><input type="text" value={smtp.host} onChange={e => updateSmtp('host', e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono" /></label>
          <label><span className="text-slate-300 block mb-1 font-semibold">SMTP Encryption</span><select value={smtp.encryption} onChange={e => updateSmtp('encryption', e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"><option value="tls">tls</option><option value="ssl">ssl</option><option value="none">none</option></select></label>
          <label><span className="text-slate-300 block mb-1 font-semibold">SMTP Port</span><input type="number" min="1" value={smtp.port} onChange={e => updateSmtp('port', e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono" /></label>
          <label><span className="text-slate-300 block mb-1 font-semibold">SMTP Email</span><input type="email" value={smtp.email} onChange={e => updateSmtp('email', e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono" /></label>
          <label className="relative"><span className="text-slate-300 block mb-1 font-semibold">SMTP Password</span><input type={showSmtpPassword ? 'text' : 'password'} value={smtp.password} onChange={e => updateSmtp('password', e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 pr-10 text-amber-300 font-mono" /><button type="button" aria-label="Hiện hoặc ẩn SMTP Password" onClick={() => setShowSmtpPassword(prev => !prev)} className="absolute right-3 bottom-2.5 text-slate-400 hover:text-white">{showSmtpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></label>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div><h4 className="font-black text-white">Tùy Chỉnh Nội Dung Gmail Gửi Khách Khi Hoàn Thành Đơn</h4><p className="text-[11px] text-slate-500 mt-1">Chọn vị trí con trỏ trong nội dung rồi bấm biến để chèn.</p></div>
          <label className="block text-xs"><span className="text-slate-300 block mb-1 font-semibold">Tiêu đề email</span><input type="text" value={smtp.subject} onChange={e => updateSmtp('subject', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white" /></label>
          <label className="block text-xs"><span className="text-slate-300 block mb-1 font-semibold">Nội dung email</span><textarea ref={emailBodyRef} rows={8} value={smtp.body} onChange={e => updateSmtp('body', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white font-mono text-[11px] resize-y" /></label>
          <div className="flex flex-wrap gap-1.5">{['{customer_name}', '{order_id}', '{ip}', '{username}', '{password}', '{expiry_date}'].map(variable => <button key={variable} type="button" onClick={() => insertEmailVariable(variable)} className="px-2.5 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300 font-mono text-[11px] hover:bg-blue-500/20">{variable}</button>)}</div>
          <button type="button" onClick={() => showToast('📧 Demo: đã tạo yêu cầu gửi thử email, nhưng chưa gửi thật vì project chưa có backend SMTP.', 'success')} className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5"><Send className="w-3.5 h-3.5" />Gửi Thử Email Bàn Giao</button>
        </div>
      </section>

      <section className="p-5 rounded-3xl bg-slate-900 border border-cyan-500/30 space-y-4" aria-labelledby="telegram-config-title">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div><h3 id="telegram-config-title" className="text-base font-black text-white flex items-center gap-2"><MessageSquare className="w-4 h-4 text-cyan-400" /> TELEGRAM</h3><p className="text-xs text-slate-400 mt-1">Thông báo cho Admin khi có đơn hàng mới.</p></div>
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800">{[[true, 'ON'], [false, 'OFF']].map(([value, label]) => <button key={label} type="button" onClick={() => updateTelegram('enabled', value)} aria-pressed={telegram.enabled === value} className={`px-3 py-1.5 rounded-lg text-xs font-black ${telegram.enabled === value ? (value ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white') : 'text-slate-500 hover:text-white'}`}>{label}</button>)}</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <label><span className="text-slate-300 block mb-1 font-semibold">CHAT ID</span><input type="text" value={telegram.chatId} onChange={e => updateTelegram('chatId', e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-cyan-300 font-mono" /></label>
          <label className="relative"><span className="text-slate-300 block mb-1 font-semibold">TOKEN TELEGRAM</span><input type={showTelegramToken ? 'text' : 'password'} value={telegram.token} onChange={e => updateTelegram('token', e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 pr-10 text-cyan-300 font-mono" /><button type="button" aria-label="Hiện hoặc ẩn Token Telegram" onClick={() => setShowTelegramToken(prev => !prev)} className="absolute right-3 bottom-2.5 text-slate-400 hover:text-white">{showTelegramToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></label>
        </div>
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div><h4 className="font-black text-white">Tùy Chỉnh Nội Dung Thông Báo Bot Telegram Khi Có Đơn Hàng Mới</h4><p className="text-[11px] text-slate-500 mt-1">Có thể dùng các biến: {`{order_id}`}, {`{customer_name}`}, {`{customer_email}`}, {`{amount}`}, {`{service_name}`}.</p></div>
          <textarea rows={7} value={telegram.message} onChange={e => updateTelegram('message', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white font-mono text-[11px] resize-y" />
          <button type="button" onClick={() => showToast('⚡ Demo: đã tạo yêu cầu bắn tin thử Telegram, nhưng chưa gửi thật vì project chưa có backend Telegram.', 'success')} className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5"><Send className="w-3.5 h-3.5" />⚡ Bắn Tin Nhắn Test Telegram</button>
        </div>
      </section>

      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200">⚠️ SMTP Password và Telegram Token đang được lưu trong localStorage của trình duyệt demo. Không dùng cấu hình này cho production trước khi chuyển secrets sang backend hoặc biến môi trường.</div>
    </div>
  );
}

// =========================================================================
// PHÂN HỆ 13: ADMIN PLANS TAB (CẤU HÌNH GÓI VPS, GIÁ NÂNG CẤP & GIỚI HẠN)
// =========================================================================
function AdminPlansTab({
  plans,
  upgradePricing,
  setUpgradePricing,
  upgradeLimits,
  setUpgradeLimits,
  formatVND,
  onOpenCreatePlan,
  onEditPlan,
  showToast
}) {
  // Local state chỉnh sửa giới hạn nâng cấp
  const [localLimits, setLocalLimits] = useState({
    maxCpu: upgradeLimits?.maxCpu ?? 4,
    maxRam: upgradeLimits?.maxRam ?? 8,
    maxDisk: upgradeLimits?.maxDisk ?? 100
  });

  // Kiểm tra tính hợp lệ: không được số âm, không được rỗng, phải là số nguyên
  const isLimitsValid = useMemo(() => {
    const { maxCpu, maxRam, maxDisk } = localLimits;
    if (maxCpu === '' || maxRam === '' || maxDisk === '') return false;
    const c = Number(maxCpu);
    const r = Number(maxRam);
    const d = Number(maxDisk);
    return (
      Number.isInteger(c) && c >= 0 &&
      Number.isInteger(r) && r >= 0 &&
      Number.isInteger(d) && d >= 0
    );
  }, [localLimits]);

  const handleSaveLimits = () => {
    if (!isLimitsValid) return;
    const finalLimits = {
      maxCpu: parseInt(localLimits.maxCpu, 10),
      maxRam: parseInt(localLimits.maxRam, 10),
      maxDisk: parseInt(localLimits.maxDisk, 10)
    };
    setUpgradeLimits(finalLimits);
    if (showToast) showToast('✅ Đã lưu cấu hình giới hạn nâng cấp phần cứng!');
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-white">Cấu Hình Gói Cước Cloud VPS ({plans.length})</h2>
        <button
          onClick={onOpenCreatePlan}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Gói VPS Mới</span>
        </button>
      </div>

      {/* Bảng giá mua thêm phần cứng */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="text-xs font-bold text-purple-300 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-purple-400" />
          <span>Đơn Giá Mua Thêm Tài Nguyên (/tháng)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Đơn giá nâng cấp +1 vCPU:</label>
            <input
              type="number"
              min="0"
              value={upgradePricing.cpuPricePerCore}
              onChange={e => setUpgradePricing({ ...upgradePricing, cpuPricePerCore: parseInt(e.target.value) || 0 })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Đơn giá nâng cấp +1GB RAM:</label>
            <input
              type="number"
              min="0"
              value={upgradePricing.ramPricePerGb}
              onChange={e => setUpgradePricing({ ...upgradePricing, ramPricePerGb: parseInt(e.target.value) || 0 })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Đơn giá nâng cấp +1GB NVMe:</label>
            <input
              type="number"
              min="0"
              value={upgradePricing.diskPricePerGb}
              onChange={e => setUpgradePricing({ ...upgradePricing, diskPricePerGb: parseInt(e.target.value) || 0 })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
            />
          </div>
        </div>
      </div>

      {/* Cấu hình giới hạn nâng cấp tối đa */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs font-bold text-amber-300 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-amber-400" />
            <span>Giới Hạn Nâng Cấp Tối Đa Cho Phép Khách Mua Thêm (Đặt 0 để tắt)</span>
          </div>
          <button
            type="button"
            disabled={!isLimitsValid}
            onClick={handleSaveLimits}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 ${
              isLimitsValid
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>Lưu Giới Hạn Nâng Cấp</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="text-slate-300 block mb-1 font-semibold">CPU mua thêm tối đa (vCPU):</label>
            <input
              type="number"
              min="0"
              step="1"
              value={localLimits.maxCpu}
              onChange={e => setLocalLimits({ ...localLimits, maxCpu: e.target.value })}
              placeholder="VD: 4"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-amber-300 font-mono font-bold"
            />
            <span className="text-[10px] text-slate-500 block mt-1">Hiện tại: 0 – {localLimits.maxCpu || 0} vCPU</span>
          </div>

          <div>
            <label className="text-slate-300 block mb-1 font-semibold">RAM mua thêm tối đa (GB):</label>
            <input
              type="number"
              min="0"
              step="1"
              value={localLimits.maxRam}
              onChange={e => setLocalLimits({ ...localLimits, maxRam: e.target.value })}
              placeholder="VD: 8"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-cyan-300 font-mono font-bold"
            />
            <span className="text-[10px] text-slate-500 block mt-1">Hiện tại: 0 – {localLimits.maxRam || 0} GB</span>
          </div>

          <div>
            <label className="text-slate-300 block mb-1 font-semibold">NVMe mua thêm tối đa (GB):</label>
            <input
              type="number"
              min="0"
              step="1"
              value={localLimits.maxDisk}
              onChange={e => setLocalLimits({ ...localLimits, maxDisk: e.target.value })}
              placeholder="VD: 100"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-emerald-300 font-mono font-bold"
            />
            <span className="text-[10px] text-slate-500 block mt-1">Hiện tại: 0 – {localLimits.maxDisk || 0} GB</span>
          </div>
        </div>

        {!isLimitsValid && (
          <div className="text-[11px] text-rose-400 font-medium">
            ⚠️ Giá trị giới hạn phải là số nguyên không âm (≥ 0) và không được bỏ trống.
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map(p => (
          <div key={p.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between gap-3 text-xs">
            <div>
              <div className="font-bold text-white text-sm">{p.name}</div>
              <div className="text-emerald-400 font-mono font-bold mt-1">{formatVND(p.price)}/tháng</div>
              <div className="text-slate-400 mt-1">{p.cpu} vCPU • {p.ram}GB RAM • {p.disk}GB NVMe</div>
            </div>
            <button
              onClick={() => onEditPlan(p)}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center gap-1.5"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Chỉnh Sửa Cấu Hình & Giá</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
// =========================================================================
// SUB-COMPONENT: ADMIN PROXY TAB (GIAN HÀNG GÓI PROXY & KHO SẴN)
// =========================================================================
function AdminProxyTab({
  proxyPlans = [],
  setProxyPlans,
  proxyStockPool = [],
  setProxyStockPool,
  formatVND,
  onOpenCreateProxyPlan,
  onOpenManualProxy,
  onEditProxyPlan,
  showToast
}) {
  const [keyword, setKeyword] = useState('');

  const filteredStock = useMemo(() => {
    const query = keyword.trim().toLowerCase();
    if (!query) return proxyStockPool;
    return proxyStockPool.filter(item =>
      [item.proxyString, item.ip, item.country, item.protocol]
        .some(value => (value || '').toLowerCase().includes(query))
    );
  }, [proxyStockPool, keyword]);

  const readyCount = useMemo(
    () => proxyStockPool.filter(item => item.status === 'Ready').length,
    [proxyStockPool]
  );

  const handleRemovePlan = (planId, planName) => {
    if (!setProxyPlans) return;
    setProxyPlans(prev => prev.filter(plan => plan.id !== planId));
    if (showToast) showToast(`Đã xóa gói proxy ${planName}!`);
  };

  const handleRemoveStock = (stockId) => {
    if (!setProxyStockPool) return;
    setProxyStockPool(prev => prev.filter(item => item.id !== stockId));
    if (showToast) showToast('Đã xóa proxy khỏi kho sẵn sàng!');
  };

  const handleMarkDelivered = (stockId) => {
    if (!setProxyStockPool) return;
    setProxyStockPool(prev => prev.map(item =>
      item.id === stockId ? { ...item, status: 'Delivered' } : item
    ));
    if (showToast) showToast('Đã đánh dấu proxy này là đã bàn giao!');
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Network className="w-5 h-5 text-cyan-400" />
            <span>Gian Hàng Proxy ({proxyPlans.length})</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Cấu hình gói bán cho khách và quản lý kho proxy bàn giao thủ công.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenCreateProxyPlan}
          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto transition"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Gói Proxy</span>
        </button>
      </div>

      {proxyPlans.length === 0 ? (
        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-500">
          Chưa có gói proxy nào. Bấm &quot;Thêm Gói Proxy&quot; để tạo gói đầu tiên.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {proxyPlans.map(plan => (
            <div key={plan.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-bold text-white text-sm">{plan.name}</div>
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border flex-shrink-0 ${
                    plan.protocol === 'SOCKS5'
                      ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                      : 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                  }`}>
                    {plan.protocol || 'HTTP'}
                  </span>
                </div>
                {plan.desc && <p className="text-slate-400 text-[11px] line-clamp-2">{plan.desc}</p>}
                <div className="flex items-center justify-between font-mono text-[11px] text-slate-400 pt-1.5 border-t border-slate-800">
                  <span>{plan.country}</span>
                  <strong className="text-emerald-400 text-sm">{formatVND(plan.price)}</strong>
                </div>
                {plan.enableDaily && (
                  <div className="flex items-center justify-between font-mono text-[11px] text-slate-500">
                    <span>Giá theo ngày:</span>
                    <span>{formatVND(plan.priceDaily)}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => onEditProxyPlan && onEditProxyPlan(plan)}
                  className="flex-1 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center gap-1 transition"
                >
                  <Edit className="w-3 h-3" />
                  <span>Sửa</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRemovePlan(plan.id, plan.name)}
                  className="py-1.5 px-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 transition"
                  title="Xóa gói proxy này"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
{/* Kho proxy sẵn sàng */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-amber-400" />
              <span>Kho Proxy Sẵn Sàng ({proxyStockPool.length})</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Còn <strong className="text-emerald-400">{readyCount}</strong> proxy ở trạng thái sẵn sàng bàn giao.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                placeholder="Tìm IP, quốc gia..."
                className="bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-xs text-white outline-none focus:border-cyan-500 transition w-48"
              />
            </div>
            <button
              type="button"
              onClick={onOpenManualProxy}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Nhập Kho</span>
            </button>
          </div>
        </div>

        {filteredStock.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-500">
            {proxyStockPool.length === 0
              ? 'Kho proxy đang trống. Bấm "Nhập Kho" để thêm proxy thủ công.'
              : 'Không tìm thấy proxy nào khớp từ khóa.'}
          </div>
        ) : (
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/60 text-slate-400">
                  <tr>
                    <th className="px-4 py-2.5 font-bold">Chuỗi Proxy</th>
                    <th className="px-4 py-2.5 font-bold">Quốc Gia</th>
                    <th className="px-4 py-2.5 font-bold">Giao Thức</th>
                    <th className="px-4 py-2.5 font-bold">Trạng Thái</th>
                    <th className="px-4 py-2.5 font-bold text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredStock.map(item => (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition">
                      <td className="px-4 py-2.5 font-mono text-emerald-400 break-all">{item.proxyString}</td>
                      <td className="px-4 py-2.5 text-slate-300">{item.country}</td>
                      <td className="px-4 py-2.5 text-slate-400 font-mono">{item.protocol}</td>
                      <td className="px-4 py-2.5">
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${
                          item.status === 'Ready'
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          {item.status === 'Ready' ? 'Sẵn sàng' : 'Đã bàn giao'}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center justify-end gap-1.5">
                          {item.status === 'Ready' && (
                            <button
                              type="button"
                              onClick={() => handleMarkDelivered(item.id)}
                              className="px-2.5 py-1 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 text-cyan-300 font-bold transition"
                              title="Đánh dấu proxy đã bàn giao cho khách"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveStock(item.id)}
                            className="px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 transition"
                            title="Xóa proxy khỏi kho"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



// =========================================================================
// SUB-COMPONENT: FULFILL ORDER MODAL (CẤP PHÁT ĐƠN HÀNG VPS, PROXY & NÂNG CẤP)
// =========================================================================
function FulfillOrderModal({ order, locations = [], proxyStockPool = [], formatVND, onClose, onFulfill, onSpecialAction }) {
  const isProxyOrder = order.orderType === 'proxy';
  const isUpgradeOrder = order.orderType === 'upgrade';

  // State cho Proxy
  const [proxyStringInput, setProxyStringInput] = useState(() => order.fulfilledInfo?.proxyString || '');
  const [protocol, setProtocol] = useState(order.protocol || 'HTTP');
  const [country, setCountry] = useState(order.country || order.requestedLocation || 'Việt Nam 🇻🇳');

  // State cho VPS - Mở rộng cho phép Admin chỉnh sửa cấu hình phần cứng
  const [vpsName, setVpsName] = useState(() => order.fulfilledInfo?.vpsName || `vps-${Math.floor(1000 + Math.random() * 9000)}`);
  const [activationCode, setActivationCode] = useState(() => order.fulfilledInfo?.activationCode || `ACT-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`);
  const [ip, setIp] = useState(() => order.fulfilledInfo?.ip || `103.142.${Math.floor(20 + Math.random() * 80)}.${Math.floor(10 + Math.random() * 200)}`);
  const [username, setUsername] = useState(() => order.fulfilledInfo?.username || 'root');
  const [password, setPassword] = useState(() => order.fulfilledInfo?.password || `TLCloud#${Math.random().toString(36).substring(2, 7)}!`);
  const [panelUrl, setPanelUrl] = useState(() => order.fulfilledInfo?.panelUrl || '');
  const [os, setOs] = useState(order.requestedOs || 'Ubuntu 22.04 LTS');
  const [selectedLocation, setSelectedLocation] = useState(order.requestedLocation || locations[0]?.name || 'Hà Nội (Viettel IDC)');

  // Phần cứng tùy chỉnh
  const [cpu, setCpu] = useState(order.plan?.cpu || 2);
  const [ram, setRam] = useState(order.plan?.ram || 4);
  const [disk, setDisk] = useState(order.plan?.disk || 50);

  // Thời gian tùy chỉnh
  const initialDays = order.periodDays || (order.periodMonths || 1) * 30;
  const [totalDays, setTotalDays] = useState(initialDays);

  const calculateExpiry = (days) => {
    const d = new Date();
    d.setDate(d.getDate() + Number(days));
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
  };

  const [expiryDateStr, setExpiryDateStr] = useState(() => calculateExpiry(totalDays));

  const handleDaysChange = (newDays) => {
    const d = Math.max(1, parseInt(newDays, 10) || 1);
    setTotalDays(d);
    setExpiryDateStr(calculateExpiry(d));
  };

  const handleSetPresetMonths = (m) => {
    const days = m * 30;
    setTotalDays(days);
    setExpiryDateStr(calculateExpiry(days));
  };

  // State xác nhận hành động đặc biệt tại chỗ (Inline Confirmation)
  const [confirmSpecialAction, setConfirmSpecialAction] = useState(null); // 'out_of_stock' | 'cancel' | 'refund' | null
  const [specialActionReason, setSpecialActionReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isUpgradeOrder) {
      onFulfill({
        isUpgrade: true,
        upgradeData: {
          vpsId: order.vpsId || order.targetVpsId || order.upgradeData?.vpsId || order.upgradeData?.vps?.id,
          addCpu: Number(order.upgradeData?.addCpu || 0),
          addRam: Number(order.upgradeData?.addRam || 0),
          addDisk: Number(order.upgradeData?.addDisk || 0),
          monthlyUpgradeCost: Number(order.upgradeData?.monthlyUpgradeCost || 0),
          vpsName: order.upgradeData?.vps?.name || order.planName
        }
      });
      return;
    }

    if (isProxyOrder) {
      if (!proxyStringInput.trim()) return;
      const parts = proxyStringInput.trim().split(':');
      onFulfill({
        isProxy: true,
        proxyString: proxyStringInput.trim(),
        ip: parts[0] || '127.0.0.1',
        port: parts[1] || '8080',
        username: parts[2] || 'user',
        password: parts[3] || 'pass',
        protocol,
        country
      });
      return;
    }

    if (!ip.trim() || !vpsName.trim()) return;
    onFulfill({
      isProxy: false,
      vpsName: vpsName.trim(),
      activationCode: activationCode.trim(),
      ip: ip.trim(),
      username: username.trim(),
      password: password.trim(),
      panelUrl: panelUrl.trim(),
      os,
      country: selectedLocation,
      cpu: parseInt(cpu, 10) || 1,
      ram: parseInt(ram, 10) || 1,
      disk: parseInt(disk, 10) || 10,
      totalDays,
      expiryDate: expiryDateStr
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-black text-base text-white flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-purple-400" />
              <span>
                {isUpgradeOrder ? 'Phê Duyệt Đơn Nâng Cấp' : 'Cấu Hình & Cấp Phát Đơn Hàng'} #{order.id}
              </span>
            </h3>
            <p className="text-xs text-slate-400">Khách: <strong>{order.customerName}</strong> ({order.customerEmail}) • Số tiền: <strong className="text-emerald-400 font-mono">{formatVND(order.amountPaid)}</strong></p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isUpgradeOrder ? (
            /* DUYỆT ĐƠN NÂNG CẤP PHẦN CỨNG */
            <div className="space-y-3 p-4 rounded-2xl bg-slate-950 border border-amber-500/40">
              <div className="text-xs font-bold text-amber-300">Chi Tiết Yêu Cầu Nâng Cấp:</div>
              <div className="space-y-2 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Tên dịch vụ:</span>
                  <strong className="text-white">{order.planName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tài nguyên yêu cầu thêm:</span>
                  <strong className="text-emerald-400 font-mono">{order.customEnv}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Số tiền khách đã thanh toán:</span>
                  <strong className="text-emerald-400 font-mono text-sm">{formatVND(order.amountPaid)}</strong>
                </div>
              </div>
              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                Khi bấm nút bên dưới, cấu hình máy chủ của khách hàng sẽ tự động được cộng thêm tài nguyên ngay lập tức.
              </div>
            </div>
          ) : isProxyOrder ? (
            /* BIỂU MẪU CẤP PHÁT PROXY GỌN GÀNG 3 TRƯỜNG */
            <div className="space-y-4">
              <div>
                <label className="text-cyan-300 block mb-1 font-bold">1. Chuỗi Proxy (Định dạng IP:Port:User:Pass):</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={proxyStringInput}
                    onChange={e => setProxyStringInput(e.target.value)}
                    placeholder="VD: 103.142.26.88:8080:tlcloud_user1:PassSecret"
                    className="w-full bg-slate-950 border border-cyan-500/50 rounded-xl px-3.5 py-2.5 text-emerald-400 font-mono font-bold outline-none"
                  />
                  {proxyStockPool.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setProxyStringInput(proxyStockPool[0].proxyString)}
                      className="px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex-shrink-0"
                    >
                      Lấy Kho
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="text-cyan-300 block mb-1 font-bold">2. Giao Thức (Protocol):</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setProtocol('HTTP')}
                    className={`py-2 rounded-xl font-bold border transition ${protocol === 'HTTP' ? 'bg-purple-600 border-purple-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                  >
                    🌐 HTTP / HTTPS
                  </button>
                  <button
                    type="button"
                    onClick={() => setProtocol('SOCKS5')}
                    className={`py-2 rounded-xl font-bold border transition ${protocol === 'SOCKS5' ? 'bg-cyan-600 border-cyan-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                  >
                    ⚡ SOCKS5
                  </button>
                </div>
              </div>

              <div>
                <label className="text-cyan-300 block mb-1 font-bold">3. Quốc Gia:</label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>
            </div>
          ) : (
            /* BIỂU MẪU CẤP PHÁT VPS CHUYÊN SÂU - ĐẦY ĐỦ TRƯỜNG CHỈNH SỬA */
            <div className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Tên Máy Chủ (VPS Name):</label>
                  <input type="text" required value={vpsName} onChange={e => setVpsName(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono" />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Địa Chỉ IPv4 Cần Điền:</label>
                  <input type="text" required value={ip} onChange={e => setIp(e.target.value)} className="w-full bg-slate-950 border border-purple-500/50 rounded-xl px-3 py-2 text-purple-300 font-mono font-bold" />
                </div>
              </div>

              {/* Tùy chỉnh phần cứng khi cấp phát */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-slate-300 font-semibold">
                  <span>Cấu Hình Phần Cứng Cấp Phát:</span>
                  <span className="text-[10px] text-slate-500">Admin có thể chỉnh sửa tự do</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-slate-400 block mb-1 text-[10px]">vCPU Cores:</label>
                    <input
                      type="number"
                      min="1"
                      value={cpu}
                      onChange={e => setCpu(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1 text-[10px]">RAM (GB):</label>
                    <input
                      type="number"
                      min="1"
                      value={ram}
                      onChange={e => setRam(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-cyan-300 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1 text-[10px]">NVMe (GB):</label>
                    <input
                      type="number"
                      min="10"
                      value={disk}
                      onChange={e => setDisk(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-amber-300 font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Mã Kích Hoạt:</label>
                  <input type="text" required value={activationCode} onChange={e => setActivationCode(e.target.value)} className="w-full bg-slate-950 border border-amber-500/40 rounded-xl px-3 py-2 text-amber-300 font-mono font-bold" />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Username:</label>
                  <input type="text" required value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono" />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Mật Khẩu:</label>
                  <input type="text" required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold" />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Link Quản Lý (Mặc định để trống, Admin tự điền khi cần):</label>
                <input
                  type="text"
                  value={panelUrl}
                  onChange={e => setPanelUrl(e.target.value)}
                  placeholder="VD: https://panel.tlcloud.net:8443/... (để trống nếu không dùng)"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-blue-400 underline font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Hệ Điều Hành:</label>
                  <input
                    type="text"
                    value={os}
                    onChange={e => setOs(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Quốc Gia / Data Center:</label>
                  <input
                    type="text"
                    value={selectedLocation}
                    onChange={e => setSelectedLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* Tùy chỉnh thời hạn sử dụng */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-semibold">Thời Hạn Sử Dụng (Tùy Chỉnh):</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 6, 12].map(m => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => handleSetPresetMonths(m)}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition ${
                          totalDays === m * 30
                            ? 'bg-purple-600 text-white border-purple-500'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        {m}T
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    value={totalDays}
                    onChange={e => handleDaysChange(e.target.value)}
                    className="w-28 bg-slate-900 border border-purple-500/50 rounded-xl px-3 py-1.5 text-cyan-300 font-mono font-bold text-xs outline-none"
                  />
                  <span className="text-slate-400 text-xs">ngày</span>
                  <span className="ml-auto text-emerald-400 text-xs font-mono font-bold">Hết hạn: {expiryDateStr}</span>
                </div>
              </div>
            </div>
          )}

          {/* Nút bàn giao chính */}
          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-purple-950/40 transition"
          >
            {isUpgradeOrder
              ? 'Xác Nhận Phê Duyệt & Nâng Cấp Phần Cứng Cho VPS'
              : isProxyOrder
              ? 'Xác Nhận Bàn Giao Proxy Cho Khách Hàng'
              : 'Xác Nhận Bàn Giao VPS Cho Khách Hàng'}
          </button>

          {/* KHU VỰC TÙY CHỌN: HẾT HÀNG, HỦY ĐƠN, VÀ HỦY ĐƠN HOÀN TIỀN */}
          <div className="pt-3 border-t border-slate-800/80 space-y-2.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-bold">Tùy Chọn Xử Lý Đặc Biệt:</span>
              <span className="text-slate-500 font-mono">Số tiền đã trả: <strong className="text-emerald-400">{formatVND(order.amountPaid)}</strong></span>
            </div>

            {/* Khung xác nhận hành động đặc biệt tại chỗ */}
            {confirmSpecialAction ? (
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-rose-500/40 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {confirmSpecialAction === 'refund' && <RefreshCw className="w-4 h-4 text-rose-400" />}
                    {confirmSpecialAction === 'cancel' && <X className="w-4 h-4 text-slate-400" />}
                    {confirmSpecialAction === 'out_of_stock' && <AlertTriangle className="w-4 h-4 text-orange-400" />}
                    <span className="font-bold text-white text-xs">
                      {confirmSpecialAction === 'refund' && `Xác nhận HỦY ĐƠN & HOÀN TIỀN ${formatVND(order.amountPaid)}?`}
                      {confirmSpecialAction === 'cancel' && `Xác nhận HỦY ĐƠN #${order.id} (Không hoàn tiền)?`}
                      {confirmSpecialAction === 'out_of_stock' && `Xác nhận BÁO HẾT HÀNG & HOÀN TIỀN ${formatVND(order.amountPaid)}?`}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setConfirmSpecialAction(null); setSpecialActionReason(''); }}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {confirmSpecialAction === 'refund' && (
                  <p className="text-[11px] text-rose-300">
                    Hệ thống sẽ tự động cộng <strong className="text-white">{formatVND(order.amountPaid)}</strong> vào số dư ví của khách <strong>{order.customerEmail}</strong> và đóng đơn hàng.
                  </p>
                )}

                {confirmSpecialAction === 'out_of_stock' && (
                  <p className="text-[11px] text-orange-300">
                    Hệ thống sẽ chuyển đơn sang trạng thái <strong className="text-white">📦 Hết Hàng</strong> và tự động hoàn lại <strong className="text-white">{formatVND(order.amountPaid)}</strong> vào ví của khách <strong>{order.customerEmail}</strong>.
                  </p>
                )}

                <input
                  type="text"
                  value={specialActionReason}
                  onChange={e => setSpecialActionReason(e.target.value)}
                  placeholder="Ghi chú lý do cho khách hàng (tùy chọn)..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
                />

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => { setConfirmSpecialAction(null); setSpecialActionReason(''); }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-bold text-xs"
                  >
                    Bỏ Qua
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (onSpecialAction) {
                        onSpecialAction(confirmSpecialAction, specialActionReason.trim());
                      }
                      setConfirmSpecialAction(null);
                    }}
                    className={`px-4 py-1.5 rounded-xl text-white font-bold text-xs transition ${
                      confirmSpecialAction === 'refund'
                        ? 'bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-950/50'
                        : confirmSpecialAction === 'out_of_stock'
                        ? 'bg-orange-600 hover:bg-orange-500 shadow-lg shadow-orange-950/50'
                        : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                  >
                    {confirmSpecialAction === 'refund' && 'Đồng Ý Hoàn Tiền'}
                    {confirmSpecialAction === 'cancel' && 'Đồng Ý Hủy Đơn'}
                    {confirmSpecialAction === 'out_of_stock' && 'Đồng Ý Hết Hàng & Hoàn Tiền'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmSpecialAction('out_of_stock')}
                  className="py-2.5 px-3 rounded-xl bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/30 text-orange-300 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                  title="Chuyển đơn sang trạng thái Hết Hàng và tự động hoàn tiền vào ví khách"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
                  <span>Hết Hàng & Hoàn Tiền</span>
                </button>

                <button
                  type="button"
                  onClick={() => setConfirmSpecialAction('cancel')}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                  title="Hủy đơn hàng mà không hoàn tiền"
                >
                  <X className="w-3.5 h-3.5 text-slate-400" />
                  <span>Hủy Đơn</span>
                </button>

                <button
                  type="button"
                  onClick={() => setConfirmSpecialAction('refund')}
                  className="py-2.5 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 font-bold text-xs flex items-center justify-center gap-1.5 transition group"
                  title="Hủy đơn và hoàn 100% tiền vào ví khách hàng"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-rose-400 group-hover:rotate-180 transition-transform" />
                  <span>Hủy Đơn Hoàn Tiền</span>
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

// =========================================================================
// SUB-COMPONENT: UPGRADE VPS MODAL (BẤM - / +, NHẬP TRỰC TIẾP, GIỚI HẠN ADMIN)
// =========================================================================
function UpgradeVpsModal({ vps, upgradePricing, upgradeLimits, currentUser, formatVND, onRequestTopup, onClose, onSuccess }) {
  // Giới hạn tối đa (mặc định CPU: 4, RAM: 8, NVMe: 100 nếu chưa cấu hình)
  const maxCpu = upgradeLimits?.maxCpu ?? 4;
  const maxRam = upgradeLimits?.maxRam ?? 8;
  const maxDisk = upgradeLimits?.maxDisk ?? 100;

  const [addCpu, setAddCpu] = useState(0);
  const [addRam, setAddRam] = useState(0);
  const [addDisk, setAddDisk] = useState(0);

  // Helper điều chỉnh với nút - / +
  const handleStep = (setter, currentVal, delta, maxLimit) => {
    if (maxLimit <= 0) return;
    const next = currentVal + delta;
    if (next < 0) setter(0);
    else if (next > maxLimit) setter(maxLimit);
    else setter(next);
  };

  // Helper nhập số trực tiếp: chặn số âm, vượt quá thì đưa về maxLimit
  const handleDirectInput = (setter, rawVal, maxLimit) => {
    if (maxLimit <= 0) {
      setter(0);
      return;
    }
    if (rawVal === '') {
      setter(0);
      return;
    }
    const parsed = parseInt(rawVal, 10);
    if (isNaN(parsed) || parsed < 0) {
      setter(0);
    } else if (parsed > maxLimit) {
      setter(maxLimit);
    } else {
      setter(parsed);
    }
  };

  const monthlyUpgradeCost = useMemo(() => {
    return (
      addCpu * (upgradePricing.cpuPricePerCore || 35000) +
      addRam * (upgradePricing.ramPricePerGb || 25000) +
      addDisk * (upgradePricing.diskPricePerGb || 2000)
    );
  }, [addCpu, addRam, addDisk, upgradePricing]);

  const effectiveMonths = useMemo(() => Math.max(1, Math.ceil((vps.daysLeft || 30) / 30)), [vps.daysLeft]);
  const costToPay = monthlyUpgradeCost * effectiveMonths;
  const isBalanceEnough = (currentUser?.balance || 0) >= costToPay;
  const hasSelection = addCpu > 0 || addRam > 0 || addDisk > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!hasSelection) return;
    if (!isBalanceEnough) {
      onRequestTopup?.(costToPay - (currentUser?.balance || 0));
      return;
    }
    onSuccess({
      vps,
      addCpu,
      addRam,
      addDisk,
      totalCost: costToPay,
      monthlyUpgradeCost
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 max-h-[92vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-black text-base text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Nâng Cấp Cấu Hình: {vps.name}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Chu kỳ thanh toán còn lại: <strong className="text-purple-300 font-mono">{effectiveMonths} tháng</strong> ({vps.daysLeft} ngày)
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* 1. Mua thêm CPU */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-slate-200 font-bold block">
                  Mua Thêm vCPU Core
                </label>
                <span className="text-[11px] text-purple-400 font-mono">
                  +{formatVND(upgradePricing.cpuPricePerCore || 35000)}/vCPU/tháng
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Hiện có: <strong className="text-white">{vps.cpu} vCPU</strong>
                {addCpu > 0 && (
                  <span className="text-emerald-400 font-bold ml-1">➔ {vps.cpu + addCpu} vCPU</span>
                )}
              </span>
            </div>

            {maxCpu <= 0 ? (
              <div className="py-2 text-center text-slate-500 bg-slate-900/60 rounded-xl font-medium">
                Admin đã tạm tắt tính năng mua thêm vCPU
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={addCpu <= 0}
                  onClick={() => handleStep(setAddCpu, addCpu, -1, maxCpu)}
                  className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700 text-white font-black text-base flex items-center justify-center transition"
                  title="Giảm 1 vCPU"
                >
                  −
                </button>

                <div className="relative flex-1">
                  <input
                    type="number"
                    min="0"
                    max={maxCpu}
                    step="1"
                    value={addCpu}
                    onChange={e => handleDirectInput(setAddCpu, e.target.value, maxCpu)}
                    className="w-full bg-slate-900 border border-purple-500/50 rounded-xl py-2 px-3 text-center text-white font-mono font-bold text-sm outline-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-xs pointer-events-none">
                    / max {maxCpu}
                  </span>
                </div>

                <button
                  type="button"
                  disabled={addCpu >= maxCpu}
                  onClick={() => handleStep(setAddCpu, addCpu, 1, maxCpu)}
                  className="w-10 h-10 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-base flex items-center justify-center transition"
                  title="Tăng 1 vCPU"
                >
                  +
                </button>
              </div>
            )}
          </div>

          {/* 2. Mua thêm RAM */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-slate-200 font-bold block">
                  Mua Thêm Bộ Nhớ RAM (GB)
                </label>
                <span className="text-[11px] text-cyan-400 font-mono">
                  +{formatVND(upgradePricing.ramPricePerGb || 25000)}/GB/tháng
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Hiện có: <strong className="text-white">{vps.ram} GB</strong>
                {addRam > 0 && (
                  <span className="text-emerald-400 font-bold ml-1">➔ {vps.ram + addRam} GB</span>
                )}
              </span>
            </div>

            {maxRam <= 0 ? (
              <div className="py-2 text-center text-slate-500 bg-slate-900/60 rounded-xl font-medium">
                Admin đã tạm tắt tính năng mua thêm RAM
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={addRam <= 0}
                  onClick={() => handleStep(setAddRam, addRam, -1, maxRam)}
                  className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700 text-white font-black text-base flex items-center justify-center transition"
                  title="Giảm 1 GB RAM"
                >
                  −
                </button>

                <div className="relative flex-1">
                  <input
                    type="number"
                    min="0"
                    max={maxRam}
                    step="1"
                    value={addRam}
                    onChange={e => handleDirectInput(setAddRam, e.target.value, maxRam)}
                    className="w-full bg-slate-900 border border-cyan-500/50 rounded-xl py-2 px-3 text-center text-white font-mono font-bold text-sm outline-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-xs pointer-events-none">
                    / max {maxRam} GB
                  </span>
                </div>

                <button
                  type="button"
                  disabled={addRam >= maxRam}
                  onClick={() => handleStep(setAddRam, addRam, 1, maxRam)}
                  className="w-10 h-10 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-base flex items-center justify-center transition"
                  title="Tăng 1 GB RAM"
                >
                  +
                </button>
              </div>
            )}
          </div>

          {/* 3. Mua thêm NVMe */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-slate-200 font-bold block">
                  Mua Thêm Ổ Cứng NVMe (GB)
                </label>
                <span className="text-[11px] text-amber-400 font-mono">
                  +{formatVND(upgradePricing.diskPricePerGb || 2000)}/GB/tháng
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Hiện có: <strong className="text-white">{vps.disk} GB</strong>
                {addDisk > 0 && (
                  <span className="text-emerald-400 font-bold ml-1">➔ {vps.disk + addDisk} GB</span>
                )}
              </span>
            </div>

            {maxDisk <= 0 ? (
              <div className="py-2 text-center text-slate-500 bg-slate-900/60 rounded-xl font-medium">
                Admin đã tạm tắt tính năng mua thêm NVMe
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={addDisk <= 0}
                  onClick={() => handleStep(setAddDisk, addDisk, -1, maxDisk)}
                  className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700 text-white font-black text-base flex items-center justify-center transition"
                  title="Giảm 1 GB NVMe"
                >
                  −
                </button>

                <div className="relative flex-1">
                  <input
                    type="number"
                    min="0"
                    max={maxDisk}
                    step="1"
                    value={addDisk}
                    onChange={e => handleDirectInput(setAddDisk, e.target.value, maxDisk)}
                    className="w-full bg-slate-900 border border-amber-500/50 rounded-xl py-2 px-3 text-center text-white font-mono font-bold text-sm outline-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-xs pointer-events-none">
                    / max {maxDisk} GB
                  </span>
                </div>

                <button
                  type="button"
                  disabled={addDisk >= maxDisk}
                  onClick={() => handleStep(setAddDisk, addDisk, 1, maxDisk)}
                  className="w-10 h-10 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-base flex items-center justify-center transition"
                  title="Tăng 1 GB NVMe"
                >
                  +
                </button>
              </div>
            )}
          </div>

          {/* Bảng tính chi phí và đối soát */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Đơn giá nâng cấp 1 tháng:</span>
              <span className="text-white font-bold">{formatVND(monthlyUpgradeCost)}/tháng</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Chu kỳ áp dụng:</span>
              <span className="text-purple-300 font-bold">× {effectiveMonths} tháng</span>
            </div>
            <div className="flex justify-between border-t border-slate-800 pt-2 text-sm">
              <span className="text-white font-bold font-sans">Tổng thanh toán ngay:</span>
              <strong className="text-emerald-400 text-base">{formatVND(costToPay)}</strong>
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 pt-1">
              <span>Số dư ví của bạn:</span>
              <span className={(currentUser?.balance || 0) >= costToPay ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                {formatVND(currentUser?.balance || 0)}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={!hasSelection}
            className={`w-full py-3.5 rounded-2xl font-black text-xs transition shadow-lg ${
              !hasSelection
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : !isBalanceEnough
                ? 'bg-amber-600 hover:bg-amber-500 text-white cursor-pointer'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-amber-950/40'
            }`}
          >
            {!hasSelection
              ? 'Vui lòng chọn tài nguyên cần mua thêm'
              : !isBalanceEnough
              ? `Nạp thêm ${formatVND(costToPay - (currentUser?.balance || 0))}`
              : 'Gửi Yêu Cầu Nâng Cấp (Chờ Admin Duyệt)'}
          </button>
        </form>
      </div>
    </div>
  );
}

// =========================================================================
// SUB-COMPONENT: MANUAL VPS MODAL (CẤP THẲNG VPS THỦ CÔNG CHO KHÁCH)
// =========================================================================
function ManualVpsModal({ users = [], plans = [], locations = [], formatVND, onClose, onSuccess }) {
  const [selectedUserEmail, setSelectedUserEmail] = useState(() => users[0]?.email || '');
  const [selectedPlanId, setSelectedPlanId] = useState(() => plans[0]?.id || '');
  const currentPlan = useMemo(() => plans.find(p => p.id === selectedPlanId) || plans[0] || {}, [plans, selectedPlanId]);

  const [vpsName, setVpsName] = useState(() => `vps-${Math.floor(1000 + Math.random() * 9000)}`);
  const [activationCode, setActivationCode] = useState(() => `ACT-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`);
  const [ip, setIp] = useState(`103.142.${Math.floor(20 + Math.random() * 80)}.${Math.floor(10 + Math.random() * 200)}`);
  const [username, setUsername] = useState('root');
  const [password, setPassword] = useState(`TLCloud#${Math.random().toString(36).substring(2, 7)}!`);
  const [panelUrl, setPanelUrl] = useState('');
  const [os, setOs] = useState(currentPlan?.supportedOs?.[0] || 'Ubuntu 22.04 LTS');
  const [country, setCountry] = useState(locations[0]?.name || 'Hà Nội (Viettel IDC)');
  const [cpu, setCpu] = useState(currentPlan?.cpu || 2);
  const [ram, setRam] = useState(currentPlan?.ram || 4);
  const [disk, setDisk] = useState(currentPlan?.disk || 50);
  
  // Tùy chỉnh thời gian linh hoạt
  const [timeMode, setTimeMode] = useState('preset'); // 'preset' | 'custom_days'
  const [selectedPresetMonths, setSelectedPresetMonths] = useState(1);
  const [customDays, setCustomDays] = useState(30);

  const totalDays = useMemo(() => {
    if (timeMode === 'custom_days') return Math.max(1, parseInt(customDays, 10) || 1);
    return selectedPresetMonths * 30;
  }, [timeMode, selectedPresetMonths, customDays]);

  const calculateExpiryDateStr = (days) => {
    const d = new Date();
    d.setDate(d.getDate() + Number(days));
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
  };

  const expiryDateStr = useMemo(() => calculateExpiryDateStr(totalDays), [totalDays]);

  const handlePlanChange = (newPlanId) => {
    setSelectedPlanId(newPlanId);
    const p = plans.find(item => item.id === newPlanId);
    if (p) {
      setCpu(p.cpu || 2);
      setRam(p.ram || 4);
      setDisk(p.disk || 50);
      setOs(p.supportedOs?.[0] || 'Ubuntu 22.04 LTS');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ip.trim() || !vpsName.trim()) return;
    const assignedUser = users.find(u => u.email === selectedUserEmail) || { name: 'Khách hàng', email: selectedUserEmail };

    onSuccess({
      id: nextId('vps'),
      name: vpsName.trim(),
      source: 'manual',
      ownerEmail: assignedUser.email,
      ownerName: assignedUser.name,
      assignedTo: assignedUser.email,
      planId: currentPlan.id || 'plan-custom',
      planName: currentPlan.name || 'Gói Cấp Thủ Công',
      plan: currentPlan,
      pricingTiers: currentPlan.pricingTiers,
      billingType: 'monthly',
      allowRenew: true,
      ip: ip.trim(),
      status: 'Running',
      cpu: parseInt(cpu) || 1,
      ram: parseInt(ram) || 1,
      disk: parseInt(disk) || 20,
      os: os.trim(),
      location: country.trim(),
      customEnv: 'Cấp phát thủ công trực tiếp',
      autoRenew: false,
      daysLeft: totalDays,
      expiryDisplay: expiryDateStr,
      basePrice: currentPlan.price || 129000,
      upgradeMonthlyCost: 0,
      renewMonths: timeMode === 'preset' ? selectedPresetMonths : Math.ceil(totalDays / 30),
      username: username.trim(),
      rootPass: password.trim(),
      activationCode: activationCode.trim(),
      panelUrl: panelUrl.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="font-black text-base text-white">Thêm & Cấp Phát VPS Thủ Công Cho Khách Hàng</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-950 border border-purple-500/30">
            <div>
              <label className="text-purple-300 block mb-1 font-semibold">Khách Hàng Nhận VPS:</label>
              <select value={selectedUserEmail} onChange={e => setSelectedUserEmail(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white">
                {users.map(u => (
                  <option key={u.id} value={u.email}>{u.name} ({u.email})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-purple-300 block mb-1 font-semibold">Chọn Gói Cước Chuẩn:</label>
              <select value={selectedPlanId} onChange={e => handlePlanChange(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white">
                {plans.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({formatVND(p.price)}/th)</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Tên Máy Chủ (VPS Name):</label>
              <input type="text" required value={vpsName} onChange={e => setVpsName(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono" />
            </div>
            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Địa Chỉ IPv4 Cần Điền:</label>
              <input type="text" required value={ip} onChange={e => setIp(e.target.value)} className="w-full bg-slate-950 border border-purple-500/50 rounded-xl px-3 py-2 text-purple-300 font-mono font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Mã Kích Hoạt:</label>
              <input type="text" required value={activationCode} onChange={e => setActivationCode(e.target.value)} className="w-full bg-slate-950 border border-amber-500/40 rounded-xl px-3 py-2 text-amber-300 font-mono font-bold" />
            </div>
            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Username:</label>
              <input type="text" required value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono" />
            </div>
            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Mật Khẩu:</label>
              <input type="text" required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold" />
            </div>
          </div>

          <div>
            <label className="text-slate-300 block mb-1 font-semibold">Link Quản Lý (Mặc định để trống, Admin tự điền khi cần):</label>
            <input
              type="text"
              value={panelUrl}
              onChange={e => setPanelUrl(e.target.value)}
              placeholder="VD: https://panel.tlcloud.net:8443/... (để trống nếu không dùng)"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-blue-400 underline font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Hệ Điều Hành:</label>
              <input type="text" value={os} onChange={e => setOs(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white" />
            </div>
            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Quốc Gia / IDC:</label>
              <input type="text" value={country} onChange={e => setCountry(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white" />
            </div>
          </div>

          {/* CHỌN CHU KỲ HOẶC TỰ ĐẶT THỜI GIAN */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-bold">Thời Hạn & Hạn Sử Dụng:</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setTimeMode('preset')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${timeMode === 'preset' ? 'bg-purple-600 text-white' : 'bg-slate-900 text-slate-400'}`}
                >
                  Chọn Theo Tháng
                </button>
                <button
                  type="button"
                  onClick={() => setTimeMode('custom_days')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${timeMode === 'custom_days' ? 'bg-amber-600 text-white' : 'bg-slate-900 text-slate-400'}`}
                >
                  ✍️ Tự Đặt Số Ngày
                </button>
              </div>
            </div>

            {timeMode === 'preset' ? (
              <div className="grid grid-cols-5 gap-1.5">
                {[1, 2, 3, 6, 12].map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setSelectedPresetMonths(m)}
                    className={`py-2 px-1 rounded-xl font-bold border text-[11px] transition ${
                      selectedPresetMonths === m
                        ? 'bg-purple-600 text-white border-purple-500 shadow'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {m} Tháng
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="3650"
                  value={customDays}
                  onChange={e => setCustomDays(e.target.value)}
                  className="flex-1 bg-slate-900 border border-amber-500/50 rounded-xl px-3 py-2 text-amber-300 font-mono font-bold text-sm outline-none"
                />
                <span className="text-slate-400 font-bold">Ngày</span>
              </div>
            )}

            <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-900 font-mono">
              <span className="text-slate-400">Tổng thời gian: <strong className="text-cyan-300">{totalDays} ngày</strong></span>
              <span className="text-slate-400">Hết hạn vào: <strong className="text-emerald-400 font-bold">{expiryDateStr}</strong></span>
            </div>
          </div>

          <button type="submit" className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs">
            Xác Nhận Bàn Giao VPS Trực Tiếp Cho Khách
          </button>
        </form>
      </div>
    </div>
  );
}

// =========================================================================
// SUB-COMPONENT: ADD PROVIDER & LOCATION MODALS
// =========================================================================
function AddProviderModal({ onClose, onAdd }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('Proxmox VE');
  const [endpoint, setEndpoint] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !endpoint.trim()) return;
    onAdd({ id: `p-${Date.now()}`, name: name.trim(), type, endpoint: endpoint.trim(), status: 'Online', latency: '2ms', activeVps: 0 });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="font-black text-base text-white">Kết Nối Cụm Máy Chủ API</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <input type="text" required placeholder="Tên Node API..." value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white" />
          <input type="url" required placeholder="https://pve.example.com:8006" value={endpoint} onChange={e => setEndpoint(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono" />
          <button type="submit" className="w-full py-2.5 rounded-xl bg-purple-600 text-white font-bold">Lưu Kết Nối</button>
        </form>
      </div>
    </div>
  );
}

function AddLocationModal({ onClose, onAdd }) {
  const [name, setName] = useState('');
  const [flag, setFlag] = useState('🇻🇳');
  const [ping, setPing] = useState('1ms');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ id: `loc-${Date.now()}`, name: name.trim(), flag, ping, nodes: 12, status: 'Online', bandwidth: '100 Gbps' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="font-black text-base text-white">Thêm Vị Trí Data Center</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <input type="text" required placeholder="Tên Data Center..." value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white" />
          <div className="grid grid-cols-2 gap-2">
            <input type="text" value={flag} onChange={e => setFlag(e.target.value)} className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white" />
            <input type="text" value={ping} onChange={e => setPing(e.target.value)} className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white" />
          </div>
          <button type="submit" className="w-full py-2.5 rounded-xl bg-purple-600 text-white font-bold">Thêm Data Center</button>
        </form>
      </div>
    </div>
  );
}

function CheckoutModal({
  item,
  coupons = [],
  currentUser,
  userBalance = 0,
  formatVND,
  onRequestTopup,
  onClose,
  onSuccess
}) {
  const [billingType, setBillingType] = useState('monthly');
  const [periodMonths, setPeriodMonths] = useState(1);
  const [periodDays, setPeriodDays] = useState(1);
  const [selectedOs, setSelectedOs] = useState(() => item.supportedOs?.[0] || 'Ubuntu 22.04 LTS');
  const [selectedLocation, setSelectedLocation] = useState(() => item.supportedLocations?.[0] || 'Hà Nội (Viettel IDC)');
  const [hostname, setHostname] = useState('vps-worker-01');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [selectedAddons, setSelectedAddons] = useState([]);

  const toggleAddon = (addon) => {
    if (selectedAddons.some(a => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter(a => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const calculatedBasePrice = useMemo(() => {
    if (billingType === 'daily') {
      const dailyRate = item.pricingTiers?.[`d${periodDays}`] || Math.round((item.price || 59000) / 30) * periodDays;
      return dailyRate;
    }
    const tierKey = `m${periodMonths}`;
    return item.pricingTiers?.[tierKey] || ((item.price || 59000) * periodMonths);
  }, [billingType, periodMonths, periodDays, item]);

  const totalAddonCost = useMemo(() => {
    const cycleMonths = billingType === 'monthly' ? periodMonths : Math.max(1, Math.ceil(periodDays / 30));
    return selectedAddons.reduce((sum, a) => sum + (a.price || 0) * cycleMonths, 0);
  }, [selectedAddons, billingType, periodMonths, periodDays]);

  const discountAmount = appliedCoupon ? Math.round((calculatedBasePrice * appliedCoupon.discount) / 100) : 0;
  const totalPaid = Math.max(0, calculatedBasePrice + totalAddonCost - discountAmount);
  const isBalanceEnough = userBalance >= totalPaid;

  const handleApplyCoupon = () => {
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    const found = coupons.find(c => c.code === code);
    if (!found) {
      setCouponError('Mã giảm giá không tồn tại!');
      return;
    }
    if (found.status !== 'Active') {
      setCouponError('Mã giảm giá hiện đang tạm dừng!');
      return;
    }
    if (found.used >= (found.maxUses || 100)) {
      setCouponError('Mã giảm giá đã hết lượt sử dụng!');
      return;
    }

    // Kiểm tra phạm vi chỉ định của mã
    if (found.scope === 'proxy') {
      setCouponError('Mã này chỉ dành riêng cho các gói Proxy!');
      return;
    }
    if (found.scope === 'category' && found.targetCategoryId && item.category !== found.targetCategoryId) {
      setCouponError(`Mã này chỉ áp dụng cho danh mục "${found.targetCategoryName || 'khác'}"!`);
      return;
    }
    if (found.scope === 'plan' && found.targetPlanId && item.id !== found.targetPlanId) {
      setCouponError(`Mã này chỉ áp dụng riêng cho gói "${found.targetPlanName || 'khác'}"!`);
      return;
    }

    setAppliedCoupon(found);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isBalanceEnough) {
      onRequestTopup?.(totalPaid - userBalance);
      return;
    }
    onSuccess({
      plan: item,
      billingType,
      periodMonths: billingType === 'monthly' ? periodMonths : 1,
      periodDays: billingType === 'daily' ? periodDays : periodMonths * 30,
      os: selectedOs,
      location: selectedLocation,
      customEnv: selectedAddons.length > 0 ? selectedAddons.map(a => a.name).join(', ') : 'Mặc định',
      selectedAddons,
      hostname: hostname.trim() || 'vps-server',
      totalPaid,
      appliedCoupon
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h3 className="font-black text-lg text-white">Cấu Hình & Triển Khai Máy Chủ: {item.name}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-6 text-xs">
          <div className="md:col-span-7 space-y-4">
            <div className="grid grid-cols-4 gap-2">
              {[1, 3, 6, 12].map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => { setBillingType('monthly'); setPeriodMonths(m); }}
                  className={`py-2.5 rounded-xl border font-bold ${
                    billingType === 'monthly' && periodMonths === m ? 'bg-purple-600 text-white border-purple-500' : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  {m} Tháng
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Hệ Điều Hành:</label>
                <select value={selectedOs} onChange={e => setSelectedOs(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white">
                  {(item.supportedOs || ['Ubuntu 22.04 LTS']).map((os, i) => <option key={i} value={os}>{os}</option>)}
                </select>
              </div>
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Vị Trí Data Center:</label>
                <select value={selectedLocation} onChange={e => setSelectedLocation(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white">
                  {(item.supportedLocations || ['Hà Nội (Viettel IDC)']).map((loc, i) => <option key={i} value={loc}>{loc}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Hostname Máy Chủ:</label>
              <input type="text" value={hostname} onChange={e => setHostname(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono" />
            </div>

            {(item.addons || []).length > 0 && (
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                <label className="text-white font-bold flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-purple-300">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>Tiện Ích Mở Rộng Đính Kèm:</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-normal">Tùy chọn bổ sung</span>
                </label>
                <div className="space-y-1.5">
                  {(item.addons || []).map((addon) => {
                    const isChecked = selectedAddons.some(a => a.id === addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddon(addon)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                          isChecked
                            ? 'bg-purple-600/15 border-purple-500/60 text-white'
                            : 'bg-slate-900 border-slate-800/80 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold border ${
                            isChecked ? 'bg-purple-600 text-white border-purple-500' : 'border-slate-700'
                          }`}>
                            {isChecked && '✓'}
                          </span>
                          <div>
                            <div className="font-bold text-xs text-slate-200">{addon.name}</div>
                            {addon.desc && <div className="text-[10px] text-slate-500">{addon.desc}</div>}
                          </div>
                        </div>
                        <div className="font-mono font-bold text-emerald-400 text-xs">
                          +{formatVND(addon.price)}/tháng
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="md:col-span-5 space-y-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Gói cước:</span>
                <strong className="text-white">{item.name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Giá gói:</span>
                <strong className="text-slate-200 font-mono">{formatVND(calculatedBasePrice)}</strong>
              </div>
              {totalAddonCost > 0 && (
                <div className="flex justify-between text-purple-300">
                  <span>Tiện ích mở rộng:</span>
                  <strong className="font-mono">+{formatVND(totalAddonCost)}</strong>
                </div>
              )}
              {discountAmount > 0 && (
                <div className="flex justify-between text-amber-300">
                  <div className="flex items-center gap-1">
                    <span>Voucher ({appliedCoupon?.code}):</span>
                    <button
                      type="button"
                      onClick={() => setAppliedCoupon(null)}
                      className="text-rose-400 hover:text-rose-300 text-[10px]"
                      title="Bỏ áp dụng mã"
                    >
                      (✕ Bỏ)
                    </button>
                  </div>
                  <strong className="font-mono">-{formatVND(discountAmount)} (-{appliedCoupon?.discount}%)</strong>
                </div>
              )}
              <div className="flex justify-between border-t border-slate-800 pt-2">
                <span className="text-slate-400">Tổng thanh toán:</span>
                <strong className="text-lg text-emerald-400 font-mono">{formatVND(totalPaid)}</strong>
              </div>

              {/* Ô nhập mã giảm giá & kiểm tra phạm vi chỉ định */}
              <div className="space-y-1.5 pt-2">
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={e => {
                      setCouponCode(e.target.value);
                      if (couponError) setCouponError('');
                    }}
                    placeholder="Mã giảm giá..."
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-mono uppercase text-xs outline-none focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition"
                  >
                    Áp Dụng
                  </button>
                </div>
                {couponError && (
                  <div className="text-[11px] text-rose-400 font-medium">
                    ⚠️ {couponError}
                  </div>
                )}
                {appliedCoupon && (
                  <div className="text-[11px] text-emerald-400 font-medium">
                    ✓ Đã áp dụng mã {appliedCoupon.code} (-{appliedCoupon.discount}%) thành công!
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={false}
                className={`w-full py-3 rounded-2xl font-black text-xs transition shadow-lg ${
                  isBalanceEnough
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-950/40'
                    : 'bg-amber-600 hover:bg-amber-500 text-white cursor-pointer'
                }`}
              >
                {isBalanceEnough ? 'Xác Nhận Thanh Toán' : `Nạp thêm ${formatVND(totalPaid - userBalance)}`}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeployProxyModal({ proxy, proxyCountries = [], currentUser, formatVND, onRequestTopup, onClose, onSuccess }) {
  const [protocol, setProtocol] = useState(proxy.protocol || 'HTTP');
  const availableCountries = useMemo(() => {
    if (Array.isArray(proxy.supportedCountries) && proxy.supportedCountries.length > 0) return proxy.supportedCountries;
    if (proxy.country) return [proxy.country];
    return proxyCountries.map(c => c.name);
  }, [proxy, proxyCountries]);

  const [selectedCountry, setSelectedCountry] = useState(availableCountries[0] || 'Việt Nam 🇻🇳');
  const [quantity, setQuantity] = useState(1);
  const [billingCycle, setBillingCycle] = useState('monthly');

  const unitPrice = billingCycle === 'daily' ? (proxy.priceDaily || Math.round(proxy.price / 30)) : proxy.price;
  const totalCost = unitPrice * quantity;
  const isBalanceEnough = (currentUser?.balance || 0) >= totalCost;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isBalanceEnough) {
      onRequestTopup?.(totalCost - (currentUser?.balance || 0));
      return;
    }
    onSuccess({
      proxyId: proxy.id,
      proxyName: proxy.name,
      protocol,
      country: selectedCountry,
      quantity,
      totalCost,
      billingCycle
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="font-black text-base text-white">Đặt Mua Proxy: {proxy.name}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setProtocol('HTTP')} className={`py-2 rounded-xl font-bold border ${protocol === 'HTTP' ? 'bg-purple-600 text-white border-purple-500' : 'bg-slate-950 text-slate-400 border-slate-800'}`}>🌐 HTTP</button>
            <button type="button" onClick={() => setProtocol('SOCKS5')} className={`py-2 rounded-xl font-bold border ${protocol === 'SOCKS5' ? 'bg-cyan-600 text-white border-cyan-500' : 'bg-slate-950 text-slate-400 border-slate-800'}`}>⚡ SOCKS5</button>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {availableCountries.map((cName, idx) => (
              <button key={idx} type="button" onClick={() => setSelectedCountry(cName)} className={`p-2 rounded-xl border text-left font-semibold ${selectedCountry === cName ? 'bg-cyan-600/20 border-cyan-500 text-cyan-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                {cName}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input type="number" min={1} max={50} value={quantity} onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold" />
            <select value={billingCycle} onChange={e => setBillingCycle(e.target.value)} className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white">
              <option value="monthly">1 Tháng</option>
              {proxy.enableDaily && <option value="daily">1 Ngày</option>}
            </select>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
            <span className="text-slate-400">Tổng thanh toán:</span>
            <strong className="text-emerald-400 font-mono text-base">{formatVND(totalCost)}</strong>
          </div>
          <button type="submit" disabled={false} className={`w-full py-3 rounded-2xl font-bold ${isBalanceEnough ? 'bg-cyan-600 text-white' : 'bg-amber-600 hover:bg-amber-500 text-white'}`}>
            {isBalanceEnough ? 'Xác Nhận Đặt Mua Proxy' : `Nạp thêm ${formatVND(totalCost - (currentUser?.balance || 0))}`}
          </button>
        </form>
      </div>
    </div>
  );
}

// =========================================================================
// CÁC SUB-COMPONENT PHỤ TRỢ (MODALS PHỤ TRỢ HOÀN CHỈNH)
// =========================================================================

function RenewVpsModal({ vps, currentUser, formatVND, onRequestTopup, onClose, onSuccess }) {
  const [renewMonths, setRenewMonths] = useState(1);
  const isProxy = vps.itemType === 'proxy';
  
  // Tính toán đơn giá gốc và phí phần cứng nâng cấp cộng dồn
  const baseMonthlyPrice = Number(vps.basePrice || 129000);
  const upgradeMonthlyCost = Number(vps.upgradeMonthlyCost || 0);
  const effectiveMonthlyRate = baseMonthlyPrice + upgradeMonthlyCost;

  // Tính giá theo chu kỳ (có chiết khấu chu kỳ 3T, 6T, 12T cho gói gốc)
  const getPeriodBasePrice = (months) => {
    if (isProxy) return baseMonthlyPrice * months;
    if (months === 1) return baseMonthlyPrice;
    if (months === 3) return vps.pricingTiers?.m3 || Math.round(baseMonthlyPrice * 3 * 0.95);
    if (months === 6) return vps.pricingTiers?.m6 || Math.round(baseMonthlyPrice * 6 * 0.90);
    if (months === 12) return vps.pricingTiers?.m12 || Math.round(baseMonthlyPrice * 12 * 0.80);
    return baseMonthlyPrice * months;
  };

  const periodBase = getPeriodBasePrice(renewMonths);
  const periodUpgrade = upgradeMonthlyCost * renewMonths;
  const totalCost = periodBase + periodUpgrade;
  const isBalanceEnough = (currentUser?.balance || 0) >= totalCost;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isBalanceEnough) {
      onRequestTopup?.(totalCost - (currentUser?.balance || 0));
      return;
    }
    const addedDays = renewMonths * 30;
    const updatedVps = {
      ...vps,
      daysLeft: (vps.daysLeft || 0) + addedDays
    };
    onSuccess(updatedVps, totalCost);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-black text-base text-white">Gia Hạn Dịch Vụ: {vps.name}</h3>
            {upgradeMonthlyCost > 0 && (
              <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                ⚡ Đã nâng cấp (+{formatVND(upgradeMonthlyCost)}/tháng)
              </span>
            )}
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 block mb-1 font-semibold">Chọn Chu Kỳ Gia Hạn:</label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 3, 6, 12].map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setRenewMonths(m)}
                  className={`py-2 rounded-xl border font-bold transition ${
                    renewMonths === m ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-900/40' : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {m} Tháng
                </button>
              ))}
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Tiền gói gốc ({renewMonths} tháng):</span>
              <span className="text-white font-bold">{formatVND(periodBase)}</span>
            </div>
            {upgradeMonthlyCost > 0 && (
              <div className="flex justify-between items-baseline text-amber-300">
                <div>
                  <span>Phí nâng cấp ({renewMonths} tháng):</span>
                  {renewMonths > 1 && (
                    <span className="text-[10px] text-slate-500 block">
                      ({formatVND(upgradeMonthlyCost)}/tháng × {renewMonths} tháng)
                    </span>
                  )}
                </div>
                <span className="font-bold">+{formatVND(periodUpgrade)}</span>
              </div>
            )}
            <div className="flex justify-between text-cyan-300 font-bold border-t border-slate-900 pt-1.5">
              <span>Đơn giá chuẩn/tháng sau nâng:</span>
              <span>{formatVND(effectiveMonthlyRate)}/tháng</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Số ngày cộng thêm:</span>
              <span className="text-cyan-300 font-bold">+{renewMonths * 30} ngày</span>
            </div>
            <div className="flex justify-between border-t border-slate-800 pt-2 text-sm font-bold">
              <span className="text-white font-sans">Tổng thanh toán:</span>
              <span className="text-emerald-400 text-base">{formatVND(totalCost)}</span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 pt-0.5">
              <span>Số dư ví của bạn:</span>
              <span className={isBalanceEnough ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                {formatVND(currentUser?.balance || 0)}
              </span>
            </div>
          </div>
          <button
            type="submit"
            disabled={false}
            className={`w-full py-3 rounded-2xl font-bold transition shadow-lg ${
              isBalanceEnough
                ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-950/40'
                : 'bg-amber-600 hover:bg-amber-500 text-white cursor-pointer'
            }`}
          >
            {isBalanceEnough ? 'Xác Nhận Thanh Toán Gia Hạn' : `Nạp thêm ${formatVND(totalCost - (currentUser?.balance || 0))}`}
          </button>
        </form>
      </div>
    </div>
  );
}

function AccountProfileModal({ currentUser, formatVND, onClose, onUpdateUser }) {
  const [name, setName] = useState(currentUser?.name || '');
  const [password, setPassword] = useState(currentUser?.password || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateUser({
      ...currentUser,
      name: name.trim(),
      password: password.trim(),
      phone: phone.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="font-black text-base text-white">Hồ Sơ & Bảo Mật</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Email:</label>
            <input type="text" disabled value={currentUser?.email} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-500 font-mono" />
          </div>
          <div>
            <label className="text-slate-300 block mb-1 font-semibold">Họ và Tên:</label>
            <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white" />
          </div>
          <div>
            <label className="text-slate-300 block mb-1 font-semibold">Mật Khẩu Mới:</label>
            <input type="text" required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono" />
          </div>
          <div>
            <label className="text-slate-300 block mb-1 font-semibold">Số Điện Thoại:</label>
            <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white" />
          </div>
          <button type="submit" className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold">
            Cập Nhật Hồ Sơ
          </button>
        </form>
      </div>
    </div>
  );
}

function TopupModal({ currentUser, topupConfig, initialAmount = 100000, formatVND, onClose, onSuccess }) {
  const configuredBanks = Array.isArray(topupConfig?.banks) ? topupConfig.banks : [];
  const activeBanks = configuredBanks.filter(bank => bank?.enabled !== false && bank?.accountNumber);
  const [amount, setAmount] = useState(Math.max(2000, Number(initialAmount) || 100000));
  const [amountError, setAmountError] = useState('');
  const [selectedBankId, setSelectedBankId] = useState(activeBanks[0]?.id || '');
  const [copiedField, setCopiedField] = useState(null);

  const selectedBank = activeBanks.find(bank => bank.id === selectedBankId) || activeBanks[0];
  const memo = (topupConfig?.memoTemplate || 'NAP {customer_username}')
    .replaceAll('{customer_username}', currentUser?.email ? currentUser.email.split('@')[0].toUpperCase() : 'USER')
    .replaceAll('{customer_email}', currentUser?.email || '');
  const quickAmounts = (Array.isArray(topupConfig?.quickAmounts) ? topupConfig.quickAmounts : [])
    .map(value => Number(value)).filter(value => value > 0);

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (!selectedBank) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 text-center">
          <Wallet className="w-10 h-10 mx-auto text-amber-400" />
          <h3 className="font-black text-white">Chưa có tài khoản nhận tiền</h3>
          <p className="text-xs text-slate-400">Admin chưa cấu hình ngân hàng nạp tiền đang hoạt động.</p>
          <button type="button" onClick={onClose} className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold">Đóng</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="font-black text-base text-white flex items-center gap-2"><QrCode className="w-5 h-5 text-emerald-400" /><span>Nạp Tiền Vào Ví (VietQR 24/7)</span></h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <div className="space-y-4 text-xs">
          {activeBanks.length > 1 && (
            <div>
              <label className="text-slate-300 block mb-1.5 font-semibold">Chọn ngân hàng nhận tiền:</label>
              <div className="grid grid-cols-2 gap-2">
                {activeBanks.map(bank => (
                  <button key={bank.id} type="button" onClick={() => setSelectedBankId(bank.id)} className={`py-2.5 rounded-xl border font-bold ${selectedBank.id === bank.id ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-950 text-slate-400 border-slate-800'}`}>
                    {bank.bankCode} · {bank.bankName}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="text-slate-300 block mb-1.5 font-semibold">Chọn Mệnh Giá Nạp:</label>
            <div className="grid grid-cols-3 gap-2">
              {quickAmounts.map(value => <button key={value} type="button" onClick={() => { setAmount(value); setAmountError(''); }} className={`py-2 rounded-xl font-bold font-mono border ${amount === value ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-950 text-slate-400 border-slate-800'}`}>{formatVND(value)}</button>)}
            </div>
            <label className="block mt-3">
              <span className="text-slate-400 block mb-1">Hoặc tự nhập số tiền (tối thiểu 2.000 VNĐ):</span>
              <input
                type="number"
                min="2000"
                step="1"
                value={amount}
                onChange={event => {
                  const value = event.target.value;
                  setAmount(value === '' ? '' : Number(value));
                  setAmountError(value !== '' && Number(value) < 2000 ? 'Số tiền nạp tối thiểu là 2.000 VNĐ.' : '');
                }}
                className={`w-full bg-slate-950 border rounded-xl px-3 py-2 text-white font-mono font-bold outline-none ${amountError ? 'border-rose-500' : 'border-slate-700'}`}
              />
              {amountError && <span className="text-[11px] text-rose-400 mt-1 block">{amountError}</span>}
            </label>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 flex flex-col sm:flex-row items-center gap-4">
            <div className="w-36 h-36 bg-white p-2 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <img src={`https://img.vietqr.io/image/${selectedBank.bankCode}-${selectedBank.accountNumber}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(memo)}&accountName=${encodeURIComponent(selectedBank.accountName)}`} alt={`VietQR ${selectedBank.bankCode}`} className="w-full h-full object-contain" />
            </div>
            <div className="space-y-2 flex-1 w-full font-mono text-[11px]">
              <div><span className="text-slate-400 block">Ngân hàng:</span><strong className="text-white">{selectedBank.bankName}</strong></div>
              <div className="flex justify-between items-center"><div><span className="text-slate-400 block">Số tài khoản:</span><strong className="text-emerald-400 text-sm">{selectedBank.accountNumber}</strong></div><button type="button" onClick={() => handleCopy(selectedBank.accountNumber, 'acc')} className="px-2 py-1 rounded bg-slate-800 text-slate-200">{copiedField === 'acc' ? '✓ Đã chép' : 'Copy'}</button></div>
              <div className="flex justify-between items-center"><div><span className="text-slate-400 block">Cú pháp nạp:</span><strong className="text-amber-300 text-sm break-all">{memo}</strong></div><button type="button" onClick={() => handleCopy(memo, 'memo')} className="px-2 py-1 rounded bg-slate-800 text-slate-200">{copiedField === 'memo' ? '✓ Đã chép' : 'Copy'}</button></div>
            </div>
          </div>

          <button type="button" disabled={!Number.isSafeInteger(Number(amount)) || Number(amount) < 2000} onClick={() => onSuccess(Number(amount))} className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-black text-xs">Đã Chuyển Khoản • Xác Nhận Nạp Ngay</button>
        </div>
      </div>
    </div>
  );
}

function AuthModal({ initialTab = 'login', users = [], setUsers, onClose, onSuccess, showToast }) {
  const [tab, setTab] = useState(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tab === 'login') {
      const found = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password);
      if (found) {
        onSuccess(found);
      } else {
        if (showToast) showToast('Email hoặc mật khẩu không chính xác!', 'error');
      }
    } else {
      if (!name.trim() || !email.trim() || !password.trim()) return;
      const normalizedEmail = email.trim().toLowerCase();
      // Chặn đăng ký trùng email: trước đây nhiều tài khoản cùng email được tạo và
      // `users.find()` khi đăng nhập sẽ trả về bản ghi đầu tiên (vào nhầm tài khoản).
      if (users.some(u => (u.email || '').toLowerCase().trim() === normalizedEmail)) {
        if (showToast) showToast('Email này đã được đăng ký. Vui lòng dùng email khác!', 'error');
        return;
      }
      const newUser = {
        id: nextId('u'),
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        role: 'Member',
        balance: 0,
        servers: 0,
        tickets: 0,
        status: 'Hoạt động',
        joined: 'Hôm nay',
        phone: ''
      };
      setUsers(prev => [...prev, newUser]);
      onSuccess(newUser);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex gap-2">
            <button
              onClick={() => setTab('login')}
              className={`font-black text-sm ${tab === 'login' ? 'text-purple-400 border-b-2 border-purple-400 pb-1' : 'text-slate-400'}`}
            >
              Đăng Nhập
            </button>
            <button
              onClick={() => setTab('register')}
              className={`font-black text-sm ${tab === 'register' ? 'text-purple-400 border-b-2 border-purple-400 pb-1' : 'text-slate-400'}`}
            >
              Đăng Ký
            </button>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {tab === 'register' && (
            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Họ và Tên:</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white" />
            </div>
          )}
          <div>
            <label className="text-slate-300 block mb-1 font-semibold">Email:</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white" />
          </div>
          <div>
            <label className="text-slate-300 block mb-1 font-semibold">Mật Khẩu:</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono" />
          </div>
          <button type="submit" className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold">
            {tab === 'login' ? 'Đăng Nhập Ngay' : 'Tạo Tài Khoản Mới'}
          </button>
        </form>
      </div>
    </div>
  );
}

// =========================================================================
// COMPONENT DÙNG CHUNG: FORM CẤU HÌNH GÓI VPS (ĐỒNG BỘ 100% EDIT & CREATE)
// =========================================================================
function PlanFormModal({
  initialPlan,
  isEdit = false,
  vpsCategories = [],
  locations = [],
  formatVND,
  onClose,
  onSubmit
}) {
  const [activeTab, setActiveTab] = useState(1);

  // Tab 1: Thông tin & thương hiệu
  const [name, setName] = useState(initialPlan?.name || '');
  const [tagline, setTagline] = useState(initialPlan?.tagline || '');
  const [category, setCategory] = useState(initialPlan?.category || vpsCategories[0]?.id || 'cat-student');
  const [bandwidth, setBandwidth] = useState(initialPlan?.bandwidth || 'Không giới hạn');
  const [badge, setBadge] = useState(initialPlan?.badge || (isEdit ? '' : '🔥 Bán Chạy'));
  const [popular, setPopular] = useState(Boolean(initialPlan?.popular));

  // Tab 2: Phần cứng
  const [cpu, setCpu] = useState(initialPlan?.cpu ?? 2);
  const [ram, setRam] = useState(initialPlan?.ram ?? 4);
  const [disk, setDisk] = useState(initialPlan?.disk ?? 50);

  // Tab 3: Bảng giá, chiết khấu chu kỳ & thuê ngày
  const [price, setPrice] = useState(initialPlan?.price ?? 129000);
  const [enableDaily, setEnableDaily] = useState(initialPlan?.enableDaily ?? true);
  const [allowDailyRenew, setAllowDailyRenew] = useState(initialPlan?.allowDailyRenew ?? false);

  const [pricingTiers, setPricingTiers] = useState(() => {
    if (initialPlan?.pricingTiers) return { ...initialPlan.pricingTiers };
    const base = initialPlan?.price ?? 129000;
    return {
      d1: Math.round(base / 20),
      d3: Math.round(base / 7),
      d7: Math.round(base / 3),
      m1: base,
      m3: Math.round(base * 3 * 0.95),
      m6: Math.round(base * 6 * 0.90),
      m12: Math.round(base * 12 * 0.80)
    };
  });

  // Tab 4: Hệ điều hành & Data Center (đã bỏ ping và tốc độ)
  const [supportedOs, setSupportedOs] = useState(
    initialPlan?.supportedOs || ['Ubuntu 22.04 LTS', 'Debian 12', 'AlmaLinux 9', 'Windows Server 2022']
  );
  const [newOsInput, setNewOsInput] = useState('');

  const [supportedLocations, setSupportedLocations] = useState(() => {
    if (initialPlan?.supportedLocations && initialPlan.supportedLocations.length > 0) {
      return [...initialPlan.supportedLocations];
    }
    return locations.length > 0
      ? locations.map(l => l.name)
      : ['Hà Nội (Viettel IDC)', 'TP.HCM (FPT Data)', 'Singapore (Equinix)'];
  });
  const [newLocName, setNewLocName] = useState('');

  // Tab 5: Tiện ích mở rộng (Add-ons & Features) - Đã bỏ trường giá tiền
  const [addons, setAddons] = useState(initialPlan?.addons || []);
  const [customAddonName, setCustomAddonName] = useState('');
  const [customAddonDesc, setCustomAddonDesc] = useState('');

  // Helper tính % chiết khấu chu kỳ tháng
  const getCycleDiscountPercent = (months, sellingPrice) => {
    const rawTotal = price * months;
    if (rawTotal <= 0 || sellingPrice >= rawTotal) return 0;
    const diff = rawTotal - sellingPrice;
    return Math.round((diff / rawTotal) * 100);
  };

  // Helper tự động tính toán lại bảng chiết khấu chuẩn
  const handleAutoCalculateTiers = () => {
    const base = parseInt(price, 10) || 59000;
    setPricingTiers(prev => ({
      ...prev,
      m1: base,
      m3: Math.round(base * 3 * 0.95),  // Giảm 5%
      m6: Math.round(base * 6 * 0.90),  // Giảm 10%
      m12: Math.round(base * 12 * 0.80), // Giảm 20%
      d1: Math.round(base / 20),
      d3: Math.round(base / 7),
      d7: Math.round(base / 3)
    }));
  };

  // Thay đổi % chiết khấu cho chu kỳ tháng
  const handleDiscountPercentChange = (tierKey, months, percentVal) => {
    const p = Math.max(0, Math.min(90, parseInt(percentVal, 10) || 0));
    const rawTotal = price * months;
    const discountAmount = Math.round((rawTotal * p) / 100);
    const calculatedPrice = Math.max(0, rawTotal - discountAmount);
    setPricingTiers(prev => ({ ...prev, [tierKey]: calculatedPrice }));
  };

  // Helper thêm OS
  const handleAddOs = (osToAdd) => {
    const target = (osToAdd || newOsInput).trim();
    if (!target) return;
    if (!supportedOs.includes(target)) {
      setSupportedOs([...supportedOs, target]);
    }
    setNewOsInput('');
  };

  // Helper thêm Data Center
  const handleAddLocation = (locToAdd) => {
    const target = (locToAdd || newLocName).trim();
    if (!target) return;
    if (!supportedLocations.includes(target)) {
      setSupportedLocations([...supportedLocations, target]);
    }
    setNewLocName('');
  };

  // Helper thêm Addon tự do với nút cộng [+]
  const handleAddCustomAddon = () => {
    if (!customAddonName.trim()) return;
    const newAddon = {
      id: `ad-${Date.now()}`,
      name: customAddonName.trim(),
      desc: customAddonDesc.trim(),
      price: 0
    };
    setAddons([...addons, newAddon]);
    setCustomAddonName('');
    setCustomAddonDesc('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmit({
      ...(initialPlan || {}),
      id: initialPlan?.id || `plan-${Date.now()}`,
      name: name.trim(),
      tagline: tagline.trim(),
      category,
      cpu: parseInt(cpu, 10) || 1,
      ram: parseInt(ram, 10) || 1,
      disk: parseInt(disk, 10) || 10,
      price: parseInt(price, 10) || 59000,
      bandwidth: bandwidth.trim(),
      badge: badge.trim(),
      popular: Boolean(popular),
      enableDaily: Boolean(enableDaily),
      allowDailyRenew: Boolean(allowDailyRenew),
      pricingTiers: {
        ...pricingTiers,
        m1: parseInt(price, 10) || 59000
      },
      supportedOs,
      supportedLocations,
      addons
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 max-h-[92vh] overflow-y-auto shadow-2xl">
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-black text-base text-white flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-purple-400" />
              <span>{isEdit ? `Chỉnh Sửa Gói VPS: ${initialPlan?.name}` : 'Thêm Gói VPS Mới Vào Hệ Thống'}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Cấu hình toàn diện thông tin, phần cứng, bảng giá chiết khấu, Data Center và tiện ích mở rộng.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Thanh Điều Hướng 5 Tab Chuyên Sâu */}
        <div className="flex flex-wrap gap-1.5 border-b border-slate-800 pb-2">
          {[
            { id: 1, label: '🏷️ 1. Thông Tin', desc: 'Tên & Nhãn' },
            { id: 2, label: '⚡ 2. Phần Cứng', desc: 'CPU, RAM, Disk' },
            { id: 3, label: '💰 3. Bảng Giá & Chiết Khấu', desc: 'Bảng chu kỳ & ngày' },
            { id: 4, label: '🌐 4. Hệ Điều Hành & IDC', desc: 'OS & Vị trí' },
            { id: 5, label: '🧩 5. Tiện Ích Mở Rộng', desc: 'Add-ons' }
          ].map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === t.id
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-950/40'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-850'
              }`}
            >
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Form Nội Dung 5 Tab */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* TAB 1: THÔNG TIN CHUNG & THƯƠNG HIỆU */}
          {activeTab === 1 && (
            <div className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Tên Gói VPS:</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="VD: Dev Pro Căng Đét, GenZ Starter..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Danh Mục Trực Thuộc:</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-bold"
                  >
                    {vpsCategories.map(c => (
                      <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Slogan Mô Tả (Tagline):</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={e => setTagline(e.target.value)}
                  placeholder="VD: Best choice cho Fullstack Dev & Deploy API Docker..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Băng Thông Mạng:</label>
                  <input
                    type="text"
                    value={bandwidth}
                    onChange={e => setBandwidth(e.target.value)}
                    placeholder="VD: Không giới hạn, 10 Gbps Port..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Huy Hiệu (Badge Nhãn):</label>
                  <input
                    type="text"
                    value={badge}
                    onChange={e => setBadge(e.target.value)}
                    placeholder="VD: 🔥 Bán Chạy Nhất, HSSV Đỉnh Chóp..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-amber-300 font-bold"
                  />
                </div>
              </div>

              {/* Nút chọn nhanh Huy hiệu */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-slate-500 mr-1">Gợi ý nhãn nhanh:</span>
                {['🔥 Bán Chạy Nhất', '⚡ HSSV Đỉnh Chóp', '🎮 Ping 1ms Nét Căng', '🚀 Hiệu Năng Cao', '💎 Doanh Nghiệp', 'Tiết Kiệm'].map(bText => (
                  <button
                    key={bText}
                    type="button"
                    onClick={() => setBadge(bText)}
                    className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[10px] text-slate-300 hover:text-white hover:border-purple-500/50 transition"
                  >
                    {bText}
                  </button>
                ))}
              </div>

              {/* Công tắc Gói Nổi Bật */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <strong className="text-white block">Đánh Dấu Là Gói Nổi Bật (Hot / Popular)</strong>
                  <span className="text-[11px] text-slate-400">Gói này sẽ được gắn viền sáng và ưu tiên hiển thị trước ngoài trang chủ</span>
                </div>
                <button
                  type="button"
                  onClick={() => setPopular(!popular)}
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${
                    popular ? 'bg-purple-600' : 'bg-slate-800'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full bg-white transition-transform ${popular ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: CẤU HÌNH PHẦN CỨNG */}
          {activeTab === 2 && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                {/* vCPU */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-slate-300 font-bold">Số Lượng vCPU (Cores):</label>
                    <div className="flex gap-1">
                      {[1, 2, 4, 8, 16].map(c => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setCpu(c)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${cpu === c ? 'bg-purple-600 text-white border-purple-500' : 'bg-slate-900 text-slate-400 border-slate-800'}`}
                        >
                          {c}C
                        </button>
                      ))}
                    </div>
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="64"
                    value={cpu}
                    onChange={e => setCpu(parseInt(e.target.value, 10) || 1)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold"
                  />
                </div>

                {/* RAM */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-cyan-300 font-bold">Bộ Nhớ RAM (GB):</label>
                    <div className="flex gap-1">
                      {[1, 2, 4, 8, 16, 32].map(r => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRam(r)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${ram === r ? 'bg-cyan-600 text-white border-cyan-500' : 'bg-slate-900 text-slate-400 border-slate-800'}`}
                        >
                          {r}GB
                        </button>
                      ))}
                    </div>
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="128"
                    value={ram}
                    onChange={e => setRam(parseInt(e.target.value, 10) || 1)}
                    className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl px-3 py-2 text-cyan-300 font-mono font-bold"
                  />
                </div>

                {/* NVMe */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-amber-300 font-bold">Dung Lượng Ổ Cứng NVMe Enterprise (GB):</label>
                    <div className="flex gap-1">
                      {[20, 30, 60, 120, 250, 500].map(d => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setDisk(d)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${disk === d ? 'bg-amber-600 text-white border-amber-500' : 'bg-slate-900 text-slate-400 border-slate-800'}`}
                        >
                          {d}GB
                        </button>
                      ))}
                    </div>
                  </div>
                  <input
                    type="number"
                    min="10"
                    max="2000"
                    value={disk}
                    onChange={e => setDisk(parseInt(e.target.value, 10) || 10)}
                    className="w-full bg-slate-900 border border-amber-500/40 rounded-xl px-3 py-2 text-amber-300 font-mono font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BẢNG GIÁ, CHIẾT KHẤU CHU KỲ & THUÊ THEO NGÀY */}
          {activeTab === 3 && (
            <div className="space-y-4">
              {/* Đơn giá 1 tháng gốc & Nút tự tính */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <label className="text-slate-300 block mb-1 font-bold">Đơn Giá 1 Tháng Gốc (VNĐ):</label>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    value={price}
                    onChange={e => setPrice(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-slate-900 border border-emerald-500/50 rounded-xl px-3.5 py-2 text-emerald-400 font-mono font-black text-base outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAutoCalculateTiers}
                  className="px-4 py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 font-bold flex items-center justify-center gap-1.5 self-end sm:self-auto transition"
                  title="Tự động áp dụng chiết khấu chuẩn: 3T (-5%), 6T (-10%), 12T (-20%)"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>⚡ Tự Tính Chiết Khấu Chuẩn</span>
                </button>
              </div>

              {/* Bảng kê chiết khấu chu kỳ tháng */}
              <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden">
                <div className="p-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
                  <span className="font-bold text-white text-xs">Bảng Chiết Khấu Chu Kỳ Dài Hạn</span>
                  <span className="text-[11px] text-slate-400">Gõ % chiết khấu để hệ thống tự tính tiền thực thu</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-900/40 text-slate-400 text-[11px]">
                      <tr>
                        <th className="p-3 font-semibold">Chu Kỳ</th>
                        <th className="p-3 font-semibold">Thời Hạn</th>
                        <th className="p-3 font-semibold">Giá Gốc</th>
                        <th className="p-3 font-semibold">% Chiết Khấu</th>
                        <th className="p-3 font-semibold">Tiết Kiệm</th>
                        <th className="p-3 font-semibold">Giá Bán Thực Thu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {/* 1 Tháng */}
                      <tr className="hover:bg-slate-900/30">
                        <td className="p-3 font-bold text-white">1 Tháng</td>
                        <td className="p-3 text-slate-400">30 ngày</td>
                        <td className="p-3 text-slate-300">{formatVND(price)}</td>
                        <td className="p-3 text-slate-500 font-sans">0% (Gốc)</td>
                        <td className="p-3 text-slate-500 font-sans">0 ₫</td>
                        <td className="p-3 text-emerald-400 font-bold">{formatVND(price)}</td>
                      </tr>

                      {/* 3 Tháng */}
                      <tr className="hover:bg-slate-900/30">
                        <td className="p-3 font-bold text-purple-300">3 Tháng</td>
                        <td className="p-3 text-slate-400">90 ngày</td>
                        <td className="p-3 text-slate-300">{formatVND(price * 3)}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="0"
                              max="90"
                              value={getCycleDiscountPercent(3, pricingTiers.m3)}
                              onChange={e => handleDiscountPercentChange('m3', 3, e.target.value)}
                              className="w-14 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-center text-amber-300 font-bold outline-none"
                            />
                            <span className="text-slate-400">%</span>
                          </div>
                        </td>
                        <td className="p-3 text-emerald-400">{formatVND(Math.max(0, price * 3 - pricingTiers.m3))}</td>
                        <td className="p-3">
                          <input
                            type="number"
                            step="1000"
                            value={pricingTiers.m3}
                            onChange={e => setPricingTiers({ ...pricingTiers, m3: parseInt(e.target.value, 10) || 0 })}
                            className="w-28 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white font-bold outline-none"
                          />
                        </td>
                      </tr>

                      {/* 6 Tháng */}
                      <tr className="hover:bg-slate-900/30">
                        <td className="p-3 font-bold text-cyan-300">6 Tháng</td>
                        <td className="p-3 text-slate-400">180 ngày</td>
                        <td className="p-3 text-slate-300">{formatVND(price * 6)}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="0"
                              max="90"
                              value={getCycleDiscountPercent(6, pricingTiers.m6)}
                              onChange={e => handleDiscountPercentChange('m6', 6, e.target.value)}
                              className="w-14 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-center text-amber-300 font-bold outline-none"
                            />
                            <span className="text-slate-400">%</span>
                          </div>
                        </td>
                        <td className="p-3 text-emerald-400">{formatVND(Math.max(0, price * 6 - pricingTiers.m6))}</td>
                        <td className="p-3">
                          <input
                            type="number"
                            step="1000"
                            value={pricingTiers.m6}
                            onChange={e => setPricingTiers({ ...pricingTiers, m6: parseInt(e.target.value, 10) || 0 })}
                            className="w-28 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white font-bold outline-none"
                          />
                        </td>
                      </tr>

                      {/* 12 Tháng */}
                      <tr className="hover:bg-slate-900/30">
                        <td className="p-3 font-bold text-emerald-300">12 Tháng</td>
                        <td className="p-3 text-slate-400">365 ngày</td>
                        <td className="p-3 text-slate-300">{formatVND(price * 12)}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="0"
                              max="90"
                              value={getCycleDiscountPercent(12, pricingTiers.m12)}
                              onChange={e => handleDiscountPercentChange('m12', 12, e.target.value)}
                              className="w-14 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-center text-amber-300 font-bold outline-none"
                            />
                            <span className="text-slate-400">%</span>
                          </div>
                        </td>
                        <td className="p-3 text-emerald-400">{formatVND(Math.max(0, price * 12 - pricingTiers.m12))}</td>
                        <td className="p-3">
                          <input
                            type="number"
                            step="1000"
                            value={pricingTiers.m12}
                            onChange={e => setPricingTiers({ ...pricingTiers, m12: parseInt(e.target.value, 10) || 0 })}
                            className="w-28 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white font-bold outline-none"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Cấu hình thuê theo ngày */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <strong className="text-white block">Cho Phép Khách Thuê Ngắn Hạn Theo Ngày</strong>
                    <span className="text-[11px] text-slate-400">Thích hợp cho sinh viên, khách test code và auto bot ngắn ngày</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEnableDaily(!enableDaily)}
                    className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${
                      enableDaily ? 'bg-emerald-600' : 'bg-slate-800'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full bg-white transition-transform ${enableDaily ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>

                {enableDaily && (
                  <div className="pt-2 border-t border-slate-850 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-slate-400 block mb-1">Giá Gói 1 Ngày:</label>
                        <input
                          type="number"
                          step="1000"
                          value={pricingTiers.d1}
                          onChange={e => setPricingTiers({ ...pricingTiers, d1: parseInt(e.target.value, 10) || 0 })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">Giá Gói 3 Ngày:</label>
                        <input
                          type="number"
                          step="1000"
                          value={pricingTiers.d3}
                          onChange={e => setPricingTiers({ ...pricingTiers, d3: parseInt(e.target.value, 10) || 0 })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">Giá Gói 7 Ngày:</label>
                        <input
                          type="number"
                          step="1000"
                          value={pricingTiers.d7}
                          onChange={e => setPricingTiers({ ...pricingTiers, d7: parseInt(e.target.value, 10) || 0 })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-mono"
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                      <input
                        type="checkbox"
                        checked={allowDailyRenew}
                        onChange={e => setAllowDailyRenew(e.target.checked)}
                        className="rounded border-slate-700 bg-slate-900 text-purple-600"
                      />
                      <span>Cho phép khách tiếp tục gia hạn từng ngày sau khi gói hết hạn</span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: HỆ ĐIỀU HÀNH & DATA CENTER IDC */}
          {activeTab === 4 && (
            <div className="space-y-4">
              {/* Quản lý Hệ điều hành */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <label className="text-slate-300 font-bold block">1. Hệ Điều Hành Hỗ Trợ (OS Templates):</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newOsInput}
                    onChange={e => setNewOsInput(e.target.value)}
                    placeholder="Nhập tên OS mới (VD: Alpine Linux, Rocky Linux 9)..."
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddOs()}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold flex-shrink-0"
                  >
                    + Thêm OS
                  </button>
                </div>

                {/* Thẻ OS đã gán */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {supportedOs.map((os, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 flex items-center gap-2 text-xs"
                    >
                      <span>{os}</span>
                      <button
                        type="button"
                        onClick={() => setSupportedOs(supportedOs.filter((_, i) => i !== idx))}
                        className="text-rose-400 hover:text-rose-300 font-bold"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>

                {/* Gợi ý OS phổ biến */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
                  <span className="text-slate-500 mr-1">Thêm nhanh:</span>
                  {['Ubuntu 24.04 LTS', 'Ubuntu 22.04 LTS', 'Debian 12', 'AlmaLinux 9', 'Windows Server 2022', 'Windows 10 Pro Lite', 'Alpine Linux'].map(osName => (
                    <button
                      key={osName}
                      type="button"
                      onClick={() => handleAddOs(osName)}
                      className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-purple-300"
                    >
                      + {osName}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quản lý Data Center IDC (Đã bỏ ping và tốc độ) */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <label className="text-slate-300 font-bold block">2. Vị Trí Data Center Khả Dụng Cho Gói:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newLocName}
                    onChange={e => setNewLocName(e.target.value)}
                    placeholder="Nhập tên Data Center mới (VD: 🇻🇳 Hà Nội Viettel IDC)..."
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddLocation()}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold flex-shrink-0"
                  >
                    + Thêm IDC
                  </button>
                </div>

                {/* Danh sách IDC đã chọn */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {supportedLocations.map((loc, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 flex items-center gap-2 text-xs"
                    >
                      <span>{loc}</span>
                      <button
                        type="button"
                        onClick={() => setSupportedLocations(supportedLocations.filter((_, i) => i !== idx))}
                        className="text-rose-400 hover:text-rose-300 font-bold"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>

                {/* Gợi ý Data Center phổ biến */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
                  <span className="text-slate-500 mr-1">Vị trí phổ biến:</span>
                  {[
                    '🇻🇳 Hà Nội (Viettel IDC)',
                    '🇻🇳 TP.HCM (FPT Data)',
                    '🇻🇳 Đà Nẵng (VNPT Data)',
                    '🇸🇬 Singapore (Equinix)',
                    '🇯🇵 Tokyo (NTT Com)',
                    '🇭🇰 Hong Kong (Mega-i)',
                    '🇺🇸 US West (Silicon Valley)'
                  ].map(locName => (
                    <button
                      key={locName}
                      type="button"
                      onClick={() => handleAddLocation(locName)}
                      className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-300"
                    >
                      + {locName}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: TIỆN ÍCH MỞ RỘNG (ADD-ONS) */}
          {activeTab === 5 && (
            <div className="space-y-4">
              {/* Thêm tiện ích tùy chỉnh với nút cộng [+] (Đã bỏ ô nhập giá tiền trong cả 2 modal) */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>Thêm Tiện Ích Mới Tùy Chỉnh:</span>
                  </span>
                  <span className="text-[11px] text-slate-500">Nhập thông tin rồi bấm nút [+] để thêm vào gói</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="text"
                    value={customAddonName}
                    onChange={e => setCustomAddonName(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomAddon();
                      }
                    }}
                    placeholder="Tên tiện ích (VD: Anti-DDoS Tầng 7, Snapshot tự động)..."
                    className="flex-1 bg-slate-900 border border-slate-700 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-white outline-none transition"
                  />
                  <input
                    type="text"
                    value={customAddonDesc}
                    onChange={e => setCustomAddonDesc(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomAddon();
                      }
                    }}
                    placeholder="Mô tả ngắn (tùy chọn)..."
                    className="flex-1 bg-slate-900 border border-slate-700 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-slate-300 outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomAddon}
                    className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-purple-950/40 flex-shrink-0 transition active:scale-95"
                    title="Bấm để thêm tiện ích này vào gói"
                  >
                    <Plus className="w-4 h-4 text-purple-200" />
                    <span>Thêm</span>
                  </button>
                </div>

                {/* Các Preset Addon phổ biến (Đã bỏ giá tiền) */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-850">
                  <span className="text-slate-500 text-[11px] mr-1">Gợi ý thêm nhanh:</span>
                  {[
                    { id: 'ad-ddos', name: 'Anti-DDoS Tầng 7 Game & Web', desc: 'Bảo vệ Layer 7, lọc traffic tự động' },
                    { id: 'ad-bk', name: 'Tự Động Sao Lưu Tuần (Snapshot)', desc: '1 bản snapshot tự động hàng tuần' },
                    { id: 'ad-ip', name: 'IPv4 Dedicated Riêng Biệt', desc: 'IPv4 sạch 100% không blacklist' },
                    { id: 'ad-net', name: 'Port Mạng Siêu Tốc 10 Gbps', desc: 'Băng thông rộng tối đa không bóp tốc độ' },
                    { id: 'ad-mng', name: 'Hỗ Trợ Kỹ Thuật VIP 1-1', desc: 'Kỹ sư trực tiếp hỗ trợ cấu hình & tối ưu' },
                    { id: 'ad-ssl', name: 'Cài Đặt Sẵn Panel & SSL Miễn Phí', desc: 'aaPanel / Docker / SSL Let\'s Encrypt' }
                  ].map(pre => (
                    <button
                      key={pre.id}
                      type="button"
                      onClick={() => {
                        if (!addons.some(a => a.name === pre.name)) {
                          setAddons([...addons, { ...pre, price: 0 }]);
                        }
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/50 text-purple-300 text-[10px] font-bold flex items-center gap-1 transition"
                    >
                      <Plus className="w-3 h-3 text-purple-400" />
                      <span>{pre.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Danh sách Add-ons đã gắn */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Danh Sách Tiện Ích Đính Kèm Gói Này ({addons.length}):</span>
                  {addons.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setAddons([])}
                      className="text-[11px] text-rose-400 hover:underline"
                    >
                      Xóa tất cả
                    </button>
                  )}
                </div>
                {addons.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center text-slate-500 text-xs">
                    Chưa có tiện ích mở rộng nào. Hãy nhập thông tin rồi bấm nút <strong>[+] Thêm</strong> hoặc chọn từ các gợi ý phía trên.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {addons.map((a, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-6 h-6 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 flex items-center justify-center flex-shrink-0 text-[11px] font-bold">
                            ✓
                          </span>
                          <div className="min-w-0">
                            <span className="font-bold text-white block truncate">{a.name}</span>
                            {a.desc && <span className="text-slate-400 text-[11px] block truncate">{a.desc}</span>}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setAddons(addons.filter((_, i) => i !== idx))}
                          className="px-2 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 font-bold text-xs flex-shrink-0 transition"
                          title="Xóa tiện ích này"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Thanh Tóm Tắt & Nút Lưu */}
          <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-slate-400 text-xs font-mono">
              Cấu hình: <strong className="text-white">{cpu} vCPU</strong> • <strong className="text-cyan-300">{ram}GB RAM</strong> • <strong className="text-amber-300">{disk}GB NVMe</strong> • <strong className="text-emerald-400">{formatVND(price)}/tháng</strong>
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-purple-950/40 transition"
            >
              {isEdit ? 'Lưu Toàn Bộ Cấu Hình Gói' : 'Tạo & Đăng Bán Gói VPS Này'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Wrapper EditPlanModal sử dụng PlanFormModal
function EditPlanModal({ plan, vpsCategories = [], locations = [], formatVND, onClose, onSave }) {
  return (
    <PlanFormModal
      initialPlan={plan}
      isEdit={true}
      vpsCategories={vpsCategories}
      locations={locations}
      formatVND={formatVND}
      onClose={onClose}
      onSubmit={onSave}
    />
  );
}

// Wrapper CreatePlanModal sử dụng cùng PlanFormModal (Đồng bộ 100%)
function CreatePlanModal({ vpsCategories = [], locations = [], formatVND, onClose, onAdd }) {
  return (
    <PlanFormModal
      initialPlan={null}
      isEdit={false}
      vpsCategories={vpsCategories}
      locations={locations}
      formatVND={formatVND}
      onClose={onClose}
      onSubmit={onAdd}
    />
  );
}

function EditProxyPlanModal({ plan, proxyCountries = [], formatVND, onClose, onSave }) {
  const [name, setName] = useState(plan.name);
  const [protocol, setProtocol] = useState(plan.protocol || 'HTTP');
  const [price, setPrice] = useState(plan.price);
  const [supportedCountries, setSupportedCountries] = useState(plan.supportedCountries || [plan.country]);
  const [newCountryName, setNewCountryName] = useState('');

  const handleAddCountry = () => {
    if (!newCountryName.trim()) return;
    if (!supportedCountries.includes(newCountryName.trim())) {
      setSupportedCountries([...supportedCountries, newCountryName.trim()]);
    }
    setNewCountryName('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...plan,
      name: name.trim(),
      protocol,
      price: parseInt(price) || 35000,
      supportedCountries
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="font-black text-base text-white">Chỉnh Sửa Gói Proxy</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="text-slate-300 block mb-1 font-semibold">Tên Gói Proxy:</label>
            <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white" />
          </div>
          <div>
            <label className="text-slate-300 block mb-1 font-semibold">Giao Thức:</label>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setProtocol('HTTP')} className={`py-1.5 rounded-xl border font-bold ${protocol === 'HTTP' ? 'bg-purple-600 text-white border-purple-500' : 'bg-slate-950 text-slate-400 border-slate-800'}`}>HTTP</button>
              <button type="button" onClick={() => setProtocol('SOCKS5')} className={`py-1.5 rounded-xl border font-bold ${protocol === 'SOCKS5' ? 'bg-cyan-600 text-white border-cyan-500' : 'bg-slate-950 text-slate-400 border-slate-800'}`}>SOCKS5</button>
            </div>
          </div>
          <div>
            <label className="text-slate-300 block mb-1 font-semibold">Đơn Giá Tháng:</label>
            <input type="number" value={price} onChange={e => setPrice(parseInt(e.target.value) || 0)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold" />
          </div>
          <div>
            <label className="text-slate-300 block mb-1 font-semibold">Quốc Gia Hỗ Trợ Cho Khách Chọn:</label>
            <div className="flex gap-2">
              <input type="text" value={newCountryName} onChange={e => setNewCountryName(e.target.value)} placeholder="Nhập tên quốc gia..." className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white" />
              <button type="button" onClick={handleAddCountry} className="px-3 py-2 bg-cyan-600 text-white rounded-xl font-bold">+</button>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {supportedCountries.map((c, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300 flex items-center gap-1.5">
                  <span>{c}</span>
                  <button type="button" onClick={() => setSupportedCountries(supportedCountries.filter((_, idx) => idx !== i))} className="text-rose-400">✕</button>
                </span>
              ))}
            </div>
          </div>
          <button type="submit" className="w-full py-2.5 rounded-xl bg-cyan-600 text-white font-bold">Lưu Gói Proxy</button>
        </form>
      </div>
    </div>
  );
}

function CreateProxyPlanModal({ proxyCountries = [], formatVND, onClose, onAdd }) {
  const [name, setName] = useState('');
  const [protocol, setProtocol] = useState('HTTP');
  const [price, setPrice] = useState(35000);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({
      id: `prx-${Date.now()}`,
      name: name.trim(),
      type: 'IPv4 Dedicated',
      protocol,
      bandwidth: 'Không giới hạn',
      speed: '1 Gbps',
      country: 'Việt Nam 🇻🇳',
      supportedCountries: ['Việt Nam 🇻🇳', 'Hoa Kỳ (USA) 🇺🇸', 'Singapore 🇸🇬'],
      price: parseInt(price) || 35000,
      priceDaily: Math.round(price / 20),
      enableDaily: true,
      badge: 'Mới',
      desc: 'Proxy tốc độ cao chuyên nghiệp'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="font-black text-base text-white">Tạo Gói Proxy Mới</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="text-slate-300 block mb-1 font-semibold">Tên Gói:</label>
            <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white" />
          </div>
          <div>
            <label className="text-slate-300 block mb-1 font-semibold">Giao Thức:</label>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setProtocol('HTTP')} className={`py-1.5 rounded-xl border font-bold ${protocol === 'HTTP' ? 'bg-purple-600 text-white border-purple-500' : 'bg-slate-950 text-slate-400 border-slate-800'}`}>HTTP</button>
              <button type="button" onClick={() => setProtocol('SOCKS5')} className={`py-1.5 rounded-xl border font-bold ${protocol === 'SOCKS5' ? 'bg-cyan-600 text-white border-cyan-500' : 'bg-slate-950 text-slate-400 border-slate-800'}`}>SOCKS5</button>
            </div>
          </div>
          <div>
            <label className="text-slate-300 block mb-1 font-semibold">Giá 1 Tháng:</label>
            <input type="number" value={price} onChange={e => setPrice(parseInt(e.target.value) || 0)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold" />
          </div>
          <button type="submit" className="w-full py-2.5 rounded-xl bg-cyan-600 text-white font-bold">Thêm Gói Proxy</button>
        </form>
      </div>
    </div>
  );
}

function ManualProxyModal({ proxyCountries = [], onClose, onAddBatch }) {
  const [rawText, setRawText] = useState('');
  const [protocol, setProtocol] = useState('HTTP');
  const [country, setCountry] = useState('Việt Nam 🇻🇳');

  const handleSubmit = (e) => {
    e.preventDefault();
    const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return;
    const list = lines.map((line, idx) => {
      const parts = line.split(':');
      return {
        id: `pst-${Date.now()}-${idx}`,
        proxyString: line,
        ip: parts[0] || '127.0.0.1',
        port: parts[1] || '8080',
        user: parts[2] || 'user',
        pass: parts[3] || 'pass',
        protocol,
        country,
        status: 'Ready',
        addedAt: 'Hôm nay'
      };
    });
    onAddBatch(list);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="font-black text-base text-white">Nhập Proxy Thủ Công Vào Kho</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="text-slate-300 block mb-1 font-semibold">Dán Danh Sách Proxy (Mỗi dòng 1 IP:Port:User:Pass):</label>
            <textarea
              rows={5}
              required
              value={rawText}
              onChange={e => setRawText(e.target.value)}
              placeholder="103.142.26.88:8080:user1:pass1&#10;142.250.190.46:1080:user2:pass2"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 font-mono text-emerald-400 outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Giao Thức:</label>
              <select value={protocol} onChange={e => setProtocol(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white">
                <option value="HTTP">HTTP</option>
                <option value="SOCKS5">SOCKS5</option>
              </select>
            </div>
            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Quốc Gia:</label>
              <input type="text" value={country} onChange={e => setCountry(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white" />
            </div>
          </div>
          <button type="submit" className="w-full py-2.5 rounded-xl bg-amber-600 text-white font-bold">
            Nhập Vào Kho Sẵn Sàng
          </button>
        </form>
      </div>
    </div>
  );
}

function CreateCategoryModal({ onClose, onAdd }) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('⚡');
  const [description, setDescription] = useState('');

  // Danh mục icon phong phú chuyên dụng cho VPS & Cloud
  const PRESET_ICONS = [
    '⚡', '🚀', '🎓', '🎮', '🪟', '🛡️', '🌐', '💻', 
    '🖥️', '🗄️', '🔒', '👨‍💻', '🤖', '📦', '🧪', '💡',
    '🕹️', '👾', '🔥', '🎯', '🏢', '💼', '💎', '👑', '⭐'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({
      id: `cat-${Date.now()}`,
      name: name.trim(),
      icon: icon.trim() || '⚡',
      description: description.trim() || 'Danh mục Cloud VPS chuyên dụng',
      badge: 'Mới',
      tag: 'Cloud'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="font-black text-base text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Thêm Danh Mục VPS Mới</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-4 gap-2.5">
            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Icon:</label>
              <input
                type="text"
                value={icon}
                onChange={e => setIcon(e.target.value)}
                className="w-full bg-slate-950 border border-purple-500/50 rounded-xl px-2 py-2 text-white text-center text-lg outline-none font-bold"
              />
            </div>
            <div className="col-span-3">
              <label className="text-slate-300 block mb-1 font-semibold">Tên Danh Mục:</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="VD: Cloud VPS Gaming Ping Thấp..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
              />
            </div>
          </div>

          {/* Bảng chọn Icon trực quan một chạm */}
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span className="font-semibold text-purple-300">Gợi Ý Chọn Nhanh Biểu Tượng:</span>
              <span className="text-slate-500">Bấm để đổi icon</span>
            </div>
            <div className="grid grid-cols-7 sm:grid-cols-8 gap-1.5 pt-1">
              {PRESET_ICONS.map((emoji, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setIcon(emoji)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition ${
                    icon === emoji
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-950/50 border border-purple-400 scale-110'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800/80 hover:border-slate-700'
                  }`}
                  title={`Chọn icon ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-slate-300 block mb-1 font-semibold">Mô Tả Ngắn:</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Mô tả mục đích sử dụng của danh mục này..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
            />
          </div>
          <button type="submit" className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-950/40 transition">
            Thêm Danh Mục
          </button>
        </form>
      </div>
    </div>
  );
}

function EditCategoryModal({ category, onClose, onSave }) {
  const [name, setName] = useState(category.name);
  const [icon, setIcon] = useState(category.icon || '⚡');
  const [description, setDescription] = useState(category.description || '');

  const PRESET_ICONS = [
    '⚡', '🚀', '🎓', '🎮', '🪟', '🛡️', '🌐', '💻', 
    '🖥️', '🗄️', '🔒', '👨‍💻', '🤖', '📦', '🧪', '💡',
    '🕹️', '👾', '🔥', '🎯', '🏢', '💼', '💎', '👑', '⭐'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...category,
      name: name.trim(),
      icon: icon.trim() || '⚡',
      description: description.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="font-black text-base text-white flex items-center gap-2">
            <Edit className="w-4 h-4 text-purple-400" />
            <span>Chỉnh Sửa Danh Mục</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-4 gap-2.5">
            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Icon:</label>
              <input
                type="text"
                value={icon}
                onChange={e => setIcon(e.target.value)}
                className="w-full bg-slate-950 border border-purple-500/50 rounded-xl px-2 py-2 text-white text-center text-lg outline-none font-bold"
              />
            </div>
            <div className="col-span-3">
              <label className="text-slate-300 block mb-1 font-semibold">Tên Danh Mục:</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
              />
            </div>
          </div>

          {/* Bảng chọn Icon trực quan một chạm */}
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span className="font-semibold text-purple-300">Gợi Ý Chọn Nhanh Biểu Tượng:</span>
              <span className="text-slate-500">Bấm để đổi icon</span>
            </div>
            <div className="grid grid-cols-7 sm:grid-cols-8 gap-1.5 pt-1">
              {PRESET_ICONS.map((emoji, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setIcon(emoji)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition ${
                    icon === emoji
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-950/50 border border-purple-400 scale-110'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800/80 hover:border-slate-700'
                  }`}
                  title={`Chọn icon ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-slate-300 block mb-1 font-semibold">Mô Tả:</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
            />
          </div>
          <button type="submit" className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-950/40 transition">
            Lưu Thay Đổi
          </button>
        </form>
      </div>
    </div>
  );
}

function CreateUserModal({ onClose, onAdd }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('123456');
  const [role, setRole] = useState('Member');
  const [balance, setBalance] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    onAdd({
      id: `u-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
      role,
      balance: parseInt(balance, 10) || 0,
      servers: 0,
      tickets: 0,
      status: 'Hoạt động',
      joined: 'Hôm nay',
      phone: ''
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="font-black text-base text-white">Thêm Thành Viên Mới</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="text-slate-300 block mb-1 font-semibold">Họ và Tên:</label>
            <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white" />
          </div>
          <div>
            <label className="text-slate-300 block mb-1 font-semibold">Email:</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white" />
          </div>
          <div>
            <label className="text-slate-300 block mb-1 font-semibold">Mật Khẩu Ban Đầu:</label>
            <input type="text" required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Số Dư Ban Đầu (VNĐ):</label>
              <input type="number" min="0" step="10000" value={balance} onChange={e => setBalance(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold" />
            </div>
            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Phân Quyền:</label>
              <select value={role} onChange={e => setRole(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold">
                <option value="Member">Member</option>
                <option value="VIP">VIP</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>
          <button type="submit" className="w-full py-2.5 rounded-xl bg-purple-600 text-white font-bold">
            Tạo Thành Viên
          </button>
        </form>
      </div>
    </div>
  );
}