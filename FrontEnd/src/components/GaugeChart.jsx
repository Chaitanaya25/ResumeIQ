import { useEffect, useRef, useState } from 'react'

// Clean semi-circle arc gauge — no needle, no tick marks
// ViewBox: 340 × 210, center at (170, 165), radius: 125

const RADIUS = 125
const CX = 170
const CY = 165
const STROKE_WIDTH = 22
const ARC_LENGTH = Math.PI * RADIUS // ≈ 392.7

function describeArc(cx, cy, r) {
  return `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`
}

function getGaugeColor(score) {
  if (score < 50) return { primary: '#ef4444', glow: 'rgba(239,68,68,0.5)' }
  if (score < 80) return { primary: '#f97316', glow: 'rgba(249,115,22,0.5)' }
  if (score < 95) return { primary: '#22c55e', glow: 'rgba(34,197,94,0.5)' }
  return { primary: '#7c3aed', glow: 'rgba(124,58,237,0.5)' }
}

function getMatchLabel(score) {
  if (score < 50) return 'Worst Match'
  if (score < 80) return 'Average Match'
  if (score < 95) return 'Good Match'
  return 'Perfect Choice'
}

export default function GaugeChart({ score }) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const animRef = useRef(null)
  const startTimeRef = useRef(null)
  const DURATION = 1400

  useEffect(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current)
    startTimeRef.current = null

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp
      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / DURATION, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      setAnimatedScore(eased * score)
      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate)
      } else {
        setAnimatedScore(score)
      }
    }

    const t = setTimeout(() => {
      animRef.current = requestAnimationFrame(animate)
    }, 200)

    return () => {
      clearTimeout(t)
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [score])

  const colors = getGaugeColor(score)
  const arcPath = describeArc(CX, CY, RADIUS)
  const dashOffset = ARC_LENGTH * (1 - animatedScore / 100)

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: 340, height: 210 }}>
        <svg
          width="340"
          height="210"
          viewBox="0 0 340 210"
          style={{ overflow: 'visible' }}
        >
          {/* Background track */}
          <path
            d={arcPath}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
          />

          {/* Colored foreground arc with CSS glow */}
          <path
            d={arcPath}
            fill="none"
            stroke={colors.primary}
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            strokeDasharray={ARC_LENGTH}
            strokeDashoffset={dashOffset}
            style={{ filter: `drop-shadow(0 0 10px ${colors.primary})` }}
          />

          {/* 0% label — bottom left of arc */}
          <text
            x={CX - RADIUS + 2}
            y={CY + 24}
            fill="rgba(255,255,255,0.3)"
            fontSize="12"
            textAnchor="middle"
            fontFamily="Inter"
          >
            0%
          </text>

          {/* 100% label — bottom right of arc */}
          <text
            x={CX + RADIUS - 2}
            y={CY + 24}
            fill="rgba(255,255,255,0.3)"
            fontSize="12"
            textAnchor="middle"
            fontFamily="Inter"
          >
            100%
          </text>
        </svg>

        {/* Center score + label */}
        <div
          className="absolute flex flex-col items-center"
          style={{
            bottom: 18,
            left: '50%',
            transform: 'translateX(-50%)',
            whiteSpace: 'nowrap',
          }}
        >
          <span
            className="font-black leading-none"
            style={{
              fontSize: '3.5rem',
              color: colors.primary,
              textShadow: `0 0 40px ${colors.glow}`,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {animatedScore.toFixed(1)}
            <span style={{ fontSize: '1.5rem', opacity: 0.8 }}>%</span>
          </span>

          <span
            className="font-semibold mt-1.5"
            style={{
              fontSize: '0.85rem',
              color: colors.primary,
              opacity: 0.85,
              letterSpacing: '0.05em',
            }}
          >
            {getMatchLabel(score)}
          </span>
        </div>
      </div>
    </div>
  )
}
