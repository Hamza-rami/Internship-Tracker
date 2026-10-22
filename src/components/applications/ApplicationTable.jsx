import React, { useState } from 'react';
import StatusBadge from '../common/StatusBadge';
import ConfirmModal from '../common/ConfirmModal';
import { 
  Building2, 
  ExternalLink, 
  Eye, 
  Edit3, 
  Trash2, 
  AlertCircle,
  Calendar
} from 'lucide-react';
import { formatDisplayDate, getFollowUpStatus } from '../../utils/dateUtils';
import { useApp } from '../../context/AppContext';

export default function ApplicationTable({ 
  applications, 
  onSelectApplication, 
  onEditApplication 
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
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Company & Role</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Applied Date</th>
                <th className="py-3.5 px-4">Follow-Up</th>
                <th className="py-3.5 px-4">Method & Type</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {applications.map((app) => {
                const followUp = app.nextFollowUpDate ? getFollowUpStatus(app.nextFollowUpDate) : null;

                return (
                  <tr
                    key={app.id}
                    onClick={() => onSelectApplication(app)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                  >
                    {/* Company & Role */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-100 flex items-center gap-1.5 group-hover:text-indigo-300 transition-colors">
                            <span>{app.companyName}</span>
                            {app.applicationUrl && (
                              <a
                                href={app.applicationUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-slate-500 hover:text-indigo-400 p-0.5"
                                title="Open Job Posting"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                          <div className="text-slate-400 text-[11px]">
                            {app.jobTitle}
                          </div>
                          {app.location && (
                            <span className="text-[10px] text-slate-500">
                              {app.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Status Badge (interactive dropdown) */}
                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <StatusBadge
                        status={app.status}
                        interactive={true}
                        onStatusChange={(newStatus) => handleStatusChange(app.id, newStatus)}
                      />
                    </td>

                    {/* Application Date */}
                    <td className="py-3.5 px-4 text-slate-300 font-mono text-[11px]">
                      {formatDisplayDate(app.applicationDate)}
                    </td>

                    {/* Next Follow-Up */}
                    <td className="py-3.5 px-4">
                      {followUp ? (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${followUp.badgeClass}`}>
                          <AlertCircle className="w-3 h-3" />
                          <span>{followUp.label}</span>
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[11px]">—</span>
                      )}
                    </td>

                    {/* Method & Type */}
                    <td className="py-3.5 px-4">
                      <div className="text-slate-300 text-xs font-medium">
                        {app.applicationMethod}
                      </div>
                      <div className="text-slate-500 text-[10px]">
                        {app.opportunityType} • {app.workArrangement}
                      </div>
                    </td>

                    {/* Action buttons */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => onSelectApplication(app)}
                          className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
                          title="View Details"
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
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
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
