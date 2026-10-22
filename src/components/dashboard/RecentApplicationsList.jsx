import React from 'react';
import { Building2, ChevronRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';
import { formatDisplayDate } from '../../utils/dateUtils';

export default function RecentApplicationsList({ 
  applications = [], 
  onSelectApplication 
}) {
  const recent = applications.slice(0, 5);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-100">
                Recent Applications
              </h3>
              <p className="text-xs text-slate-400">
                Latest submissions and entries
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

        {recent.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            <p>No applications logged yet.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {recent.map((app) => (
              <div
                key={app.id}
                onClick={() => onSelectApplication(app)}
                className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between gap-3 cursor-pointer transition-all"
              >
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-xs text-slate-200 flex items-center gap-1.5 truncate">
                    <Building2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                    <span className="truncate">{app.companyName}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {app.jobTitle}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                    {formatDisplayDate(app.applicationDate)}
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <StatusBadge status={app.status} size="xs" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {applications.length > 5 && (
        <div className="pt-3 border-t border-slate-800/80 text-center">
          <Link
            to="/applications"
            className="text-xs text-slate-400 hover:text-indigo-400"
          >
            +{applications.length - 5} more in application manager
          </Link>
        </div>
      )}
    </div>
  );
}
