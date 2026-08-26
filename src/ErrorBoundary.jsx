import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React ErrorBoundary caught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {}

    if ('caches' in window) {
      caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k)))).then(() => {
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.getRegistrations().then((regs) => {
            Promise.all(regs.map((r) => r.unregister())).then(() => {
              window.location.href = window.location.pathname + '?v=' + Date.now();
            });
          });
        } else {
          window.location.href = window.location.pathname + '?v=' + Date.now();
        }
      }).catch(() => {
        window.location.href = window.location.pathname + '?v=' + Date.now();
      });
    } else {
      window.location.href = window.location.pathname + '?v=' + Date.now();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6 font-sans">
          <div className="max-w-xl w-full bg-slate-800 border border-slate-700 rounded-3xl p-8 space-y-5 shadow-2xl">
            <div className="w-16 h-16 bg-amber-500/20 border border-amber-500/40 text-amber-400 rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold">
              ⚠️
            </div>
            <div className="space-y-2 text-center">
              <h3 className="text-xl font-black text-white">Phát Hiện Lỗi Hệ Thống</h3>
              <p className="text-xs text-slate-300">
                Chi tiết lỗi bên dưới giúp lập trình viên xử lý dứt điểm:
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl text-left border border-slate-800 font-mono text-xs text-rose-400 overflow-x-auto max-h-48">
              <div className="font-bold text-amber-300 mb-1">{this.state.error?.toString()}</div>
              <div className="text-[10px] text-slate-400 whitespace-pre-wrap">{this.state.error?.stack}</div>
            </div>

            <button
              onClick={this.handleReload}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black rounded-2xl shadow-lg transition-all active:scale-95 text-sm cursor-pointer"
            >
              🔄 Xóa Bộ Nhớ Đệm & Tải Lại Nhanh
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
