import { useState } from 'react'
import LandingPage from './components/LandingPage'
import LoadingScreen from './components/LoadingScreen'
import ResultsDashboard from './components/ResultsDashboard'

const API_BASE = 'https://resumeiq-backend.onrender.com'
```


export default function App() {
  const [view, setView] = useState('landing') // 'landing' | 'loading' | 'results' | 'error'
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const [loadingMsg, setLoadingMsg] = useState('Analyzing your resume...')

  const LOADING_MESSAGES = [
    'Parsing your resume...',
    'Extracting skills with AI...',
    'Matching against job description...',
    'Calculating relevance scores...',
    'Generating your report...',
  ]

  const handleAnalyze = async ({ file, jobDescription }) => {
    if (!file) {
      setError('Please upload a resume file (PDF or DOCX).')
      setView('error')
      return
    }
    if (!jobDescription.trim()) {
      setError('Please paste a job description.')
      setView('error')
      return
    }

    setView('loading')
    setError(null)

    // Cycle loading messages
    let msgIdx = 0
    setLoadingMsg(LOADING_MESSAGES[0])
    const msgTimer = setInterval(() => {
      msgIdx = (msgIdx + 1) % LOADING_MESSAGES.length
      setLoadingMsg(LOADING_MESSAGES[msgIdx])
    }, 2200)

    try {
      const formData = new FormData()
      formData.append('resume', file)
      formData.append('job_description', jobDescription)

      const res = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        body: formData,
      })

      clearInterval(msgTimer)

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData?.detail || `Server error: ${res.status}`)
      }

      const data = await res.json()

      if (!data.success) {
        throw new Error('Analysis failed. Please try again.')
      }

      setResults(data)
      setView('results')
    } catch (err) {
      clearInterval(msgTimer)
      setError(err.message || 'An unexpected error occurred.')
      setView('error')
    }
  }

  const handleReset = () => {
    setView('landing')
    setResults(null)
    setError(null)
  }

  return (
    <div className="min-h-screen" style={{ background: '#07071a' }}>
      {/* Ambient background orbs */}
      <div
        className="orb fixed"
        style={{
          width: 600,
          height: 600,
          background: 'radial-gradient(circle, rgba(124,58,237,0.14) 0%, transparent 70%)',
          top: '-200px',
          left: '-200px',
        }}
      />
      <div
        className="orb fixed"
        style={{
          width: 500,
          height: 500,
          background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
          bottom: '-150px',
          right: '-150px',
          animationDelay: '3s',
        }}
      />

      {view === 'landing' && (
        <LandingPage onAnalyze={handleAnalyze} />
      )}

      {view === 'loading' && (
        <LoadingScreen message={loadingMsg} />
      )}

      {view === 'results' && results && (
        <ResultsDashboard results={results} onReset={handleReset} />
      )}

      {view === 'error' && (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div
            className="glass-card glow-hover max-w-md w-full p-8 text-center"
            style={{ borderColor: 'rgba(239,68,68,0.3)' }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)' }}
            >
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                <path
                  d="M12 8v5m0 3h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className="text-xl font-700 mb-2" style={{ fontWeight: 700, color: '#fca5a5' }}>
              Analysis Failed
            </h2>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {error}
            </p>
            <button
              onClick={handleReset}
              className="btn-primary px-6 py-3 text-white text-sm w-full"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
