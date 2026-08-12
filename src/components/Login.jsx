import React, { useState } from 'react';
import { User, Lock, Loader2, ShieldCheck } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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

      // 1. Try Firebase Auth first
      let authUser = null;
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        authUser = userCredential.user;
      } catch (authErr) {
        // Fallback: Check if Firestore users collection has customPassword updated by Admin
        const q = query(collection(db, 'users'), where('username', '==', cleanUsername));
        const querySnap = await getDocs(q);
        
        if (!querySnap.empty) {
          const userDoc = querySnap.docs[0];
          const userData = userDoc.data();
          if (userData.customPassword && userData.customPassword === password) {
            onLoginSuccess({
              uid: userDoc.id,
              email: userData.email || email,
              username: userData.username,
              role: userData.role || 'FACILITY',
              facilityId: userData.facilityId || null,
            });
            setIsLoading(false);
            return;
          }
        }

        // If no customPassword match either, throw original auth error
        throw authErr;
      }

      // Fetch user role from Firestore if Firebase Auth succeeded
      const userDoc = await getDoc(doc(db, 'users', authUser.uid));
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
        uid: authUser.uid,
        email: authUser.email,
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
        <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 p-7 sm:p-8 text-center text-white relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center">
            {/* Official Vietnam Forest Protection Badge Logo */}
            <div className="mb-3.5 relative group">
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto flex items-center justify-center p-1.5 bg-white/15 rounded-2xl border border-white/30 shadow-xl backdrop-blur-md">
                <img
                  src="./images/logo_kiem_lam.png"
                  alt="Phù Hiệu Kiểm Lâm Việt Nam"
                  className="w-full h-full object-contain filter drop-shadow-md transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>

            {/* Split Title with "KRÔNG BÔNG" prominently on 2nd line */}
            <h1 className="text-xs sm:text-sm font-extrabold text-emerald-200 uppercase tracking-widest">
              Hạt Kiểm lâm khu vực
            </h1>
            <div className="text-2xl sm:text-3xl font-black text-amber-300 tracking-tight uppercase mt-0.5 drop-shadow-md">
              KRÔNG BÔNG
            </div>

            <p className="text-[11px] sm:text-xs text-emerald-100/90 font-semibold mt-1.5 bg-emerald-900/40 px-3 py-1 rounded-full border border-emerald-400/30">
              Ứng Dụng Quản Lý Động Vật Hoang Dã Mẫu II
            </p>
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
