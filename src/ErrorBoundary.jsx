import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

// Chặn lỗi runtime của một nhánh giao diện để không làm trắng toàn bộ ứng dụng.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
    this.handleReset = this.handleReset.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Lỗi giao diện không mong muốn:', error, info?.componentStack);
  }

  handleReset() {
    this.setState({ error: null });
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="p-6 rounded-3xl bg-slate-900 border border-rose-500/40 space-y-3 text-xs">
        <div className="flex items-center gap-2 text-rose-300 font-black text-sm">
          <AlertTriangle className="w-4 h-4" />
          <span>{this.props.title || 'Khu vực này đang gặp sự cố hiển thị'}</span>
        </div>
        <p className="text-slate-400">
          {this.props.description || 'Dữ liệu của bạn vẫn được giữ nguyên. Hãy thử tải lại khu vực này.'}
        </p>
        <p className="font-mono text-[11px] text-rose-400/80 break-all">{error.message}</p>
        <button
          type="button"
          onClick={this.handleReset}
          className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Thử lại</span>
        </button>
      </div>
    );
  }
}