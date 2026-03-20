import { X, Check, ArrowLeft, Plus, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { useRadar, SavedCard } from './RadarContext';

interface AddToRadarModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardData: Omit<SavedCard, 'id' | 'timestamp'>;
  onSuccess?: (radarName: string, radarEmoji: string) => void;
}

const radarTemplates = [
  {
    id: 'invoice',
    name: 'Invoice Management',
    emoji: '💸',
    description: 'Track invoices, payments, and billing',
  },
  {
    id: 'csr',
    name: 'CSR / Customer Requests',
    emoji: '🎧',
    description: 'Customer service and support tickets',
  },
  {
    id: 'crew',
    name: 'Crew Scheduling',
    emoji: '👷',
    description: 'Team assignments and job scheduling',
  },
  {
    id: 'estimates',
    name: 'Estimates & Quotes',
    emoji: '📋',
    description: 'Pending quotes and estimates',
  },
  {
    id: 'warranty',
    name: 'Warranty Claims',
    emoji: '🛡️',
    description: 'Track warranty requests and repairs',
  },
  {
    id: 'materials',
    name: 'Materials & Inventory',
    emoji: '📦',
    description: 'Stock levels and material orders',
  },
  {
    id: 'blank',
    name: 'Blank Radar',
    emoji: '✨',
    description: 'Start from scratch',
  },
];

type CardSeed = Omit<SavedCard, 'id' | 'timestamp'>;

