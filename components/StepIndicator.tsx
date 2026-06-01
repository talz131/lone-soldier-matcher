type Props = {
  currentStep: number
  totalSteps: number
  steps: string[]
  color: string
}

export default function StepIndicator({ currentStep, totalSteps, steps, color }: Props) {
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100

  return (
    <div className="mb-10">
      <div className="relative flex items-start justify-between">
        {/* Track background */}
        <div className="absolute left-0 right-0 top-4 h-0.5 bg-[#e8e0d4]" />
        {/* Track fill */}
        <div
          className="absolute left-0 top-4 h-0.5 transition-all duration-500"
          style={{ backgroundColor: color, width: `${progress}%` }}
        />
        {steps.map((step, index) => {
          const n = index + 1
          const done = n < currentStep
          const active = n === currentStep

          return (
            <div key={step} className="relative z-10 flex flex-col items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                style={
                  done || active
                    ? { backgroundColor: color, color: '#fff' }
                    : { backgroundColor: '#fff', border: '2px solid #d4c9b8', color: '#888' }
                }
              >
                {done ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : n}
              </div>
              <span
                className="text-xs font-medium whitespace-nowrap"
                style={{ color: active ? '#0B2818' : '#888' }}
              >
                {step}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
