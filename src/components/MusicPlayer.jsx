import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Disc, ListMusic, Music, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

const PLAYLIST = [
  // 1-10: Nhạc Trịnh Công Sơn kinh điển
  {
    id: 1,
    title: 'Hạ Trắng',
    composer: 'Trịnh Công Sơn',
    genre: 'Guitar Acoustic Thư Giãn',
    duration: '3:45',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    coverBg: 'from-amber-600 to-emerald-900',
  },
  {
    id: 2,
    title: 'Diễm Xưa',
    composer: 'Trịnh Công Sơn',
    genre: 'Hòa tấu Saxophone & Piano',
    duration: '4:12',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    coverBg: 'from-teal-600 to-slate-900',
  },
  {
    id: 3,
    title: 'Còn Tuổi Nào Cho Em',
    composer: 'Trịnh Công Sơn',
    genre: 'Piano Rừng Xanh Thư Thái',
    duration: '3:28',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    coverBg: 'from-emerald-700 to-indigo-950',
  },
  {
    id: 4,
    title: 'Cát Bụi',
    composer: 'Trịnh Công Sơn',
    genre: 'Violin & Cello Trầm Mộc',
    duration: '4:18',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    coverBg: 'from-amber-800 to-slate-950',
  },
  {
    id: 5,
    title: 'Một Cõi Đi Về',
    composer: 'Trịnh Công Sơn',
    genre: 'Guitar Cổ Điển Rừng Sâu',
    duration: '3:50',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    coverBg: 'from-emerald-900 to-teal-950',
  },
  {
    id: 6,
    title: 'Biển Nhớ',
    composer: 'Trịnh Công Sơn',
    genre: 'Hòa Tấu Piano Thư Giãn',
    duration: '3:55',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    coverBg: 'from-cyan-700 to-emerald-950',
  },
  {
    id: 7,
    title: 'Nhớ Mùa Thu Hà Nội',
    composer: 'Trịnh Công Sơn',
    genre: 'Saxophone Thơ Mộng',
    duration: '4:05',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    coverBg: 'from-amber-700 to-emerald-950',
  },
  {
    id: 8,
    title: 'Như Cánh Vạc Bay',
    composer: 'Trịnh Công Sơn',
    genre: 'Hòa Tấu Sáo Trúc Rừng Chiều',
    duration: '3:38',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    coverBg: 'from-teal-700 to-indigo-950',
  },
  {
    id: 9,
    title: 'Mưa Hồng',
    composer: 'Trịnh Công Sơn',
    genre: 'Acoustic Guitar Thả Hồn',
    duration: '3:42',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    coverBg: 'from-rose-800 to-emerald-950',
  },
  {
    id: 10,
    title: 'Nắng Thủy Tinh',
    composer: 'Trịnh Công Sơn',
    genre: 'Piano & Tiếng Chim Hót',
    duration: '4:00',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    coverBg: 'from-amber-600 to-teal-900',
  },

  // 11-20: Nhạc Trịnh & Tuyệt Phẩm Sâu Lắng
  {
    id: 11,
    title: 'Tình Nhớ',
    composer: 'Trịnh Công Sơn',
    genre: 'Hòa Tấu Cello & Guitar',
    duration: '4:22',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
    coverBg: 'from-indigo-900 to-slate-950',
  },
  {
    id: 12,
    title: 'Ru Em Bằng Tiếng Sóng',
    composer: 'Trịnh Công Sơn',
    genre: 'Piano Thư Giãn Ban Đêm',
    duration: '3:50',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
    coverBg: 'from-blue-800 to-emerald-950',
  },
  {
    id: 13,
    title: 'Cuối Cùng Cho Một Tình Yêu',
    composer: 'Trịnh Công Sơn',
    genre: 'Guitar Cổ Điển Nhẹ Nhàng',
    duration: '3:30',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
    coverBg: 'from-emerald-800 to-amber-950',
  },
  {
    id: 14,
    title: 'Thuở Bống Là Người',
    composer: 'Trịnh Công Sơn',
    genre: 'Hòa Tấu Sáo Rừng & Đàn Tranh',
    duration: '3:48',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',
    coverBg: 'from-teal-800 to-emerald-950',
  },
  {
    id: 15,
    title: 'Quỳnh Hương',
    composer: 'Trịnh Công Sơn',
    genre: 'Piano Nốt Nhẹ Thư Thái',
    duration: '3:35',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
    coverBg: 'from-purple-900 to-emerald-950',
  },
  {
    id: 16,
    title: 'Dấu Chân Địa Đàng',
    composer: 'Trịnh Công Sơn',
    genre: 'Violin Rừng Chiều Thơ Mộng',
    duration: '4:15',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3',
    coverBg: 'from-amber-900 to-teal-950',
  },
  {
    id: 17,
    title: 'Em Còn Nhớ Hay Em Đã Quên',
    composer: 'Trịnh Công Sơn',
    genre: 'Acoustic Guitar Thả Hồn',
    duration: '4:02',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    coverBg: 'from-emerald-900 to-indigo-950',
  },
  {
    id: 18,
    title: 'Lời Buồn Thánh',
    composer: 'Trịnh Công Sơn',
    genre: 'Piano & Gió Rừng Đêm',
    duration: '3:58',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    coverBg: 'from-slate-800 to-emerald-950',
  },
  {
    id: 19,
    title: 'Tuổi Đời Nối Vòng Tay',
    composer: 'Trịnh Công Sơn',
    genre: 'Hòa Tấu Măng Đô Lin & Guitar',
    duration: '3:25',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    coverBg: 'from-amber-700 to-emerald-900',
  },
  {
    id: 20,
    title: 'Vẫn Có Em Bên Đời',
    composer: 'Trịnh Công Sơn',
    genre: 'Saxophone Trầm Ấm Thư Giãn',
    duration: '4:10',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    coverBg: 'from-teal-900 to-slate-950',
  },

  // 21-30: Tuyệt Phẩm Nhạc Rừng Núi & Tây Nguyên Krông Bông
  {
    id: 21,
    title: 'Tiếng Gọi Đại Ngàn Krông Bông',
    composer: 'Âm Hưởng Tây Nguyên',
    genre: 'Đàn T\'rưng & Tiếng Suối Ngàn',
    duration: '4:15',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    coverBg: 'from-emerald-800 to-amber-950',
  },
  {
    id: 22,
    title: 'Nối Vòng Tay Lớn Đại Ngàn',
    composer: 'Trịnh Công Sơn',
    genre: 'Hòa Tấu Đàn Đá & T\'rưng',
    duration: '3:40',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    coverBg: 'from-amber-800 to-teal-950',
  },
  {
    id: 23,
    title: 'Bình Minh Trên Đỉnh Chu Yang Sin',
    composer: 'Hạt Kiểm Lâm Krông Bông',
    genre: 'Sáo Rừng & Tiếng Chim Hót',
    duration: '4:30',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    coverBg: 'from-teal-700 to-emerald-950',
  },
  {
    id: 24,
    title: 'Chiều Mơ Rừng Núi Tây Nguyên',
    composer: 'Nhạc Dân Dân Đại Ngàn',
    genre: 'Guitar Acoustic & Gió Rừng',
    duration: '3:52',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    coverBg: 'from-amber-700 to-emerald-950',
  },
  {
    id: 25,
    title: 'Tiếng Suối & Ngàn Chim Hót',
    composer: 'Thiên Nhiên Krông Bông',
    genre: 'Âm Thanh Thiên Nhiên 8K',
    duration: '5:00',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    coverBg: 'from-emerald-900 to-cyan-950',
  },
  {
    id: 26,
    title: 'Đêm Ban Mê & Gió Rừng Già',
    composer: 'Hòa Tấu Đại Ngàn',
    genre: 'Piano Thư Giãn Rừng Sâu',
    duration: '4:12',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    coverBg: 'from-indigo-950 to-emerald-900',
  },
  {
    id: 27,
    title: 'Khát Vọng Tây Nguyên',
    composer: 'Âm Hưởng Rừng Xanh',
    genre: 'Violin & Đàn Đá Thư Thái',
    duration: '3:45',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
    coverBg: 'from-emerald-800 to-amber-900',
  },
  {
    id: 28,
    title: 'Hoàng Hôn Rừng Già',
    composer: 'Hạt Kiểm Lâm Krông Bông',
    genre: 'Guitar & Sáo Trúc Thả Hồn',
    duration: '4:08',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
    coverBg: 'from-amber-900 to-slate-950',
  },
  {
    id: 29,
    title: 'Giọt Sương Trên Lá Rừng',
    composer: 'Âm Hưởng Thiên Nhiên',
    genre: 'Hòa Tấu Thư Giãn Sáng Rừng',
    duration: '3:50',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
    coverBg: 'from-teal-800 to-emerald-950',
  },
  {
    id: 30,
    title: 'Rừng Xanh Krông Bông Bình Yên',
    composer: 'Tuyệt Phẩm Kiểm Lâm',
    genre: 'Hòa Tấu Tổng Hợp Thư Giãn',
    duration: '4:45',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',
    coverBg: 'from-emerald-900 to-teal-900',
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const audioRef = useRef(null);
  const currentTrack = PLAYLIST[currentTrackIndex];

  // Play/Pause toggle
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setLoadError(false);
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn("Autoplay audio blocked or error:", err);
        setIsPlaying(false);
      });
    }
  };

  // Next Track
  const nextTrack = () => {
    setLoadError(false);
    const nextIdx = (currentTrackIndex + 1) % PLAYLIST.length;
    setCurrentTrackIndex(nextIdx);
    setIsPlaying(true);
  };

  // Previous Track
  const prevTrack = () => {
    setLoadError(false);
    const prevIdx = (currentTrackIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
    setCurrentTrackIndex(prevIdx);
    setIsPlaying(true);
  };

  // Handle Audio error
  const handleAudioError = (e) => {
    console.warn("Audio loading error for track:", currentTrack.title, e);
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
  }, [currentTrackIndex]);

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

  return (
    <div className="mt-4 bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-900 text-white rounded-2xl p-3.5 border border-emerald-500/30 shadow-lg relative overflow-hidden font-sans transition-all">
      {/* Background Glow */}
      <div className="absolute -right-8 -top-8 w-28 h-28 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />
      
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={currentTrack.src}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
        onError={handleAudioError}
        preload="auto"
      />

      {/* Header Bar */}
      <div className="flex items-center justify-between pb-2.5 border-b border-emerald-500/20 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-emerald-500/20 rounded-lg text-emerald-400 border border-emerald-400/30">
            <Music className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-black tracking-wide text-white flex items-center gap-1.5">
              <span>Góc Nhạc Thư Giãn</span>
              <Sparkles className="w-3 h-3 text-amber-400" />
            </h3>
            <p className="text-[9px] text-emerald-300/80 font-medium">Nhạc Trịnh & Điệu Rừng Núi</p>
          </div>
        </div>

        <button
          onClick={() => setShowPlaylist(!showPlaylist)}
          className={`p-1.5 rounded-lg border text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer ${
            showPlaylist 
              ? 'bg-emerald-500 text-slate-950 border-emerald-400' 
              : 'bg-white/10 hover:bg-white/20 text-emerald-200 border-emerald-500/30'
          }`}
          title="Danh sách bài hát"
        >
          <ListMusic className="w-3.5 h-3.5" />
          <span className="text-[10px]">{PLAYLIST.length} Bài</span>
        </button>
      </div>

      {/* Main Player Display */}
      <div className="flex items-center gap-3 mb-3">
        {/* Spinning Vinyl Album Cover */}
        <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${currentTrack.coverBg} p-1 shadow-md border border-white/20 flex items-center justify-center flex-shrink-0 overflow-hidden`}>
          <Disc className={`w-8 h-8 text-amber-300/90 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
          <div className="absolute w-2.5 h-2.5 bg-slate-900 rounded-full border border-white/40" />
        </div>

        {/* Track Title Info */}
        <div className="overflow-hidden flex-1 leading-tight">
          <div className="font-black text-xs text-white truncate drop-shadow-xs">
            {currentTrack.title}
          </div>
          <div className="text-[11px] font-bold text-amber-300/90 truncate mt-0.5">
            {currentTrack.composer}
          </div>
          <div className="text-[9px] font-medium text-emerald-300/70 truncate mt-0.5">
            {currentTrack.genre}
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
      <div className="flex items-center justify-between bg-black/30 p-2 rounded-xl border border-white/10">
        <button
          onClick={toggleMute}
          className="p-1.5 text-emerald-300 hover:text-white transition-colors cursor-pointer"
          title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
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
            className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black shadow-md flex items-center justify-center transition-transform hover:scale-105 cursor-pointer"
            title={isPlaying ? "Tạm dừng" : "Phát nhạc"}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950 ml-0.5" />}
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
          className="p-1.5 text-emerald-300 hover:text-white transition-colors cursor-pointer"
          title="Xem Playlist"
        >
          {showPlaylist ? <ChevronUp className="w-4 h-4 text-amber-400" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expandable Playlist Dropdown */}
      {showPlaylist && (
        <div className="mt-3 pt-2.5 border-t border-emerald-500/20 space-y-1 max-h-48 overflow-y-auto scrollbar-thin animate-in fade-in duration-200">
          <div className="text-[10px] font-bold text-amber-300/90 uppercase tracking-wider mb-1.5 px-1 flex items-center justify-between">
            <span>Danh sách phát ({PLAYLIST.length})</span>
            <span className="text-[9px] text-emerald-300/70 font-normal">Trịnh Công Sơn & Rừng Núi</span>
          </div>
          {PLAYLIST.map((track, idx) => {
            const isSelected = idx === currentTrackIndex;
            return (
              <button
                key={track.id}
                onClick={() => {
                  setCurrentTrackIndex(idx);
                  setIsPlaying(true);
                }}
                className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-emerald-500/30 text-white border border-emerald-400/50 font-bold' 
                    : 'hover:bg-white/10 text-emerald-100/90 font-medium'
                }`}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className={`text-[10px] font-mono w-4 font-bold ${isSelected ? 'text-amber-400' : 'text-emerald-400/60'}`}>
                    0{idx + 1}
                  </span>
                  <div className="overflow-hidden leading-tight">
                    <div className="truncate text-[11px] font-extrabold">{track.title}</div>
                    <div className="text-[9px] text-emerald-300/70 truncate">{track.composer}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] font-mono">
                  {isSelected && isPlaying && (
                    <span className="flex items-center gap-0.5">
                      <span className="w-1 h-2.5 bg-amber-400 rounded-full animate-bounce"></span>
                      <span className="w-1 h-3.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                      <span className="w-1 h-2 bg-amber-300 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                    </span>
                  )}
                  <span className="text-emerald-300/60">{track.duration}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