const templateSeedCards: Record<string, CardSeed[]> = {
  invoice: [
    {
      type: 'chart',
      title: 'Monthly Invoice Volume',
      preview: '143 invoices sent this month — 12% increase from last month. Average invoice value: $4,280.',
      content: { chartType: 'bar', metric: 'invoice_volume', period: 'monthly' },
    },
    {
      type: 'widget',
      title: 'Outstanding Receivables',
      preview: '$127,400 in unpaid invoices across 31 accounts. 8 invoices overdue by 30+ days.',
      content: { metric: 'outstanding_receivables', value: 127400 },
    },
    {
      type: 'chart',
      title: 'Payment Collection Rate',
      preview: '78% of invoices paid within 30 days. DSO trending down from 42 to 36 days over the last quarter.',
      content: { chartType: 'line', metric: 'collection_rate', period: 'quarterly' },
    },
    {
      type: 'card',
      title: 'Top 5 Overdue Accounts',
      preview: 'Henderson Residence ($18,200), Oakwood Commercial ($14,800), Riverside HOA ($12,500) — action needed.',
      content: { type: 'list', category: 'overdue_accounts' },
    },
    {
      type: 'widget',
      title: 'Revenue by Service Type',
      preview: 'Re-roofing: $94K (42%), Repairs: $58K (26%), New installs: $48K (21%), Gutters: $24K (11%).',
      content: { chartType: 'pie', metric: 'revenue_by_service' },
    },
  ],
  csr: [
    {
      type: 'chart',
      title: 'Customer Request Volume',
      preview: '67 new requests this week — peak on Monday (18) and Wednesday (14). Average resolution: 1.8 days.',
      content: { chartType: 'bar', metric: 'csr_volume', period: 'weekly' },
    },
    {
      type: 'widget',
      title: 'Open Tickets Summary',
      preview: '23 open tickets: 5 urgent, 11 normal, 7 low priority. 3 tickets awaiting customer response.',
      content: { metric: 'open_tickets', value: 23 },
    },
    {
      type: 'chart',
      title: 'Customer Satisfaction Score',
      preview: 'CSAT at 4.6/5.0 this month, up from 4.3 last month. Repair jobs rated highest at 4.8.',
      content: { chartType: 'line', metric: 'csat_score', period: 'monthly' },
    },
    {
      type: 'card',
      title: 'Escalated Issues',
      preview: '2 active escalations: leak complaint at 412 Elm St (3 days), warranty dispute on commercial flat roof.',
      content: { type: 'alert', category: 'escalations' },
    },
    {
      type: 'widget',
      title: 'Response Time Metrics',
      preview: 'Avg first response: 2.4 hours. Avg resolution: 1.8 days. SLA compliance: 91%.',
      content: { metric: 'response_time', value: 2.4 },
    },
  ],
  crew: [
    {
      type: 'chart',
      title: 'Crew Utilization Rate',
      preview: '4 out of 6 crews at full capacity this week. Crew B has 2 open slots on Thursday and Friday.',
      content: { chartType: 'bar', metric: 'crew_utilization', period: 'weekly' },
    },
    {
      type: 'widget',
      title: "Today's Job Assignments",
      preview: '12 jobs scheduled today across 6 crews. 3 jobs in North zone, 5 South, 4 East. All crews dispatched.',
      content: { metric: 'daily_assignments', value: 12 },
    },
    {
      type: 'chart',
      title: 'Jobs Completed vs Scheduled',
      preview: '89% completion rate this month. 8 jobs delayed due to weather, 3 rescheduled by customer.',
      content: { chartType: 'line', metric: 'completion_rate', period: 'monthly' },
    },
    {
      type: 'card',
      title: 'Crew Availability This Week',
      preview: 'Crew A: Fully booked | Crew B: 2 slots open | Crew C: Available Friday | Crew D: On PTO Thursday.',
      content: { type: 'schedule', category: 'crew_availability' },
    },
    {
      type: 'widget',
      title: 'Overtime Hours Tracker',
      preview: '34 overtime hours logged this week — Crew A leads with 14 hrs. Budget threshold: 40 hrs.',
      content: { chartType: 'gauge', metric: 'overtime_hours', value: 34 },
    },
  ],
  estimates: [
    {
      type: 'chart',
      title: 'Quote Pipeline Value',
      preview: '$342K in active quotes. $127K awaiting approval, $98K sent this week, $117K in draft stage.',
      content: { chartType: 'bar', metric: 'quote_pipeline', period: 'current' },
    },
    {
      type: 'widget',
      title: 'Win Rate Trend',
      preview: '62% win rate this quarter — up 8% from last quarter. Re-roofing quotes close at 71%.',
      content: { chartType: 'line', metric: 'win_rate', period: 'quarterly' },
    },
    {
      type: 'chart',
      title: 'Average Quote Value',
      preview: 'Avg quote: $8,400. Residential avg: $6,200 | Commercial avg: $18,600. Trending up 5% MoM.',
      content: { chartType: 'line', metric: 'avg_quote_value', period: 'monthly' },
    },
    {
      type: 'card',
      title: 'Quotes Expiring Soon',
      preview: '7 quotes expiring this week totaling $84,000. Top: Henderson re-roof ($22K), Plaza repair ($18K).',
      content: { type: 'alert', category: 'expiring_quotes' },
    },
    {
      type: 'widget',
      title: 'Quote-to-Close Timeline',
      preview: 'Avg days to close: 14 days. Fastest: repair jobs (6 days). Slowest: commercial new builds (28 days).',
      content: { metric: 'quote_timeline', value: 14 },
    },
  ],
  warranty: [
    {
      type: 'chart',
      title: 'Warranty Claims by Month',
      preview: '18 claims this month — 6 shingle defects, 5 workmanship, 4 flashing failures, 3 leak callbacks.',
      content: { chartType: 'bar', metric: 'warranty_claims', period: 'monthly' },
    },
    {
      type: 'widget',
      title: 'Active Claims Status',
      preview: '12 open claims: 4 in inspection, 3 approved for repair, 3 pending manufacturer review, 2 scheduled.',
      content: { metric: 'active_claims', value: 12 },
    },
    {
      type: 'chart',
      title: 'Warranty Cost Trend',
      preview: '$18,400 warranty cost MTD. Down 22% from last month. Avg claim cost: $1,020.',
      content: { chartType: 'line', metric: 'warranty_cost', period: 'quarterly' },
    },
    {
      type: 'card',
      title: 'High-Priority Claims',
      preview: '3 urgent claims: Commercial flat roof leak (filed 2 days ago), residential shingle blow-off, gutter separation.',
      content: { type: 'alert', category: 'priority_claims' },
    },
    {
      type: 'widget',
      title: 'Claims by Roof Type',
      preview: 'Asphalt shingle: 44%, Flat/TPO: 28%, Metal: 16%, Tile: 12%. Shingle claims down from last year.',
      content: { chartType: 'pie', metric: 'claims_by_type' },
    },
  ],
  materials: [
    {
      type: 'chart',
      title: 'Inventory Levels Overview',
      preview: '82% stock health. Low stock alerts on: GAF Timberline HDZ (14 squares left), 4" flashing rolls (6 remaining).',
      content: { chartType: 'bar', metric: 'inventory_levels', period: 'current' },
    },
    {
      type: 'widget',
      title: 'Monthly Material Spend',
      preview: '$47,200 spent this month on materials. Top: shingles ($18K), underlayment ($8.4K), flashing ($6.2K).',
      content: { metric: 'material_spend', value: 47200 },
    },
    {
      type: 'chart',
      title: 'Material Cost Trend',
      preview: 'Avg material cost per job: $3,400 — up 6% this quarter. Shingle prices driving the increase.',
      content: { chartType: 'line', metric: 'material_cost_trend', period: 'quarterly' },
    },
    {
      type: 'card',
      title: 'Pending Purchase Orders',
      preview: '4 POs pending: ABC Supply ($12,400 — arriving Thu), SRS Distribution ($8,600 — arriving Fri).',
      content: { type: 'list', category: 'pending_orders' },
    },
    {
      type: 'widget',
      title: 'Waste & Surplus Tracker',
      preview: '7.2% material waste rate this month — target is 5%. Highest waste on tear-off jobs.',
      content: { chartType: 'gauge', metric: 'waste_rate', value: 7.2 },
    },
  ],
  blank: [],
};

