import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Disc,
  ListMusic,
  Music,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ExternalLink,
  Flame,
  Radio,
} from 'lucide-react';

// Bảng Xếp Hạng Top 20 bài hát #zingchart trên MP3 Zing
export const ZING_TOP_20_PLAYLIST = [
  {
    id: 1,
    rank: 1,
    title: 'Giá Như Anh Là Em',
    artist: 'Lệ Quyên',
    genre: 'Pop Ballad • Top 1 #zingchart',
    duration: '4:25',
    zingUrl: 'https://zingmp3.vn/tim-kiem/tat-ca?q=Gia+Nhu+Anh+La+Em+Le+Quyen',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    coverBg: 'from-amber-500 via-rose-600 to-purple-950',
  },
  {
    id: 2,
    rank: 2,
    title: 'Ngồi Nghe Em Khóc',
    artist: 'Đạt G',
    genre: 'V-Pop • Top 2 #zingchart',
    duration: '3:50',
    zingUrl: 'https://zingmp3.vn/tim-kiem/tat-ca?q=Ngoi+Nghe+Em+Khoc+Dat+G',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    coverBg: 'from-sky-500 via-indigo-600 to-slate-950',
  },
  {
    id: 3,
    rank: 3,
    title: 'Không Môn Đăng Hộ Đối',
    artist: 'Nguyễn Vĩ',
    genre: 'Ballad Tình Cảm • Top 3 #zingchart',
    duration: '4:15',
    zingUrl: 'https://zingmp3.vn/tim-kiem/tat-ca?q=Khong+Mon+Dang+Ho+Doi+Nguyen+Vi',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    coverBg: 'from-emerald-500 via-teal-700 to-slate-950',
  },
  {
    id: 4,
    rank: 4,
    title: 'Kẻ Say Tình 2',
    artist: 'Quốc Thiên',
    genre: 'Trữ Tình Hiện Đại • Top 4 #zingchart',
    duration: '4:02',
    zingUrl: 'https://zingmp3.vn/tim-kiem/tat-ca?q=Ke+Say+Tinh+2+Quoc+Thien',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    coverBg: 'from-purple-600 via-pink-700 to-indigo-950',
  },
  {
    id: 5,
    rank: 5,
    title: 'Đáng Ra Anh Không Nên',
    artist: 'Nhiều Nghệ Sĩ',
    genre: 'Pop Sâu Lắng • Top 5 #zingchart',
    duration: '3:45',
    zingUrl: 'https://zingmp3.vn/tim-kiem/tat-ca?q=Dang+Ra+Anh+Khong+Nen',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    coverBg: 'from-rose-600 via-amber-700 to-slate-950',
  },
  {
    id: 6,
    rank: 6,
    title: 'Ngân Hàng Nỗi Nhớ',
    artist: 'Đạt G',
    genre: 'V-Pop Melancholy • Top 6 #zingchart',
    duration: '4:10',
    zingUrl: 'https://zingmp3.vn/tim-kiem/tat-ca?q=Ngan+Hang+Noi+Nho+Dat+G',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    coverBg: 'from-cyan-600 via-blue-800 to-indigo-950',
  },
  {
    id: 7,
    rank: 7,
    title: 'Ngày Còn Đôi Mươi',
    artist: 'Chú Út Lông Bông, Tiểu Mỹ',
    genre: 'Acoustic Mộc • Top 7 #zingchart',
    duration: '3:35',
    zingUrl: 'https://zingmp3.vn/tim-kiem/tat-ca?q=Ngay+Con+Doi+Muoi+Chu+Ut+Long+Bong',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    coverBg: 'from-amber-600 via-orange-700 to-stone-950',
  },
  {
    id: 8,
    rank: 8,
    title: 'Nói Buông Là Buông',
    artist: 'Đình Dũng',
    genre: 'Ballad Buồn • Top 8 #zingchart',
    duration: '4:20',
    zingUrl: 'https://zingmp3.vn/tim-kiem/tat-ca?q=Noi+Buong+La+Buong+Dinh+Dung',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    coverBg: 'from-indigo-600 via-purple-800 to-slate-950',
  },
  {
    id: 9,
    rank: 9,
    title: 'Ác Mộng Đẹp',
    artist: 'Đạt G',
    genre: 'R&B / Soul • Top 9 #zingchart',
    duration: '3:55',
    zingUrl: 'https://zingmp3.vn/tim-kiem/tat-ca?q=Ac+Mong+Dep+Dat+G',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    coverBg: 'from-fuchsia-600 via-rose-700 to-slate-950',
  },
  {
    id: 10,
    rank: 10,
    title: 'Đến Khi Nào',
    artist: 'Yanbi',
    genre: 'V-Pop • Top 10 #zingchart',
    duration: '3:40',
    zingUrl: 'https://zingmp3.vn/tim-kiem/tat-ca?q=Den+Khi+Nao+Yanbi',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    coverBg: 'from-teal-600 via-emerald-800 to-slate-950',
  },
  {
    id: 11,
    rank: 11,
    title: 'Xin Đừng Rời Xa Anh',
    artist: 'Lê Gia Bảo',
    genre: 'Pop Lãng Mạn • Top 11 #zingchart',
    duration: '4:05',
    zingUrl: 'https://zingmp3.vn/tim-kiem/tat-ca?q=Xin+Dung+Roi+Xa+Anh+Le+Gia+Bao',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
    coverBg: 'from-blue-600 via-indigo-700 to-slate-950',
  },
  {
    id: 12,
    rank: 12,
    title: 'Tửu Âm',
    artist: 'TVk, 93NewG',
    genre: 'Nhạc Trẻ Thịnh Hành • Top 12 #zingchart',
    duration: '3:30',
    zingUrl: 'https://zingmp3.vn/tim-kiem/tat-ca?q=Tuu+Am+TVk+93NewG',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
    coverBg: 'from-red-600 via-orange-800 to-zinc-950',
  },
  {
    id: 13,
    rank: 13,
    title: 'Họa Phận Ái Lưu',
    artist: 'Chân Caca',
    genre: 'Cổ Phong Hiện Đại • Top 13 #zingchart',
    duration: '4:18',
    zingUrl: 'https://zingmp3.vn/tim-kiem/tat-ca?q=Hoa+Phan+Ai+Luu+Chan+Caca',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
    coverBg: 'from-violet-600 via-purple-900 to-slate-950',
  },
  {
    id: 14,
    rank: 14,
    title: 'Sau Này Em Cưới Ai Rồi',
    artist: 'Kiều Chi',
    genre: 'Ballad Nữ • Top 14 #zingchart',
    duration: '4:12',
    zingUrl: 'https://zingmp3.vn/tim-kiem/tat-ca?q=Sau+Nay+Em+Cuoi+Ai+Roi+Kieu+Chi',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',
    coverBg: 'from-rose-500 via-pink-700 to-slate-950',
  },
  {
    id: 15,
    rank: 15,
    title: 'Em Vá Đời Anh',
    artist: 'Thiên Chí',
    genre: 'Tình Khúc Trầm Lắng • Top 15 #zingchart',
    duration: '3:48',
    zingUrl: 'https://zingmp3.vn/tim-kiem/tat-ca?q=Em+Va+Doi+Anh+Thien+Chi',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
    coverBg: 'from-emerald-600 via-teal-800 to-slate-950',
  },
  {
    id: 16,
    rank: 16,
    title: 'Không Môn Đăng Hộ Đối (Cover)',
    artist: 'Thái Học',
    genre: 'Cover Cảm Xúc • Top 16 #zingchart',
    duration: '4:15',
    zingUrl: 'https://zingmp3.vn/tim-kiem/tat-ca?q=Khong+Mon+Dang+Ho+Doi+Thai+Hoc',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3',
    coverBg: 'from-amber-600 via-yellow-700 to-stone-950',
  },
  {
    id: 17,
    rank: 17,
    title: 'Cơm Áo Gạo Tiền',
    artist: 'Tuấn Phong, Tiến Nguyễn',
    genre: 'Đời Thường Ý Nghĩa • Top 17 #zingchart',
    duration: '4:00',
    zingUrl: 'https://zingmp3.vn/tim-kiem/tat-ca?q=Com+Ao+Gao+Tien+Tuan+Phong',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    coverBg: 'from-slate-600 via-slate-800 to-black',
  },
  {
    id: 18,
    rank: 18,
    title: 'Em Bán Đi Hết Chân Tình',
    artist: 'Jin Tuấn Nam',
    genre: 'Nhạc Trẻ Cảm Xúc • Top 18 #zingchart',
    duration: '3:52',
    zingUrl: 'https://zingmp3.vn/tim-kiem/tat-ca?q=Em+Ban+Di+Het+Chan+Tinh+Jin+Tuan+Nam',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    coverBg: 'from-purple-700 via-rose-800 to-slate-950',
  },
  {
    id: 19,
    rank: 19,
    title: 'Thắng Đời Thua Em',
    artist: 'Thái Học',
    genre: 'Trữ Tình Sâu Sắc • Top 19 #zingchart',
    duration: '4:22',
    zingUrl: 'https://zingmp3.vn/tim-kiem/tat-ca?q=Thang+Doi+Thua+Em+Thai+Hoc',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    coverBg: 'from-amber-700 via-red-800 to-stone-950',
  },
  {
    id: 20,
    rank: 20,
    title: 'Không Muốn Cũng Đành Buông',
    artist: 'CHEN CHILL',
    genre: 'Lo-fi Chill • Top 20 #zingchart',
    duration: '3:45',
    zingUrl: 'https://zingmp3.vn/tim-kiem/tat-ca?q=Khong+Muon+Cung+Danh+Buong+CHEN+CHILL',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    coverBg: 'from-teal-600 via-indigo-800 to-slate-950',
  },
];

