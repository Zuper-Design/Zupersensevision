import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Lock, Globe, Circle, FileText, Database, Users, Zap } from 'lucide-react';
import logoCircles from '../../imports/logo-circles.svg';
import { SenseLogo } from './SenseLogo';

interface ResearchStep {
  id: string;
  text: string;
  icon?: 'lock' | 'globe' | 'dot' | 'file' | 'database' | 'users' | 'zap';
  timestamp?: string;
  tags?: string[];
}

interface ResearchTopic {
  id: string;
  title: string;
  steps: ResearchStep[];
  status?: 'in-progress' | 'completed';
}

interface ResearchDisplayProps {
  topics: ResearchTopic[];
  isActive?: boolean;
  onComplete?: () => void;
  forceCollapse?: boolean;
}

const iconMap = {
  lock: Lock,
  globe: Globe,
  dot: Circle,
  file: FileText,
  database: Database,
  users: Users,
  zap: Zap,
};

const TypewriterText: React.FC<{ text: string; onComplete?: () => void }> = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, Math.random() * 8 + 3); // 3-11ms per character (faster)

      return () => clearTimeout(timeout);
    } else if (currentIndex === text.length && !hasCompleted) {
      setHasCompleted(true);
      if (onComplete) {
        onComplete();
      }
    }
  }, [currentIndex, text, hasCompleted, onComplete]);

  return <span>{displayedText}</span>;
};

const TagBadge: React.FC<{ tag: string }> = ({ tag }) => {
  // Check if it's an email or name
  const isEmail = tag.includes('@');
  const displayText = isEmail ? tag : tag;
  
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F3F4F6] rounded-md text-[11px] text-[#6B7280] font-medium">
      {displayText}
    </span>
  );
};

export const ResearchDisplay: React.FC<ResearchDisplayProps> = ({ topics, isActive = true, onComplete, forceCollapse }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [visibleSteps, setVisibleSteps] = useState<string[]>([]);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [allStepsComplete, setAllStepsComplete] = useState(false);
  const [thinkingDuration, setThinkingDuration] = useState(0);
  const [thinkingStartTime] = useState(() => Date.now());

  // Track thinking duration
  useEffect(() => {
    if (allStepsComplete) return;
    const interval = setInterval(() => {
      setThinkingDuration(Math.round((Date.now() - thinkingStartTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [allStepsComplete, thinkingStartTime]);

  // Capture final duration when complete
  useEffect(() => {
    if (allStepsComplete && thinkingDuration === 0) {
      setThinkingDuration(Math.max(1, Math.round((Date.now() - thinkingStartTime) / 1000)));
    }
  }, [allStepsComplete]);

  // Flatten all steps from all topics for sequential display
  const allSteps = topics.flatMap(topic => 
    topic.steps.map(step => ({ ...step, topicTitle: topic.title }))
  );

  // Sequential reveal of steps
  useEffect(() => {
    if (!isActive || allStepsComplete) return;

    let currentStepIndex = 0;

    const revealNextStep = () => {
      if (currentStepIndex >= allSteps.length) {
        setAllStepsComplete(true);
        return;
      }

      const step = allSteps[currentStepIndex];
      setVisibleSteps(prev => [...prev, step.id]);
      currentStepIndex++;
    };

    // Start revealing first step immediately
    revealNextStep();

    return () => {};
  }, [isActive, allSteps.length]);

  // Force collapse when the response content is generated
  useEffect(() => {
    if (forceCollapse && !isCollapsed) {
      setIsCollapsed(true);
      setAllStepsComplete(true);
    }
  }, [forceCollapse]);

  // Handle step completion (after typewriter finishes)
  const handleStepComplete = (stepId: string) => {
    setCompletedSteps(prev => {
      const newSet = new Set(prev);
      newSet.add(stepId);
      return newSet;
    });

    // After a step completes, reveal next step after a short delay
    const currentIndex = allSteps.findIndex(s => s.id === stepId);
    if (currentIndex < allSteps.length - 1 && isActive) {
      setTimeout(() => {
        const nextStep = allSteps[currentIndex + 1];
        setVisibleSteps(prev => {
          if (!prev.includes(nextStep.id)) {
            return [...prev, nextStep.id];
          }
          return prev;
        });
      }, 300); // Faster delay before showing next step
    } else if (currentIndex === allSteps.length - 1) {
      // All steps complete
      setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
      }, 500);
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="py-2">
      {/* Collapsed View - Simple text (clickable to expand) */}
      {isCollapsed ? (
        <button
          onClick={toggleCollapse}
          className="group hover:opacity-80 transition-opacity text-left"
        >
          <div className="inline-flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-[#6B7280]" />
            <p className="text-[13px] text-[#6B7280] font-medium">
              Analyzed {allSteps.length} data points across Jobs, Customer, Organisation, and Quotes modules
            </p>
          </div>
        </button>
      ) : (
        <>
          {/* Header with collapse icon - only shown when expanded */}
          <button
            onClick={toggleCollapse}
            className="flex items-center gap-1.5 mb-4 group hover:opacity-80 transition-opacity"
          >
            <ChevronDown className="w-4 h-4 text-[#9CA3AF]" />
            
            {/* Thinking Logo with Animation */}
            {isActive && !allStepsComplete && (
              <div className="w-8 h-8 flex items-center justify-center">
                <SenseLogo size={32} animated={true} />
              </div>
            )}
            
            {/* Static Logo - shown when complete */}
            {allStepsComplete && (
              null
            )}
            
            <h3 className="text-[16px] font-normal text-[#9CA3AF]">
              {allStepsComplete ? `Thought for ${thinkingDuration} seconds` : 'Thinking'}
            </h3>
          </button>

          {/* Timeline Content - Expanded View */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[7px] top-2 bottom-2 w-[1px] border-l border-dashed border-[#D1D5DB]"></div>
            
            <div className="space-y-4">
              {allSteps.map((step, index) => {
                if (!visibleSteps.includes(step.id)) return null;
                
                const isCompleted = completedSteps.has(step.id);

                return (
                  <div
                    key={step.id}
                    className="relative pl-9 animate-[fadeInUp_0.2s_ease-out]"
                  >
                    {/* Checkbox circle positioned on the timeline */}
                    <div className={`absolute left-0 top-[2px] w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-200 ${
                      isCompleted 
                        ? 'border-[#9CA3AF] bg-[#9CA3AF]' 
                        : 'border-[#E6E8EC] bg-white'
                    }`}>
                      {isCompleted && (
                        <svg 
                          className="w-2.5 h-2.5 text-white" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={3} 
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="space-y-2">
                      <p className="text-[14px] text-[#6B7280] leading-relaxed">
                        <TypewriterText 
                          text={step.text} 
                          onComplete={() => handleStepComplete(step.id)}
                        />
                      </p>
                      
                      {/* Tags - show after text completes */}
                      {step.tags && step.tags.length > 0 && isCompleted && (
                        <div className="flex flex-wrap gap-2 animate-[fadeIn_0.2s_ease-out]">
                          {step.tags.map((tag, idx) => (
                            <TagBadge key={idx} tag={tag} />
                          ))}
                        </div>
                      )}
                      
                      {/* Timestamp */}
                      {step.timestamp && isCompleted && (
                        <p className="text-[11px] text-[#9CA3AF] mt-1 animate-[fadeIn_0.2s_ease-out]">
                          {step.timestamp}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Animation keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes thinking-pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
`;
if (typeof document !== 'undefined' && !document.getElementById('research-display-styles')) {
  style.id = 'research-display-styles';
  document.head.appendChild(style);
}