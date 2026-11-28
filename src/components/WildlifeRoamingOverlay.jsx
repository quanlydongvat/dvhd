import React, { useState, useEffect, useRef } from 'react';

const BASE = import.meta.env.BASE_URL || '/';

const GROUND_AND_DOVE = [
  {
    id: 'civet',
    name: 'Cầy vòi hương',
    src: `${BASE}videos/cayvoihuong.mp4`,
    category: 'beast',
    durationMs: 10500,
    sizeClass: 'w-44 sm:w-52 md:w-60 h-auto',
    facingLeftByDefault: false,
  },
  {
    id: 'dove',
    name: 'Chim Cu gáy',
    src: `${BASE}videos/chimcu.mp4`,
    category: 'bird',
    durationMs: 9500,
    sizeClass: 'w-36 sm:w-44 md:w-48 h-auto',
    facingLeftByDefault: false,
  },
];

const BULBUL_CONFIG = {
  id: 'bulbul',
  name: 'Chim Chào mào',
  src: `${BASE}videos/chaomao.mp4`,
  durationMs: 9000,
};

/**
 * Renders a video onto a transparent-background <canvas> in real time
 * by keying out the studio background color sampled from the frame borders.
 */
function TransparentVideoCanvas({ src, className, style }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let isCancelled = false;

    const renderFrame = () => {
      if (isCancelled) return;

      if (video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) {
        const targetW = 260;
        const targetH = Math.round((video.videoHeight / video.videoWidth) * targetW);

        if (canvas.width !== targetW || canvas.height !== targetH) {
          canvas.width = targetW;
          canvas.height = targetH;
        }

        ctx.drawImage(video, 0, 0, targetW, targetH);
        const frame = ctx.getImageData(0, 0, targetW, targetH);
        const d = frame.data;

        // Sample background color from top-left & top-right corners
        const bgR = (d[0] + d[(targetW - 1) * 4]) / 2;
        const bgG = (d[1] + d[(targetW - 1) * 4 + 1]) / 2;
        const bgB = (d[2] + d[(targetW - 1) * 4 + 2]) / 2;

        const isLightBg = Math.min(bgR, bgG, bgB) > 195;
        const isGreenScreen = bgG > bgR + 35 && bgG > bgB + 35;

        const totalPixels = targetW * targetH;
        for (let i = 0; i < totalPixels; i++) {
          const p = i * 4;
          const r = d[p];
          const g = d[p + 1];
          const b = d[p + 2];

          const x = i % targetW;
          const y = (i - x) / targetW;

          // Remove subtle AI watermark in bottom-right corner
          if (x > targetW * 0.86 && y > targetH * 0.82 && Math.min(r, g, b) > 170) {
            d[p + 3] = 0;
            continue;
          }

          if (isGreenScreen) {
            const greenness = g - Math.max(r, b);
            if (greenness > 45) {
              d[p + 3] = 0;
            } else if (greenness > 15) {
              d[p + 3] = Math.round(((45 - greenness) / 30) * 255);
            }
          } else if (isLightBg) {
            const dist = Math.abs(r - bgR) + Math.abs(g - bgG) + Math.abs(b - bgB);
            const minC = Math.min(r, g, b);
            const sat = Math.max(r, g, b) - minC;

            if (dist < 42 && sat < 26) {
              d[p + 3] = 0;
            } else if (dist < 85 && sat < 35 && minC > 190) {
              d[p + 3] = Math.round(((dist - 42) / 43) * 255);
            }
          } else {
            const dist = Math.abs(r - bgR) + Math.abs(g - bgG) + Math.abs(b - bgB);
            if (dist < 38) {
              d[p + 3] = 0;
            } else if (dist < 68) {
              d[p + 3] = Math.round(((dist - 38) / 30) * 255);
            }
          }
        }

        ctx.putImageData(frame, 0, 0);
      }

      rafRef.current = requestAnimationFrame(renderFrame);
    };

    video.play().catch(() => {});
    rafRef.current = requestAnimationFrame(renderFrame);

    return () => {
      isCancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [src]);

  return (
    <>
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="fixed top-0 left-0 w-px h-px opacity-0 pointer-events-none -z-50"
      />
      <canvas
        ref={canvasRef}
        className={className}
        style={style}
      />
    </>
  );
}

