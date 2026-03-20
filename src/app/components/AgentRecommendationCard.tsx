import { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronRight, Bot, Check, Loader2 } from 'lucide-react';

const COLLECTION_ASSISTANT_AVATAR = 'https://cdn.prod.website-files.com/5e51c674258ffe10d286d30a/5e535d314600800f758ffa34_peep-99.svg';

interface AgentRecommendationCardProps {
  onHireAgent?: () => void;
}

type DeployPhase = 'idle' | 'initializing' | 'connecting' | 'deploying' | 'done';

const deploySteps: { phase: DeployPhase; label: string; duration: number }[] = [
  { phase: 'initializing', label: 'Initializing agent…', duration: 1000 },
  { phase: 'connecting', label: 'Connecting to your invoice data…', duration: 1200 },
  { phase: 'deploying', label: 'Adding to Canvas…', duration: 1000 },
  { phase: 'done', label: 'Agent is live', duration: 800 },
];

export function AgentRecommendationCard({ onHireAgent }: AgentRecommendationCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [deployPhase, setDeployPhase] = useState<DeployPhase>('idle');
  const [completedSteps, setCompletedSteps] = useState<DeployPhase[]>([]);
  const onHireAgentRef = useRef(onHireAgent);
  const firedRef = useRef(false);

  useEffect(() => {
    onHireAgentRef.current = onHireAgent;
  }, [onHireAgent]);

  useEffect(() => {
    if (deployPhase === 'idle') return;
    if (firedRef.current) return;

    const currentIndex = deploySteps.findIndex(s => s.phase === deployPhase);
    if (currentIndex === -1) return;

    const step = deploySteps[currentIndex];
    const timer = setTimeout(() => {
      setCompletedSteps(prev => [...prev, step.phase]);
      const next = deploySteps[currentIndex + 1];
      if (next) {
        setDeployPhase(next.phase);
      } else {
        // All done — fire callback after a brief pause
        firedRef.current = true;
        setTimeout(() => {
          onHireAgentRef.current?.();
        }, 600);
      }
    }, step.duration);

    return () => clearTimeout(timer);
  }, [deployPhase]);

  const handleHire = () => {
    if (deployPhase !== 'idle') return;
    setDeployPhase('initializing');
  };

  const isDeploying = deployPhase !== 'idle';

  return (
    <div className="w-full rounded-xl border border-[#E6E8EC] bg-white overflow-hidden transition-all duration-200">
      {/* Header */}
      <style>{`
        @keyframes agent-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(253, 80, 0, 0); }
          50% { box-shadow: 0 0 12px 2px rgba(253, 80, 0, 0.08); }
        }
        .agent-glow-pulse {
          animation: agent-glow 3s ease-in-out infinite;
        }
        @keyframes deploy-fade-in {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .deploy-step-enter {
          animation: deploy-fade-in 0.3s ease-out forwards;
        }
        @keyframes subtle-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .deploy-pulse {
          animation: subtle-pulse 1.2s ease-in-out infinite;
        }
        @keyframes check-pop {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
        .check-pop {
          animation: check-pop 0.3s ease-out forwards;
        }
      `}</style>
      <button
        onClick={() => !isDeploying && setExpanded(!expanded)}
        className={`${!isDeploying && !expanded ? 'agent-glow-pulse' : ''} w-full flex items-center gap-4 px-4 py-3.5 text-left hover:bg-[#FAFAFA] transition-colors rounded-xl`}
      >
        {/* Avatar */}
        <div className="flex-shrink-0 w-[48px] h-[48px] rounded-lg overflow-hidden bg-[#B6E3F4]" style={{ borderRadius: '8px' }}>
          <img src={COLLECTION_ASSISTANT_AVATAR} alt="Collection Assistant" className="w-full h-full object-cover mt-1.5" />
        </div>
        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-[#1C1E21] text-[15px]" style={{ fontWeight: 600 }}>
            Ryan
          </p>
          <p className="text-[#6B7280] mt-0.5 text-[13px]">
            Collection Assistant · Automates follow-ups and keeps cash flowing.
          </p>
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            {['Invoice tracking', 'Follow-ups', 'DSO reduction'].map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-full bg-[#F3F4F6] text-[#6B7280] text-[11px]"
                style={{ fontWeight: 500 }}
              >
                {tag}
              </span>
            ))}
            <span className="px-2 py-0.5 rounded-full bg-[#F3F4F6] text-[#9CA3AF] text-[11px]" style={{ fontWeight: 500 }}>
              +2
            </span>
          </div>
        </div>
        {/* Play / Expand button */}
        <div className="flex-shrink-0">
          <div className="flex-shrink-0 text-[#9CA3AF]">
            {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </div>
        </div>
      </button>

      {/* Expanded */}
      {expanded && (
        <div className="px-5 pb-5">
          <div className="border-t border-[#F0F0F0] pt-5">
            {/* What Ryan does */}
            <p className="text-[#1C1E21] text-[13px] mb-3" style={{ fontWeight: 600 }}>What Ryan does</p>

            {!isDeploying ? (
              <>
                <ul className="space-y-2 mb-5">
                  <li className="text-[#6B7280] text-[14px]">· Sends reminders before invoices go overdue</li>
                  <li className="text-[#6B7280] text-[14px]">· Flags high-risk accounts early</li>
                  <li className="text-[#6B7280] text-[14px]">· Reduces DSO by up to <span style={{ fontWeight: 600, color: '#1C1E21' }}>20 days</span></li>
                </ul>

                {/* Before/After Projection */}
                <div className="mb-5">
                  <div className="space-y-0">
                    <div className="flex items-center justify-between py-2">
                      <span className="text-[13px] text-[#6B7280]">DSO by June</span>
                      <div className="flex items-center gap-3">
                        <span className="text-[13px] text-[#9CA3AF] line-through">87 days</span>
                        <span className="text-[13px] text-[#1C1E21]" style={{ fontWeight: 600 }}>→ 44 days</span>
                      </div>
                    </div>
                    <div className="h-px bg-[#F0F0F0]"></div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-[13px] text-[#6B7280]">Monthly cash collected</span>
                      <div className="flex items-center gap-3">
                        <span className="text-[13px] text-[#9CA3AF] line-through">~$38K</span>
                        <span className="text-[13px] text-[#1C1E21]" style={{ fontWeight: 600 }}>→ ~$84K</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button 
                    onClick={handleHire}
                    className="px-4 py-2 rounded-lg bg-[#1C1E21] text-white text-[12px] transition-all hover:bg-[#2D2F33] active:scale-[0.98]" style={{ fontWeight: 600 }}>
                    Run Agent
                  </button>
                </div>
              </>
            ) : (
              /* Deploy Animation */
              <div className="py-2">
                <div className="space-y-0">
                  {deploySteps.map((step, i) => {
                    const isCompleted = completedSteps.includes(step.phase);
                    const isCurrent = deployPhase === step.phase && !isCompleted;
                    const isVisible = isCurrent || isCompleted || deploySteps.findIndex(s => s.phase === deployPhase) >= i;

                    if (!isVisible) return null;

                    return (
                      <div key={step.phase} className="deploy-step-enter flex items-center gap-3 py-2">
                        <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                          {isCompleted ? (
                            <div className="check-pop w-5 h-5 rounded-full bg-[#10B981] flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" strokeWidth={3} />
                            </div>
                          ) : isCurrent ? (
                            <Loader2 className="w-4 h-4 text-[#9CA3AF] animate-spin" />
                          ) : null}
                        </div>
                        <span className={`text-[13px] transition-colors duration-300 ${
                          isCompleted 
                            ? 'text-[#1C1E21]' 
                            : isCurrent 
                              ? 'text-[#6B7280] deploy-pulse' 
                              : 'text-[#9CA3AF]'
                        }`} style={{ fontWeight: isCompleted || (step.phase === 'done' && isCompleted) ? 500 : 400 }}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}