// Danh sách Nhạc Trịnh & Thiên Nhiên Rừng Núi
export const TRINH_CONG_SON_PLAYLIST = [
  {
    id: 101,
    title: 'Hạ Trắng',
    artist: 'Trịnh Công Sơn',
    genre: 'Guitar Acoustic Thư Giãn',
    duration: '3:45',
    zingUrl: 'https://zingmp3.vn/tim-kiem/tat-ca?q=Ha+Trang+Trinh+Cong+Son',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    coverBg: 'from-amber-600 to-emerald-950',
  },
  {
    id: 102,
    title: 'Diễm Xưa',
    artist: 'Trịnh Công Sơn',
    genre: 'Hòa tấu Saxophone & Piano',
    duration: '4:12',
    zingUrl: 'https://zingmp3.vn/tim-kiem/tat-ca?q=Diem+Xua+Trinh+Cong+Son',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    coverBg: 'from-teal-600 to-slate-950',
  },
  {
    id: 103,
    title: 'Còn Tuổi Nào Cho Em',
    artist: 'Trịnh Công Sơn',
    genre: 'Piano Rừng Xanh Thư Thái',
    duration: '3:28',
    zingUrl: 'https://zingmp3.vn/tim-kiem/tat-ca?q=Con+Tuoi+Nao+Cho+Em+Trinh+Cong+Son',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    coverBg: 'from-emerald-700 to-indigo-950',
  },
  {
    id: 104,
    title: 'Cát Bụi',
    artist: 'Trịnh Công Sơn',
    genre: 'Violin & Cello Trầm Mộc',
    duration: '4:18',
    zingUrl: 'https://zingmp3.vn/tim-kiem/tat-ca?q=Cat+Bui+Trinh+Cong+Son',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    coverBg: 'from-amber-800 to-slate-950',
  },
  {
    id: 105,
    title: 'Một Cõi Đi Về',
    artist: 'Trịnh Công Sơn',
    genre: 'Guitar Cổ Điển Rừng Sâu',
    duration: '3:50',
    zingUrl: 'https://zingmp3.vn/tim-kiem/tat-ca?q=Mot+Coi+Di+Ve+Trinh+Cong+Son',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    coverBg: 'from-emerald-900 to-teal-950',
  },
  {
    id: 106,
    title: 'Biển Nhớ',
    artist: 'Trịnh Công Sơn',
    genre: 'Hòa Tấu Piano Thư Giãn',
    duration: '3:55',
    zingUrl: 'https://zingmp3.vn/tim-kiem/tat-ca?q=Bien+Nho+Trinh+Cong+Son',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    coverBg: 'from-cyan-700 to-emerald-950',
  },
  {
    id: 107,
    title: 'Tiếng Suối & Ngàn Chim Hót',
    artist: 'Thiên Nhiên Krông Bông',
    genre: 'Âm Thanh Rừng Già',
    duration: '5:00',
    zingUrl: 'https://zingmp3.vn/tim-kiem/tat-ca?q=Tieng+chim+hot+thien+nhien',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    coverBg: 'from-emerald-800 to-teal-950',
  },
  {
    id: 108,
    title: 'Chiều Mơ Rừng Núi Tây Nguyên',
    artist: 'Hòa Tấu Đại Ngàn',
    genre: 'Sáo Trúc & Đàn T\'rưng',
    duration: '4:30',
    zingUrl: 'https://zingmp3.vn/tim-kiem/tat-ca?q=Hoa+tau+tay+nguyen',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    coverBg: 'from-amber-700 to-slate-950',
  },
];

