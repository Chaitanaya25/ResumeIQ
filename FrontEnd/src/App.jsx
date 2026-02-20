import { useState } from 'react'
import LandingPage from './components/LandingPage'
import LoadingScreen from './components/LoadingScreen'
import ResultsDashboard from './components/ResultsDashboard'

const API_BASE = 'https://resumeiq-nffq.onrender.com'

export default function App() {
  const [view, setView] = useState('landing')
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
      {view === 'landing' && <LandingPage onAnalyze={handleAnalyze} />}
      {view === 'loading' && <LoadingScreen message={loadingMsg} />}
      {view === 'results' && results && (
        <ResultsDashboard results={results} onReset={handleReset} />
      )}
      {view === 'error' && (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-md w-full p-8 text-center">
            <h2 className="text-xl font-bold mb-2 text-red-400">
              Analysis Failed
            </h2>
            <p className="text-sm mb-6 text-gray-400">{error}</p>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-purple-600 text-white text-sm w-full rounded"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  )
}