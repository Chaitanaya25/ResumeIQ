import { useEffect, useState } from 'react'

const COMPONENTS = [
  {
    key: 'keyword_match',
    label: 'Keyword Match',
    weight: 40,
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.08)',
    border: 'rgba(139,92,246,0.2)',
    icon: '🔑',
    desc: 'JD keywords found in your resume',
  },
  {
    key: 'skill_coverage',
    label: 'Skill Coverage',
    weight: 30,
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.08)',
    border: 'rgba(34,197,94,0.2)',
    icon: '🎯',
    desc: 'Required skills matched from skill dictionary',
  },
  {
    key: 'section_structure',
    label: 'Section Structure',
    weight: 15,
    color: '#60a5fa',
    bg: 'rgba(96,165,250,0.08)',
    border: 'rgba(96,165,250,0.2)',
    icon: '📋',
    desc: 'Presence of key resume sections',
  },
  {
    key: 'achievements',
    label: 'Achievements',
    weight: 15,
    color: '#f97316',
    bg: 'rgba(249,115,22,0.08)',
    border: 'rgba(249,115,22,0.2)',
    icon: '🏆',
    desc: 'Quantifiable results and action words',
  },
]

function BreakdownRow({ component, scoreData, index }) {
  const [width, setWidth] = useState(0)
  const score = scoreData?.score ?? 0

  useEffect(() => {
    const t = setTimeout(() => setWidth(score), 300 + index * 100)
    return () => clearTimeout(t)
  }, [score, index])

  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: component.bg,
        border: `1px solid ${component.border}`,
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-base">{component.icon}</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>
                {component.label}
              </span>
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{
                  background: `${component.color}22`,
                  border: `1px solid ${component.color}44`,
                  color: component.color,
                }}
              >
                {component.weight}%
              </span>
            </div>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
              {component.desc}
            </span>
          </div>
        </div>
        <span
          className="text-xl font-black flex-shrink-0 ml-3"
          style={{
            color: component.color,
            textShadow: `0 0 20px ${component.color}55`,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {score.toFixed(0)}%
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height: 6, background: 'rgba(255,255,255,0.06)' }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${width}%`,
            background: `linear-gradient(90deg, ${component.color}88, ${component.color})`,
            boxShadow: `0 0 8px ${component.color}66`,
            transition: 'width 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        />
      </div>
    </div>
  )
}

export default function ATSBreakdownCard({ breakdown = {} }) {
  return (
    <div className="glass-card glow-hover p-6 md:p-7">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-bold text-base" style={{ color: '#fff' }}>
            ATS Score Breakdown
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
            How your ATS score was calculated across 4 weighted components
          </p>
        </div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
          style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.2)' }}
        >
          📊
        </div>
      </div>

      {/* Weight formula */}
      <div
        className="flex flex-wrap items-center gap-2 mb-5 p-3 rounded-xl text-xs"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <span style={{ color: 'rgba(255,255,255,0.4)' }}>Score =</span>
        {COMPONENTS.map((c, i) => (
          <span key={c.key} className="flex items-center gap-1">
            <span style={{ color: c.color, fontWeight: 600 }}>{c.weight}%</span>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>{c.label}</span>
            {i < COMPONENTS.length - 1 && (
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>+</span>
            )}
          </span>
        ))}
      </div>

      {/* Component rows */}
      <div className="grid sm:grid-cols-2 gap-3">
        {COMPONENTS.map((comp, i) => (
          <BreakdownRow
            key={comp.key}
            component={comp}
            scoreData={breakdown[comp.key]}
            index={i}
          />
        ))}
      </div>
    </div>
  )
}
