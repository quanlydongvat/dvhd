import React, { useState, useEffect } from 'react';
import { ShieldCheck, UserPlus, Key, Trash2, Search, Loader2, Check } from 'lucide-react';
import { db, app } from '../firebase';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../firebase';

// Khởi tạo một app thứ hai để tạo user mà không làm đăng xuất Admin hiện tại
const secondaryApp = initializeApp(firebaseConfig, "SecondaryApp");
const secondaryAuth = getAuth(secondaryApp);

export default function AdminDashboard({ facilitiesList, onApproveRequest }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  // Tabs
  const [activeTab, setActiveTab] = useState('USERS'); // 'USERS' | 'APPROVALS'

  // Requests state
  const [requests, setRequests] = useState([]);
  const [isLoadingReqs, setIsLoadingReqs] = useState(false);

  // Form states
  const [selectedFacility, setSelectedFacility] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('@123456');

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
      reqsData.sort((a, b) => b.createdAt - a.createdAt);
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
      // 1. Update status to APPROVED in fluctuation_requests
      await setDoc(doc(db, "fluctuation_requests", req.id), { status: 'APPROVED' }, { merge: true });
      
      // 2. Call parent to update App state (which syncs to facilities collection)
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

      // Cảnh báo: Việc sử dụng Client SDK để tạo tài khoản sẽ đăng xuất Admin hiện tại
      // Trong môi trường thực tế, nên dùng Firebase Admin SDK (Cloud Functions)
      // Để bypass nhanh cho Frontend-only app, chúng ta tạo xong thì yêu cầu Admin đăng nhập lại.
      // HOẶC sử dụng secondaryAuth nếu cấu hình cho phép. Ở đây chúng ta vẫn dùng Client SDK.
      
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
      const newUid = userCredential.user.uid;

      // Lưu thông tin role vào Firestore
      await setDoc(doc(db, "users", newUid), {
        username: cleanUsername,
        email: email,
        role: 'FACILITY',
        facilityId: selectedFacility,
        createdAt: new Date().toISOString()
      });

      alert(`Đã tạo tài khoản thành công cho cơ sở!\nTài khoản: ${cleanUsername}\nMật khẩu: ${password}`);
      setUsername('');
      setSelectedFacility('');
      
      // Đăng xuất khỏi secondaryAuth để phiên tiếp theo tạo người dùng mới không lỗi
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
      setIsCreating(true); // Keeping it true if we want them to re-login, but we'll set it false.
      setIsCreating(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 animate-in fade-in">
      <div className="flex items-center gap-3 mb-6">
        <ShieldCheck className="w-8 h-8 text-emerald-600" />
        <h1 className="text-2xl font-black text-slate-800">Quản Trị Hệ Thống & Tài Khoản</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Cấp Tài Khoản Mới */}
        <div className="lg:col-span-1 bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-emerald-600" /> Cấp Tài Khoản Cơ Sở
          </h2>
          
          <form onSubmit={handleCreateAccount} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Chọn Cơ Sở Nuôi</label>
              <select 
                value={selectedFacility}
                onChange={(e) => setSelectedFacility(e.target.value)}
                className="w-full text-sm border-slate-300 rounded-xl focus:ring-emerald-500 focus:border-emerald-500"
                required
              >
                <option value="">-- Chọn một cơ sở --</option>
                {facilitiesList.map(f => (
                  <option key={f.id} value={f.id}>{f.facilityName} - {f.ownerName} ({f.commune})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tên Đăng Nhập (viết thường, không dấu)</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                placeholder="vd: nguyenvana"
                className="w-full text-sm border-slate-300 rounded-xl focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mật Khẩu Mặc Định</label>
              <input 
                type="text" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-sm border-slate-300 rounded-xl bg-slate-50 text-slate-500"
                required
              />
            </div>

            <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-800">
              <strong>Lưu ý:</strong> Việc tạo tài khoản ở phiên bản này có thể khiến Admin bị đăng xuất. Bạn cần đăng nhập lại sau khi tạo thành công.
            </div>

            <button 
              type="submit" 
              disabled={isCreating}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Tạo Tài Khoản
            </button>
          </form>
        </div>

        {/* Tab Selector could go here, or we just render both sections vertically */}
        <div className="lg:col-span-3">
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab('USERS')}
              className={`px-6 py-3 font-bold text-sm ${activeTab === 'USERS' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Tài Khoản Đã Cấp
            </button>
            <button
              onClick={() => setActiveTab('APPROVALS')}
              className={`px-6 py-3 font-bold text-sm ${activeTab === 'APPROVALS' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Yêu Cầu Chờ Duyệt {requests.length > 0 && <span className="ml-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{requests.length}</span>}
            </button>
          </div>
        </div>

        {/* Tab A: Danh Sách Tài Khoản */}
        {activeTab === 'USERS' && (
          <div className="lg:col-span-2 bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800">Danh Sách Tài Khoản Đã Cấp</h2>
              <button onClick={fetchUsers} className="text-emerald-600 hover:bg-emerald-50 p-1.5 rounded-lg">
                <Search className="w-4 h-4" />
              </button>
            </div>

            {isLoading ? (
              <div className="py-10 text-center text-slate-500 flex flex-col items-center">
                <Loader2 className="w-6 h-6 animate-spin mb-2" />
                Đang tải...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Tài Khoản</th>
                      <th className="px-4 py-3">Vai Trò</th>
                      <th className="px-4 py-3">Cơ Sở Quản Lý</th>
                      <th className="px-4 py-3 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map(u => {
                      const fac = facilitiesList.find(f => f.id === u.facilityId);
                      return (
                        <tr key={u.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-medium text-slate-900">{u.username}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {fac ? `${fac.facilityName} - ${fac.ownerName}` : (u.role === 'ADMIN' ? 'Tất cả' : 'Không tìm thấy CS')}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {u.role !== 'ADMIN' && (
                              <button className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg inline-flex items-center gap-1 text-xs font-bold" title="Tính năng xóa tài khoản đang phát triển">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan="4" className="px-4 py-8 text-center text-slate-500">
                          Chưa có tài khoản nào được tạo.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab B: Danh Sách Yêu Cầu Chờ Duyệt */}
        {activeTab === 'APPROVALS' && (
          <div className="lg:col-span-3 bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800">Danh Sách Khai Báo Biến Động (Chờ Duyệt)</h2>
              <button onClick={fetchRequests} className="text-emerald-600 hover:bg-emerald-50 p-1.5 rounded-lg">
                <Search className="w-4 h-4" />
              </button>
            </div>

            {isLoadingReqs ? (
              <div className="py-10 text-center text-slate-500 flex flex-col items-center">
                <Loader2 className="w-6 h-6 animate-spin mb-2" />
                Đang tải yêu cầu...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Thời gian</th>
                      <th className="px-4 py-3">Cơ sở khai báo</th>
                      <th className="px-4 py-3">Loài</th>
                      <th className="px-4 py-3">Nội dung thay đổi</th>
                      <th className="px-4 py-3 text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {requests.map(req => (
                      <tr key={req.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-slate-600">
                          {req.createdAt ? new Date(req.createdAt).toLocaleString('vi-VN') : 'Không rõ'}
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-900">
                          {req.facilityName}<br/>
                          <span className="text-xs text-slate-500">Tài khoản: {req.submittedBy}</span>
                        </td>
                        <td className="px-4 py-3 text-slate-700">{req.speciesName}</td>
                        <td className="px-4 py-3">
                          <div className="text-xs flex gap-2">
                            {req.father !== undefined && <span>Trống: <b className="text-emerald-600">{req.father}</b></span>}
                            {req.mother !== undefined && <span>Mái: <b className="text-emerald-600">{req.mother}</b></span>}
                            {req.type && <span>Phân loại: <b>{req.type}</b></span>}
                          </div>
                          {req.note && <div className="text-xs text-slate-500 italic">"{req.note}"</div>}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button 
                            onClick={() => handleApproveRequest(req)}
                            className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" /> Duyệt
                          </button>
                        </td>
                      </tr>
                    ))}
                    {requests.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-4 py-8 text-center text-slate-500">
                          Không có yêu cầu nào đang chờ duyệt.
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
  );
}
