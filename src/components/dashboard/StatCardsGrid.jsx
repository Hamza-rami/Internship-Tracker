import React from 'react';
import { 
  Briefcase, 
  Send, 
  CalendarDays, 
  Clock, 
  MessageSquare, 
  Award, 
  XCircle, 
  Percent, 
  HelpCircle 
} from 'lucide-react';

export default function StatCardsGrid({ stats }) {
  const cards = [
    {
      title: 'Total Applications',
      value: stats.total,
      subtext: `${stats.totalSubmitted} submitted, ${stats.total - stats.totalSubmitted} planning`,
      icon: Briefcase,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    },
    {
      title: 'Sent This Week',
      value: stats.sentThisWeek,
      subtext: `Target: ${stats.weeklyGoal} (${stats.weeklyProgress}%)`,
      icon: Send,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    },
    {
      title: 'Sent This Month',
      value: stats.sentThisMonth,
      subtext: 'Cumulative monthly applications',
      icon: CalendarDays,
      color: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    },
    {
      title: 'Awaiting Response',
      value: stats.awaitingResponse,
      subtext: 'Applied & Follow-up in progress',
      icon: Clock,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'Interviews Scheduled',
      value: stats.interviewsScheduled,
      subtext: `${stats.interviewConversionRate}% interview rate`,
      icon: MessageSquare,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    },
    {
      title: 'Offers Received',
      value: stats.offersReceived,
      subtext: stats.offersReceived > 0 ? 'Offer secured! 🎉' : 'Your offer is coming',
      icon: Award,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'Rejections',
      value: stats.rejections,
      subtext: 'Stepping stones to improvement',
      icon: XCircle,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    },
    {
      title: 'Response Rate',
      value: `${stats.responseRate}%`,
      subtext: 'Interviews + Tech + Offers + Rejections / Total Sent',
      icon: Percent,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      tooltip: 'Calculated as: (Applications that received an explicit reply [Interview, Tech Assessment, Offer, or Rejection] ÷ Total Submitted Applications) × 100.'
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm hover:border-slate-700/80 transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                {card.title}
                {card.tooltip && (
                  <span title={card.tooltip} className="cursor-help">
                    <HelpCircle className="w-3 h-3 text-slate-500 hover:text-slate-300" />
                  </span>
                )}
              </span>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center border ${card.color}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>

            <div>
              <div className="text-2xl font-bold font-mono text-slate-100 tracking-tight">
                {card.value}
              </div>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                {card.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
