import { useEffect, useState } from 'react'

function useCountUp(target, duration = 1000, delay = 0, isFloat = false) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => {
      let start = null
      const step = (timestamp) => {
        if (!start) start = timestamp
        const progress = Math.min((timestamp - start) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 2)
        const raw = eased * target
        setValue(isFloat ? parseFloat(raw.toFixed(1)) : Math.round(raw))
        if (progress < 1) requestAnimationFrame(step)
        else setValue(isFloat ? parseFloat(target.toFixed(1)) : target)
      }
      requestAnimationFrame(step)
    }, delay)
    return () => clearTimeout(t)
  }, [target, duration, delay, isFloat])
  return value
}

function StatCard({ label, value, icon, color, delay, suffix = '', isFloat = false }) {
  const animated = useCountUp(value, 900, delay, isFloat)

  const colorMap = {
    purple: { bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.2)', text: '#a78bfa', glow: 'rgba(139,92,246,0.15)' },
    green:  { bg: 'rgba(34,197,94,0.08)',  border: 'rgba(34,197,94,0.2)',  text: '#4ade80', glow: 'rgba(34,197,94,0.15)'  },
    red:    { bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.2)',  text: '#f87171', glow: 'rgba(239,68,68,0.15)'  },
    blue:   { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.2)', text: '#60a5fa', glow: 'rgba(59,130,246,0.15)' },
  }
  const c = colorMap[color] || colorMap.purple

  return (
    <div
      className="glass-card glow-hover p-5 flex flex-col gap-3"
      style={{
        borderColor: c.border,
        '--glow-color': c.glow,
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
        style={{ background: c.bg, border: `1px solid ${c.border}` }}
      >
        {icon}
      </div>
      <div>
        <div
          className="text-3xl font-black leading-none"
          style={{
            color: c.text,
            textShadow: `0 0 24px ${c.glow}`,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {animated}{suffix}
        </div>
        <div
          className="text-xs font-medium mt-1.5 leading-snug"
          style={{ color: 'rgba(255,255,255,0.45)' }}
        >
          {label}
        </div>
      </div>
    </div>
  )
}

export default function StatCards({ data }) {
  const {
    matched_skills = [],
    extra_skills = [],
    missing_skills = [],
    total_job_skills = 0,
    total_missing = 0,
    skill_match_percent = 0,
  } = data

  const totalResumeSkills = matched_skills.length + extra_skills.length

  const stats = [
    {
      label: 'Skills in Resume',
      value: totalResumeSkills,
      icon: '📄',
      color: 'purple',
      delay: 100,
    },
    {
      label: 'Skills Required by Job',
      value: total_job_skills,
      icon: '💼',
      color: 'blue',
      delay: 200,
    },
    {
      label: 'Skills You\'re Missing',
      value: total_missing || missing_skills.length,
      icon: '❗',
      color: 'red',
      delay: 300,
    },
    {
      label: 'Skill Coverage',
      value: skill_match_percent,
      icon: '📊',
      color: 'green',
      delay: 400,
      suffix: '%',
      isFloat: true,
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((s) => (
        <StatCard key={s.label} {...s} isFloat={s.isFloat || false} />
      ))}
    </div>
  )
}
