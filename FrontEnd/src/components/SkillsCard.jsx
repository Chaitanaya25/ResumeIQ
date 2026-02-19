import { useEffect, useState } from 'react'

function SkillBadge({ skill, color }) {
  const styles = {
    matched: {
      bg: 'rgba(34,197,94,0.1)',
      border: 'rgba(34,197,94,0.25)',
      text: '#4ade80',
      dot: '#22c55e',
    },
    missing: {
      bg: 'rgba(239,68,68,0.1)',
      border: 'rgba(239,68,68,0.25)',
      text: '#f87171',
      dot: '#ef4444',
    },
    extra: {
      bg: 'rgba(59,130,246,0.1)',
      border: 'rgba(59,130,246,0.25)',
      text: '#60a5fa',
      dot: '#3b82f6',
    },
    warning: {
      bg: 'rgba(234,179,8,0.1)',
      border: 'rgba(234,179,8,0.25)',
      text: '#facc15',
      dot: '#eab308',
    },
  }
  const s = styles[color]
  return (
    <span
      className="skill-badge"
      style={{
        background: s.bg,
        border: `1px solid ${s.border}`,
        color: s.text,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full mr-1.5 flex-shrink-0"
        style={{ background: s.dot, display: 'inline-block' }}
      />
      {skill.charAt(0).toUpperCase() + skill.slice(1)}
    </span>
  )
}

function SkillRow({ label, skills, color, icon }) {
  if (!skills || skills.length === 0) return null
  return (
    <div>
      <div className="flex items-center gap-2 mb-2.5">
        <span className="text-base">{icon}</span>
        <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.65)' }}>
          {label}
        </span>
        <span
          className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium"
          style={{
            background: color === 'matched' ? 'rgba(34,197,94,0.1)'
              : color === 'missing'  ? 'rgba(239,68,68,0.1)'
              : color === 'warning'  ? 'rgba(234,179,8,0.1)'
              : 'rgba(59,130,246,0.1)',
            color: color === 'matched' ? '#4ade80'
              : color === 'missing'   ? '#f87171'
              : color === 'warning'   ? '#facc15'
              : '#60a5fa',
          }}
        >
          {skills.length}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map((s) => (
          <SkillBadge key={s} skill={s} color={color} />
        ))}
      </div>
    </div>
  )
}

export default function SkillsCard({ matchPercent = 0, matched = [], missing = [], extra = [], missingKeywords = [], totalJob = 0, totalMatched = 0 }) {
  const [progressWidth, setProgressWidth] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setProgressWidth(matchPercent), 300)
    return () => clearTimeout(t)
  }, [matchPercent])

  const color =
    matchPercent >= 76 ? '#22c55e'
    : matchPercent >= 56 ? '#eab308'
    : matchPercent >= 36 ? '#f97316'
    : '#ef4444'

  const bgColor =
    matchPercent >= 76 ? 'rgba(34,197,94,0.08)'
    : matchPercent >= 56 ? 'rgba(234,179,8,0.08)'
    : matchPercent >= 36 ? 'rgba(249,115,22,0.08)'
    : 'rgba(239,68,68,0.08)'

  return (
    <div className="glass-card glow-hover p-6 md:p-7 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base" style={{ color: '#fff' }}>
            Skill Match Overview
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {totalMatched} of {totalJob} required skills detected
          </p>
        </div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
          style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.2)' }}
        >
          🎯
        </div>
      </div>

      {/* Progress section */}
      <div>
        <div className="flex items-end justify-between mb-2">
          <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Skill Match Percentage
          </span>
          <span className="text-2xl font-black" style={{ color, textShadow: `0 0 20px ${color}66` }}>
            {matchPercent.toFixed(1)}%
          </span>
        </div>

        {/* Progress bar track */}
        <div
          className="w-full rounded-full overflow-hidden"
          style={{
            height: 10,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div
            className="h-full rounded-full progress-fill"
            style={{
              width: `${progressWidth}%`,
              background: `linear-gradient(90deg, ${color}99, ${color})`,
              boxShadow: `0 0 12px ${color}88`,
            }}
          />
        </div>

        {/* Segment labels */}
        <div className="flex justify-between mt-1.5">
          {['0%', '25%', '50%', '75%', '100%'].map((l) => (
            <span key={l} className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
              {l}
            </span>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.05)' }} />

      {/* Skill rows */}
      <div className="flex flex-col gap-5">
        <SkillRow
          label="Matched Skills"
          skills={matched}
          color="matched"
          icon="✅"
        />
        <SkillRow
          label="Missing Skills"
          skills={missing}
          color="missing"
          icon="❌"
        />
        <SkillRow
          label="Bonus Skills"
          skills={extra}
          color="extra"
          icon="💡"
        />
        <SkillRow
          label="Missing Keywords"
          skills={missingKeywords}
          color="warning"
          icon="🔍"
        />
      </div>

      {/* Empty state */}
      {(!matched?.length && !missing?.length && !extra?.length && !missingKeywords?.length) && (
        <p className="text-sm text-center" style={{ color: 'rgba(255,255,255,0.3)' }}>
          No skills data available.
        </p>
      )}
    </div>
  )
}
