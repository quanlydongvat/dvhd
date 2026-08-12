import React, { useState, useEffect } from 'react';
import { ShieldCheck, UserPlus, Key, Trash2, Search, Loader2, Check, Clock, UserCheck, X, Edit3 } from 'lucide-react';
import { db } from '../firebase';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../firebase';

// Khởi tạo ứng dụng phụ để tạo tài khoản không đăng xuất Admin
const secondaryApp = initializeApp(firebaseConfig, "SecondaryApp");
const secondaryAuth = getAuth(secondaryApp);

export default function AdminDashboard({ facilitiesList = [], onApproveRequest }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  // Tabs: 'USERS' | 'APPROVALS'
  const [activeTab, setActiveTab] = useState('USERS');

  // Requests state
  const [requests, setRequests] = useState([]);
  const [isLoadingReqs, setIsLoadingReqs] = useState(false);

  // Form states (Cấp mới)
  const [selectedFacility, setSelectedFacility] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('@123456');

  // Modal Đổi Mật Khẩu / Tên Đăng Nhập
  const [editingUser, setEditingUser] = useState(null); // User object selected for edit
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setIsLoadingReqs(true);
    try {
      const querySnapshot = await getDocs(collection(db, "fluctuation_requests"));
      const reqsData = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.status === 'PENDING') {
          reqsData.push({ id: doc.id, ...data });
        }
      });
      reqsData.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setRequests(reqsData);
    } catch (err) {
      console.error("Lỗi khi tải yêu cầu chờ duyệt:", err);
    } finally {
      setIsLoadingReqs(false);
    }
  };

  const handleApproveRequest = async (req) => {
    if (!window.confirm(`Bạn có chắc chắn muốn duyệt yêu cầu này của cơ sở ${req.facilityName}?`)) return;
    
    try {
      await setDoc(doc(db, "fluctuation_requests", req.id), { status: 'APPROVED' }, { merge: true });
      
      if (onApproveRequest) {
        await onApproveRequest(req);
        alert("Duyệt yêu cầu và cập nhật dữ liệu thành công!");
      }
      
      fetchRequests();
    } catch (err) {
      console.error(err);
      alert("Lỗi khi duyệt: " + err.message);
    }
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersData = [];
      querySnapshot.forEach((doc) => {
        usersData.push({ id: doc.id, ...doc.data() });
      });
      setUsers(usersData);
    } catch (err) {
      console.error("Lỗi khi tải danh sách người dùng:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    if (!selectedFacility || !username || !password) {
      alert("Vui lòng điền đủ thông tin");
      return;
    }

    setIsCreating(true);
    try {
      const cleanUsername = username.trim().toLowerCase().replace(/\s+/g, '');
      const email = `${cleanUsername}@krongbong.gov.vn`;

      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
      const newUid = userCredential.user.uid;

      await setDoc(doc(db, "users", newUid), {
        username: cleanUsername,
        email: email,
        role: 'FACILITY',
        facilityId: selectedFacility,
        customPassword: password,
        createdAt: new Date().toISOString()
      });

      alert(`Đã tạo tài khoản thành công cho cơ sở!\nTài khoản: ${cleanUsername}\nMật khẩu: ${password}`);
      setUsername('');
      setSelectedFacility('');
      
      await signOut(secondaryAuth);
      fetchUsers();
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        alert("Tên đăng nhập này đã được sử dụng. Vui lòng chọn tên khác.");
      } else {
        alert("Lỗi tạo tài khoản: " + err.message);
      }
    } finally {
      setIsCreating(false);
    }
  };

  // Mở modal đổi tài khoản/mật khẩu
  const handleOpenEditModal = (u) => {
    setEditingUser(u);
    setEditUsername(u.username || '');
    setEditPassword(u.customPassword || '@123456');
  };

  // Đổi tài khoản/mật khẩu
  const handleSaveResetPassword = async (e) => {
    e.preventDefault();
    if (!editingUser || !editUsername.trim() || !editPassword.trim()) {
      alert("Vui lòng điền đầy đủ tên đăng nhập và mật khẩu mới.");
      return;
    }

    setIsResetting(true);
    try {
      const cleanUsername = editUsername.trim().toLowerCase().replace(/\s+/g, '');
      const email = `${cleanUsername}@krongbong.gov.vn`;

      await setDoc(doc(db, "users", editingUser.id), {
        username: cleanUsername,
        email: email,
        customPassword: editPassword.trim(),
        updatedAt: new Date().toISOString()
      }, { merge: true });

      alert(`✅ Đã cấp đổi lại tài khoản thành công cho cơ sở!\n\n• Tên đăng nhập mới: ${cleanUsername}\n• Mật khẩu mới: ${editPassword.trim()}`);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error("Lỗi khi cấp đổi tài khoản:", err);
      alert("Lỗi khi cấp đổi lại tài khoản: " + err.message);
    } finally {
      setIsResetting(false);
    }
  };

  // Xóa tài khoản
  const handleDeleteUser = async (u) => {
    if (!window.confirm(`⚠️ Bạn có chắc chắn muốn xóa tài khoản "${u.username}" của cơ sở này khỏi hệ thống không?`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, "users", u.id));
      alert(`Đã xóa tài khoản ${u.username} thành công.`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Lỗi khi xóa tài khoản: " + err.message);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-emerald-500/20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-md">
            <ShieldCheck className="w-8 h-8 text-amber-300" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">Quản Trị Hệ Thống & Cấp Đổi Tài Khoản</h1>
            <p className="text-xs text-emerald-200 font-medium mt-0.5">
              Cấp mới, đổi mật khẩu hoặc cập nhật tài khoản đăng nhập cho các cơ sở nuôi sinh sản Krông Bông
            </p>
          </div>
        </div>
      </div>

      {/* 2-COLUMN SIDE-BY-SIDE LAYOUT FOR WEB / DESKTOP */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN (5 Cols): Cấp Tài Khoản Cơ Sở */}
        <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-slate-200/80 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>Cấp Tài Khoản Cơ Sở Nuôi</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Tạo tài khoản đăng nhập riêng cho từng cơ sở
            </p>
          </div>
          
          <form onSubmit={handleCreateAccount} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-1.5">
                Chọn Cơ Sở Nuôi
              </label>
              <select 
                value={selectedFacility}
                onChange={(e) => setSelectedFacility(e.target.value)}
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer shadow-2xs"
                required
              >
                <option value="">-- Chọn một cơ sở --</option>
                {facilitiesList.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.facilityName} - {f.ownerName} ({f.commune})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-1.5">
                Tên Đăng Nhập (viết thường, không dấu)
              </label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                placeholder="vd: nguyenvana hoặc cs01"
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-2xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-1.5">
                Mật Khẩu Mặc Định
              </label>
              <input 
                type="text" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3 py-2.5 bg-slate-100 font-mono font-bold text-slate-700"
                required
              />
            </div>

            <div className="p-3.5 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl text-xs text-emerald-900 leading-relaxed font-medium">
              💡 <strong>Lưu ý:</strong> Tài khoản tạo thành công sẽ được kích hoạt ngay lập tức trên Firebase Cloud để cơ sở nuôi sử dụng đăng nhập.
            </div>

            <button 
              type="submit" 
              disabled={isCreating}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-70 cursor-pointer active:scale-[0.99]"
            >
              {isCreating ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Check className="w-4 h-4 text-amber-300 stroke-[3]" />}
              <span>Tạo Tài Khoản Mới</span>
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN (7 Cols): Danh Sách Tài Khoản & Yêu Cầu Chờ Duyệt */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-slate-200/80 space-y-4">
          {/* Tab Navigation Bar */}
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('USERS')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all cursor-pointer ${
                  activeTab === 'USERS'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Tài Khoản Đã Cấp ({users.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('APPROVALS')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all cursor-pointer ${
                  activeTab === 'APPROVALS'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Chờ Duyệt Biến Động</span>
                {requests.length > 0 && (
                  <span className="bg-amber-400 text-slate-950 font-mono text-[11px] px-2 py-0.5 rounded-full font-black">
                    {requests.length}
                  </span>
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={activeTab === 'USERS' ? fetchUsers : fetchRequests}
              className="p-2 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors"
              title="Làm mới danh sách"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* TAB 1: Danh Sách Tài Khoản */}
          {activeTab === 'USERS' && (
            <div className="space-y-3">
              {isLoading ? (
                <div className="py-12 text-center text-slate-500 flex flex-col items-center">
                  <Loader2 className="w-6 h-6 animate-spin text-emerald-600 mb-2" />
                  <span>Đang tải danh sách tài khoản từ Firebase Cloud...</span>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-200/80 max-h-[500px] overflow-y-auto scrollbar-thin">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-700 font-extrabold uppercase border-b border-slate-200 sticky top-0 z-10">
                      <tr>
                        <th className="px-4 py-3">Tài Khoản</th>
                        <th className="px-3 py-3">Vai Trò</th>
                        <th className="px-4 py-3">Cơ Sở Nuôi Quản Lý</th>
                        <th className="px-3 py-3 text-center">Thao tác Admin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {users.map((u) => {
                        const fac = facilitiesList.find((f) => f.id === u.facilityId);
                        return (
                          <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-4 py-3 font-mono font-bold text-slate-900">
                              {u.username}
                              {u.customPassword && (
                                <span className="block text-[10px] font-normal text-slate-400">
                                  MK: <span className="font-mono text-slate-600">{u.customPassword}</span>
                                </span>
                              )}
                            </td>
                            <td className="px-3 py-3">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                                u.role === 'ADMIN'
                                  ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                  : u.role === 'STAFF'
                                  ? 'bg-amber-100 text-amber-900 border border-amber-200'
                                  : 'bg-blue-100 text-blue-800 border border-blue-200'
                              }`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-slate-700 font-medium">
                              {fac ? (
                                <div>
                                  <strong className="text-slate-900">{fac.facilityName}</strong>
                                  <div className="text-[10px] text-slate-500">Chủ hộ: {fac.ownerName} • 📍 {fac.commune}</div>
                                </div>
                              ) : u.role === 'ADMIN' ? (
                                <span className="text-purple-700 font-bold">Toàn Huyện</span>
                              ) : u.role === 'STAFF' ? (
                                <span className="text-amber-800 font-bold">Cán bộ Hạt Kiểm lâm</span>
                              ) : (
                                <span className="text-slate-400 italic">Không tìm thấy cơ sở</span>
                              )}
                            </td>
                            <td className="px-3 py-3 text-center">
                              {u.role !== 'ADMIN' && (
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditModal(u)}
                                    className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg font-bold text-[11px] transition-all inline-flex items-center gap-1 cursor-pointer active:scale-95 shadow-2xs"
                                    title="Cấp đổi tên đăng nhập hoặc mật khẩu mới"
                                  >
                                    <Key className="w-3.5 h-3.5 text-blue-600" />
                                    <span>Đổi MK</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleDeleteUser(u)}
                                    className="p-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg transition-all cursor-pointer active:scale-95"
                                    title="Xóa tài khoản này khỏi hệ thống"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                      {users.length === 0 && (
                        <tr>
                          <td colSpan="4" className="px-4 py-8 text-center text-slate-500 font-medium">
                            Chưa có tài khoản nào được tạo trên Cloud.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Danh Sách Yêu Cầu Chờ Duyệt */}
          {activeTab === 'APPROVALS' && (
            <div className="space-y-3">
              {isLoadingReqs ? (
                <div className="py-12 text-center text-slate-500 flex flex-col items-center">
                  <Loader2 className="w-6 h-6 animate-spin text-emerald-600 mb-2" />
                  <span>Đang tải danh sách biến động chờ duyệt...</span>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-200/80 max-h-[500px] overflow-y-auto scrollbar-thin">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-700 font-extrabold uppercase border-b border-slate-200 sticky top-0 z-10">
                      <tr>
                        <th className="px-3 py-3">Thời gian</th>
                        <th className="px-4 py-3">Cơ sở khai báo</th>
                        <th className="px-3 py-3">Loài</th>
                        <th className="px-3 py-3 text-center">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {requests.map((req) => (
                        <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-3 py-3 text-slate-500 font-mono text-[11px]">
                            {req.createdAt ? new Date(req.createdAt).toLocaleDateString('vi-VN') : 'Không rõ'}
                          </td>
                          <td className="px-4 py-3 text-slate-900">
                            <strong className="font-bold block">{req.facilityName}</strong>
                            <span className="text-[10px] text-slate-500 font-medium">TK: {req.submittedBy}</span>
                          </td>
                          <td className="px-3 py-3 font-semibold text-slate-800">
                            {req.speciesName}
                          </td>
                          <td className="px-3 py-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleApproveRequest(req)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1 active:scale-95 cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5 text-amber-300 stroke-[3]" />
                              <span>Duyệt</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                      {requests.length === 0 && (
                        <tr>
                          <td colSpan="4" className="px-4 py-8 text-center text-slate-500 font-medium">
                            Không có biến động nào đang chờ duyệt.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      {/* MODAL CẤP ĐỔI TÀI KHOẢN / MẬT KHẨU CHO CƠ SỞ */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative space-y-4">
            <button
              type="button"
              onClick={() => setEditingUser(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="p-2.5 bg-blue-100 text-blue-700 rounded-2xl">
                <Key className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Cấp Đổi Tài Khoản / Mật Khẩu</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Cơ sở: <strong className="text-slate-800">{facilitiesList.find(f => f.id === editingUser.facilityId)?.facilityName || editingUser.username}</strong>
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-1.5">
                  Tên Đăng Nhập Mới
                </label>
                <input
                  type="text"
                  required
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                  className="w-full text-sm bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Nhập tên đăng nhập mới..."
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-1.5">
                  Mật Khẩu Mới
                </label>
                <input
                  type="text"
                  required
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-mono font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Nhập mật khẩu mới..."
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 font-medium">
                🔑 Sau khi bấm lưu, tài khoản và mật khẩu mới sẽ có hiệu lực ngay lập tức. Hãy bàn giao mật khẩu này cho chủ cơ sở nuôi.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>

                <button
                  type="submit"
                  disabled={isResetting}
                  className="px-5 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-70"
                >
                  {isResetting ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Check className="w-4 h-4 text-amber-300 stroke-[3]" />}
                  <span>Lưu Cấp Đổi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
