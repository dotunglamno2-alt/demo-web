import React, { useMemo, useState } from 'react';
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Filter,
  History,
  RotateCcw,
  Search,
  WalletCards
} from 'lucide-react';

const PAGE_SIZE = 20;

export const FINANCE_TYPE_LABELS = {
  topup: 'Nạp tiền',
  purchase_vps: 'Mua VPS',
  purchase_proxy: 'Mua Proxy',
  upgrade: 'Nâng cấp',
  renewal: 'Gia hạn',
  refund: 'Hoàn tiền',
  admin_adjustment: 'Điều chỉnh quản trị'
};

const TYPE_OPTIONS = Object.entries(FINANCE_TYPE_LABELS);

const EMPTY_FILTERS = {
  search: '',
  type: 'all',
  direction: 'all',
  from: '',
  to: ''
};

function toSearchable(value) {
  return String(value ?? '').toLocaleLowerCase('vi');
}

function parseIsoDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function localDateStart(value) {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day, 0, 0, 0, 0).getTime();
}

function localDateEndExclusive(value) {
  const start = localDateStart(value);
  return start === null ? null : start + 24 * 60 * 60 * 1000;
}

function formatDateTime(value) {
  const date = parseIsoDate(value);
  if (!date) return '—';
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(date);
}

function formatAmount(amount, formatVND) {
  const numericAmount = Number(amount) || 0;
  if (typeof formatVND === 'function') return formatVND(numericAmount);
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(numericAmount);
}

function signedAmountClass(amount) {
  const numericAmount = Number(amount) || 0;
  if (numericAmount > 0) return 'text-emerald-300';
  if (numericAmount < 0) return 'text-rose-300';
  return 'text-slate-300';
}

function signedAmountPrefix(amount) {
  const numericAmount = Number(amount) || 0;
  return numericAmount > 0 ? '+' : '';
}

function getLedgerRecordKey(record, index) {
  return `${record?.id || 'ledger-record'}-${record?.createdAt || index}-${index}`;
}

