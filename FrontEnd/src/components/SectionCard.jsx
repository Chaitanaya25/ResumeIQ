import { useState } from 'react'

function ScorePill({ score, variant }) {
  const isStrong = variant === 'strong'
  return (
    <span
      className="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
      style={{
        background: isStrong ? 'rgba(34,197,94,0.12)' : 'rgba(249,115,22,0.12)',
        border: `1px solid ${isStrong ? 'rgba(34,197,94,0.25)' : 'rgba(249,115,22,0.25)'}`,
        color: isStrong ? '#4ade80' : '#fb923c',
      }}
    >
      {score.toFixed(1)}% relevance
    </span>
  )
}

function MiniBar({ score, variant }) {
  const isStrong = variant === 'strong'
  const color = isStrong ? '#22c55e' : '#f97316'
  return (
    <div
      className="w-full rounded-full overflow-hidden mt-2.5"
      style={{ height: 4, background: 'rgba(255,255,255,0.06)' }}
    >
      <div
        className="h-full rounded-full"
        style={{
          width: `${Math.min(score, 100)}%`,
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          transition: 'width 1s ease',
        }}
      />
    </div>
  )
}

function SectionItem({ section, variant, index }) {
  const [expanded, setExpanded] = useState(false)
  const isStrong = variant === 'strong'
  const maxChars = 200
  const text = section.text || ''
  const isLong = text.length > maxChars

  return (
    <div
      className="rounded-2xl p-4 transition-all duration-200"
      style={{
        background: isStrong ? 'rgba(34,197,94,0.04)' : 'rgba(249,115,22,0.04)',
        border: `1px solid ${isStrong ? 'rgba(34,197,94,0.12)' : 'rgba(249,115,22,0.12)'}`,
        animationDelay: `${index * 80}ms`,
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-md flex-shrink-0"
          style={{
            background: isStrong ? 'rgba(34,197,94,0.1)' : 'rgba(249,115,22,0.1)',
            color: isStrong ? '#86efac' : '#fdba74',
          }}
        >
          Section {index + 1}
        </span>
        <ScorePill score={section.score} variant={variant} />
      </div>

      <p
        className="text-sm leading-relaxed"
        style={{ color: 'rgba(255,255,255,0.65)' }}
      >
        {expanded || !isLong ? text : `${text.slice(0, maxChars)}...`}
      </p>

      <MiniBar score={section.score} variant={variant} />

      <div className="flex items-center justify-between mt-2.5">
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
          {isStrong
            ? 'Highly relevant to the job description.'
            : 'Low relevance — consider rewriting or removing.'}
        </p>
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs font-medium ml-4 flex-shrink-0"
            style={{ color: isStrong ? '#4ade80' : '#fb923c' }}
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>
    </div>
  )
}

export default function SectionCard({ sections, variant }) {
  const isStrong = variant === 'strong'

  const config = {
    strong: {
      icon: '✅',
      title: 'Strong Sections — Keep These',
      subtitle: 'These sections closely match the job requirements.',
      accentColor: '#22c55e',
      glowBg: 'rgba(34,197,94,0.06)',
      glowBorder: 'rgba(34,197,94,0.2)',
      headerIcon: '🟢',
    },
    weak: {
      icon: '⚠️',
      title: 'Weak Sections — Consider Improving',
      subtitle: 'These sections have low relevance to the job description.',
      accentColor: '#f97316',
      glowBg: 'rgba(249,115,22,0.06)',
      glowBorder: 'rgba(249,115,22,0.2)',
      headerIcon: '🟠',
    },
  }

  const c = config[variant]

  return (
    <div
      className="glass-card p-6 md:p-7 flex flex-col gap-4 glow-hover"
      style={{
        borderColor: c.glowBorder,
      }}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
          style={{ background: c.glowBg, border: `1px solid ${c.glowBorder}` }}
        >
          {c.icon}
        </div>
        <div>
          <h3 className="font-bold text-base" style={{ color: '#fff' }}>
            {c.title}
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {c.subtitle}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: `rgba(${isStrong ? '34,197,94' : '249,115,22'},0.1)` }} />

      {/* Sections */}
      {sections && sections.length > 0 ? (
        <div className="flex flex-col gap-3">
          {sections.map((section, i) => (
            <SectionItem
              key={i}
              section={section}
              variant={variant}
              index={i}
            />
          ))}
        </div>
      ) : (
        <div
          className="rounded-xl p-6 text-center"
          style={{ background: 'rgba(255,255,255,0.03)' }}
        >
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
            No {isStrong ? 'strong' : 'weak'} sections identified.
          </p>
        </div>
      )}
    </div>
  )
}
