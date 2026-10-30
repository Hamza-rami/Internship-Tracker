import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import StatCardsGrid from '../components/dashboard/StatCardsGrid';
import DailyActionPanel from '../components/dashboard/DailyActionPanel';
import WeeklyGoalCard from '../components/dashboard/WeeklyGoalCard';
import ActivityHeatmap from '../components/dashboard/ActivityHeatmap';
import OverviewCharts from '../components/dashboard/OverviewCharts';
import MilestonesCard from '../components/dashboard/MilestonesCard';
import FollowUpCard from '../components/dashboard/FollowUpCard';
import RecentApplicationsList from '../components/dashboard/RecentApplicationsList';
import LeetCodeWidget from '../components/dashboard/LeetCodeWidget';
import ApplicationDetailsModal from '../components/applications/ApplicationDetailsModal';
import ApplicationModal from '../components/applications/ApplicationModal';
import EmptyState from '../components/common/EmptyState';
import { Plus, Sparkles, Building2 } from 'lucide-react';

export default function DashboardPage() {
  const { openAddModal } = useOutletContext();
  const { applications, stats, loadSampleData } = useApp();

  const [selectedApp, setSelectedApp] = useState(null);
  const [editingApp, setEditingApp] = useState(null);

  const handleEdit = (app) => {
    setSelectedApp(null);
    setEditingApp(app);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              1337 Tech Tracker
            </span>
            <span className="text-xs text-slate-400">• Ready for your next tech leap</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
            Internship Command Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mt-0.5">
            Log your daily applications, manage technical interview pipelines, and track your momentum locally.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {applications.length === 0 && (
            <button
              type="button"
              onClick={loadSampleData}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-medium rounded-xl border border-slate-700 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Load Samples</span>
            </button>
          )}

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-indigo-600/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Application</span>
          </button>
        </div>
      </div>

      {/* Empty State Onboarding if no applications */}
      {applications.length === 0 ? (
        <div className="space-y-6">
          <EmptyState
            title="Welcome to your Local Internship Tracker!"
            description="You haven't logged any applications yet. Add your first job lead, or load realistic sample applications for Moroccan & remote tech opportunities to explore the dashboard features."
            actionLabel="Add Your First Application"
            onAction={openAddModal}
            onLoadSamples={loadSampleData}
          />
          {/* LeetCode Practice Readiness Widget */}
          <LeetCodeWidget />
        </div>
      ) : (
        <>
          {/* Key Metrics Grid */}
          <StatCardsGrid stats={stats} />

          {/* Daily Action Checklist & Motivation */}
          <DailyActionPanel />

          {/* LeetCode Assessment Prep Widget */}
          <LeetCodeWidget />

          {/* Weekly Target & Streak Progress */}
          <WeeklyGoalCard />

          {/* Visual Charts: Timeline & Status Distribution */}
          <OverviewCharts applications={applications} stats={stats} />

          {/* Heatmap Activity Calendar */}
          <ActivityHeatmap />

          {/* Upcoming Follow-ups & Recent Submissions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <FollowUpCard onSelectApplication={setSelectedApp} />
            <RecentApplicationsList
              applications={applications}
              onSelectApplication={setSelectedApp}
            />
          </div>

          {/* Career Milestones */}
          <MilestonesCard />
        </>
      )}

      {/* Details Modal */}
      {selectedApp && (
        <ApplicationDetailsModal
          isOpen={Boolean(selectedApp)}
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
          onEdit={handleEdit}
        />
      )}

      {/* Edit Modal */}
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
