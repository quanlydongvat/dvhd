import React, { useState } from 'react';
import { ShieldCheck, User, Lock, Loader2, Sparkles, Feather } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const WILDLIFE_SPECIES = [
    { name: 'Dúi mốc lớn', icon: '🦔', tag: 'Nhóm IIB' },
    { name: 'Cầy vòi Hương', icon: '🦊', tag: 'Nhóm IIB' },
    { name: 'Nhím bờm', icon: '🦔', tag: 'Nhóm IIB' },
    { name: 'Chim Chào mào', icon: '🦜', tag: 'ĐV Thông thường' },
    { name: 'Dúi má đào', icon: '🦔', tag: 'Nhóm IIB' },
    { name: 'Cầy vòi mốc', icon: '🦊', tag: 'Nhóm IIB' },
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const cleanUsername = username.trim().toLowerCase().replace(/\s+/g, '');

      // Demo / Special Account Fallbacks
      if (cleanUsername === 'dlc-krb' && password === 'kiemlam123') {
        onLoginSuccess({
          uid: 'dlc_krb_staff_id',
          email: 'dlc-krb@krongbong.gov.vn',
          username: 'dlc-krb',
          role: 'STAFF',
          facilityId: null,
        });
        setIsLoading(false);
        return;
      }

      if (cleanUsername === 'admin' && (password === 'admin123' || password === 'kiemlam123')) {
        onLoginSuccess({
          uid: 'admin_id',
          email: 'admin@krongbong.gov.vn',
          username: 'admin',
          role: 'ADMIN',
          facilityId: null,
        });
        setIsLoading(false);
        return;
      }

      const email = `${cleanUsername}@krongbong.gov.vn`;

      // Authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch user role from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      let role = 'FACILITY';
      let facilityId = null;

      if (userDoc.exists()) {
        const data = userDoc.data();
        role = data.role || 'FACILITY';
        facilityId = data.facilityId || null;
      } else {
        if (cleanUsername === 'admin') {
          role = 'ADMIN';
        } else if (cleanUsername === 'dlc-krb') {
          role = 'STAFF';
        }
      }

      onLoginSuccess({
        uid: user.uid,
        email: user.email,
        username: cleanUsername,
        role: role,
        facilityId: facilityId,
      });
    } catch (err) {
      console.error(err);
      if (
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/invalid-credential'
      ) {
        setError('Sai tên đăng nhập hoặc mật khẩu.');
      } else {
        setError('Có lỗi xảy ra: ' + err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Glowing Orbs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-emerald-500/20 z-10">
        {/* Header */}
        <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 p-6 sm:p-8 text-center text-white relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center">
            {/* Center Shield & Wildlife Badges */}
            <div className="relative mb-3">
              <div className="bg-white/20 p-3.5 rounded-2xl border border-white/30 shadow-lg backdrop-blur-md">
                <ShieldCheck className="w-9 h-9 text-amber-300" />
              </div>
              <span className="absolute -top-2 -right-3 text-lg animate-bounce">🦜</span>
              <span className="absolute -bottom-2 -left-3 text-lg animate-pulse">🦔</span>
            </div>

            {/* Split Title with "KRÔNG BÔNG" prominently on 2nd line */}
            <h1 className="text-xs sm:text-sm font-extrabold text-emerald-200 uppercase tracking-widest">
              Hạt Kiểm lâm khu vực
            </h1>
            <div className="text-2xl sm:text-3xl font-black text-amber-300 tracking-tight uppercase mt-0.5 drop-shadow-md">
              KRÔNG BÔNG
            </div>

            <p className="text-[11px] sm:text-xs text-emerald-100/90 font-semibold mt-1 bg-emerald-900/40 px-3 py-1 rounded-full border border-emerald-400/30">
              Ứng Dụng Quản Lý Động Vật Hoang Dã Mẫu II
            </p>
          </div>
        </div>

        {/* Wildlife Showcase Ticker */}
        <div className="bg-slate-900 py-2.5 px-3 overflow-hidden border-b border-slate-800 flex items-center gap-2">
          <div className="flex items-center gap-1 text-[10px] font-black uppercase text-amber-400 flex-shrink-0 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Loài nuôi:</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none text-[11px] font-bold text-slate-200 whitespace-nowrap">
            {WILDLIFE_SPECIES.map((sp, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 bg-slate-800/80 border border-slate-700/80 px-2 py-0.5 rounded-lg text-emerald-300">
                <span>{sp.icon}</span>
                <span>{sp.name}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="p-6 sm:p-8 space-y-5">
          <div className="text-center">
            <h2 className="text-lg sm:text-xl font-black text-slate-900">Đăng Nhập Hệ Thống</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Nhập tài khoản Kiểm lâm hoặc Cơ sở nuôi để tiếp tục</p>
          </div>

          {error && (
            <div className="bg-rose-50 text-rose-600 p-3 rounded-2xl text-xs font-bold text-center border border-rose-200 animate-in fade-in">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wide">Tên Đăng Nhập</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-4 h-4 text-emerald-600" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xs sm:text-sm font-semibold transition-all"
                  placeholder="VD: admin hoặc dlc-krb"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wide">Mật Khẩu</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 h-4 text-emerald-600" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xs sm:text-sm font-semibold transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold py-3.5 px-4 rounded-xl transition-all shadow-md shadow-emerald-900/30 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Đang xác thực hệ thống...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-amber-300" />
                  <span>Đăng Nhập Ngay</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-500 font-medium">
              Sử dụng và lưu hành trong phạm vi quản lý của Hạt Kiểm lâm khu vực Krông Bông.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
