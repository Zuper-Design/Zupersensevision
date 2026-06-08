import { useState } from 'react';
import { MessageSquare, FileText, ArrowRight, ChevronDown } from 'lucide-react';

type Suggestion = { short: string; full: string; icon: 'chat' | 'doc' };

interface SuggestedFollowupsProps {
  suggestions: Suggestion[];
  onSelect: (text: string) => void;
}

export function SuggestedFollowups({ suggestions, onSelect }: SuggestedFollowupsProps) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className={`rounded-[20px] border border-[#E6E8EC] bg-[#FAFAFB] shadow-[0_1px_2px_rgba(0,0,0,0.03)] px-3 transition-[padding] duration-200 ${collapsed ? 'py-0.5' : 'pt-1 pb-1.5'}`}>
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        aria-expanded={!collapsed}
        className="w-full flex items-center justify-between px-2 py-2 text-left group"
      >
        <span className="text-[13px] font-medium text-[#6B7280]">Suggested follow-ups</span>
        <ChevronDown
          className={`w-4 h-4 text-[#9CA3AF] group-hover:text-[#6B7280] transition-transform duration-200 ease-out ${collapsed ? '' : 'rotate-180'}`}
        />
      </button>
      {/* grid 1fr→0fr gives a smooth height collapse without measuring */}
      <div
        className="grid transition-[grid-template-rows] duration-200 ease-out"
        style={{ gridTemplateRows: collapsed ? '0fr' : '1fr' }}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col">
            {suggestions.slice(0, 3).map((s, i) => (
              <button
                key={i}
                onClick={() => onSelect(s.full)}
                tabIndex={collapsed ? -1 : 0}
                className="group flex items-center gap-3 px-2 py-2.5 text-left border-t border-[#EEEEF1] first:border-t-0 hover:bg-[#F2F3F5] transition-colors rounded-sm"
              >
                <MessageSquare className="w-4 h-4 text-[#9CA3AF] flex-shrink-0" />
                <span className="flex-1 text-[14px] text-[#1C1E21] font-medium">{s.full}</span>
                <ArrowRight className="w-4 h-4 text-[#9CA3AF] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function getFollowupSuggestions(
  content: string,
  options?: {
    dsoChart?: boolean;
    confirmationCard?: any;
    checklistCard?: any;
    actionConfirmationCard?: any;
    canvasWidgetId?: string;
  }
): Suggestion[] {
  const lower = content.toLowerCase();

  if (options?.dsoChart || (lower.includes('overdue') && lower.includes('invoice')) || lower.includes('dso')) {
    return [
      { short: 'Different chart', full: 'Show me a different chart for this data.', icon: 'chat' },
      { short: 'Remove unknown', full: 'Remove unknown values from the chart.', icon: 'chat' },
      { short: 'Aging report', full: 'Generate an aging report for accounts receivable.', icon: 'doc' },
    ];
  }

  if (options?.checklistCard || lower.includes('checklist')) {
    return [
      { short: 'Assign to teammate', full: 'Assign this checklist to a team member.', icon: 'chat' },
      { short: 'Add deadlines', full: 'Add a deadline for each checklist item.', icon: 'chat' },
      { short: 'Post-install version', full: 'Create a similar checklist for post-installation.', icon: 'doc' },
    ];
  }

  if (options?.confirmationCard) {
    const moduleType = options.confirmationCard.moduleType || '';
    return [
      { short: `Recent ${moduleType}s`, full: `Show me all recent ${moduleType}s.`, icon: 'chat' },
      { short: `Open ${moduleType} status`, full: `What's the status of my open ${moduleType}s?`, icon: 'chat' },
      { short: `${moduleType} report`, full: `Generate a ${moduleType} summary report.`, icon: 'doc' },
    ];
  }

  if (options?.canvasWidgetId) {
    const widgetSuggestions: Record<string, Suggestion[]> = {
      'weather': [
        { short: 'Affected sites', full: 'Which job sites are affected by weather this week?', icon: 'chat' },
        { short: 'Reschedule rainouts', full: 'Reschedule outdoor jobs due to rain forecast.', icon: 'chat' },
        { short: 'Weather impact', full: 'Generate a weather impact report for the week.', icon: 'doc' },
      ],
      'customers': [
        { short: 'Pending quotes', full: 'Which customers have pending quotes?', icon: 'chat' },
        { short: 'Satisfaction trends', full: 'Show me customer satisfaction trends.', icon: 'chat' },
        { short: 'Activity report', full: 'Generate a customer activity report.', icon: 'doc' },
      ],
      'email': [
        { short: 'Summarize unread', full: 'Summarize my unread emails.', icon: 'chat' },
        { short: 'Follow up oldest', full: 'Draft a follow-up for the oldest unanswered email.', icon: 'chat' },
        { short: 'Weekly digest', full: 'Generate a weekly email digest.', icon: 'doc' },
      ],
      'line-chart': [
        { short: 'Different chart', full: 'Show me a different chart for this data.', icon: 'chat' },
        { short: 'Remove unknown', full: 'Remove unknown values from the chart.', icon: 'chat' },
        { short: 'Forecast next month', full: 'Generate a revenue forecast for next month.', icon: 'doc' },
      ],
      'bar-chart': [
        { short: 'Different chart', full: 'Show me a different chart for this data.', icon: 'chat' },
        { short: 'Remove unknown', full: 'Remove unknown values from the chart.', icon: 'chat' },
        { short: 'Quarter comparison', full: 'Generate a quarterly revenue comparison.', icon: 'doc' },
      ],
      'tasks-table': [
        { short: 'Overdue tasks', full: 'Which tasks are overdue?', icon: 'chat' },
        { short: 'Rebalance load', full: 'Reassign tasks for better workload balance.', icon: 'chat' },
        { short: 'Completion report', full: 'Generate a task completion report.', icon: 'doc' },
      ],
      'performance': [
        { short: 'vs last quarter', full: 'How does this compare to last quarter?', icon: 'chat' },
        { short: 'Top team', full: 'Which team is performing best?', icon: 'chat' },
        { short: 'Improvement plan', full: 'Generate a performance improvement plan.', icon: 'doc' },
      ],
      'team': [
        { short: 'Available members', full: 'Who is available for new assignments?', icon: 'chat' },
        { short: 'Utilization', full: 'Show team utilization rates.', icon: 'chat' },
        { short: 'Capacity report', full: 'Generate a team capacity report.', icon: 'doc' },
      ],
    };
    return widgetSuggestions[options.canvasWidgetId] || getDefaultSuggestions();
  }

  if (lower.includes('revenue') || lower.includes('performance') || lower.includes('business')) {
    return [
      { short: 'Different chart', full: 'Show me a different chart for this data.', icon: 'chat' },
      { short: 'Remove unknown', full: 'Remove unknown values from the chart.', icon: 'chat' },
      { short: 'Performance report', full: 'Generate a business performance report.', icon: 'doc' },
    ];
  }

  if (lower.includes('job') || lower.includes('completion') || lower.includes('task')) {
    return [
      { short: 'At-risk deadlines', full: 'Which jobs are at risk of missing their deadline?', icon: 'chat' },
      { short: 'Workload split', full: 'Show me team workload distribution.', icon: 'chat' },
      { short: 'Completion trends', full: 'Generate a job completion trend report.', icon: 'doc' },
    ];
  }

  if (lower.includes('team') || lower.includes('crew') || lower.includes('staff')) {
    return [
      { short: 'Top completion rate', full: 'Who has the highest job completion rate?', icon: 'chat' },
      { short: 'Overtime by member', full: 'Show overtime hours by team member.', icon: 'chat' },
      { short: 'Scorecard', full: 'Generate a team performance scorecard.', icon: 'doc' },
    ];
  }

  if (lower.includes('quote') || lower.includes('proposal') || lower.includes('estimate')) {
    return [
      { short: 'Expiring soon', full: 'Which quotes are about to expire?', icon: 'chat' },
      { short: 'Win rate', full: "What's our quote-to-close conversion rate?", icon: 'chat' },
      { short: 'Pipeline report', full: 'Generate a quotes pipeline report.', icon: 'doc' },
    ];
  }

  return getDefaultSuggestions();
}

function getDefaultSuggestions(): Suggestion[] {
  return [
    { short: 'Weekly health', full: 'How is my business doing this week?', icon: 'chat' },
    { short: 'Needs attention', full: 'Show me items that need my attention.', icon: 'chat' },
    { short: 'Weekly summary', full: 'Generate a weekly business summary.', icon: 'doc' },
  ];
}
