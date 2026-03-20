import { MessageSquare, FileText, ArrowRight } from 'lucide-react';

interface SuggestedFollowupsProps {
  suggestions: { text: string; icon: 'chat' | 'doc' }[];
  onSelect: (text: string) => void;
}

export function SuggestedFollowups({ suggestions, onSelect }: SuggestedFollowupsProps) {
  return (
    <div className="mt-4 pt-2">
      <p className="text-[13px] text-[#9CA3AF] mb-2">Suggested follow-ups</p>
      <div className="flex flex-col">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => onSelect(s.text)}
            className="group flex items-center gap-3 px-1 py-2.5 text-left border-t border-[#F0F0F0] first:border-t-0 hover:bg-[#FAFAFA] transition-colors rounded-sm"
          >
            {s.icon === 'chat' ? (
              <MessageSquare className="w-4 h-4 text-[#9CA3AF] flex-shrink-0" />
            ) : (
              <FileText className="w-4 h-4 text-[#9CA3AF] flex-shrink-0" />
            )}
            <span className="flex-1 text-[14px] text-[#4B5563]">{s.text}</span>
            <ArrowRight className="w-4 h-4 text-[#9CA3AF] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}

// Generate context-relevant follow-up suggestions based on the conversation content
export function getFollowupSuggestions(
  content: string,
  options?: {
    dsoChart?: boolean;
    confirmationCard?: any;
    checklistCard?: any;
    actionConfirmationCard?: any;
    canvasWidgetId?: string;
  }
): { text: string; icon: 'chat' | 'doc' }[] {
  const lower = content.toLowerCase();

  // DSO / overdue invoices
  if (options?.dsoChart || (lower.includes('overdue') && lower.includes('invoice')) || lower.includes('dso')) {
    return [
      { text: 'Which customers have the oldest overdue invoices?', icon: 'chat' },
      { text: 'Send payment reminders to all overdue accounts.', icon: 'chat' },
      { text: 'Generate an aging report for accounts receivable.', icon: 'doc' },
    ];
  }

  // Checklist
  if (options?.checklistCard || lower.includes('checklist')) {
    return [
      { text: 'Assign this checklist to a team member.', icon: 'chat' },
      { text: 'Add a deadline for each checklist item.', icon: 'chat' },
      { text: 'Create a similar checklist for post-installation.', icon: 'doc' },
    ];
  }

  // Module creation / confirmation
  if (options?.confirmationCard) {
    const moduleType = options.confirmationCard.moduleType || '';
    return [
      { text: `Show me all recent ${moduleType}s.`, icon: 'chat' },
      { text: `What's the status of my open ${moduleType}s?`, icon: 'chat' },
      { text: `Generate a ${moduleType} summary report.`, icon: 'doc' },
    ];
  }

  // Canvas widgets
  if (options?.canvasWidgetId) {
    const widgetSuggestions: Record<string, { text: string; icon: 'chat' | 'doc' }[]> = {
      'weather': [
        { text: 'Which job sites are affected by weather this week?', icon: 'chat' },
        { text: 'Reschedule outdoor jobs due to rain forecast.', icon: 'chat' },
        { text: 'Generate a weather impact report for the week.', icon: 'doc' },
      ],
      'customers': [
        { text: 'Which customers have pending quotes?', icon: 'chat' },
        { text: 'Show me customer satisfaction trends.', icon: 'chat' },
        { text: 'Generate a customer activity report.', icon: 'doc' },
      ],
      'email': [
        { text: 'Summarize my unread emails.', icon: 'chat' },
        { text: 'Draft a follow-up for the oldest unanswered email.', icon: 'chat' },
        { text: 'Generate a weekly email digest.', icon: 'doc' },
      ],
      'line-chart': [
        { text: 'What\'s driving the revenue trend this quarter?', icon: 'chat' },
        { text: 'Compare revenue across service categories.', icon: 'chat' },
        { text: 'Generate a revenue forecast for next month.', icon: 'doc' },
      ],
      'bar-chart': [
        { text: 'Which months had the highest revenue?', icon: 'chat' },
        { text: 'Break down revenue by project type.', icon: 'chat' },
        { text: 'Generate a quarterly revenue comparison.', icon: 'doc' },
      ],
      'tasks-table': [
        { text: 'Which tasks are overdue?', icon: 'chat' },
        { text: 'Reassign tasks for better workload balance.', icon: 'chat' },
        { text: 'Generate a task completion report.', icon: 'doc' },
      ],
      'performance': [
        { text: 'How does this compare to last quarter?', icon: 'chat' },
        { text: 'Which team is performing best?', icon: 'chat' },
        { text: 'Generate a performance improvement plan.', icon: 'doc' },
      ],
      'team': [
        { text: 'Who is available for new assignments?', icon: 'chat' },
        { text: 'Show team utilization rates.', icon: 'chat' },
        { text: 'Generate a team capacity report.', icon: 'doc' },
      ],
    };
    return widgetSuggestions[options.canvasWidgetId] || getDefaultSuggestions(lower);
  }

  // Revenue / business performance
  if (lower.includes('revenue') || lower.includes('performance') || lower.includes('business')) {
    return [
      { text: 'Break down revenue by service category.', icon: 'chat' },
      { text: 'Compare this quarter to the same period last year.', icon: 'chat' },
      { text: 'Generate a business performance report.', icon: 'doc' },
    ];
  }

  // Jobs / completion
  if (lower.includes('job') || lower.includes('completion') || lower.includes('task')) {
    return [
      { text: 'Which jobs are at risk of missing their deadline?', icon: 'chat' },
      { text: 'Show me team workload distribution.', icon: 'chat' },
      { text: 'Generate a job completion trend report.', icon: 'doc' },
    ];
  }

  // Team
  if (lower.includes('team') || lower.includes('crew') || lower.includes('staff')) {
    return [
      { text: 'Who has the highest job completion rate?', icon: 'chat' },
      { text: 'Show overtime hours by team member.', icon: 'chat' },
      { text: 'Generate a team performance scorecard.', icon: 'doc' },
    ];
  }

  // Quote
  if (lower.includes('quote') || lower.includes('proposal') || lower.includes('estimate')) {
    return [
      { text: 'Which quotes are about to expire?', icon: 'chat' },
      { text: 'What\'s our quote-to-close conversion rate?', icon: 'chat' },
      { text: 'Generate a quotes pipeline report.', icon: 'doc' },
    ];
  }

  return getDefaultSuggestions(lower);
}

function getDefaultSuggestions(_content: string): { text: string; icon: 'chat' | 'doc' }[] {
  return [
    { text: 'How is my business doing this week?', icon: 'chat' },
    { text: 'Show me items that need my attention.', icon: 'chat' },
    { text: 'Generate a weekly business summary.', icon: 'doc' },
  ];
}