export default function MusicPlayer() {
  const [activeTab, setActiveTab] = useState('ZING_TOP_20'); // 'ZING_TOP_20' | 'TRINH_SON'
  const currentPlaylist = activeTab === 'ZING_TOP_20' ? ZING_TOP_20_PLAYLIST : TRINH_CONG_SON_PLAYLIST;

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const audioRef = useRef(null);
  const currentTrack = currentPlaylist[currentTrackIndex] || currentPlaylist[0];

  // Play/Pause toggle
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setLoadError(false);
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn('Autoplay audio blocked or error:', err);
          setIsPlaying(false);
        });
    }
  };

  // Next Track
  const nextTrack = () => {
    setLoadError(false);
    const nextIdx = (currentTrackIndex + 1) % currentPlaylist.length;
    setCurrentTrackIndex(nextIdx);
    setIsPlaying(true);
  };

  // Previous Track
  const prevTrack = () => {
    setLoadError(false);
    const prevIdx = (currentTrackIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
    setCurrentTrackIndex(prevIdx);
    setIsPlaying(true);
  };

  // Handle Tab Switch
  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    setCurrentTrackIndex(0);
    setLoadError(false);
    setIsPlaying(false);
  };

  // Handle Audio error
  const handleAudioError = (e) => {
    console.warn('Audio loading error for track:', currentTrack?.title, e);
    setLoadError(true);
  };

  // Auto-play when track changes if was playing
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(console.warn);
      }
    }
  }, [currentTrackIndex, activeTab]);

  // Handle time update
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  // Handle Seek
  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  // Toggle Mute
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Format Time Helper (MM:SS)
  const formatTime = (secs) => {
    if (isNaN(secs) || secs === 0) return '0:00';
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Get Rank Badge Style
  const getRankBadgeStyle = (rank) => {
    if (rank === 1) return 'bg-amber-400 text-slate-950 font-black shadow-xs ring-1 ring-amber-300';
    if (rank === 2) return 'bg-sky-400 text-slate-950 font-black shadow-xs ring-1 ring-sky-300';
    if (rank === 3) return 'bg-emerald-400 text-slate-950 font-black shadow-xs ring-1 ring-emerald-300';
    return 'bg-white/10 text-emerald-300 font-bold';
  };

  return (
    <div className="mt-1 bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-950 text-white rounded-2xl p-3.5 border border-emerald-500/30 shadow-xl relative overflow-hidden font-sans transition-all">
      {/* Background Glow */}
      <div className="absolute -right-8 -top-8 w-28 h-28 bg-purple-500/15 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -left-8 -bottom-8 w-28 h-28 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={currentTrack?.src}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
        onError={handleAudioError}
        preload="auto"
      />

      {/* Header Bar with MP3 Zing Badge & Official Chart Link */}
      <div className="flex items-center justify-between pb-2.5 border-b border-emerald-500/20 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-black tracking-wide text-white flex items-center gap-1.5">
              <span>Top 20 MP3 Zing</span>
              <Sparkles className="w-3 h-3 text-amber-400" />
            </h3>
            <p className="text-[9px] text-emerald-300/80 font-medium">Bảng xếp hạng #zingchart trực tuyến</p>
          </div>
        </div>

        <a
          href="https://zingmp3.vn/zing-chart"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-500/40 text-[10px] font-black transition-all hover:scale-105 active:scale-95 shadow-xs"
          title="Mở Bảng xếp hạng #zingchart trên website mp3.zing.vn"
        >
          <span>ZingChart</span>
          <ExternalLink className="w-2.5 h-2.5" />
        </a>
      </div>

      {/* Tabs Selector: Top 20 Zing MP3 vs Nhạc Rừng Núi */}
      <div className="grid grid-cols-2 gap-1.5 p-1 bg-black/40 rounded-xl border border-white/10 mb-3 text-[11px] font-extrabold">
        <button
          type="button"
          onClick={() => handleTabChange('ZING_TOP_20')}
          className={`flex items-center justify-center gap-1 py-1 px-2 rounded-lg transition-all cursor-pointer ${
            activeTab === 'ZING_TOP_20'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-900/40 font-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Flame className="w-3 h-3 text-amber-400" />
          <span>Top 20 MP3 Zing</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('TRINH_SON')}
          className={`flex items-center justify-center gap-1 py-1 px-2 rounded-lg transition-all cursor-pointer ${
            activeTab === 'TRINH_SON'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-900/40 font-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Music className="w-3 h-3 text-emerald-300" />
          <span>Nhạc Trịnh & Rừng</span>
        </button>
      </div>

      {/* Main Player Display Card */}
      <div className="flex items-center gap-3 mb-3 bg-white/5 p-2 rounded-xl border border-white/10 relative">
        {/* Spinning Vinyl Album Cover */}
        <div
          className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${currentTrack?.coverBg} p-1 shadow-md border border-white/20 flex items-center justify-center flex-shrink-0 overflow-hidden`}
        >
          <Disc
            className={`w-8 h-8 text-amber-300/90 ${isPlaying ? 'animate-spin' : ''}`}
            style={{ animationDuration: '4s' }}
          />
          <div className="absolute w-2.5 h-2.5 bg-slate-900 rounded-full border border-white/40" />

          {/* Rank Badge on Vinyl */}
          {currentTrack?.rank && (
            <span
              className={`absolute top-0.5 left-0.5 text-[8px] px-1 py-0.2 rounded-full font-black leading-none ${getRankBadgeStyle(
                currentTrack.rank
              )}`}
            >
              #{currentTrack.rank}
            </span>
          )}
        </div>

        {/* Track Title Info */}
        <div className="overflow-hidden flex-1 leading-tight">
          <div className="flex items-center justify-between gap-1">
            <div className="font-black text-xs text-white truncate drop-shadow-xs">
              {currentTrack?.title}
            </div>
            {currentTrack?.rank && (
              <span className="text-[9px] font-extrabold text-amber-400 bg-amber-400/20 border border-amber-400/40 px-1 rounded-sm whitespace-nowrap">
                Top {currentTrack.rank}
              </span>
            )}
          </div>

          <div className="text-[11px] font-bold text-amber-300/90 truncate mt-0.5">
            {currentTrack?.artist}
          </div>

          {/* Quick link to play on Zing MP3 */}
          <div className="flex items-center justify-between mt-1">
            <span className="text-[9px] text-emerald-300/70 truncate">{currentTrack?.genre}</span>
            {currentTrack?.zingUrl && (
              <a
                href={currentTrack.zingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 text-[9px] font-extrabold text-purple-300 hover:text-white bg-purple-900/60 hover:bg-purple-800 px-1.5 py-0.5 rounded border border-purple-400/40 transition-colors whitespace-nowrap"
                title="Mở nghe bài hát đầy đủ trên mp3.zing.vn"
              >
                <span>Mở MP3 Zing</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Progress Slider */}
      <div className="space-y-1 mb-3">
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1 bg-emerald-950/80 rounded-lg appearance-none cursor-pointer accent-emerald-400"
        />
        <div className="flex justify-between text-[9px] text-emerald-200/70 font-mono font-bold">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex items-center justify-between bg-black/40 p-2 rounded-xl border border-white/10">
        <button
          onClick={toggleMute}
          className="p-1.5 text-emerald-300 hover:text-white transition-colors cursor-pointer"
          title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={prevTrack}
            className="p-1.5 text-emerald-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title="Bài trước"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={togglePlay}
            className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-purple-400 hover:from-emerald-300 hover:to-purple-300 text-slate-950 font-black shadow-md flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            title={isPlaying ? 'Tạm dừng' : 'Phát nhạc'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-slate-950" />
            ) : (
              <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
            )}
          </button>

          <button
            onClick={nextTrack}
            className="p-1.5 text-emerald-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title="Bài kế tiếp"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={() => setShowPlaylist(!showPlaylist)}
          className={`p-1.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
            showPlaylist
              ? 'bg-purple-600 text-white border-purple-400'
              : 'text-emerald-300 hover:text-white border-white/10 hover:bg-white/10'
          }`}
          title="Xem danh sách bài hát"
        >
          <ListMusic className="w-3.5 h-3.5" />
          <span className="text-[10px] font-mono">{currentPlaylist.length}</span>
          {showPlaylist ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />}
        </button>
      </div>

      {/* Expandable Playlist Dropdown */}
      {showPlaylist && (
        <div className="mt-3 pt-2.5 border-t border-emerald-500/20 space-y-1 max-h-56 overflow-y-auto scrollbar-thin animate-in fade-in duration-200">
          <div className="text-[10px] font-black text-amber-300 uppercase tracking-wider mb-1.5 px-1 flex items-center justify-between">
            <span className="flex items-center gap-1">
              {activeTab === 'ZING_TOP_20' ? (
                <>
                  <Flame className="w-3 h-3 text-rose-400" />
                  <span>Top 20 #zingchart MP3 Zing</span>
                </>
              ) : (
                <>
                  <Music className="w-3 h-3 text-emerald-400" />
                  <span>Tuyển tập Trịnh & Rừng Núi</span>
                </>
              )}
            </span>
            <span className="text-[9px] text-emerald-300/70 font-mono">{currentPlaylist.length} bài hát</span>
          </div>

          {currentPlaylist.map((track, idx) => {
            const isSelected = idx === currentTrackIndex;
            return (
              <div
                key={track.id}
                className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-all group ${
                  isSelected
                    ? 'bg-purple-600/30 text-white border border-purple-400/50 font-bold'
                    : 'hover:bg-white/10 text-emerald-100/90 font-medium'
                }`}
              >
                {/* Clickable song row to play in app */}
                <button
                  type="button"
                  onClick={() => {
                    setCurrentTrackIndex(idx);
                    setIsPlaying(true);
                  }}
                  className="flex items-center gap-2 overflow-hidden flex-1 text-left cursor-pointer"
                >
                  {/* Rank badge */}
                  {track.rank ? (
                    <span
                      className={`text-[9px] font-mono w-5 h-5 rounded-md flex items-center justify-center font-black flex-shrink-0 ${getRankBadgeStyle(
                        track.rank
                      )}`}
                    >
                      {track.rank < 10 ? `0${track.rank}` : track.rank}
                    </span>
                  ) : (
                    <span
                      className={`text-[10px] font-mono w-4 font-bold flex-shrink-0 ${
                        isSelected ? 'text-amber-400' : 'text-emerald-400/60'
                      }`}
                    >
                      {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                    </span>
                  )}

                  <div className="overflow-hidden leading-tight">
                    <div className="truncate text-[11px] font-extrabold flex items-center gap-1">
                      <span>{track.title}</span>
                    </div>
                    <div className="text-[9px] text-emerald-300/70 truncate">{track.artist}</div>
                  </div>
                </button>

                {/* Right Actions: External Zing Link & Equalizer/Duration */}
                <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
                  {/* External link to listen on Zing MP3 */}
                  {track.zingUrl && (
                    <a
                      href={track.zingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 rounded bg-white/5 hover:bg-purple-600 hover:text-white text-purple-300 transition-colors"
                      title={`Nghe "${track.title}" trên Zing MP3`}
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  {/* Equalizer animation */}
                  {isSelected && isPlaying ? (
                    <span className="flex items-center gap-0.5">
                      <span className="w-1 h-2.5 bg-amber-400 rounded-full animate-bounce"></span>
                      <span
                        className="w-1 h-3.5 bg-purple-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.15s' }}
                      ></span>
                      <span
                        className="w-1 h-2 bg-emerald-300 rounded-full animate-bounce"
                        style={{ animationDelay: '0.3s' }}
                      ></span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-emerald-300/60">{track.duration}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
