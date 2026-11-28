import React, { useState, useEffect, useRef } from 'react';

const ANIMALS = [
  {
    id: 'civet',
    name: 'Cầy vòi hương',
    type: 'ground',
    durationMs: 10500,
  },
  {
    id: 'bamboo_rat',
    name: 'Dúi mốc lớn',
    type: 'ground',
    durationMs: 12000,
  },
  {
    id: 'deer',
    name: 'Nai',
    type: 'ground',
    durationMs: 8500,
  },
  {
    id: 'bulbul',
    name: 'Chim Chào mào',
    type: 'air',
    durationMs: 9000,
  },
  {
    id: 'dove',
    name: 'Chim Cu gáy',
    type: 'air',
    durationMs: 9500,
  },
];

function AnimalSprite({ id }) {
  switch (id) {
    case 'civet':
      return (
        <svg viewBox="0 0 120 70" className="w-24 h-14 sm:w-28 sm:h-16 drop-shadow-md">
          {/* Tail */}
          <path
            d="M25 36 Q8 30 4 44 Q10 48 24 42"
            fill="#2d2a26"
            className="origin-[25px_38px] animate-[wiggle_0.45s_ease-in-out_infinite_alternate]"
          />
          {/* Body */}
          <ellipse cx="52" cy="40" rx="26" ry="12" fill="#4a443c" />
          {/* Spots */}
          <circle cx="42" cy="37" r="2" fill="#1f1c18" />
          <circle cx="52" cy="35" r="2.2" fill="#1f1c18" />
          <circle cx="60" cy="39" r="2" fill="#1f1c18" />
          <circle cx="48" cy="43" r="1.8" fill="#1f1c18" />
          {/* Back legs */}
          <path d="M35 48 L30 62" stroke="#2d2a26" strokeWidth="5" strokeLinecap="round" className="animate-[legA_0.28s_linear_infinite_alternate]" />
          <path d="M41 48 L44 62" stroke="#1f1c18" strokeWidth="4.5" strokeLinecap="round" className="animate-[legB_0.28s_linear_infinite_alternate]" />
          {/* Front legs */}
          <path d="M64 48 L60 62" stroke="#2d2a26" strokeWidth="4.5" strokeLinecap="round" className="animate-[legB_0.28s_linear_infinite_alternate]" />
          <path d="M70 48 L75 62" stroke="#1f1c18" strokeWidth="5" strokeLinecap="round" className="animate-[legA_0.28s_linear_infinite_alternate]" />
          {/* Head */}
          <ellipse cx="83" cy="34" rx="13" ry="9" fill="#3a352f" />
          {/* White mask */}
          <path d="M80 28 Q87 28 92 33 Q86 36 80 34 Z" fill="#f3f4f6" />
          {/* Ear */}
          <polygon points="75,27 79,19 84,26" fill="#2d2a26" />
          {/* Nose & Eye */}
          <circle cx="96" cy="35" r="2" fill="#111827" />
          <circle cx="86" cy="32" r="1.7" fill="#111827" />
        </svg>
      );

    case 'bamboo_rat':
      return (
        <svg viewBox="0 0 110 70" className="w-20 h-14 sm:w-24 sm:h-16 drop-shadow-md">
          {/* Short Tail */}
          <path d="M22 48 L10 52" stroke="#d4a373" strokeWidth="3.5" strokeLinecap="round" />
          {/* Plump Body */}
          <ellipse cx="52" cy="44" rx="28" ry="17" fill="#6b5b4f" />
          <ellipse cx="55" cy="48" rx="22" ry="11" fill="#8a796b" opacity="0.6" />
          {/* Short Legs */}
          <ellipse cx="36" cy="59" rx="5" ry="3.5" fill="#4a3f37" className="animate-[legA_0.25s_linear_infinite_alternate]" />
          <ellipse cx="68" cy="59" rx="5" ry="3.5" fill="#4a3f37" className="animate-[legB_0.25s_linear_infinite_alternate]" />
          {/* Round Head */}
          <ellipse cx="78" cy="41" rx="14" ry="12" fill="#6b5b4f" />
          {/* Small Ear */}
          <circle cx="71" cy="31" r="3.5" fill="#54473d" />
          {/* Cute Teeth & Nose */}
          <rect x="88" y="45" width="3" height="4" rx="0.8" fill="#fef3c7" />
          <circle cx="92" cy="42" r="2" fill="#d97706" />
          <circle cx="82" cy="38" r="2" fill="#111827" />
          {/* Whiskers */}
          <path d="M87 43 L98 40 M87 45 L98 46" stroke="#e5e7eb" strokeWidth="1" />
        </svg>
      );

    case 'deer':
      return (
        <svg viewBox="0 0 130 100" className="w-28 h-20 sm:w-32 sm:h-24 drop-shadow-md">
          {/* Tail */}
          <path d="M24 52 Q16 46 20 56" fill="#78350f" />
          {/* Body */}
          <ellipse cx="54" cy="54" rx="28" ry="14" fill="#92400e" />
          <ellipse cx="54" cy="60" rx="20" ry="7" fill="#d97706" opacity="0.45" />
          {/* Legs */}
          <path d="M35 62 L27 92" stroke="#78350f" strokeWidth="4.5" strokeLinecap="round" className="animate-[legA_0.26s_linear_infinite_alternate]" />
          <path d="M43 62 L49 92" stroke="#92400e" strokeWidth="4.5" strokeLinecap="round" className="animate-[legB_0.26s_linear_infinite_alternate]" />
          <path d="M66 62 L59 92" stroke="#78350f" strokeWidth="4.5" strokeLinecap="round" className="animate-[legB_0.26s_linear_infinite_alternate]" />
          <path d="M74 62 L84 92" stroke="#92400e" strokeWidth="4.5" strokeLinecap="round" className="animate-[legA_0.26s_linear_infinite_alternate]" />
          {/* Neck & Head */}
          <path d="M72 48 L84 26 L94 30 L82 55 Z" fill="#92400e" />
          <ellipse cx="94" cy="28" rx="11" ry="6.5" fill="#92400e" />
          {/* Antlers */}
          <path d="M86 22 L80 6 M83 14 L75 11 M89 22 L93 7 M91 14 L98 11" stroke="#fef3c7" strokeWidth="2.3" strokeLinecap="round" />
          {/* Ear, Eye, Nose */}
          <ellipse cx="83" cy="23" rx="4" ry="2.5" transform="rotate(-25 83 23)" fill="#78350f" />
          <circle cx="95" cy="26" r="1.8" fill="#111827" />
          <circle cx="105" cy="29" r="2.2" fill="#111827" />
        </svg>
      );

    case 'bulbul':
      return (
        <svg viewBox="0 0 100 70" className="w-20 h-14 sm:w-24 sm:h-16 drop-shadow-md">
          {/* Tail */}
          <path d="M28 42 L6 48 L8 42 Z" fill="#3f3f46" />
          <circle cx="15" cy="46" r="2.5" fill="#ef4444" />
          {/* Wing */}
          <path
            d="M42 36 Q52 10 64 32 Q50 38 42 36"
            fill="#52525b"
            className="origin-[48px_36px] animate-[flap_0.22s_ease-in-out_infinite_alternate]"
          />
          {/* Body */}
          <ellipse cx="48" cy="40" rx="18" ry="10" fill="#71717a" />
          <ellipse cx="50" cy="44" rx="14" ry="6" fill="#f4f4f5" />
          {/* Head & Red-whiskered Crest */}
          <circle cx="68" cy="34" r="8" fill="#27272a" />
          <polygon points="62,28 67,13 73,27" fill="#18181b" />
          {/* Cheek patch (white + red) */}
          <ellipse cx="70" cy="36" rx="4" ry="3" fill="#ffffff" />
          <circle cx="68" cy="35" r="1.6" fill="#dc2626" />
          {/* Beak & Eye */}
          <polygon points="75,33 85,35 75,37" fill="#18181b" />
          <circle cx="71" cy="32" r="1.4" fill="#111827" />
        </svg>
      );

    case 'dove':
    default:
      return (
        <svg viewBox="0 0 110 75" className="w-24 h-16 sm:w-28 sm:h-18 drop-shadow-md">
          {/* Tail */}
          <path d="M32 42 L6 50 L8 42 Z" fill="#78716c" />
          {/* Wing */}
          <path
            d="M44 37 Q56 8 70 33 Q55 39 44 37"
            fill="#a8a29e"
            className="origin-[52px_37px] animate-[flap_0.25s_ease-in-out_infinite_alternate]"
          />
          {/* Body */}
          <ellipse cx="52" cy="42" rx="20" ry="10.5" fill="#d6d3d1" />
          <ellipse cx="54" cy="45" rx="14" ry="6" fill="#e7e5e4" />
          {/* Neck & Spotted Collar */}
          <circle cx="74" cy="34" r="8" fill="#d6d3d1" />
          <path d="M65 36 Q71 42 76 38" stroke="#292524" strokeWidth="4" strokeLinecap="round" strokeDasharray="1.5 2.5" fill="none" />
          {/* Beak & Eye */}
          <polygon points="81,33 90,35 81,37" fill="#44403c" />
          <circle cx="77" cy="32" r="1.5" fill="#111827" />
        </svg>
      );
  }
}

