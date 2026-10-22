import React, { useState } from 'react';
import StatusBadge from '../common/StatusBadge';
import ConfirmModal from '../common/ConfirmModal';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  AlertCircle,
  Eye,
  User
} from 'lucide-react';
import { formatDisplayDate, getFollowUpStatus } from '../../utils/dateUtils';
import { useApp } from '../../context/AppContext';

export default function ApplicationCards({
  applications,
  onSelectApplication,
  onEditApplication,
}) {
  const { updateApplication, deleteApplication } = useApp();
  const [deleteCandidate, setDeleteCandidate] = useState(null);

  const handleStatusChange = (appId, newStatus) => {
    updateApplication(appId, { status: newStatus });
  };

  const confirmDelete = () => {
    if (deleteCandidate) {
      deleteApplication(deleteCandidate.id);
      setDeleteCandidate(null);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {applications.map((app) => {
          const followUp = app.nextFollowUpDate ? getFollowUpStatus(app.nextFollowUpDate) : null;

          return (
            <div
              key={app.id}
              onClick={() => onSelectApplication(app)}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 flex flex-col justify-between transition-all hover:shadow-lg cursor-pointer group"
            >
              <div>
                {/* Header: Company, Role & Status */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-start gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-1">
                        {app.companyName}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-1">
                        {app.jobTitle}
                      </p>
                    </div>
                  </div>

                  <div onClick={(e) => e.stopPropagation()}>
                    <StatusBadge
                      status={app.status}
                      interactive={true}
                      onStatusChange={(newStatus) => handleStatusChange(app.id, newStatus)}
                      size="xs"
                    />
                  </div>
                </div>

                {/* Sub details: Tags */}
                <div className="flex flex-wrap items-center gap-1.5 mb-3 text-[11px] text-slate-400">
                  <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800">
                    {app.opportunityType}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800">
                    {app.workArrangement}
                  </span>
                  {app.location && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {app.location}
                    </span>
                  )}
                </div>

                {/* Tech stack tags */}
                {app.techStack && app.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {app.techStack.slice(0, 4).map((tech, i) => (
                      <span 
                        key={i} 
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                      >
                        {tech}
                      </span>
                    ))}
                    {app.techStack.length > 4 && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                        +{app.techStack.length - 4}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Card Footer: Follow-up, Date & Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between mt-2">
                <div className="space-y-1">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    <span>{formatDisplayDate(app.applicationDate)}</span>
                  </div>

                  {followUp && (
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${followUp.badgeClass}`}>
                      <AlertCircle className="w-3 h-3" />
                      <span>{followUp.label}</span>
                    </span>
                  )}
                </div>

                <div 
                  className="flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  {app.applicationUrl && (
                    <a
                      href={app.applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-slate-400 hover:text-indigo-300 hover:bg-slate-800 rounded-lg transition-colors"
                      title="Open job link"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => onSelectApplication(app)}
                    className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
                    title="View details"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onEditApplication(app)}
                    className="p-1.5 text-slate-400 hover:text-indigo-300 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteCandidate(app)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {deleteCandidate && (
        <ConfirmModal
          isOpen={Boolean(deleteCandidate)}
          onClose={() => setDeleteCandidate(null)}
          onConfirm={confirmDelete}
          title="Delete Application"
          message={`Are you sure you want to delete your record for "${deleteCandidate.companyName}" (${deleteCandidate.jobTitle})?`}
          confirmText="Delete"
          confirmVariant="danger"
        />
      )}
    </>
  );
}
