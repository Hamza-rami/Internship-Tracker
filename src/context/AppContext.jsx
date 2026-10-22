import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { storageService, generateId, sanitizeApplication, DEFAULT_SETTINGS } from '../utils/storage';
import { APPLICATION_STATUSES, DEFAULT_DAILY_CHECKLIST, MILESTONES } from '../constants/statuses';
import { computeApplicationStats } from '../utils/stats';
import { toLocalDateString } from '../utils/dateUtils';
import { getRealisticSampleApplications } from '../utils/sampleData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Applications state
  const [applications, setApplications] = useState(() => storageService.getApplications());

  // Settings state
  const [settings, setSettings] = useState(() => storageService.getSettings());

  // Theme state
  const [theme, setTheme] = useState(() => settings.theme || 'dark');

  // Daily checklist state
  const [dailyTasks, setDailyTasks] = useState(() => {
    const todayStr = toLocalDateString(new Date());
    const stored = storageService.getDailyTasks();
    if (stored && stored.date === todayStr && Array.isArray(stored.items)) {
      return stored;
    }
    // New day or first time: initialize fresh tasks for today
    return {
      date: todayStr,
      items: DEFAULT_DAILY_CHECKLIST.map(t => ({ ...t, completed: false }))
    };
  });

  // Celebrated milestones
  const [celebratedMilestones, setCelebratedMilestones] = useState(() => storageService.getMilestones());

  // Celebration modal state
  const [celebration, setCelebration] = useState({
    isOpen: false,
    title: '',
    message: '',
    badge: null,
  });

  // Global notification banner/toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(prev => (prev && prev.message === message ? null : prev));
    }, 4000);
  };

  // Sync theme to DOM
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    const updated = { ...settings, theme };
    setSettings(updated);
    storageService.saveSettings(updated);
  }, [theme]);

  // Load and synchronize with local project disk file (data/tracker_data.json) on startup
  useEffect(() => {
    async function initFromDiskFile() {
      const diskData = await storageService.fetchDiskFile();
      if (diskData && Array.isArray(diskData.applications) && diskData.applications.length > 0) {
        setApplications(diskData.applications);
        if (diskData.settings) setSettings(diskData.settings);
        if (diskData.dailyTasks) setDailyTasks(diskData.dailyTasks);
        if (diskData.celebratedMilestones) setCelebratedMilestones(diskData.celebratedMilestones);
        showToast(`Loaded ${diskData.applications.length} applications from data/tracker_data.json`, 'info');
      } else if (applications.length > 0) {
        // Disk file is empty but localStorage has apps: write to disk file immediately
        storageService.syncToDiskFile(applications, settings, dailyTasks, celebratedMilestones);
      }
    }
    initFromDiskFile();
  }, []);

  // Persist applications to localStorage & directly to data/tracker_data.json
  useEffect(() => {
    storageService.saveApplications(applications);
    storageService.syncToDiskFile(applications, settings, dailyTasks, celebratedMilestones);
  }, [applications, settings, dailyTasks, celebratedMilestones]);

  // Persist settings
  useEffect(() => {
    storageService.saveSettings(settings);
  }, [settings]);

  // Persist daily checklist
  useEffect(() => {
    storageService.saveDailyTasks(dailyTasks);
  }, [dailyTasks]);

  // Persist celebrated milestones
  useEffect(() => {
    storageService.saveMilestones(celebratedMilestones);
  }, [celebratedMilestones]);

  // Computed stats
  const stats = useMemo(() => {
    return computeApplicationStats(applications, settings.weeklyGoal || 10);
  }, [applications, settings.weeklyGoal]);

  // Trigger celebration routine
  const triggerCelebration = (title, message, badge = null) => {
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#a855f7', '#10b981', '#f59e0b', '#3b82f6']
      });
    } catch (e) {
      // safe fallback if canvas is unavailable
    }
    setCelebration({
      isOpen: true,
      title,
      message,
      badge
    });
  };

  const closeCelebration = () => {
    setCelebration(prev => ({ ...prev, isOpen: false }));
  };

  // Check milestones and goal triggers
  const checkMilestonesAfterChange = (newAppsList) => {
    const submittedCount = newAppsList.filter(app => 
      app.status !== APPLICATION_STATUSES.WISHLIST && 
      app.status !== APPLICATION_STATUSES.PREPARING
    ).length;

    // Check application milestone
    for (const m of MILESTONES) {
      if (submittedCount >= m.count && !celebratedMilestones.includes(m.count)) {
        setCelebratedMilestones(prev => [...prev, m.count]);
        triggerCelebration(
          `Milestone Unlocked: ${m.title}! 🎯`,
          `Congratulations! You have submitted ${m.count} applications. Keep this incredible momentum going!`,
          `${m.count} Apps`
        );
        return;
      }
    }

    // Check weekly goal reached
    const statsNow = computeApplicationStats(newAppsList, settings.weeklyGoal || 10);
    if (statsNow.hasReachedWeeklyGoal && !celebratedMilestones.includes(`week_${toLocalDateString(new Date())}`)) {
      const weekKey = `week_${toLocalDateString(new Date())}`;
      setCelebratedMilestones(prev => [...prev, weekKey]);
      triggerCelebration(
        `Weekly Target Achieved! 🏆`,
        `Amazing work! You hit your weekly goal of ${settings.weeklyGoal} applications! Take a moment to celebrate your dedication.`,
        'Goal Crushed'
      );
    }
  };

  // Add application
  const addApplication = (appData) => {
    const todayStr = toLocalDateString(new Date());
    const isSubmitted = appData.status !== APPLICATION_STATUSES.WISHLIST && appData.status !== APPLICATION_STATUSES.PREPARING;
    
    const newApp = sanitizeApplication({
      ...appData,
      id: generateId(),
      appliedDate: isSubmitted ? (appData.applicationDate || todayStr) : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const updated = [newApp, ...applications];
    setApplications(updated);
    showToast(`Added application for "${newApp.companyName}"`);
    checkMilestonesAfterChange(updated);
    return newApp;
  };

  // Check if duplicate exists (for duplicate warning before submit)
  const checkDuplicate = (companyName, jobTitle, excludeId = null) => {
    const cNorm = (companyName || '').trim().toLowerCase();
    const jNorm = (jobTitle || '').trim().toLowerCase();
    return applications.some(app => 
      app.id !== excludeId &&
      app.companyName.trim().toLowerCase() === cNorm &&
      app.jobTitle.trim().toLowerCase() === jNorm
    );
  };

  // Update application
  const updateApplication = (id, updates) => {
    let wasMovedToApplied = false;
    let becameOffer = false;

    const updated = applications.map(app => {
      if (app.id !== id) return app;

      // Status change logic:
      let newAppliedDate = app.appliedDate;
      if (
        updates.status &&
        updates.status !== app.status &&
        updates.status !== APPLICATION_STATUSES.WISHLIST &&
        updates.status !== APPLICATION_STATUSES.PREPARING
      ) {
        if (!app.appliedDate) {
          newAppliedDate = toLocalDateString(new Date());
          wasMovedToApplied = true;
        }
      }

      if (updates.status === APPLICATION_STATUSES.OFFER && app.status !== APPLICATION_STATUSES.OFFER) {
        becameOffer = true;
      }

      return sanitizeApplication({
        ...app,
        ...updates,
        appliedDate: newAppliedDate,
        updatedAt: new Date().toISOString()
      });
    });

    setApplications(updated);
    showToast('Application updated successfully');

    if (becameOffer) {
      triggerCelebration(
        `OFFER RECEIVED! 🎉🥳`,
        `HUGE congratulations on receiving an offer! Your hard work and dedication paid off!`,
        'Offer Received'
      );
    } else if (wasMovedToApplied) {
      checkMilestonesAfterChange(updated);
    }

    return true;
  };

  // Delete application
  const deleteApplication = (id) => {
    const target = applications.find(a => a.id === id);
    const updated = applications.filter(a => a.id !== id);
    setApplications(updated);
    showToast(`Deleted application ${target ? `for "${target.companyName}"` : ''}`, 'info');
  };

  // Quick mark follow-up as complete
  const markFollowUpComplete = (id, newNextDate = '') => {
    const app = applications.find(a => a.id === id);
    if (!app) return;

    const nowStr = toLocalDateString(new Date());
    const updatedNotes = app.notes 
      ? `${app.notes}\n• [${nowStr}] Completed follow-up with recruiter.`
      : `• [${nowStr}] Completed follow-up with recruiter.`;

    updateApplication(id, {
      nextFollowUpDate: newNextDate,
      notes: updatedNotes,
      status: app.status === APPLICATION_STATUSES.APPLIED ? APPLICATION_STATUSES.FOLLOW_UP : app.status
    });
    showToast(`Follow-up marked as completed for ${app.companyName}`);
  };

  // Checklist toggle
  const toggleChecklistItem = (id) => {
    const todayStr = toLocalDateString(new Date());
    setDailyTasks(prev => {
      const curDate = prev.date === todayStr ? prev.date : todayStr;
      const currentItems = prev.date === todayStr ? prev.items : DEFAULT_DAILY_CHECKLIST.map(t => ({ ...t, completed: false }));
      
      const newItems = currentItems.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      );

      const allCompleted = newItems.every(i => i.completed);
      if (allCompleted && !currentItems.every(i => i.completed)) {
        triggerCelebration(
          'Daily Action Goals Completed! 🚀',
          'You finished all daily search tasks today! Amazing discipline.',
          '100% Daily Tasks'
        );
      }

      return {
        date: curDate,
        items: newItems
      };
    });
  };

  // Reset checklist manually
  const resetDailyChecklist = () => {
    setDailyTasks({
      date: toLocalDateString(new Date()),
      items: DEFAULT_DAILY_CHECKLIST.map(t => ({ ...t, completed: false }))
    });
    showToast('Daily checklist reset for today');
  };

  // Update Settings
  const updateSettings = (newSettings) => {
    const merged = { ...settings, ...newSettings };
    setSettings(merged);
    showToast('Settings saved successfully');
  };

  // Toggle Theme
  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Backup Export
  const exportData = () => {
    const res = storageService.exportBackupFile(applications, settings);
    if (res.success) {
      showToast('Backup exported successfully');
    } else {
      showToast('Failed to export backup: ' + res.error, 'error');
    }
  };

  // Backup Import
  const importData = (fileContent) => {
    const validation = storageService.validateImportPayload(fileContent);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    setApplications(validation.applications);
    if (validation.settings) {
      setSettings(validation.settings);
    }
    showToast(`Successfully restored ${validation.validCount} applications!`);
    return { success: true, count: validation.validCount, warnings: validation.warnings };
  };

  // Load sample data
  const loadSampleData = () => {
    const samples = getRealisticSampleApplications();
    setApplications(samples);
    showToast('Loaded 7 sample applications for Moroccan/remote tech opportunities');
  };

  // Restore directly from disk file (e.g. data/tracker_backup.json)
  const restoreFromDiskBackup = async () => {
    const diskBackup = await storageService.fetchDiskBackup();
    if (diskBackup && Array.isArray(diskBackup.applications) && diskBackup.applications.length > 0) {
      setApplications(diskBackup.applications);
      if (diskBackup.settings) setSettings(diskBackup.settings);
      showToast(`Restored ${diskBackup.applications.length} applications from project disk file!`);
      return true;
    }
    showToast('No disk backup file found yet.', 'info');
    return false;
  };

  // Reset all data
  const resetAllData = () => {
    storageService.clearAllTrackerData();
    storageService.syncToDiskFile([], DEFAULT_SETTINGS, null, []);
    setApplications([]);
    setSettings(DEFAULT_SETTINGS);
    setCelebratedMilestones([]);
    setDailyTasks({
      date: toLocalDateString(new Date()),
      items: DEFAULT_DAILY_CHECKLIST.map(t => ({ ...t, completed: false }))
    });
    showToast('All local application records have been cleared', 'info');
  };

  const value = {
    applications,
    settings,
    theme,
    dailyTasks,
    stats,
    toast,
    celebration,
    celebratedMilestones,
    addApplication,
    updateApplication,
    deleteApplication,
    checkDuplicate,
    markFollowUpComplete,
    toggleChecklistItem,
    resetDailyChecklist,
    updateSettings,
    toggleTheme,
    exportData,
    importData,
    restoreFromDiskBackup,
    loadSampleData,
    resetAllData,
    showToast,
    closeCelebration,
    triggerCelebration,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
