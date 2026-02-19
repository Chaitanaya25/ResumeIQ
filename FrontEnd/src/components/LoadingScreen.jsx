export default function LoadingScreen({ message }) {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-50"
      style={{ background: '#07071a' }}
    >
      {/* Ambient orbs */}
      <div
        className="absolute rounded-full"
        style={{
          width: 400,
          height: 400,
          background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'float 6s ease-in-out infinite',
        }}
      />

      <div className="relative flex flex-col items-center gap-8 px-6 text-center">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #8b5cf6)',
              boxShadow: '0 0 40px rgba(124,58,237,0.5)',
            }}
          >
            🧠
          </div>
          <span
            className="text-2xl font-black gradient-text tracking-tight"
          >
            ResumeIQ
          </span>
        </div>

        {/* Spinning ring */}
        <div className="relative w-24 h-24">
          {/* Outer ring */}
          <svg
            className="absolute inset-0 animate-spin"
            style={{ animationDuration: '2s' }}
            width="96"
            height="96"
            viewBox="0 0 96 96"
          >
            <circle
              cx="48"
              cy="48"
              r="40"
              fill="none"
              stroke="rgba(139,92,246,0.12)"
              strokeWidth="4"
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              fill="none"
              stroke="url(#spinGrad)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="251"
              strokeDashoffset="188"
            />
            <defs>
              <linearGradient id="spinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#c4b5fd" />
              </linearGradient>
            </defs>
          </svg>

          {/* Inner ring (opposite spin) */}
          <svg
            className="absolute inset-0"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 52,
              height: 52,
              animation: 'spin 1.4s linear infinite reverse',
            }}
            viewBox="0 0 52 52"
          >
            <circle
              cx="26"
              cy="26"
              r="20"
              fill="none"
              stroke="rgba(139,92,246,0.08)"
              strokeWidth="3"
            />
            <circle
              cx="26"
              cy="26"
              r="20"
              fill="none"
              stroke="#8b5cf6"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="125"
              strokeDashoffset="100"
              opacity="0.7"
            />
          </svg>

          {/* Center pulse dot */}
          <div
            className="absolute rounded-full pulse-slow"
            style={{
              width: 16,
              height: 16,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle, #8b5cf6, #6d28d9)',
              boxShadow: '0 0 20px rgba(139,92,246,0.6)',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          />
        </div>

        {/* Message */}
        <div className="flex flex-col items-center gap-3">
          <p
            className="text-lg font-semibold transition-all duration-500"
            style={{ color: 'rgba(255,255,255,0.85)' }}
          >
            {message}
          </p>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
            This usually takes a few seconds
          </p>
        </div>

        {/* Bouncing dots */}
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full dot-1"
            style={{ background: '#8b5cf6' }}
          />
          <div
            className="w-2.5 h-2.5 rounded-full dot-2"
            style={{ background: '#a78bfa' }}
          />
          <div
            className="w-2.5 h-2.5 rounded-full dot-3"
            style={{ background: '#c4b5fd' }}
          />
        </div>

        {/* Skeleton preview cards */}
        <div className="w-full max-w-md grid grid-cols-2 gap-3 mt-2 opacity-60">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="skeleton rounded-xl"
              style={{ height: 72 }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
