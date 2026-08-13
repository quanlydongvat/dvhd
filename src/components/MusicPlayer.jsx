import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Disc, ListMusic, Music, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

const PLAYLIST = [
  {
    id: 1,
    title: 'Hạ Trắng',
    composer: 'Trịnh Công Sơn',
    genre: 'Guitar Acoustic Thư Giãn',
    duration: '3:45',
    src: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=acoustic-guitar-loop-113654.mp3',
    coverBg: 'from-amber-600 to-emerald-900',
  },
  {
    id: 2,
    title: 'Diễm Xưa',
    composer: 'Trịnh Công Sơn',
    genre: 'Hòa tấu Saxophone & Piano',
    duration: '4:12',
    src: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=relaxing-mountains-14111.mp3',
    coverBg: 'from-teal-600 to-slate-900',
  },
  {
    id: 3,
    title: 'Còn Tuổi Nào Cho Em',
    composer: 'Trịnh Công Sơn',
    genre: 'Piano Rừng Xanh Thư Thái',
    duration: '3:28',
    src: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792e7.mp3?filename=forest-lullaby-110624.mp3',
    coverBg: 'from-emerald-700 to-indigo-950',
  },
  {
    id: 4,
    title: 'Tiếng Gọi Đại Ngàn',
    composer: 'Âm Hưởng Rừng Krông Bông',
    genre: 'Đàn T\'rưng & Nhạc Rừng Núi',
    duration: '4:05',
    src: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_8844866345.mp3?filename=mountain-stream-11234.mp3',
    coverBg: 'from-emerald-800 to-amber-950',
  },
  {
    id: 5,
    title: 'Nối Vòng Tay Lớn',
    composer: 'Trịnh Công Sơn',
    genre: 'Hòa Tấu Đại Ngàn Tây Nguyên',
    duration: '3:15',
    src: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a1682f.mp3?filename=peaceful-forest-ambient-20320.mp3',
    coverBg: 'from-amber-700 to-teal-950',
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);

  const audioRef = useRef(null);
  const currentTrack = PLAYLIST[currentTrackIndex];

  // Play/Pause toggle
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn("Autoplay audio blocked or error:", err);
      });
    }
  };

  // Next Track
  const nextTrack = () => {
    const nextIdx = (currentTrackIndex + 1) % PLAYLIST.length;
    setCurrentTrackIndex(nextIdx);
    setIsPlaying(true);
  };

  // Previous Track
  const prevTrack = () => {
    const prevIdx = (currentTrackIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
    setCurrentTrackIndex(prevIdx);
    setIsPlaying(true);
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
        preload="metadata"
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
