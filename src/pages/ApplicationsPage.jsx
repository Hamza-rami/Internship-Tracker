import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ApplicationFilters from '../components/applications/ApplicationFilters';
import ApplicationTable from '../components/applications/ApplicationTable';
import ApplicationCards from '../components/applications/ApplicationCards';
import ApplicationDetailsModal from '../components/applications/ApplicationDetailsModal';
import ApplicationModal from '../components/applications/ApplicationModal';
import EmptyState from '../components/common/EmptyState';
import { Plus, Briefcase, Sparkles } from 'lucide-react';
import { parseLocalDate } from '../utils/dateUtils';

export default function ApplicationsPage() {
  const { openAddModal } = useOutletContext();
  const { applications, settings, updateSettings, loadSampleData } = useApp();

  const [viewMode, setViewMode] = useState(settings.viewMode || 'table');
  const [selectedApp, setSelectedApp] = useState(null);
  const [editingApp, setEditingApp] = useState(null);

  const [filters, setFilters] = useState({
    search: '',
    status: 'ALL',
    opportunityType: 'ALL',
    method: 'ALL',
    location: 'ALL',
    sortBy: 'date_desc'
  });

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    updateSettings({ viewMode: mode });
  };

  // Distinct locations for filter dropdown
  const uniqueLocations = useMemo(() => {
    const set = new Set();
    applications.forEach(a => {
      if (a.location && a.location.trim()) {
        set.add(a.location.trim());
      }
    });
    return Array.from(set).sort();
  }, [applications]);

  // Filter and sort applications
  const filteredApplications = useMemo(() => {
    let result = [...applications];

    // Search query
    if (filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      result = result.filter(app => 
        app.companyName.toLowerCase().includes(q) ||
        app.jobTitle.toLowerCase().includes(q) ||
        (app.techStack && app.techStack.some(t => t.toLowerCase().includes(q)))
      );
    }

    // Status
    if (filters.status !== 'ALL') {
      result = result.filter(app => app.status === filters.status);
    }

    // Opportunity Type
    if (filters.opportunityType !== 'ALL') {
      result = result.filter(app => app.opportunityType === filters.opportunityType);
    }

    // Method
    if (filters.method !== 'ALL') {
      result = result.filter(app => app.applicationMethod === filters.method);
    }

    // Location
    if (filters.location !== 'ALL') {
      result = result.filter(app => app.location === filters.location);
    }

    // Sorting
    result.sort((a, b) => {
      if (filters.sortBy === 'date_desc') {
        const timeA = parseLocalDate(a.applicationDate)?.getTime() || 0;
        const timeB = parseLocalDate(b.applicationDate)?.getTime() || 0;
        return timeB - timeA;
      }
      if (filters.sortBy === 'date_asc') {
        const timeA = parseLocalDate(a.applicationDate)?.getTime() || 0;
        const timeB = parseLocalDate(b.applicationDate)?.getTime() || 0;
        return timeA - timeB;
      }
      if (filters.sortBy === 'company_asc') {
        return a.companyName.localeCompare(b.companyName);
      }
      if (filters.sortBy === 'company_desc') {
        return b.companyName.localeCompare(a.companyName);
      }
      if (filters.sortBy === 'followup_asc') {
        const timeA = parseLocalDate(a.nextFollowUpDate)?.getTime() || Infinity;
        const timeB = parseLocalDate(b.nextFollowUpDate)?.getTime() || Infinity;
        return timeA - timeB;
      }
      return 0;
    });

    return result;
  }, [applications, filters]);

  const handleEdit = (app) => {
    setSelectedApp(null);
    setEditingApp(app);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <span>Application Management</span>
            <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {filteredApplications.length} of {applications.length}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Organize, update stages, follow up with recruiters, and manage your pipeline.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Application</span>
          </button>
        </div>
      </div>

      {applications.length === 0 ? (
        <EmptyState
          title="No applications tracked yet"
          description="Log your applications to keep your contacts, follow-up deadlines, and notes in one organized place."
          actionLabel="Add Application"
          onAction={openAddModal}
          onLoadSamples={loadSampleData}
        />
      ) : (
        <>
          {/* Filters Bar */}
          <ApplicationFilters
            filters={filters}
            onFilterChange={setFilters}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            locations={uniqueLocations}
          />

          {/* List or Cards View */}
          {filteredApplications.length === 0 ? (
            <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <Briefcase className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <h4 className="text-sm font-semibold text-slate-200">No matching applications</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                No records match your active search and filter criteria. Try resetting your filters.
              </p>
              <button
                type="button"
                onClick={() => setFilters({
                  search: '',
                  status: 'ALL',
                  opportunityType: 'ALL',
                  method: 'ALL',
                  location: 'ALL',
                  sortBy: 'date_desc'
                })}
                className="mt-4 px-3.5 py-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 bg-indigo-950/40 border border-indigo-800 rounded-lg"
              >
                Clear all filters
              </button>
            </div>
          ) : viewMode === 'table' ? (
            <ApplicationTable
              applications={filteredApplications}
              onSelectApplication={setSelectedApp}
              onEditApplication={setEditingApp}
            />
          ) : (
            <ApplicationCards
              applications={filteredApplications}
              onSelectApplication={setSelectedApp}
              onEditApplication={setEditingApp}
            />
          )}
        </>
      )}

      {/* Details View Modal */}
      {selectedApp && (
        <ApplicationDetailsModal
          isOpen={Boolean(selectedApp)}
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
          onEdit={handleEdit}
        />
      )}

      {/* Edit View Modal */}
      {editingApp && (
        <ApplicationModal
          isOpen={Boolean(editingApp)}
          initialData={editingApp}
          onClose={() => setEditingApp(null)}
        />
      )}
    </div>
  );
}
