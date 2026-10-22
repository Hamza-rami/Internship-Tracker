import React from 'react';
import { AlertCircle, Clock, CheckCircle2, Calendar, Building2, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDisplayDate } from '../../utils/dateUtils';
import { Link } from 'react-router-dom';

export default function FollowUpCard({ onSelectApplication }) {
  const { stats, markFollowUpComplete } = useApp();

  const overdue = stats.overdueFollowUps || [];
  const upcoming = stats.upcomingFollowUps || [];
  const allFollowUps = [...overdue, ...upcoming];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              overdue.length > 0 
                ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400' 
                : 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400'
            }`}>
              {overdue.length > 0 ? (
                <AlertCircle className="w-4 h-4" />
              ) : (
                <Clock className="w-4 h-4" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-100 flex items-center gap-2">
                Actionable Follow-Ups
                {overdue.length > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {overdue.length} Overdue
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400">
                Keep recruiters engaged and stay top-of-mind
              </p>
            </div>
          </div>

          <Link
            to="/applications"
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {allFollowUps.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            <CheckCircle2 className="w-8 h-8 text-emerald-500/40 mx-auto mb-2" />
            <p className="font-medium text-slate-400">All caught up!</p>
            <p className="mt-0.5">No pending or overdue follow-ups right now.</p>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {allFollowUps.slice(0, 5).map((app) => {
              const status = app.followUpStatus;
              const isOverdue = status?.type === 'overdue';

              return (
                <div
                  key={app.id}
                  onClick={() => onSelectApplication(app)}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                    isOverdue
                      ? 'bg-rose-950/20 border-rose-800/40 hover:border-rose-700'
                      : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 font-semibold text-xs text-slate-200 truncate">
                      <Building2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                      <span className="truncate">{app.companyName}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {app.jobTitle}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[10px]">
                      <span className={`px-2 py-0.5 rounded-full font-medium border ${status?.badgeClass}`}>
                        {status?.label}
                      </span>
                      <span className="text-slate-500">
                        Scheduled: {formatDisplayDate(app.nextFollowUpDate)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      markFollowUpComplete(app.id, '');
                    }}
                    className="px-2.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded-lg text-xs font-medium border border-emerald-500/30 transition-all flex items-center gap-1 flex-shrink-0"
                    title="Mark Done"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Done</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {allFollowUps.length > 5 && (
        <div className="pt-3 border-t border-slate-800/80 text-center">
          <Link
            to="/applications"
            className="text-xs text-slate-400 hover:text-indigo-400"
          >
            +{allFollowUps.length - 5} more follow-ups in applications
          </Link>
        </div>
      )}
    </div>
  );
}
