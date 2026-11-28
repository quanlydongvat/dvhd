import React, { useState, useEffect, useRef } from 'react';

const ANIMALS = [
  {
    id: 'civet',
    img: './images/roam_civet.png',
    type: 'ground',
    durationMs: 10500,
    sizeClass: 'h-14 sm:h-16 md:h-20 w-auto',
  },
  {
    id: 'bamboo_rat',
    img: './images/roam_bamboo_rat.png',
    type: 'ground',
    durationMs: 12000,
    sizeClass: 'h-12 sm:h-14 md:h-16 w-auto',
  },
  {
    id: 'deer',
    img: './images/roam_deer.png',
    type: 'ground',
    durationMs: 8500,
    sizeClass: 'h-20 sm:h-24 md:h-28 w-auto',
  },
  {
    id: 'bulbul',
    img: './images/roam_bulbul.png',
    type: 'air',
    durationMs: 9000,
    sizeClass: 'h-12 sm:h-14 md:h-16 w-auto',
  },
  {
    id: 'dove',
    img: './images/roam_dove.png',
    type: 'air',
    durationMs: 9500,
    sizeClass: 'h-14 sm:h-16 md:h-18 w-auto',
  },
];

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
          // Next appearance in 60 to 80 seconds
          const nextDelay = 60000 + Math.floor(Math.random() * 20000);
          scheduleNext(nextDelay);
        }, chosen.durationMs + 400);
      }, delayMs);
    };

    // First appearance quickly after load (5s), then every 60-80 seconds
    scheduleNext(5000);

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
          0% { transform: translateX(-200px); }
          100% { transform: translateX(calc(100vw + 200px)); }
        }
        @keyframes roamLeft {
          0% { transform: translateX(calc(100vw + 200px)); }
          100% { transform: translateX(-200px); }
        }
        @keyframes hopRun {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          35% { transform: translateY(-7px) rotate(-2deg); }
          70% { transform: translateY(-2px) rotate(1.5deg); }
        }
        @keyframes flyWave {
          0%, 100% { transform: translateY(0px) rotate(-3deg) scaleY(1); }
          50% { transform: translateY(-18px) rotate(4deg) scaleY(0.95); }
        }
      `}</style>

      <div
        className="absolute left-0"
        style={{
          bottom: isGround ? '12px' : undefined,
          top: !isGround ? `${activeAnimal.topPercent}%` : undefined,
          animation: `${activeAnimal.goRight ? 'roamRight' : 'roamLeft'} ${activeAnimal.durationMs}ms linear forwards`,
        }}
      >
        <div
          style={{
            animation: isGround
              ? 'hopRun 0.42s ease-in-out infinite'
              : 'flyWave 1.4s ease-in-out infinite',
          }}
        >
          <img
            src={activeAnimal.img}
            alt=""
            className={`${activeAnimal.sizeClass} object-contain select-none drop-shadow-[0_6px_10px_rgba(0,0,0,0.28)]`}
            style={{
              transform: activeAnimal.goRight ? 'scaleX(1)' : 'scaleX(-1)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