export function AddToRadarModal({ isOpen, onClose, cardData, onSuccess }: AddToRadarModalProps) {
  const [step, setStep] = useState<'select' | 'create'>('select');
  const [selectedRadarId, setSelectedRadarId] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [newRadarName, setNewRadarName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { radars, addRadarWithCards, addCardToRadar } = useRadar();

  useEffect(() => {
    if (step === 'create' && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [step]);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep('select');
        setSelectedRadarId(null);
        setSelectedTemplate(null);
        setNewRadarName('');
      }, 200);
    }
  }, [isOpen]);

  // Auto-fill name when template is selected
  useEffect(() => {
    if (selectedTemplate && !newRadarName) {
      const tmpl = radarTemplates.find((t) => t.id === selectedTemplate);
      if (tmpl && tmpl.id !== 'blank') {
        setNewRadarName(tmpl.name);
      }
    }
  }, [selectedTemplate]);

  const handleAddToExistingRadar = () => {
    if (selectedRadarId) {
      addCardToRadar(selectedRadarId, cardData);
      const radar = radars.find((r) => r.id === selectedRadarId);
      if (onSuccess && radar) {
        onSuccess(radar.name, radar.emoji);
      }
      onClose();
    }
  };

  const handleCreateNewRadar = () => {
    if (!selectedTemplate || !newRadarName.trim()) return;

    const template = radarTemplates.find((t) => t.id === selectedTemplate);
    if (template) {
      const seedCards = templateSeedCards[template.id] || [];
      // Include the card the user wanted to add + template seeds
      const allCards = [cardData, ...seedCards];
      addRadarWithCards(
        { name: newRadarName.trim(), emoji: template.emoji },
        allCards
      );
      if (onSuccess) {
        onSuccess(newRadarName.trim(), template.emoji);
      }
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-[101] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="bg-white rounded-2xl border border-[#E6E8EC] shadow-[0_24px_48px_rgba(0,0,0,0.12)] w-full max-w-md overflow-hidden"
              style={{ fontFamily: 'DM Sans, system-ui, sans-serif' }}
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-[#E6E8EC] flex items-center gap-3">
                {step === 'create' && (
                  <button
                    onClick={() => {
                      setStep('select');
                      setSelectedTemplate(null);
                      setNewRadarName('');
                    }}
                    className="p-1.5 rounded-lg hover:bg-[#F3F4F6] transition-colors duration-150 -ml-1"
                    aria-label="Back"
                  >
                    <ArrowLeft className="w-4 h-4 text-[#6B7280]" />
                  </button>
                )}
                <h2 className="text-[16px] font-semibold text-[#1C1E21] flex-1">
                  {step === 'select' ? 'Add to Radar' : 'Create New Radar'}
                </h2>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-[#F3F4F6] transition-colors duration-150"
                  aria-label="Close"
                >
                  <X className="w-4 h-4 text-[#6B7280]" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {step === 'select' ? (
                    <motion.div
                      key="select-step"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Card being added preview */}
                      <div className="mb-4 px-3 py-2.5 bg-[#F8F9FB] rounded-xl border border-[#E6E8EC]">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            cardData.type === 'chart' ? 'bg-[#3B82F6]' :
                            cardData.type === 'widget' ? 'bg-[#10B981]' :
                            cardData.type === 'card' ? 'bg-[#FD5000]' :
                            'bg-[#6B7280]'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-medium text-[#1C1E21] truncate">{cardData.title}</p>
                          </div>
                          <span className="text-[10px] uppercase tracking-wider text-[#9CA3AF] bg-white px-1.5 py-0.5 rounded border border-[#E6E8EC]">{cardData.type}</span>
                        </div>
                      </div>

                      {/* Radar list label */}
                      <p className="text-[12px] text-[#9CA3AF] uppercase tracking-wider mb-2.5 px-1">Choose a radar</p>

                      {/* Existing Radars */}
                      <div className="space-y-1.5 mb-4">
                        {radars.map((radar) => (
                          <button
                            key={radar.id}
                            onClick={() => setSelectedRadarId(radar.id)}
                            className={`w-full px-4 py-3 rounded-xl border transition-all duration-150 text-left flex items-center justify-between group ${
                              selectedRadarId === radar.id
                                ? 'border-[#FD5000] bg-[#FFF4ED]'
                                : 'border-[#E6E8EC] hover:border-[#D1D5DB] hover:bg-[#F8F9FB]'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-[20px]">{radar.emoji}</span>
                              <div>
                                <p className="text-[14px] font-medium text-[#1C1E21]">{radar.name}</p>
                                <p className="text-[12px] text-[#9CA3AF]">
                                  {radar.cardCount} {radar.cardCount === 1 ? 'card' : 'cards'}
                                </p>
                              </div>
                            </div>
                            {selectedRadarId === radar.id ? (
                              <div className="w-5 h-5 rounded-full bg-[#FD5000] flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-full border-2 border-[#D1D5DB] group-hover:border-[#9CA3AF] transition-colors" />
                            )}
                          </button>
                        ))}
                      </div>

                      {/* Create New Radar Button */}
                      <button
                        onClick={() => setStep('create')}
                        className="w-full px-4 py-3 rounded-xl border-2 border-dashed border-[#D1D5DB] hover:border-[#FD5000] hover:bg-[#FFF4ED] transition-all duration-150 flex items-center justify-center gap-2 group"
                      >
                        <Plus className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#FD5000] transition-colors" />
                        <span className="text-[14px] font-medium text-[#6B7280] group-hover:text-[#FD5000] transition-colors">Add a new radar</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#9CA3AF] group-hover:text-[#FD5000] transition-colors" />
                      </button>

                      {/* Add Button */}
                      <button
                        onClick={handleAddToExistingRadar}
                        disabled={!selectedRadarId}
                        className={`w-full mt-5 px-4 py-3 rounded-xl font-medium text-[14px] transition-all duration-150 ${
                          selectedRadarId
                            ? 'bg-[#FD5000] text-white hover:bg-[#E04800] shadow-[0_4px_12px_rgba(253,80,0,0.3)]'
                            : 'bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed'
                        }`}
                      >
                        Add to Radar
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="create-step"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Name Input */}
                      <div className="mb-5">
                        <label className="text-[12px] text-[#9CA3AF] uppercase tracking-wider mb-2 block px-1">Radar name</label>
                        <input
                          ref={inputRef}
                          type="text"
                          value={newRadarName}
                          onChange={(e) => setNewRadarName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && selectedTemplate && newRadarName.trim()) {
                              handleCreateNewRadar();
                            }
                          }}
                          placeholder="e.g. Q1 Invoice Tracking"
                          className="w-full px-4 py-3 rounded-xl bg-[#F8F9FB] border border-[#E6E8EC] text-[14px] text-[#1C1E21] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#FD5000] focus:bg-white focus:shadow-[0_0_0_3px_rgba(253,80,0,0.08)] transition-all duration-150"
                        />
                      </div>

                      {/* Template Picker */}
                      <div className="mb-5">
                        <label className="text-[12px] text-[#9CA3AF] uppercase tracking-wider mb-2.5 block px-1">Choose a template</label>
                        <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1 scrollbar-auto-hide">
                          {radarTemplates.map((template) => {
                            const seedCount = (templateSeedCards[template.id] || []).length;
                            const isSelected = selectedTemplate === template.id;
                            return (
                              <button
                                key={template.id}
                                onClick={() => {
                                  setSelectedTemplate(template.id);
                                  if (!newRadarName && template.id !== 'blank') {
                                    setNewRadarName(template.name);
                                  }
                                }}
                                className={`w-full px-4 py-3 rounded-xl border transition-all duration-150 text-left ${
                                  isSelected
                                    ? 'border-[#FD5000] bg-[#FFF4ED]'
                                    : 'border-[#E6E8EC] hover:border-[#D1D5DB] hover:bg-[#F8F9FB]'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-[20px] flex-shrink-0">{template.emoji}</span>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-[14px] font-medium text-[#1C1E21] mb-0.5">{template.name}</p>
                                    <p className="text-[12px] text-[#9CA3AF]">
                                      {template.description}
                                      {seedCount > 0 && (
                                        <span className="text-[#6B7280]"> · {seedCount} starter cards</span>
                                      )}
                                    </p>
                                  </div>
                                  {isSelected ? (
                                    <div className="w-5 h-5 rounded-full bg-[#FD5000] flex items-center justify-center flex-shrink-0">
                                      <Check className="w-3 h-3 text-white" />
                                    </div>
                                  ) : (
                                    <div className="w-5 h-5 rounded-full border-2 border-[#D1D5DB] flex-shrink-0" />
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Seed cards preview */}
                      {selectedTemplate && selectedTemplate !== 'blank' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.2 }}
                          className="mb-5 overflow-hidden"
                        >
                          <p className="text-[12px] text-[#9CA3AF] uppercase tracking-wider mb-2 px-1">Included starter cards</p>
                          <div className="space-y-1 max-h-[120px] overflow-y-auto scrollbar-auto-hide">
                            {(templateSeedCards[selectedTemplate] || []).map((card, i) => (
                              <div key={i} className="flex items-center gap-2 px-3 py-2 bg-[#F8F9FB] rounded-lg">
                                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                  card.type === 'chart' ? 'bg-[#3B82F6]' :
                                  card.type === 'widget' ? 'bg-[#10B981]' :
                                  'bg-[#FD5000]'
                                }`} />
                                <span className="text-[12px] text-[#1C1E21] truncate flex-1">{card.title}</span>
                                <span className="text-[10px] text-[#9CA3AF] uppercase">{card.type}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* Create Button */}
                      <button
                        onClick={handleCreateNewRadar}
                        disabled={!selectedTemplate || !newRadarName.trim()}
                        className={`w-full px-4 py-3 rounded-xl font-medium text-[14px] transition-all duration-150 ${
                          selectedTemplate && newRadarName.trim()
                            ? 'bg-[#FD5000] text-white hover:bg-[#E04800] shadow-[0_4px_12px_rgba(253,80,0,0.3)]'
                            : 'bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed'
                        }`}
                      >
                        {selectedTemplate && selectedTemplate !== 'blank'
                          ? `Create with ${(templateSeedCards[selectedTemplate] || []).length + 1} cards`
                          : 'Create Radar'
                        }
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}