import React, { useState } from 'react';
import { ShieldCheck, User, Lock, Loader2 } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

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
      // 1. Format username to email (e.g. admin -> admin@krongbong.gov.vn)
      const cleanUsername = username.trim().toLowerCase().replace(/\s+/g, '');
      const email = `${cleanUsername}@krongbong.gov.vn`;

      // 2. Authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 3. Fetch user role from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      let role = 'FACILITY'; // default
      let facilityId = null;

      if (userDoc.exists()) {
        const data = userDoc.data();
        role = data.role || 'FACILITY';
        facilityId = data.facilityId || null;
      } else {
        // Fallback for Admin if doc doesn't exist yet (for initial setup)
        if (cleanUsername === 'admin') {
          role = 'ADMIN';
        }
      }

      onLoginSuccess({
        uid: user.uid,
        email: user.email,
        username: cleanUsername,
        role: role,
        facilityId: facilityId
      });

    } catch (err) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Sai tên đăng nhập hoặc mật khẩu.');
      } else {
        setError('Có lỗi xảy ra: ' + err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-600 p-8 text-center text-white">
          <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black mb-2">Hạt Kiểm Lâm Krông Bông</h1>
          <p className="text-emerald-100 font-medium text-sm">Hệ Thống Quản Lý Động Vật Hoang Dã</p>
        </div>

        {/* Form */}
        <div className="p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">Đăng Nhập Hệ Thống</h2>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium mb-6 text-center border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Tên Đăng Nhập</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm transition-all"
                  placeholder="VD: admin hoặc nguyenvana"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Mật Khẩu</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                'Đăng Nhập'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500 font-medium">
            Phiên bản nội bộ. Chỉ dành cho cơ quan nhà nước và các cơ sở được cấp phép.
          </p>
        </div>
      </div>
    </div>
  );
}
