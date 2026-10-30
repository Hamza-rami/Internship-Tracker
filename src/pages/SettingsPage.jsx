import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import ConfirmModal from '../components/common/ConfirmModal';
import Modal from '../components/common/Modal';
import { 
  Download, 
  Upload, 
  Trash2, 
  Target, 
  Sun, 
  Moon, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  FileJson,
  Info,
  HardDrive,
  User,
  LogOut,
  Users
} from 'lucide-react';
import { storageService, STORAGE_KEYS } from '../utils/storage';

export default function SettingsPage() {
  const { 
    settings, 
    updateSettings, 
    theme, 
    toggleTheme, 
    exportData, 
    importData, 
    restoreFromDiskBackup,
    resetAllData, 
    loadSampleData,
    applications,
    currentUser,
    users,
    logout,
    switchUser
  } = useApp();

  const [weeklyGoalInput, setWeeklyGoalInput] = useState(settings.weeklyGoal || 10);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showSampleConfirm, setShowSampleConfirm] = useState(false);

  // Import state
  const fileInputRef = useRef(null);
  const [importPendingPayload, setImportPendingPayload] = useState(null);
  const [importPreviewModal, setImportPreviewModal] = useState(false);
  const [importError, setImportError] = useState(null);

  const handleSaveGoal = (e) => {
    e.preventDefault();
    const val = parseInt(weeklyGoalInput, 10);
    if (!isNaN(val) && val > 0 && val <= 100) {
      updateSettings({ weeklyGoal: val });
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        try {
          // Pre-test structure
          const parsed = JSON.parse(content);
          const appsCount = Array.isArray(parsed) 
            ? parsed.length 
            : (Array.isArray(parsed?.applications) ? parsed.applications.length : 0);

          if (appsCount === 0) {
            setImportError('No valid applications found in this JSON file.');
            return;
          }

          setImportPendingPayload(content);
          setImportPreviewModal(true);
        } catch (err) {
          setImportError('Invalid JSON format. Please upload a valid .json backup file.');
        }
      }
    };
    reader.readAsText(file);
    // Reset file input so same file can be selected again
    e.target.value = '';
  };

  const handleConfirmImport = () => {
    if (importPendingPayload) {
      const res = importData(importPendingPayload);
      if (res.success) {
        setImportPreviewModal(false);
        setImportPendingPayload(null);
      } else {
        setImportError(res.error);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
          Application Settings & Backup
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Manage your job search targets, interface preferences, and local data persistence.
        </p>
      </div>

      {/* Critical Storage Notice Banner */}
      <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-900/50 flex items-start gap-3.5">
        <Info className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-slate-300 leading-relaxed">
          <p className="font-semibold text-indigo-200">
            Local Storage & Data Isolation Notice
          </p>
          <p>
            Track1337 stores 100% of your records locally inside this browser’s <code className="font-mono text-indigo-300">localStorage</code>.
            Because browsers isolate data by <strong>Origin (domain + port)</strong>, if you open <code className="font-mono text-indigo-300">http://127.0.0.1:5173</code> instead of <code className="font-mono text-indigo-300">http://localhost:5173</code>, or use a private window, your data won't appear there.
          </p>
        </div>
      </div>

      {/* Storage Diagnostics Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <HardDrive className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-100">
              Active Browser Storage Diagnostics
            </h3>
            <p className="text-xs text-slate-400">
              Where and how your records are currently residing on this machine
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Local Storage File</span>
            <span className="text-emerald-400 font-mono font-medium truncate block mt-0.5">
              data/tracker_data.json
            </span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Active Browser Origin</span>
            <span className="text-slate-200 font-mono text-[11px] block mt-0.5 truncate">
              {typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173'}
            </span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Stored Applications</span>
            <span className="text-emerald-400 font-mono font-bold text-sm block mt-0.5">
              {applications.length} records saved
            </span>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 pt-1 leading-relaxed">
          ✅ <strong>Dual-Layer Storage Active:</strong> Your data is saved simultaneously to your browser's <code className="text-slate-200 font-mono">localStorage</code> AND to the physical file <code className="text-emerald-400 font-mono font-medium">data/tracker_data.json</code> in this project folder. Even if your browser cache, cookies, or site data are wiped by CleanMyMac, your records will automatically reload from this file!
        </p>
      </div>

      {/* Account & Profile Switcher */}
      {currentUser && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-slate-100">
                  Active 1337 Student Account
                </h3>
                <p className="text-xs text-slate-400">
                  Your profile and application data isolation
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-600 border border-rose-500/20 rounded-xl transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Full Name</span>
              <span className="text-slate-200 font-medium text-xs block mt-0.5 truncate">
                {currentUser.fullName}
              </span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">1337 Username / Campus</span>
              <span className="text-indigo-300 font-mono text-xs block mt-0.5 truncate">
                @{currentUser.username} • {currentUser.campus || '1337'}
              </span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Email</span>
              <span className="text-slate-300 font-mono text-xs block mt-0.5 truncate">
                {currentUser.email}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Section 1: Weekly Goal */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-100">
              Weekly Application Target
            </h3>
            <p className="text-xs text-slate-400">
              Set the number of high-quality applications you aim to send each week
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveGoal} className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="w-full sm:w-48">
            <input
              type="number"
              min="1"
              max="100"
              value={weeklyGoalInput}
              onChange={(e) => setWeeklyGoalInput(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-all"
          >
            Update Weekly Target
          </button>
          <span className="text-xs text-slate-500">
            Currently set to <strong className="text-slate-300">{settings.weeklyGoal}</strong> applications / week
          </span>
        </form>
      </div>

      {/* Section 2: Appearance & Theme */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-100">
              Appearance & Theme
            </h3>
            <p className="text-xs text-slate-400">
              Choose between dark mode (default) and clean light mode
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs sm:text-sm font-medium rounded-xl transition-colors"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Switch to Light Theme</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-400" />
                <span>Switch to Dark Theme</span>
              </>
            )}
          </button>
          <span className="text-xs text-slate-500">
            Active mode: <strong className="text-slate-300 capitalize">{theme}</strong>
          </span>
        </div>
      </div>

      {/* Section 3: Data Backup & Restore */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <FileJson className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-100">
              Backup & Restore (JSON)
            </h3>
            <p className="text-xs text-slate-400">
              Safely export or import your applications, settings, and milestones
            </p>
          </div>
        </div>

        {importError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{importError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Export */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between space-y-3">
            <div>
              <h4 className="text-xs font-semibold text-slate-200">
                Export Complete Backup
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Generates a JSON file containing all {applications.length} applications and tracker configuration.
              </p>
            </div>
            <button
              type="button"
              onClick={exportData}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Backup (.json)</span>
            </button>
          </div>

          {/* Import */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between space-y-3">
            <div>
              <h4 className="text-xs font-semibold text-slate-200">
                Restore From Backup
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Upload a JSON backup file. You will preview and confirm the items before any changes are made.
              </p>
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Select Backup File...</span>
              </button>
            </div>
          </div>

          {/* Local Project Disk File Auto-Sync & Recovery */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:col-span-2">
            <div>
              <h4 className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-emerald-400" />
                Local Disk Mirror (<code className="font-mono text-indigo-300">data/tracker_backup.json</code>)
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed max-w-xl">
                Every application change is automatically mirrored to a real JSON file inside your project directory. Even if your browser cache or site data is wiped, Track1337 will auto-recover your records from this disk file!
              </p>
            </div>

            <button
              type="button"
              onClick={restoreFromDiskBackup}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-sm transition-all whitespace-nowrap self-start sm:self-auto"
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span>Recover From Disk File</span>
            </button>
          </div>
        </div>
      </div>

      {/* Section 4: Sample Data & Reset */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-100">
              Database Maintenance
            </h3>
            <p className="text-xs text-slate-400">
              Load realistic sample records or reset local tracker data
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setShowSampleConfirm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Load Moroccan & Remote Tech Samples</span>
          </button>

          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-medium rounded-xl border border-rose-800/60 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset All Local Tracker Data</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <ConfirmModal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={resetAllData}
        title="Reset All Tracker Data"
        message="Are you sure you want to completely erase all applications, streaks, milestones, and settings from this browser?\n\nMake sure you have exported a JSON backup first if you wish to preserve your records."
        confirmText="Yes, Erase Everything"
        confirmVariant="danger"
      />

      {/* Load Sample Data Confirmation */}
      <ConfirmModal
        isOpen={showSampleConfirm}
        onClose={() => setShowSampleConfirm(false)}
        onConfirm={loadSampleData}
        title="Load Sample Dataset"
        message="This will load 7 realistic sample applications (OCP, SG ABS, Thales, Chari.ma, GitLab, Stripe, Capgemini) to preview the dashboard charts and follow-up alerts.\n\nDo you want to proceed?"
        confirmText="Load Samples"
        confirmVariant="primary"
      />

      {/* Import Preview Modal */}
      {importPreviewModal && (
        <Modal
          isOpen={importPreviewModal}
          onClose={() => setImportPreviewModal(false)}
          title="Confirm Backup Restoration"
          maxWidth="max-w-md"
        >
          <div className="space-y-4 py-2 text-xs text-slate-300 leading-relaxed">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
              <p className="font-semibold text-sm flex items-center gap-1.5 mb-1">
                <AlertCircle className="w-4 h-4" />
                Data Replacement Notice
              </p>
              <p>
                Importing will replace your current {applications.length} applications with the records from the backup file.
              </p>
            </div>

            <p>
              Click <strong>Restore Backup</strong> to apply these records now.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setImportPreviewModal(false)}
                className="px-3.5 py-2 text-xs font-medium text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmImport}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl"
              >
                Restore Backup
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