function useFilteredLedger(transactions) {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [page, setPage] = useState(1);

  const filteredTransactions = useMemo(() => {
    const source = Array.isArray(transactions) ? transactions : [];
    const search = toSearchable(filters.search).trim();
    const fromTime = localDateStart(filters.from);
    const toTime = localDateEndExclusive(filters.to);

    return source.filter(record => {
      const searchableText = [
        record?.id,
        record?.userId,
        record?.userName,
        record?.userEmail,
        record?.referenceId,
        record?.description
      ].map(toSearchable).join(' ');
      const matchesSearch = !search || searchableText.includes(search);
      const matchesType = filters.type === 'all' || record?.type === filters.type;
      const amount = Number(record?.amount) || 0;
      const matchesDirection =
        filters.direction === 'all' ||
        (filters.direction === 'credit' && amount > 0) ||
        (filters.direction === 'debit' && amount < 0);
      const recordTime = parseIsoDate(record?.createdAt)?.getTime();
      const matchesFrom = fromTime === null || (recordTime !== undefined && recordTime >= fromTime);
      const matchesTo = toTime === null || (recordTime !== undefined && recordTime < toTime);

      return matchesSearch && matchesType && matchesDirection && matchesFrom && matchesTo;
    });
  }, [filters, transactions]);

  const pageCount = Math.max(1, Math.ceil(filteredTransactions.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageRows = filteredTransactions.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const updateFilter = (name, value) => {
    setFilters(previous => ({ ...previous, [name]: value }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters(EMPTY_FILTERS);
    setPage(1);
  };

  const goToPage = nextPage => {
    setPage(Math.max(1, Math.min(pageCount, nextPage)));
  };

  return {
    filters,
    filteredTransactions,
    pageRows,
    page: safePage,
    pageCount,
    updateFilter,
    resetFilters,
    goToPage
  };
}

function FinanceFilters({ filters, updateFilter, resetFilters, resultCount, totalCount, idPrefix }) {
  return (
    <div className="space-y-3" data-testid={`${idPrefix}-filters`}>
      <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 xl:grid-cols-5 text-xs">
        <label className="relative md:col-span-2 xl:col-span-2">
          <span className="sr-only">Tìm kiếm lịch sử tài chính</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
          <input
            type="search"
            value={filters.search}
            onChange={event => updateFilter('search', event.target.value)}
            placeholder="Tìm mã, khách hàng, email, nội dung..."
            aria-label="Tìm theo mã, email, tên, mã tham chiếu hoặc mô tả"
            data-testid={`${idPrefix}-search`}
            className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 pl-9 pr-3 text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          />
        </label>

        <label>
          <span className="sr-only">Loại giao dịch</span>
          <select
            value={filters.type}
            onChange={event => updateFilter('type', event.target.value)}
            aria-label="Lọc theo loại giao dịch"
            data-testid={`${idPrefix}-type-filter`}
            className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-white outline-none focus:border-purple-500"
          >
            <option value="all">Tất cả loại giao dịch</option>
            {TYPE_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>

        <label>
          <span className="sr-only">Hướng biến động số dư</span>
          <select
            value={filters.direction}
            onChange={event => updateFilter('direction', event.target.value)}
            aria-label="Lọc theo hướng biến động số dư"
            data-testid={`${idPrefix}-direction-filter`}
            className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-white outline-none focus:border-purple-500"
          >
            <option value="all">Tất cả biến động</option>
            <option value="credit">Tiền vào</option>
            <option value="debit">Tiền ra</option>
          </select>
        </label>

        <div className="flex items-center gap-2 md:col-span-2 xl:col-span-1">
          <label className="min-w-0 flex-1">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-slate-500">Từ ngày</span>
            <input
              type="date"
              value={filters.from}
              max={filters.to || undefined}
              onChange={event => updateFilter('from', event.target.value)}
              aria-label="Ngày bắt đầu"
              data-testid={`${idPrefix}-from-date`}
              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-2.5 py-2 text-white outline-none focus:border-purple-500"
            />
          </label>
          <label className="min-w-0 flex-1">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-slate-500">Đến ngày</span>
            <input
              type="date"
              value={filters.to}
              min={filters.from || undefined}
              onChange={event => updateFilter('to', event.target.value)}
              aria-label="Ngày kết thúc"
              data-testid={`${idPrefix}-to-date`}
              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-2.5 py-2 text-white outline-none focus:border-purple-500"
            />
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between">
        <p className="text-slate-500" aria-live="polite" data-testid={`${idPrefix}-count`}>
          Hiển thị {resultCount} / {totalCount} bản ghi
        </p>
        <button
          type="button"
          onClick={resetFilters}
          className="inline-flex items-center justify-center gap-1.5 self-start rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 font-bold text-slate-300 transition hover:border-purple-500/60 hover:text-white sm:self-auto"
          data-testid={`${idPrefix}-reset`}
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Đặt lại bộ lọc
        </button>
      </div>
    </div>
  );
}

function Pagination({ page, pageCount, goToPage, idPrefix }) {
  if (pageCount <= 1) return null;
  return (
    <nav className="flex items-center justify-between border-t border-slate-800/80 px-3 py-3 text-xs" aria-label="Phân trang lịch sử tài chính" data-testid={`${idPrefix}-pagination`}>
      <span className="text-slate-500">Trang {page} / {pageCount}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => goToPage(page - 1)}
          disabled={page <= 1}
          aria-label="Trang trước"
          data-testid={`${idPrefix}-previous-page`}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-800 px-2.5 py-1.5 font-bold text-slate-300 transition hover:border-purple-500/60 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Trước
        </button>
        <button
          type="button"
          onClick={() => goToPage(page + 1)}
          disabled={page >= pageCount}
          aria-label="Trang sau"
          data-testid={`${idPrefix}-next-page`}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-800 px-2.5 py-1.5 font-bold text-slate-300 transition hover:border-purple-500/60 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Sau
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}

function EmptyLedgerState({ filtered, idPrefix }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-8 text-center" data-testid={`${idPrefix}-empty`}>
      <History className="mx-auto mb-3 h-8 w-8 text-purple-400/70" aria-hidden="true" />
      <p className="text-sm font-bold text-slate-200">
        {filtered ? 'Không có bản ghi phù hợp với bộ lọc.' : 'Chưa có lịch sử tài chính.'}
      </p>
      <p className="mt-1 text-xs text-slate-500">
        Lịch sử được ghi nhận từ thời điểm kích hoạt tính năng; không có sự kiện cũ được thêm vào.
      </p>
    </div>
  );
}

function FinanceHeader({ title, description, icon: Icon }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 className="flex items-center gap-2 text-lg font-black text-white">
          <Icon className="h-5 w-5 text-purple-400" aria-hidden="true" />
          {title}
        </h2>
        <p className="mt-1 text-xs text-slate-400">{description}</p>
      </div>
      <div className="inline-flex items-center gap-1.5 self-start rounded-lg border border-purple-500/20 bg-purple-500/10 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-purple-300">
        <Filter className="h-3 w-3" aria-hidden="true" />
        Đối soát
      </div>
    </div>
  );
}

function TableShell({ children, idPrefix }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900" data-testid={`${idPrefix}-table-shell`}>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

function TypeBadge({ type }) {
  return (
    <span className="inline-flex whitespace-nowrap rounded-md bg-purple-500/15 px-2 py-1 text-[11px] font-bold text-purple-300">
      {FINANCE_TYPE_LABELS[type] || type || 'Không xác định'}
    </span>
  );
}

function AmountCell({ amount, formatVND }) {
  const numericAmount = Number(amount) || 0;
  const DirectionIcon = numericAmount >= 0 ? ArrowUpRight : ArrowDownLeft;
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap font-mono font-black ${signedAmountClass(numericAmount)}`}>
      <DirectionIcon className="h-3.5 w-3.5" aria-hidden="true" />
      {signedAmountPrefix(numericAmount)}{formatAmount(numericAmount, formatVND)}
    </span>
  );
}

export function AdminTransactionsTab({ transactions, formatVND }) {
  const ledger = useFilteredLedger(transactions);
  const hasRecords = Array.isArray(transactions) && transactions.length > 0;

  return (
    <section className="space-y-4" data-testid="admin-transactions-tab">
      <FinanceHeader
        title="Giao dịch tài chính"
        description="Kiểm tra các khoản nạp, chi, hoàn tiền và điều chỉnh trong sổ cái bất biến."
        icon={WalletCards}
      />
      <FinanceFilters
        {...ledger}
        resultCount={ledger.filteredTransactions.length}
        totalCount={hasRecords ? transactions.length : 0}
        idPrefix="transactions"
      />
      {!ledger.pageRows.length ? (
        <EmptyLedgerState filtered={hasRecords} idPrefix="transactions" />
      ) : (
        <>
          <TableShell idPrefix="transactions">
            <table className="w-full min-w-[1120px] text-left text-xs">
              <caption className="sr-only">Danh sách giao dịch tài chính</caption>
              <thead className="border-b border-slate-800 bg-slate-950/60 text-[10px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th scope="col" className="px-4 py-3 font-black">Thời gian</th>
                  <th scope="col" className="px-4 py-3 font-black">Mã giao dịch</th>
                  <th scope="col" className="px-4 py-3 font-black">Khách hàng</th>
                  <th scope="col" className="px-4 py-3 font-black">Loại</th>
                  <th scope="col" className="px-4 py-3 font-black">Mã tham chiếu</th>
                  <th scope="col" className="px-4 py-3 font-black">Mô tả</th>
                  <th scope="col" className="px-4 py-3 text-right font-black">Số tiền</th>
                  <th scope="col" className="px-4 py-3 font-black">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {ledger.pageRows.map((record, index) => (
                  <tr key={getLedgerRecordKey(record, index)} className="align-top transition hover:bg-slate-800/30" data-testid="transaction-row">
                    <td className="whitespace-nowrap px-4 py-3 text-slate-400">{formatDateTime(record?.createdAt)}</td>
                    <td className="px-4 py-3 font-mono font-bold text-white">{record?.id || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-200">{record?.userName || '—'}</div>
                      <div className="mt-0.5 text-[11px] text-slate-500">{record?.userEmail || record?.userId || '—'}</div>
                    </td>
                    <td className="px-4 py-3"><TypeBadge type={record?.type} /></td>
                    <td className="px-4 py-3 font-mono text-slate-400">{record?.referenceId || '—'}</td>
                    <td className="max-w-[280px] px-4 py-3 text-slate-300">{record?.description || '—'}</td>
                    <td className="px-4 py-3 text-right"><AmountCell amount={record?.amount} formatVND={formatVND} /></td>
                    <td className="px-4 py-3">
                      <span className="inline-flex whitespace-nowrap rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-300">Hoàn tất</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableShell>
          <Pagination {...ledger} idPrefix="transactions" />
        </>
      )}
    </section>
  );
}

export function AdminBalanceHistoryTab({ transactions, formatVND }) {
  const ledger = useFilteredLedger(transactions);
  const hasRecords = Array.isArray(transactions) && transactions.length > 0;

  return (
    <section className="space-y-4" data-testid="admin-balance-history-tab">
      <FinanceHeader
        title="Lịch sử số dư"
        description="Theo dõi biến động số dư trước và sau từng ghi nhận trong cùng một sổ cái."
        icon={History}
      />
      <FinanceFilters
        {...ledger}
        resultCount={ledger.filteredTransactions.length}
        totalCount={hasRecords ? transactions.length : 0}
        idPrefix="balance-history"
      />
      {!ledger.pageRows.length ? (
        <EmptyLedgerState filtered={hasRecords} idPrefix="balance-history" />
      ) : (
        <>
          <TableShell idPrefix="balance-history">
            <table className="w-full min-w-[1060px] text-left text-xs">
              <caption className="sr-only">Lịch sử thay đổi số dư</caption>
              <thead className="border-b border-slate-800 bg-slate-950/60 text-[10px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th scope="col" className="px-4 py-3 font-black">Thời gian</th>
                  <th scope="col" className="px-4 py-3 font-black">Khách hàng</th>
                  <th scope="col" className="px-4 py-3 font-black">Thay đổi</th>
                  <th scope="col" className="px-4 py-3 font-black">Số dư trước</th>
                  <th scope="col" className="px-4 py-3 font-black">Số dư sau</th>
                  <th scope="col" className="px-4 py-3 font-black">Mô tả</th>
                  <th scope="col" className="px-4 py-3 font-black">Người thực hiện</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {ledger.pageRows.map((record, index) => (
                  <tr key={getLedgerRecordKey(record, index)} className="align-top transition hover:bg-slate-800/30" data-testid="balance-history-row">
                    <td className="whitespace-nowrap px-4 py-3 text-slate-400">{formatDateTime(record?.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-200">{record?.userName || '—'}</div>
                      <div className="mt-0.5 text-[11px] text-slate-500">{record?.userEmail || record?.userId || '—'}</div>
                    </td>
                    <td className="px-4 py-3"><AmountCell amount={record?.amount} formatVND={formatVND} /></td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-slate-400">{formatAmount(record?.balanceBefore, formatVND)}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono font-bold text-slate-200">{formatAmount(record?.balanceAfter, formatVND)}</td>
                    <td className="max-w-[320px] px-4 py-3 text-slate-300">{record?.description || '—'}</td>
                    <td className="px-4 py-3 text-slate-400">{record?.actorEmail || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableShell>
          <Pagination {...ledger} idPrefix="balance-history" />
        </>
      )}
    </section>
  );
}