export default function WildlifeRoamingOverlay() {
  const [activeAnimal, setActiveAnimal] = useState(null);
  const timerRef = useRef(null);
  const hideTimerRef = useRef(null);

  useEffect(() => {
    const scheduleNext = (delayMs) => {
      timerRef.current = setTimeout(() => {
        const chosen = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
        const goRight = Math.random() > 0.35;
        const topPercent = chosen.type === 'air' ? Math.floor(14 + Math.random() * 24) : null;

        setActiveAnimal({
          ...chosen,
          key: Date.now(),
          goRight,
          topPercent,
        });

        hideTimerRef.current = setTimeout(() => {
          setActiveAnimal(null);
          // Next appearance in 2 to 3 minutes (120s - 180s)
          const nextDelay = 120000 + Math.floor(Math.random() * 60000);
          scheduleNext(nextDelay);
        }, chosen.durationMs + 400);
      }, delayMs);
    };

    // First appearance quickly after load (10s) so user can see it, then every 2-3 minutes
    scheduleNext(10000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  if (!activeAnimal) return null;

  const isGround = activeAnimal.type === 'ground';

  return (
    <div
      key={activeAnimal.key}
      className="fixed inset-0 pointer-events-none z-40 overflow-hidden print:hidden"
      aria-hidden="true"
    >
      <style>{`
        @keyframes roamRight {
          0% { transform: translateX(-160px); }
          100% { transform: translateX(calc(100vw + 160px)); }
        }
        @keyframes roamLeft {
          0% { transform: translateX(calc(100vw + 160px)); }
          100% { transform: translateX(-160px); }
        }
        @keyframes hopRun {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes flyWave {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50% { transform: translateY(-16px) rotate(3deg); }
        }
        @keyframes flap {
          0% { transform: scaleY(1); }
          100% { transform: scaleY(-0.55); }
        }
        @keyframes legA {
          0% { transform: rotate(-16deg); }
          100% { transform: rotate(18deg); }
        }
        @keyframes legB {
          0% { transform: rotate(18deg); }
          100% { transform: rotate(-16deg); }
        }
        @keyframes wiggle {
          0% { transform: rotate(-8deg); }
          100% { transform: rotate(10deg); }
        }
      `}</style>

      <div
        className="absolute left-0"
        style={{
          bottom: isGround ? '14px' : undefined,
          top: !isGround ? `${activeAnimal.topPercent}%` : undefined,
          animation: `${activeAnimal.goRight ? 'roamRight' : 'roamLeft'} ${activeAnimal.durationMs}ms linear forwards`,
        }}
      >
        <div
          className="flex flex-col items-center"
          style={{
            animation: isGround
              ? 'hopRun 0.36s ease-in-out infinite'
              : 'flyWave 1.6s ease-in-out infinite',
          }}
        >
          <span className="mb-0.5 px-2 py-0.5 rounded-full bg-emerald-950/75 text-emerald-100 text-[10px] font-bold tracking-tight shadow-sm backdrop-blur-xs whitespace-nowrap">
            {activeAnimal.name}
          </span>
          <div style={{ transform: activeAnimal.goRight ? 'scaleX(1)' : 'scaleX(-1)' }}>
            <AnimalSprite id={activeAnimal.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
