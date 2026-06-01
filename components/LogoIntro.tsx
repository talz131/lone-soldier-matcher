'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

// r=65px circle → circumference = 2π×65 ≈ 408.41
const R = 65
const CIRC = +(2 * Math.PI * R).toFixed(2)

interface Props {
  onComplete: () => void
}

export default function LogoIntro({ onComplete }: Props) {
  const [fading, setFading] = useState(false)

  useEffect(() => {
    // Timeline:
    //   0 ms  → gold circle draws (700 ms)
    // 700 ms  → logo pops in with spring (500 ms)
    // 900 ms  → rays shoot out and fade (700 ms)
    //1300 ms  → logo pulses (350 ms)
    //1700 ms  → overlay starts fading out (600 ms)
    //2300 ms  → done, reveal page content
    const t1 = setTimeout(() => setFading(true), 1700)
    const t2 = setTimeout(onComplete, 2300)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onComplete])

  return (
    <>
      {/* Keyframes scoped to this component — safe because LogoIntro is client-only */}
      <style>{`
        @keyframes lsm-circle {
          from { stroke-dashoffset: ${CIRC}; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes lsm-logo-in {
          from { transform: scale(0.3); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
        @keyframes lsm-pulse {
          0%, 100% { transform: scale(1);    }
          50%      { transform: scale(1.08); }
        }
        @keyframes lsm-rays {
          0%   { transform: scale(0.6); opacity: 0;    }
          30%  { opacity: 0.8; }
          100% { transform: scale(2.4); opacity: 0;    }
        }
      `}</style>

      {/* Full-screen overlay */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: '#F9F6F0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'opacity 0.6s ease',
          opacity: fading ? 0 : 1,
          pointerEvents: fading ? 'none' : 'auto',
        }}
      >
        <div style={{ position: 'relative', width: 160, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

          {/* Gold rays — behind everything, shoot out after logo appears */}
          <svg
            aria-hidden="true"
            style={{
              position: 'absolute', width: 220, height: 220, top: -30, left: -30,
              animation: 'lsm-rays 700ms ease-out 900ms both',
            }}
            viewBox="-110 -110 220 220"
          >
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i * 30 * Math.PI) / 180
              return (
                <line
                  key={i}
                  x1={(Math.cos(a) * 50).toFixed(1)} y1={(Math.sin(a) * 50).toFixed(1)}
                  x2={(Math.cos(a) * 95).toFixed(1)} y2={(Math.sin(a) * 95).toFixed(1)}
                  stroke="#EF9F27" strokeWidth="2.5" strokeLinecap="round"
                />
              )
            })}
          </svg>

          {/* Gold circle drawing itself */}
          <svg
            style={{ position: 'absolute', width: 160, height: 160, top: 0, left: 0 }}
            viewBox="0 0 160 160"
          >
            <circle
              cx="80" cy="80" r={R}
              fill="none"
              stroke="#EF9F27"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={CIRC}
              style={{ animation: 'lsm-circle 700ms cubic-bezier(0.4, 0, 0.2, 1) forwards' }}
            />
          </svg>

          {/* Logo: spring pop-in then pulse */}
          <div style={{
            position: 'relative', zIndex: 2,
            animation: [
              'lsm-logo-in 500ms cubic-bezier(0.34, 1.56, 0.64, 1) 700ms both',
              'lsm-pulse 350ms ease-in-out 1300ms',
            ].join(', '),
          }}>
            <Image
              src="/logo.png"
              alt="Lone Soldier Matcher"
              width={90}
              height={90}
              className="rounded-full shadow-md"
              priority
            />
          </div>
        </div>
      </div>
    </>
  )
}
