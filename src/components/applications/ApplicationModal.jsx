import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { 
  APPLICATION_STATUSES, 
  APPLICATION_METHODS, 
  WORK_ARRANGEMENTS, 
  OPPORTUNITY_TYPES 
} from '../../constants/statuses';
import { toLocalDateString } from '../../utils/dateUtils';
import { useApp } from '../../context/AppContext';
import { AlertCircle, Plus, X } from 'lucide-react';

export default function ApplicationModal({ isOpen, onClose, initialData = null }) {
  const { addApplication, updateApplication, checkDuplicate } = useApp();
  const isEditing = Boolean(initialData && initialData.id);

  const getInitialState = () => {
    const today = toLocalDateString(new Date());
    if (initialData) {
      return {
        companyName: initialData.companyName || '',
        jobTitle: initialData.jobTitle || '',
        applicationDate: initialData.applicationDate || today,
        applicationMethod: initialData.applicationMethod || 'Company Website',
        applicationUrl: initialData.applicationUrl || '',
        companyWebsite: initialData.companyWebsite || '',
        location: initialData.location || '',
        workArrangement: initialData.workArrangement || 'Hybrid',
        opportunityType: initialData.opportunityType || 'Internship',
        techStackInput: (initialData.techStack || []).join(', '),
        status: initialData.status || APPLICATION_STATUSES.APPLIED,
        recruiterName: initialData.recruiterName || '',
        contactInfo: initialData.contactInfo || '',
        nextFollowUpDate: initialData.nextFollowUpDate || '',
        interviewDate: initialData.interviewDate || '',
        interviewTime: initialData.interviewTime || '',
        notes: initialData.notes || '',
      };
    }
    return {
      companyName: '',
      jobTitle: '',
      applicationDate: today,
      applicationMethod: 'Company Website',
      applicationUrl: '',
      companyWebsite: '',
      location: '',
      workArrangement: 'Hybrid',
      opportunityType: 'Internship',
      techStackInput: '',
      status: APPLICATION_STATUSES.APPLIED,
      recruiterName: '',
      contactInfo: '',
      nextFollowUpDate: '',
      interviewDate: '',
      interviewTime: '',
      notes: '',
    };
  };

  const [formData, setFormData] = useState(getInitialState);
  const [duplicateWarning, setDuplicateWarning] = useState(false);
  const [allowDuplicateSubmit, setAllowDuplicateSubmit] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialState());
      setDuplicateWarning(false);
      setAllowDuplicateSubmit(false);
      setFormErrors({});
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
    if (name === 'companyName' || name === 'jobTitle') {
      setDuplicateWarning(false);
      setAllowDuplicateSubmit(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.companyName.trim()) {
      errors.companyName = 'Company name is required';
    }
    if (!formData.jobTitle.trim()) {
      errors.jobTitle = 'Job title is required';
    }
    if (!formData.applicationDate) {
      errors.applicationDate = 'Application date is required';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Duplicate check for new applications or changed company/role
    if (!allowDuplicateSubmit) {
      const isDup = checkDuplicate(
        formData.companyName, 
        formData.jobTitle, 
        isEditing ? initialData.id : null
      );
      if (isDup) {
        setDuplicateWarning(true);
        return;
      }
    }

    // Process tech stack
    const parsedTechStack = formData.techStackInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const payload = {
      ...formData,
      techStack: parsedTechStack,
    };

    if (isEditing) {
      updateApplication(initialData.id, payload);
    } else {
      addApplication(payload);
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Application' : 'Add New Application'}
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Duplicate warning notification */}
        {duplicateWarning && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-400 mt-0.5" />
            <div className="space-y-2 flex-1">
              <p className="font-semibold text-sm">Potential Duplicate Detected</p>
              <p>
                You already have an application recorded for <strong className="text-white">{formData.companyName}</strong> as <strong className="text-white">{formData.jobTitle}</strong>.
              </p>
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setAllowDuplicateSubmit(true);
                    setDuplicateWarning(false);
                  }}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold rounded-lg text-xs"
                >
                  Save Anyway
                </button>
                <button
                  type="button"
                  onClick={() => setDuplicateWarning(false)}
                  className="text-amber-400 hover:underline text-xs"
                >
                  Cancel & Change Role Title
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Section: Core Information */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Core Position Details
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Company Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="e.g. OCP Group, Thales, Chari..."
                className={`w-full px-3.5 py-2 bg-slate-950 border rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                  formErrors.companyName ? 'border-rose-500' : 'border-slate-800'
                }`}
              />
              {formErrors.companyName && (
                <p className="text-[11px] text-rose-400 mt-1">{formErrors.companyName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Job Title / Position <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                placeholder="e.g. Full-Stack Intern (PFE), Junior Backend Dev"
                className={`w-full px-3.5 py-2 bg-slate-950 border rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                  formErrors.jobTitle ? 'border-rose-500' : 'border-slate-800'
                }`}
              />
              {formErrors.jobTitle && (
                <p className="text-[11px] text-rose-400 mt-1">{formErrors.jobTitle}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Application Date <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                name="applicationDate"
                value={formData.applicationDate}
                onChange={handleChange}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Application Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                {Object.values(APPLICATION_STATUSES).map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section: Type, Method & Work Details */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Opportunity & Work Setup
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Opportunity Type
              </label>
              <select
                name="opportunityType"
                value={formData.opportunityType}
                onChange={handleChange}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                {OPPORTUNITY_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Work Arrangement
              </label>
              <select
                name="workArrangement"
                value={formData.workArrangement}
                onChange={handleChange}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                {WORK_ARRANGEMENTS.map(arr => (
                  <option key={arr} value={arr}>{arr}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Application Method
              </label>
              <select
                name="applicationMethod"
                value={formData.applicationMethod}
                onChange={handleChange}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                {APPLICATION_METHODS.map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Casablanca, Rabat, Benguerir, Remote"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Tech Stack / Relevant Skills
              </label>
              <input
                type="text"
                name="techStackInput"
                value={formData.techStackInput}
                onChange={handleChange}
                placeholder="Comma-separated: React, Node.js, C++, Docker"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>
        </div>

        {/* Section: Links & Contacts */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Web Links & Recruiter Contact
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Application URL
              </label>
              <input
                type="url"
                name="applicationUrl"
                value={formData.applicationUrl}
                onChange={handleChange}
                placeholder="https://company.com/jobs/123"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Company Website
              </label>
              <input
                type="url"
                name="companyWebsite"
                value={formData.companyWebsite}
                onChange={handleChange}
                placeholder="https://company.com"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Recruiter / Contact Name
              </label>
              <input
                type="text"
                name="recruiterName"
                value={formData.recruiterName}
                onChange={handleChange}
                placeholder="e.g. Jane Doe (Tech Talent Lead)"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Contact Email or LinkedIn URL
              </label>
              <input
                type="text"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleChange}
                placeholder="email@company.com or linkedin.com/in/..."
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>
        </div>

        {/* Section: Timeline, Follow-up & Interviews */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Follow-Up & Interview Schedule
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Next Follow-Up Date
              </label>
              <input
                type="date"
                name="nextFollowUpDate"
                value={formData.nextFollowUpDate}
                onChange={handleChange}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Interview Date
              </label>
              <input
                type="date"
                name="interviewDate"
                value={formData.interviewDate}
                onChange={handleChange}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Interview Time
              </label>
              <input
                type="time"
                name="interviewTime"
                value={formData.interviewTime}
                onChange={handleChange}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>
        </div>

        {/* Section: Notes */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Notes & Recruiter Conversations
          </label>
          <textarea
            rows="3"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Key notes, specific questions asked, feedback received, salary/stipend info..."
            className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 rounded-xl transition-colors border border-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md transition-all active:scale-95"
          >
            {isEditing ? 'Save Changes' : 'Create Application'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
