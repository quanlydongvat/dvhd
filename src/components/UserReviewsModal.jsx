import React, { useState, useMemo } from 'react';
import {
  Star,
  X,
  MessageSquare,
  Sparkles,
  Send,
  Trash2,
  Edit3,
  CheckCircle2,
  LogIn,
  ThumbsUp,
  ShieldCheck,
  Building2,
  MapPin,
  Calendar,
} from 'lucide-react';

const STAR_LABELS = {
  1: '😞 Cần cải thiện nhiều',
  2: '🙁 Chưa hài lòng',
  3: '😐 Bình thường',
  4: '🙂 Rất tốt, hài lòng',
  5: '🌟 Tuyệt vời, rất hài lòng!',
};

export default function UserReviewsModal({
  isOpen,
  onClose,
  reviews = [],
  currentUser = null,
  facilitiesList = [],
  onSaveReview,
  onDeleteReview,
  onOpenLogin,
}) {
  const [hoveredStar, setHoveredStar] = useState(0);
  const [filterRating, setFilterRating] = useState('ALL'); // 'ALL' | 5 | 4 | 3 | 2 | 1
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Find user's existing review if any
  const myExistingReview = useMemo(() => {
    if (!currentUser) return null;
    return (reviews || []).find(
      (r) =>
        (currentUser.facilityId && r.facilityId === currentUser.facilityId) ||
        (currentUser.username && r.username === currentUser.username)
    );
  }, [reviews, currentUser]);

  // Form states (prefill with existing review if available)
  const [rating, setRating] = useState(myExistingReview ? myExistingReview.rating : 5);
  const [comment, setComment] = useState(myExistingReview ? myExistingReview.comment : '');
  const [isEditingMode, setIsEditingMode] = useState(!myExistingReview);

  // Sync state if existing review changes
  React.useEffect(() => {
    if (myExistingReview) {
      setRating(myExistingReview.rating || 5);
      setComment(myExistingReview.comment || '');
    } else {
      setRating(5);
      setComment('');
      setIsEditingMode(true);
    }
  }, [myExistingReview]);

  // Find associated facility info for currentUser
  const currentFacility = useMemo(() => {
    if (!currentUser) return null;
    if (currentUser.facilityId) {
      return (facilitiesList || []).find((f) => f.id === currentUser.facilityId) || null;
    }
    return null;
  }, [currentUser, facilitiesList]);

  // Statistical calculations
  const stats = useMemo(() => {
    const list = reviews || [];
    const total = list.length;
    if (total === 0) {
      return {
        avg: '5.0',
        total: 0,
        counts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        pcts: { 5: 100, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
    }
    const sum = list.reduce((acc, r) => acc + (Number(r.rating) || 5), 0);
    const avg = (sum / total).toFixed(1);

    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    list.forEach((r) => {
      const s = Math.min(5, Math.max(1, Math.round(Number(r.rating) || 5)));
      counts[s] = (counts[s] || 0) + 1;
    });

    const pcts = {};
    for (let i = 1; i <= 5; i++) {
      pcts[i] = Math.round((counts[i] / total) * 100);
    }

    return { avg, total, counts, pcts };
  }, [reviews]);

  // Filtered reviews list
  const filteredReviews = useMemo(() => {
    let list = reviews || [];
    if (filterRating !== 'ALL') {
      const num = Number(filterRating);
      list = list.filter((r) => Number(r.rating) === num);
    }
    return list;
  }, [reviews, filterRating]);

  if (!isOpen) return null;

  // Handle form submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      if (onOpenLogin) onOpenLogin();
      return;
    }

    const trimmed = (comment || '').trim();
    if (!trimmed) {
      alert('Vui lòng nhập nội dung nhận xét, đánh giá của cơ sở!');
      return;
    }

    setIsSubmitting(true);
    try {
      const facilityName =
        currentFacility?.facilityName ||
        currentFacility?.ownerName ||
        currentUser.facilityName ||
        currentUser.fullName ||
        currentUser.username ||
        'Cơ sở nuôi';

      const ownerName =
        currentFacility?.ownerName ||
        currentUser.fullName ||
        currentUser.username ||
        'Chủ cơ sở';

      const commune =
        currentFacility?.commune ||
        currentUser.commune ||
        'Hạt Kiểm Lâm Krông Bông';

      const reviewId =
        myExistingReview?.id ||
        (currentUser.facilityId ? `rev_${currentUser.facilityId}` : `rev_${currentUser.username}`);

      const reviewData = {
        id: reviewId,
        facilityId: currentUser.facilityId || '',
        facilityName,
        ownerName,
        commune,
        username: currentUser.username || '',
        userRole: currentUser.role || 'FACILITY',
        rating: Number(rating) || 5,
        comment: trimmed,
        createdAt: myExistingReview?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (onSaveReview) {
        await onSaveReview(reviewData);
      }

      setIsEditingMode(false);
      alert('✅ Cảm ơn bạn! Đánh giá & bình luận của cơ sở đã được ghi nhận thành công.');
    } catch (err) {
      console.error('Lỗi khi gửi đánh giá:', err);
      alert('Đã xảy ra lỗi khi lưu đánh giá. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa đánh giá này không?')) return;
    try {
      if (onDeleteReview) {
        await onDeleteReview(reviewId);
      }
      if (myExistingReview && myExistingReview.id === reviewId) {
        setIsEditingMode(true);
        setComment('');
        setRating(5);
      }
      alert('Đã xóa đánh giá thành công.');
    } catch (err) {
      console.error('Lỗi khi xóa đánh giá:', err);
      alert('Không thể xóa đánh giá. Vui lòng thử lại!');
    }
  };

  const activeStarValue = hoveredStar || rating;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200 font-sans">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 text-white flex items-center justify-between relative overflow-hidden flex-shrink-0">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 p-2 flex items-center justify-center shadow-inner flex-shrink-0">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Đánh Giá & Góp Ý Từ Cơ Sở Nuôi
                </h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                  {stats.avg} ★
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-emerald-200 font-medium">
                Khảo sát mức độ hài lòng và đóng góp ý kiến hoàn thiện Sổ Mẫu II điện tử
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer relative z-10"
            title="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin">
          
          {/* 1. Rating Statistics Overview Card */}
          <div className="bg-gradient-to-br from-amber-50/70 via-orange-50/40 to-slate-50 p-4 rounded-2xl border border-amber-200/80 flex flex-col sm:flex-row items-center gap-5 sm:gap-8 shadow-2xs">
            {/* Big Score Box */}
            <div className="text-center sm:text-left flex flex-col items-center sm:items-start flex-shrink-0">
              <span className="text-4xl sm:text-5xl font-black font-mono text-amber-950 leading-none">
                {stats.avg}
              </span>
              <div className="flex items-center gap-1 my-1.5 text-amber-500">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${
                      s <= Math.round(Number(stats.avg))
                        ? 'fill-amber-500 text-amber-500'
                        : 'fill-slate-200 text-slate-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-amber-900/80">
                Dựa trên {stats.total} lượt đánh giá
              </span>
            </div>

            {/* Distribution Bars */}
            <div className="flex-1 w-full space-y-1.5 text-xs">
              {[5, 4, 3, 2, 1].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <span className="w-6 font-extrabold text-slate-600 font-mono text-right flex items-center justify-end gap-0.5">
                    {s} <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                  </span>
                  <div className="flex-1 bg-slate-200/80 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-400 to-amber-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${stats.pcts[s] || 0}%` }}
                    />
                  </div>
                  <span className="w-9 font-mono font-bold text-slate-400 text-[11px] text-right">
                    {stats.counts[s] || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Review Form / User Rating Box */}
          <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-emerald-700" />
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                  {myExistingReview
                    ? 'Đánh Giá Của Cơ Sở Bạn'
                    : 'Gửi Chấm Điểm & Ý Kiến Của Cơ Sở'}
                </h3>
              </div>

              {myExistingReview && !isEditingMode && (
                <button
                  type="button"
                  onClick={() => setIsEditingMode(true)}
                  className="flex items-center gap-1 text-xs font-black text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Chỉnh sửa đánh giá</span>
                </button>
              )}
            </div>

            {currentUser ? (
              isEditingMode ? (
                /* Interactive Form */
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  {/* Reviewer identity badge */}
                  <div className="flex items-center gap-2 text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200/80">
                    <Building2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <div className="truncate flex-1">
                      <span className="font-extrabold text-slate-900">
                        {currentFacility?.facilityName || currentFacility?.ownerName || currentUser.username}
                      </span>
                      <span className="text-slate-400 font-medium">
                        {' '}• {currentFacility?.commune || 'Krông Bông'}
                      </span>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                      {currentUser.role === 'ADMIN' ? 'Hạt Kiểm Lâm' : 'Cơ sở nuôi'}
                    </span>
                  </div>

                  {/* Star Rating Picker */}
                  <div className="space-y-1 text-center py-2 bg-white rounded-xl border border-slate-200/80">
                    <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
                      Chọn số sao hài lòng
                    </span>
                    <div className="flex items-center justify-center gap-2 my-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onMouseEnter={() => setHoveredStar(s)}
                          onMouseLeave={() => setHoveredStar(0)}
                          onClick={() => setRating(s)}
                          className="p-1 hover:scale-125 transition-transform cursor-pointer focus:outline-none"
                          title={`${s} sao`}
                        >
                          <Star
                            className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                              s <= activeStarValue
                                ? 'fill-amber-400 text-amber-500 drop-shadow-xs'
                                : 'fill-slate-100 text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <p className="text-xs font-black text-amber-900 transition-all">
                      {STAR_LABELS[activeStarValue]}
                    </p>
                  </div>

                  {/* Comment Input */}
                  <div className="space-y-1">
                    <label className="block text-xs font-extrabold text-slate-700">
                      Bình luận & Ý kiến đóng góp <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Chia sẻ trải nghiệm sử dụng phần mềm, đề xuất thêm tính năng hoặc phản ánh thuận tiện/khó khăn..."
                      maxLength={600}
                      className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-600 transition-all resize-none"
                      required
                    />
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Góp ý giúp Hạt Kiểm lâm nâng cấp ứng dụng tốt hơn</span>
                      <span>{comment.length}/600</span>
                    </div>
                  </div>

                  {/* Submit / Cancel Buttons */}
                  <div className="flex items-center justify-end gap-2 pt-1">
                    {myExistingReview && (
                      <button
                        type="button"
                        onClick={() => setIsEditingMode(false)}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/70 transition-colors cursor-pointer"
                      >
                        Hủy
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-black shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmitting ? 'Đang gửi...' : myExistingReview ? 'Cập Nhật Đánh Giá' : 'Gửi Đánh Giá Ngay'}</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* View mode for my review */
                <div className="bg-white p-3.5 rounded-xl border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${
                            s <= myExistingReview.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'fill-slate-200 text-slate-200'
                          }`}
                        />
                      ))}
                      <span className="ml-1.5 text-xs font-extrabold text-slate-800">
                        {STAR_LABELS[myExistingReview.rating]}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(myExistingReview.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition-colors cursor-pointer"
                      title="Xóa đánh giá của bạn"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-700 font-medium leading-relaxed italic">
                    "{myExistingReview.comment}"
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                    <span>Đã gửi ngày {new Date(myExistingReview.updatedAt || myExistingReview.createdAt).toLocaleDateString('vi-VN')}</span>
                    <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Đã công khai
                    </span>
                  </div>
                </div>
              )
            ) : (
              /* Prompt to login */
              <div className="bg-white p-4 rounded-xl border border-slate-200 text-center space-y-2.5">
                <p className="text-xs text-slate-600 font-medium">
                  Vui lòng đăng nhập bằng tài khoản cơ sở nuôi để chấm điểm sao và gửi bình luận góp ý.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenLogin) onOpenLogin();
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded-xl text-xs font-black shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Đăng Nhập Ngay</span>
                </button>
              </div>
            )}
          </div>

          {/* 3. Filter & Feed of All Reviews */}
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-purple-600" />
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">
                  Tất Cả Bình Luận ({reviews.length})
                </h3>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1 text-[11px] overflow-x-auto py-0.5">
                <button
                  type="button"
                  onClick={() => setFilterRating('ALL')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    filterRating === 'ALL'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Tất cả
                </button>
                {[5, 4, 3].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFilterRating(s)}
                    className={`px-2 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-0.5 ${
                      filterRating === s
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>{s}</span>
                    <Star className="w-2.5 h-2.5 fill-current" />
                  </button>
                ))}
              </div>
            </div>

            {/* Reviews Cards List */}
            <div className="space-y-2.5">
              {filteredReviews.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 font-medium bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  Chưa có đánh giá nào cho mức sao này.
                </div>
              ) : (
                filteredReviews.map((rev) => {
                  const isAuthor =
                    currentUser &&
                    ((currentUser.facilityId && rev.facilityId === currentUser.facilityId) ||
                      (currentUser.username && rev.username === currentUser.username));
                  const isAdmin = currentUser?.role === 'ADMIN';

                  return (
                    <div
                      key={rev.id}
                      className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 hover:border-slate-300 shadow-2xs space-y-2 transition-all"
                    >
                      {/* Top row: Reviewer info & rating */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-black text-xs flex items-center justify-center flex-shrink-0 shadow-2xs">
                            {rev.ownerName?.[0] || rev.facilityName?.[0] || 'C'}
                          </div>
                          <div className="min-w-0 flex-1 leading-tight">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-extrabold text-xs text-slate-900 truncate">
                                {rev.ownerName || rev.facilityName}
                              </span>
                              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-md">
                                🏠 Cơ sở nuôi
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400 font-medium mt-0.5 truncate">
                              📍 {rev.commune || 'Krông Bông'}
                              {rev.createdAt && (
                                <span> • {new Date(rev.createdAt).toLocaleDateString('vi-VN')}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Star Rating Badge */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <div className="flex items-center gap-0.5 text-amber-400">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3 h-3 ${
                                  s <= (rev.rating || 5)
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'fill-slate-200 text-slate-200'
                                }`}
                              />
                            ))}
                          </div>

                          {(isAuthor || isAdmin) && (
                            <button
                              type="button"
                              onClick={() => handleDelete(rev.id)}
                              className="text-slate-300 hover:text-rose-600 p-1 rounded-md transition-colors cursor-pointer ml-1"
                              title="Xóa đánh giá này"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Comment */}
                      <p className="text-xs text-slate-700 font-medium leading-relaxed bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                        "{rev.comment}"
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 flex-shrink-0">
          <span className="text-[11px] text-slate-400 font-medium">
            🛡️ Dữ liệu đánh giá được bảo mật & kiểm duyệt bởi Hạt Kiểm lâm Krông Bông
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
}
