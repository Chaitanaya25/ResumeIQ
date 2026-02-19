import { useState, useRef, useCallback } from 'react'

const ACCEPTED_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
const ACCEPTED_EXT = ['.pdf', '.docx']

function FileIcon() {
  return (
    <svg width="36" height="36" fill="none" viewBox="0 0 24 24">
      <path
        d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
        stroke="url(#fileGrad)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 2v6h6M16 13H8M16 17H8M10 9H8"
        stroke="url(#fileGrad)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="fileGrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function CheckCircle() {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <path
        d="M22 11.08V12a10 10 0 11-5.93-9.14"
        stroke="#4ade80"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 4L12 14.01l-3-3"
        stroke="#4ade80"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function XIcon({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="ml-auto flex items-center justify-center w-6 h-6 rounded-full transition-colors"
      style={{ background: 'rgba(239,68,68,0.1)' }}
    >
      <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
        <path d="M18 6L6 18M6 6l12 12" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </button>
  )
}

export default function LandingPage({ onAnalyze }) {
  const [file, setFile] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [jobDescription, setJobDescription] = useState('')
  const [fileError, setFileError] = useState('')
  const [jdError, setJdError] = useState('')
  const fileInputRef = useRef(null)

  const validateFile = (f) => {
    if (!f) return false
    const isValidType = ACCEPTED_TYPES.includes(f.type) ||
      ACCEPTED_EXT.some(ext => f.name.toLowerCase().endsWith(ext))
    if (!isValidType) {
      setFileError('Only PDF and DOCX files are accepted.')
      return false
    }
    if (f.size > 10 * 1024 * 1024) {
      setFileError('File size must be under 10 MB.')
      return false
    }
    setFileError('')
    return true
  }

  const handleFileChange = (f) => {
    if (validateFile(f)) setFile(f)
    else setFile(null)
  }

  const onInputChange = (e) => {
    const f = e.target.files?.[0]
    if (f) handleFileChange(f)
  }

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files?.[0]
    if (f) handleFileChange(f)
  }, [])

  const onDragOver = (e) => { e.preventDefault(); setDragOver(true) }
  const onDragLeave = () => setDragOver(false)

  const handleSubmit = () => {
    let valid = true
    if (!file) { setFileError('Please upload a resume file.'); valid = false }
    if (!jobDescription.trim()) { setJdError('Please paste a job description.'); valid = false }
    if (!valid) return
    onAnalyze({ file, jobDescription })
  }

  const removeFile = () => {
    setFile(null)
    setFileError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 relative z-10">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #8b5cf6)' }}
          >
            🧠
          </div>
          <span className="text-lg font-bold gradient-text tracking-tight">ResumeIQ</span>
        </div>
        <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
          <span className="w-2 h-2 rounded-full bg-green-400 inline-block" style={{ boxShadow: '0 0 6px #4ade80' }} />
          API Online
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center px-4 pt-10 pb-16 relative z-10">
        {/* Badge */}
        <div
          className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-6"
          style={{
            background: 'rgba(124,58,237,0.12)',
            border: '1px solid rgba(139,92,246,0.25)',
            color: '#c4b5fd',
          }}
        >
          <span style={{ fontSize: '10px' }}>✦</span>
          AI-Powered Resume Intelligence
          <span style={{ fontSize: '10px' }}>✦</span>
        </div>

        {/* Title */}
        <h1
          className="text-center font-black mb-4 leading-none"
          style={{ fontSize: 'clamp(2.6rem, 6vw, 5rem)', letterSpacing: '-0.03em' }}
        >
          <span className="gradient-text">Analyze.</span>{' '}
          <span style={{ color: '#fff' }}>Match.</span>{' '}
          <span className="gradient-text">Get Hired.</span>
        </h1>

        <p
          className="text-center max-w-xl mb-12 leading-relaxed"
          style={{ color: 'rgba(255,255,255,0.48)', fontSize: '1.05rem' }}
        >
          Upload your resume and paste a job description. Our AI scores your match, identifies
          skill gaps, and pinpoints exactly what to improve — in seconds.
        </p>

        {/* Input card */}
        <div className="glass-card glow-hover w-full max-w-4xl p-8 md:p-10">
          <div className="grid md:grid-cols-2 gap-8">
            {/* File Upload */}
            <div>
              <label
                className="block text-sm font-semibold mb-3"
                style={{ color: 'rgba(255,255,255,0.75)' }}
              >
                Resume File
                <span style={{ color: '#8b5cf6', marginLeft: 4 }}>*</span>
              </label>

              {!file ? (
                <div
                  className={`drop-zone${dragOver ? ' drag-over' : ''} flex flex-col items-center justify-center p-8 cursor-pointer min-h-[200px]`}
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx"
                    className="hidden"
                    onChange={onInputChange}
                  />
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(139,92,246,0.2)' }}
                  >
                    <FileIcon />
                  </div>
                  <p className="text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    Drag & drop your resume here
                  </p>
                  <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    PDF or DOCX · Max 10 MB
                  </p>
                  <div
                    className="px-4 py-2 rounded-lg text-xs font-semibold"
                    style={{
                      background: 'rgba(124,58,237,0.15)',
                      border: '1px solid rgba(139,92,246,0.3)',
                      color: '#a78bfa',
                    }}
                  >
                    Browse Files
                  </div>
                </div>
              ) : (
                <div
                  className="flex items-center gap-3 p-4 rounded-2xl min-h-[200px] flex-col justify-center"
                  style={{
                    background: 'rgba(74,222,128,0.05)',
                    border: '1px solid rgba(74,222,128,0.2)',
                  }}
                >
                  <CheckCircle />
                  <div className="text-center">
                    <p className="text-sm font-semibold" style={{ color: '#4ade80' }}>
                      File Ready
                    </p>
                    <p
                      className="text-xs mt-1 max-w-[180px] truncate"
                      style={{ color: 'rgba(255,255,255,0.55)' }}
                    >
                      {file.name}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <button
                    onClick={removeFile}
                    className="mt-2 text-xs px-3 py-1.5 rounded-lg transition-colors"
                    style={{
                      background: 'rgba(239,68,68,0.1)',
                      border: '1px solid rgba(239,68,68,0.2)',
                      color: '#f87171',
                    }}
                  >
                    Remove File
                  </button>
                </div>
              )}

              {fileError && (
                <p className="mt-2 text-xs" style={{ color: '#f87171' }}>
                  {fileError}
                </p>
              )}
            </div>

            {/* Job Description */}
            <div className="flex flex-col">
              <label
                className="block text-sm font-semibold mb-3"
                style={{ color: 'rgba(255,255,255,0.75)' }}
              >
                Job Description
                <span style={{ color: '#8b5cf6', marginLeft: 4 }}>*</span>
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => { setJobDescription(e.target.value); setJdError('') }}
                placeholder="Paste the full job description here...&#10;&#10;Include responsibilities, requirements,&#10;and preferred qualifications for the&#10;most accurate analysis."
                className="flex-1 resize-none rounded-2xl p-4 text-sm leading-relaxed outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${jdError ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  color: 'rgba(255,255,255,0.85)',
                  minHeight: '200px',
                  caretColor: '#8b5cf6',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(139,92,246,0.5)'
                  e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = jdError ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.08)'
                  e.target.style.boxShadow = 'none'
                }}
              />
              {jdError && (
                <p className="mt-2 text-xs" style={{ color: '#f87171' }}>
                  {jdError}
                </p>
              )}
              <p className="mt-2 text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
                {jobDescription.trim().split(/\s+/).filter(Boolean).length} words
              </p>
            </div>
          </div>

          {/* Submit */}
          <div className="mt-8 flex flex-col items-center gap-4">
            <button
              onClick={handleSubmit}
              className="btn-primary text-white px-12 py-4 text-base w-full md:w-auto min-w-[260px]"
            >
              <span className="flex items-center justify-center gap-3">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Analyze My Resume
              </span>
            </button>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
              Your files are processed securely and never stored.
            </p>
          </div>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-10">
          {[
            { icon: '⚡', label: 'Instant Analysis' },
            { icon: '🎯', label: 'Skill Gap Detection' },
            { icon: '📊', label: 'Match Score' },
            { icon: '🔍', label: 'Section Review' },
          ].map((f) => (
            <div
              key={f.label}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                color: 'rgba(255,255,255,0.5)',
              }}
            >
              <span>{f.icon}</span>
              {f.label}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
