import React, { useState, useEffect, useMemo } from 'react';
import {
  Star,
  MessageSquare,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Edit3,
  LogIn,
  CheckCircle2,
  Heart,
} from 'lucide-react';

export default function SidebarUserReviews({
  reviews = [],
  currentUser = null,
  onOpenReviewModal,
  onOpenLogin,
}) {
  const [activeReviewIdx, setActiveReviewIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Compute rating metrics
  const { avgRating, totalReviews, ratingCounts, myReview } = useMemo(() => {
    const list = reviews || [];
    const total = list.length;
    if (total === 0) {
      return { avgRating: 5.0, totalReviews: 0, ratingCounts: {}, myReview: null };
    }
    const sum = list.reduce((acc, r) => acc + (Number(r.rating) || 5), 0);
    const avg = (sum / total).toFixed(1);

    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    list.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(Number(r.rating) || 5)));
      counts[star] = (counts[star] || 0) + 1;
    });

    const mine = currentUser
      ? list.find(
          (r) =>
            (currentUser.facilityId && r.facilityId === currentUser.facilityId) ||
            (currentUser.username && r.username === currentUser.username)
        )
      : null;

    return {
      avgRating: avg,
      totalReviews: total,
      ratingCounts: counts,
      myReview: mine,
    };
  }, [reviews, currentUser]);

  // Auto-cycle through reviews (2 at a time) every 6 seconds (pauses on hover)
  useEffect(() => {
    if (isPaused || (reviews || []).length <= 2) return;
    const timer = setInterval(() => {
      setActiveReviewIdx((prev) => (prev + 2) % reviews.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, reviews]);

  const visibleReviews = useMemo(() => {
    if (!reviews || reviews.length === 0) return [];
    if (reviews.length <= 2) return reviews;
    const first = reviews[activeReviewIdx % reviews.length];
    const second = reviews[(activeReviewIdx + 1) % reviews.length];
    return [first, second];
  }, [reviews, activeReviewIdx]);

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="space-y-2 select-none"
    >
      {/* 1. Widget Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-md bg-amber-500/15 text-amber-600 border border-amber-300/60 flex items-center justify-center shadow-2xs">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          </div>
          <h2 className="text-xs font-black text-slate-800 uppercase tracking-wider">
            Đánh Giá Của Cơ Sở
          </h2>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-[9px] font-black uppercase tracking-wider text-amber-900 bg-amber-100 border border-amber-300/80 px-1.5 py-0.5 rounded-md shadow-2xs flex items-center gap-0.5">
            <span>⭐</span>
            <span>{avgRating}/5</span>
          </span>

          {/* Navigation arrows for review snippets */}
          {reviews.length > 2 && (
            <div className="flex items-center">
              <button
                type="button"
                onClick={() =>
                  setActiveReviewIdx((prev) =>
                    (prev - 2 + reviews.length) % reviews.length
                  )
                }
                className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-200/80 rounded-md transition-colors cursor-pointer"
                title="Đánh giá trước"
              >
                <ChevronLeft className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setActiveReviewIdx((prev) => (prev + 2) % reviews.length)
                }
                className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-200/80 rounded-md transition-colors cursor-pointer"
                title="Đánh giá tiếp theo"
              >
                <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Main Review Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3 space-y-2.5 overflow-hidden transition-all duration-300">
        
        {/* Rating Overview Score Box */}
        <div className="flex items-center justify-between bg-gradient-to-r from-amber-50/90 via-orange-50/50 to-amber-50/90 p-2 rounded-xl border border-amber-200/80">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black font-mono text-amber-950 leading-none">
              {avgRating}
            </span>
            <div className="leading-tight">
              <div className="flex items-center gap-0.5 text-amber-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${
                      star <= Math.round(Number(avgRating))
                        ? 'fill-amber-500 text-amber-500'
                        : 'fill-slate-200 text-slate-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] text-amber-800/80 font-bold block mt-0.5">
                {totalReviews} cơ sở đã đánh giá
              </span>
            </div>
          </div>

          {/* Action Button: Rate / Edit / Login */}
          {currentUser ? (
            <button
              type="button"
              onClick={onOpenReviewModal}
              className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 px-2.5 py-1.5 rounded-lg text-[10px] font-black shadow-xs transition-all active:scale-95 cursor-pointer flex-shrink-0"
              title={myReview ? 'Chỉnh sửa đánh giá của bạn' : 'Gửi chấm điểm & bình luận'}
            >
              {myReview ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-slate-950" />
                  <span>Đã chấm {myReview.rating}★</span>
                </>
              ) : (
                <>
                  <Edit3 className="w-3 h-3 text-slate-950" />
                  <span>Chấm điểm</span>
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenLogin}
              className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-amber-300 px-2.5 py-1.5 rounded-lg text-[10px] font-extrabold shadow-xs transition-all active:scale-95 cursor-pointer flex-shrink-0"
              title="Đăng nhập tài khoản cơ sở nuôi để chấm điểm"
            >
              <LogIn className="w-3 h-3" />
              <span>Đăng nhập</span>
            </button>
          )}
        </div>

        {/* 3. Review Quote Snippet Cards (2 reviews per view) */}
        {visibleReviews.length > 0 ? (
          <div className="space-y-2">
            {visibleReviews.map((reviewItem) => (
              <div
                key={reviewItem.id || `${reviewItem.ownerName}_${reviewItem.createdAt}`}
                className="relative bg-slate-50/90 rounded-xl p-2.5 border border-slate-200/70 space-y-1.5 min-h-[78px] flex flex-col justify-between"
              >
                {/* Reviewer Header */}
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5 min-w-0 flex-1">
                    <div className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center flex-shrink-0">
                      {reviewItem.ownerName?.[0] || reviewItem.facilityName?.[0] || 'C'}
                    </div>
                    <div className="min-w-0 flex-1 leading-none truncate">
                      <span className="font-extrabold text-[11px] text-slate-900 truncate block">
                        {reviewItem.ownerName || reviewItem.facilityName}
                      </span>
                      <span className="text-[9px] text-slate-400 font-medium truncate block mt-0.5">
                        {reviewItem.commune || 'Krông Bông'}
                      </span>
                    </div>
                  </div>

                  {/* Star Rating of this review */}
                  <div className="flex items-center gap-0.5 text-amber-500 flex-shrink-0">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-2.5 h-2.5 ${
                          s <= (reviewItem.rating || 5)
                            ? 'fill-amber-500 text-amber-500'
                            : 'fill-slate-200 text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Comment snippet */}
                <p className="text-[10px] text-slate-600 font-medium line-clamp-2 leading-relaxed italic">
                  "{reviewItem.comment || 'Ứng dụng quản lý Sổ Mẫu số 10 rất thuận tiện và chính xác.'}"
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-4 text-center text-[10px] text-slate-400 font-medium bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
            Chưa có đánh giá nào. Hãy là cơ sở đầu tiên chấm điểm!
          </div>
        )}

        {/* 4. Footer CTA: Open Full Reviews Modal */}
        <div className="pt-0.5 flex items-center justify-between text-[10px]">
          <button
            type="button"
            onClick={onOpenReviewModal}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 hover:text-slate-900 font-black transition-all cursor-pointer text-center"
          >
            <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
            <span>Xem tất cả góp ý & gửi đánh giá</span>
          </button>
        </div>

      </div>
    </section>
  );
}
