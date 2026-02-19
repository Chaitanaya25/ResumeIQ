import { useEffect, useState } from 'react'
import GaugeChart from './GaugeChart'
import SkillsCard from './SkillsCard'
import StatCards from './StatCards'
import ATSBreakdownCard from './ATSBreakdownCard'

// Staggered fade-in wrapper
function Reveal({ children, delay = 0 }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(t)
  }, [delay])
  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.55s ease, transform 0.55s ease',
      }}
    >
      {children}
    </div>
  )
}

export default function ResultsDashboard({ results, onReset }) {
  const {
    ats_score = 0,
    ats_label = '',
    ats_breakdown = {},
    matched_keywords = [],
    missing_keywords = [],
    matched_skills = [],
    missing_skills = [],
    extra_skills = [],
    skill_match_percent = 0,
    total_job_skills = 0,
    total_matched = 0,
    total_missing = 0,
    word_count = 0,
  } = results

  const scoreColor =
    ats_score >= 80 ? '#22c55e'
    : ats_score >= 60 ? '#eab308'
    : ats_score >= 40 ? '#f97316'
    : '#ef4444'

  const interpretationText =
    ats_score >= 80
      ? `Your resume is a strong match for this position. You have ${total_matched} of the ${total_job_skills} required skills and ${extra_skills.length} bonus skills. Focus on adding the ${missing_keywords.length} missing keywords to clear ATS filters.`
      : ats_score >= 60
      ? `Your resume is a good candidate for this role. You match ${total_matched} of ${total_job_skills} required skills. Adding ${missing_skills.slice(0, 3).join(', ')} and key missing keywords would strengthen your application.`
      : ats_score >= 40
      ? `Your resume partially matches this position. You're missing ${missing_skills.length} key skills and ${missing_keywords.length} important keywords. Tailor your resume language closer to the job description.`
      : `Your resume needs significant tailoring for this role. Focus on incorporating the missing keywords and skills listed below — most ATS systems would filter this resume out before a human sees it.`

  return (
    <div className="min-h-screen">
      {/* Sticky header */}
      <header
        className="sticky top-0 z-40 px-6 py-4 flex items-center justify-between"
        style={{
          background: 'rgba(7,7,26,0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #8b5cf6)' }}
          >
            🧠
          </div>
          <span className="font-bold gradient-text tracking-tight">ResumeIQ</span>
        </div>

        <div className="flex items-center gap-3">
          <div
            className="hidden sm:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
            style={{
              background: 'rgba(34,197,94,0.08)',
              border: '1px solid rgba(34,197,94,0.2)',
              color: '#4ade80',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
            Analysis Complete
          </div>
          <button
            onClick={onReset}
            className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all"
            style={{
              background: 'rgba(139,92,246,0.1)',
              border: '1px solid rgba(139,92,246,0.25)',
              color: '#a78bfa',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(139,92,246,0.2)'
              e.currentTarget.style.boxShadow = '0 0 20px rgba(139,92,246,0.2)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(139,92,246,0.1)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <path d="M1 4v6h6M23 20v-6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Analyze Another
          </button>
        </div>
      </header>

      {/* Page content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 flex flex-col gap-6">

        {/* Hero row — ATS Score gauge + Summary */}
        <Reveal delay={50}>
          <div className="grid md:grid-cols-5 gap-5">
            {/* Gauge card */}
            <div
              className="glass-card glow-hover p-6 md:col-span-2 flex flex-col items-center justify-center gap-4"
              style={{ minHeight: 320 }}
            >
              <div
                className="text-xs font-semibold uppercase tracking-widest mb-1"
                style={{ color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em' }}
              >
                ATS Score
              </div>
              <GaugeChart score={ats_score} />
            </div>

            {/* Right panel */}
            <div className="md:col-span-3 flex flex-col gap-5">
              {/* Overview summary card */}
              <div className="glass-card glow-hover p-6 flex flex-col gap-5">
                <div
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em' }}
                >
                  Analysis Summary
                </div>

                {/* Three key metrics */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'ATS Score',       value: `${ats_score.toFixed(1)}%`,          color: scoreColor },
                    { label: 'Skills Matched',  value: `${total_matched}/${total_job_skills}`, color: '#a78bfa' },
                    { label: 'Skill Coverage',  value: `${skill_match_percent.toFixed(0)}%`,  color: '#60a5fa' },
                  ].map((m) => (
                    <div
                      key={m.label}
                      className="rounded-xl p-4 text-center"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      <div
                        className="text-2xl font-black"
                        style={{ color: m.color, textShadow: `0 0 20px ${m.color}55` }}
                      >
                        {m.value}
                      </div>
                      <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Interpretation */}
                <div
                  className="rounded-xl p-4"
                  style={{ background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.12)' }}
                >
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    {interpretationText}
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="glass-card glow-hover p-5">
                <div
                  className="text-xs font-semibold uppercase tracking-widest mb-4"
                  style={{ color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em' }}
                >
                  Quick Actions
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      icon: '🔑',
                      text: `Add ${missing_keywords.length} missing keywords`,
                      sub: 'to pass ATS keyword filters',
                      color: 'rgba(139,92,246,0.08)',
                      border: 'rgba(139,92,246,0.15)',
                    },
                    {
                      icon: '🎯',
                      text: `Add ${missing_skills.length} missing skills`,
                      sub: 'to your resume',
                      color: 'rgba(239,68,68,0.08)',
                      border: 'rgba(239,68,68,0.15)',
                    },
                    {
                      icon: '✅',
                      text: `${matched_keywords.length} keywords matched`,
                      sub: 'already in your resume',
                      color: 'rgba(34,197,94,0.08)',
                      border: 'rgba(34,197,94,0.15)',
                    },
                    {
                      icon: '💡',
                      text: `${extra_skills.length} bonus skills`,
                      sub: 'differentiate you',
                      color: 'rgba(59,130,246,0.08)',
                      border: 'rgba(59,130,246,0.15)',
                    },
                  ].map((a) => (
                    <div
                      key={a.text}
                      className="rounded-xl p-3"
                      style={{ background: a.color, border: `1px solid ${a.border}` }}
                    >
                      <span className="text-lg">{a.icon}</span>
                      <p className="text-xs font-semibold mt-1" style={{ color: 'rgba(255,255,255,0.75)' }}>
                        {a.text}
                      </p>
                      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                        {a.sub}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ATS Breakdown card */}
        <Reveal delay={180}>
          <ATSBreakdownCard breakdown={ats_breakdown} />
        </Reveal>

        {/* Stat cards row */}
        <Reveal delay={280}>
          <div>
            <div
              className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em' }}
            >
              At a Glance
            </div>
            <StatCards data={results} />
          </div>
        </Reveal>

        {/* Skills card — full width */}
        <Reveal delay={380}>
          <SkillsCard
            matchPercent={skill_match_percent || 0}
            matched={matched_skills}
            missing={missing_skills}
            extra={extra_skills}
            missingKeywords={missing_keywords}
            totalJob={total_job_skills}
            totalMatched={total_matched}
          />
        </Reveal>

        {/* Bottom CTA */}
        <Reveal delay={480}>
          <div
            className="glass-card p-8 text-center flex flex-col items-center gap-4"
            style={{ borderColor: 'rgba(139,92,246,0.2)' }}
          >
            <div className="text-2xl">🚀</div>
            <h3 className="text-lg font-bold" style={{ color: '#fff' }}>
              Ready to improve your resume?
            </h3>
            <p className="text-sm max-w-md" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Apply the insights above, then re-run the analysis to track your ATS score improvement.
            </p>
            <button
              onClick={onReset}
              className="btn-primary text-white px-8 py-3 text-sm mt-1"
            >
              Analyze Another Resume
            </button>
          </div>
        </Reveal>
      </main>
    </div>
  )
}