export default function WildlifeRoamingOverlay() {
  // Stream 1: Cầy vòi hương & Chim Cu gáy (every 30-40 seconds)
  const [activeAnimal, setActiveAnimal] = useState(null);
  // Stream 2: Đôi Chim Chào mào (2 birds together, every 7-10 seconds)
  const [activeBulbulPair, setActiveBulbulPair] = useState(null);

  const animalTimerRef = useRef(null);
  const animalHideTimerRef = useRef(null);
  const lastAnimalIdxRef = useRef(-1);

  const bulbulTimerRef = useRef(null);
  const bulbulHideTimerRef = useRef(null);

  // Stream 1 effect: Cầy vòi hương & Chim Cu gáy
  useEffect(() => {
    let isFirst = true;

    const scheduleNextAnimal = (delayMs) => {
      animalTimerRef.current = setTimeout(() => {
        const nextIdx = isFirst ? 0 : (lastAnimalIdxRef.current + 1) % GROUND_AND_DOVE.length;
        isFirst = false;
        lastAnimalIdxRef.current = nextIdx;

        const chosen = GROUND_AND_DOVE[nextIdx];
        const goRight = nextIdx === 0 ? true : Math.random() > 0.4;
        const topPercent = chosen.category === 'bird' ? Math.floor(18 + Math.random() * 18) : null;

        setActiveAnimal({
          ...chosen,
          key: `animal_${Date.now()}`,
          goRight,
          topPercent,
        });

        animalHideTimerRef.current = setTimeout(() => {
          setActiveAnimal(null);
          // Next appearance in 30 to 40 seconds
          const nextDelay = 30000 + Math.floor(Math.random() * 10000);
          scheduleNextAnimal(nextDelay);
        }, chosen.durationMs + 400);
      }, delayMs);
    };

    scheduleNextAnimal(3000);

    return () => {
      if (animalTimerRef.current) clearTimeout(animalTimerRef.current);
      if (animalHideTimerRef.current) clearTimeout(animalHideTimerRef.current);
    };
  }, []);

  // Stream 2 effect: Pair of Chim Chào mào flying together every 7-10 seconds
  useEffect(() => {
    const scheduleNextBulbul = (delayMs) => {
      bulbulTimerRef.current = setTimeout(() => {
        const goRight = Math.random() > 0.35;
        const baseTop = Math.floor(10 + Math.random() * 18); // 10% - 28%
        const secondTop = baseTop + (Math.random() > 0.5 ? 5 : -4);

        setActiveBulbulPair({
          key: `bulbul_pair_${Date.now()}`,
          goRight,
          durationMs: BULBUL_CONFIG.durationMs,
          birds: [
            {
              id: 'b1',
              topPercent: Math.max(6, baseTop),
              delayMs: 0,
              sizeClass: 'w-32 sm:w-40 md:w-44 h-auto',
              glideDuration: '2.1s',
            },
            {
              id: 'b2',
              topPercent: Math.max(6, secondTop),
              delayMs: 600,
              sizeClass: 'w-28 sm:w-36 md:w-40 h-auto',
              glideDuration: '2.5s',
            },
          ],
        });

        bulbulHideTimerRef.current = setTimeout(() => {
          setActiveBulbulPair(null);
          // Next pair in 7 to 10 seconds
          const nextDelay = 7000 + Math.floor(Math.random() * 3000);
          scheduleNextBulbul(nextDelay);
        }, BULBUL_CONFIG.durationMs + 900);
      }, delayMs);
    };

    // Start first pair after 6 seconds
    scheduleNextBulbul(6000);

    return () => {
      if (bulbulTimerRef.current) clearTimeout(bulbulTimerRef.current);
      if (bulbulHideTimerRef.current) clearTimeout(bulbulHideTimerRef.current);
    };
  }, []);

  if (!activeAnimal && !activeBulbulPair) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-40 overflow-hidden print:hidden"
      aria-hidden="true"
    >
      <style>{`
        @keyframes roamRight {
          0% { transform: translateX(-260px); }
          100% { transform: translateX(calc(100vw + 260px)); }
        }
        @keyframes roamLeft {
          0% { transform: translateX(calc(100vw + 260px)); }
          100% { transform: translateX(-260px); }
        }
        @keyframes birdGlide {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-16px); }
        }
      `}</style>

      {/* Stream 1: Cầy vòi hương or Chim Cu gáy */}
      {activeAnimal && (() => {
        const isBeast = activeAnimal.category === 'beast';
        const flipX = activeAnimal.facingLeftByDefault ? !activeAnimal.goRight : activeAnimal.goRight;
        return (
          <div
            key={activeAnimal.key}
            className="absolute left-0"
            style={{
              bottom: isBeast ? '8px' : undefined,
              top: !isBeast ? `${activeAnimal.topPercent}%` : undefined,
              animation: `${activeAnimal.goRight ? 'roamRight' : 'roamLeft'} ${activeAnimal.durationMs}ms linear forwards`,
            }}
          >
            <div
              style={{
                animation: !isBeast ? 'birdGlide 2.2s ease-in-out infinite' : undefined,
              }}
            >
              <TransparentVideoCanvas
                src={activeAnimal.src}
                className={`${activeAnimal.sizeClass} object-contain select-none drop-shadow-[0_6px_12px_rgba(0,0,0,0.22)]`}
                style={{
                  transform: flipX ? 'scaleX(1)' : 'scaleX(-1)',
                }}
              />
            </div>
          </div>
        );
      })()}

      {/* Stream 2: Pair of 2 Chim Chào mào flying together */}
      {activeBulbulPair && activeBulbulPair.birds.map((bird) => (
        <div
          key={`${activeBulbulPair.key}_${bird.id}`}
          className="absolute left-0"
          style={{
            top: `${bird.topPercent}%`,
            transform: activeBulbulPair.goRight ? 'translateX(-260px)' : 'translateX(calc(100vw + 260px))',
            animation: `${activeBulbulPair.goRight ? 'roamRight' : 'roamLeft'} ${activeBulbulPair.durationMs}ms linear ${bird.delayMs}ms forwards`,
          }}
        >
          <div
            style={{
              animation: `birdGlide ${bird.glideDuration} ease-in-out infinite`,
            }}
          >
            <TransparentVideoCanvas
              src={BULBUL_CONFIG.src}
              className={`${bird.sizeClass} object-contain select-none drop-shadow-[0_6px_12px_rgba(0,0,0,0.22)]`}
              style={{
                transform: activeBulbulPair.goRight ? 'scaleX(1)' : 'scaleX(-1)',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
