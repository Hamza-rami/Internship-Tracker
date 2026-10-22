import React, { useState } from 'react';
import Modal from '../common/Modal';
import StatusBadge from '../common/StatusBadge';
import ConfirmModal from '../common/ConfirmModal';
import { 
  Building2, 
  MapPin, 
  Briefcase, 
  Calendar, 
  Clock, 
  ExternalLink, 
  User, 
  Mail, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { formatDisplayDate, getFollowUpStatus, toLocalDateString } from '../../utils/dateUtils';
import { useApp } from '../../context/AppContext';

export default function ApplicationDetailsModal({ 
  application, 
  isOpen, 
  onClose, 
  onEdit 
}) {
  const { updateApplication, deleteApplication, markFollowUpComplete } = useApp();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isReschedulingFollowUp, setIsReschedulingFollowUp] = useState(false);
  const [newFollowUpDate, setNewFollowUpDate] = useState('');

  if (!application) return null;

  const followUpStatus = application.nextFollowUpDate 
    ? getFollowUpStatus(application.nextFollowUpDate) 
    : null;

  const handleDelete = () => {
    deleteApplication(application.id);
    onClose();
  };

  const handleStatusChange = (newStatus) => {
    updateApplication(application.id, { status: newStatus });
  };

  const handleCompleteFollowUp = () => {
    markFollowUpComplete(application.id, '');
  };

  const handleSaveRescheduledFollowUp = (e) => {
    e.preventDefault();
    if (newFollowUpDate) {
      updateApplication(application.id, { nextFollowUpDate: newFollowUpDate });
      setIsReschedulingFollowUp(false);
      setNewFollowUpDate('');
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Application Details" maxWidth="max-w-2xl">
        <div className="space-y-6">
          {/* Header Card */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                  {application.opportunityType}
                </span>
                <span className="text-xs text-slate-500">•</span>
                <span className="text-xs text-slate-400">
                  {application.workArrangement}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {application.jobTitle}
              </h2>
              <p className="text-base font-medium text-indigo-400 flex items-center gap-1.5 mt-0.5">
                <Building2 className="w-4 h-4" />
                {application.companyName}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start">
              <StatusBadge
                status={application.status}
                interactive={true}
                onStatusChange={handleStatusChange}
                size="md"
              />
            </div>
          </div>

          {/* Quick Follow-up Banner if set */}
          {application.nextFollowUpDate && (
            <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
              followUpStatus?.type === 'overdue'
                ? 'bg-rose-950/30 border-rose-800 text-rose-200'
                : 'bg-amber-950/30 border-amber-800 text-amber-200'
            }`}>
              <div className="flex items-center gap-2.5">
                <AlertCircle className={`w-5 h-5 flex-shrink-0 ${
                  followUpStatus?.type === 'overdue' ? 'text-rose-400' : 'text-amber-400'
                }`} />
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider block">
                    {followUpStatus?.label}
                  </span>
                  <span className="text-xs opacity-80">
                    Scheduled for {formatDisplayDate(application.nextFollowUpDate)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleCompleteFollowUp}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 shadow-sm"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  Mark Done
                </button>
                <button
                  type="button"
                  onClick={() => setIsReschedulingFollowUp(!isReschedulingFollowUp)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700"
                >
                  Reschedule
                </button>
              </div>
            </div>
          )}

          {/* Reschedule inline input */}
          {isReschedulingFollowUp && (
            <form onSubmit={handleSaveRescheduledFollowUp} className="flex items-center gap-2 p-3 bg-slate-900 border border-slate-800 rounded-xl">
              <input
                type="date"
                value={newFollowUpDate}
                onChange={(e) => setNewFollowUpDate(e.target.value)}
                min={toLocalDateString(new Date())}
                className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsReschedulingFollowUp(false)}
                className="px-2 py-1.5 text-slate-400 hover:text-slate-200 text-xs"
              >
                Cancel
              </button>
            </form>
          )}

          {/* Grid Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-3 bg-slate-900/50 p-4 rounded-xl border border-slate-800/80">
              <div className="flex items-center gap-2 text-slate-400">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span className="text-slate-400">Applied On:</span>
                <span className="font-semibold text-slate-200">
                  {formatDisplayDate(application.applicationDate)}
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-4 h-4 text-indigo-400" />
                <span className="text-slate-400">Location:</span>
                <span className="font-semibold text-slate-200">
                  {application.location || 'Not specified'}
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-400">
                <Briefcase className="w-4 h-4 text-indigo-400" />
                <span className="text-slate-400">Method:</span>
                <span className="font-semibold text-slate-200">
                  {application.applicationMethod}
                </span>
              </div>
            </div>

            <div className="space-y-3 bg-slate-900/50 p-4 rounded-xl border border-slate-800/80">
              <div className="flex items-center gap-2 text-slate-400">
                <User className="w-4 h-4 text-indigo-400" />
                <span className="text-slate-400">Recruiter:</span>
                <span className="font-semibold text-slate-200">
                  {application.recruiterName || 'None listed'}
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-400 truncate">
                <Mail className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span className="text-slate-400 flex-shrink-0">Contact:</span>
                <span className="font-semibold text-slate-200 truncate">
                  {application.contactInfo || 'None listed'}
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-400">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span className="text-slate-400">Interview:</span>
                <span className="font-semibold text-slate-200">
                  {application.interviewDate 
                    ? `${formatDisplayDate(application.interviewDate)} ${application.interviewTime ? `at ${application.interviewTime}` : ''}` 
                    : 'Not scheduled'}
                </span>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          {application.techStack && application.techStack.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Tech Stack & Required Skills
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {application.techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 text-xs rounded-lg font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Notes & Conversations
            </h4>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 whitespace-pre-wrap leading-relaxed min-h-[4rem]">
              {application.notes || 'No notes added yet for this application.'}
            </div>
          </div>

          {/* External Links */}
          <div className="flex flex-wrap gap-3 pt-2">
            {application.applicationUrl && (
              <a
                href={application.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-300 bg-indigo-950/40 border border-indigo-800 hover:bg-indigo-900/50 transition-colors"
              >
                <span>Job Posting Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {application.companyWebsite && (
              <a
                href={application.companyWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors"
              >
                <span>Company Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <span className="text-[11px] text-slate-500">
              Last updated: {new Date(application.updatedAt).toLocaleDateString()}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors border border-rose-900/40"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(application);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit Record
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Application"
        message={`Are you sure you want to permanently delete your application record for "${application.companyName}" (${application.jobTitle})?\n\nThis action cannot be undone.`}
        confirmText="Permanently Delete"
        confirmVariant="danger"
      />
    </>
  );
}
