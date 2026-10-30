import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { storageService, generateId, sanitizeApplication, DEFAULT_SETTINGS, DEFAULT_USERS } from '../utils/storage';
import { APPLICATION_STATUSES, DEFAULT_DAILY_CHECKLIST, MILESTONES } from '../constants/statuses';
import { computeApplicationStats } from '../utils/stats';
import { toLocalDateString } from '../utils/dateUtils';
import { getRealisticSampleApplications } from '../utils/sampleData';
import { DEFAULT_LEETCODE_PROBLEMS } from '../constants/leetcodeProblems';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Users state
  const [users, setUsers] = useState(() => storageService.getUsers());

  // Current logged in user
  const [currentUser, setCurrentUser] = useState(() => storageService.getCurrentUser());

  // All Applications state across users
  const [allApplications, setAllApplications] = useState(() => storageService.getApplications());

  // LeetCode Practice Problems for tech assessments
  const [leetCodeProblems, setLeetCodeProblems] = useState(() => storageService.getLeetCodeProblems());

  // Settings state
  const [settings, setSettings] = useState(() => storageService.getSettings());

  // Theme state
  const [theme, setTheme] = useState(() => settings.theme || 'dark');

  // Filtered applications for currently active user
  const applications = useMemo(() => {
    if (!currentUser) return [];
    return allApplications.filter(app => !app.userId || app.userId === currentUser.id);
  }, [allApplications, currentUser]);

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
      if (diskData) {
        if (Array.isArray(diskData.applications) && diskData.applications.length > 0) {
          setAllApplications(diskData.applications);
        }
        if (Array.isArray(diskData.users) && diskData.users.length > 0) {
          setUsers(diskData.users);
          storageService.saveUsers(diskData.users);
        }
        if (diskData.currentUser) {
          setCurrentUser(diskData.currentUser);
          storageService.setCurrentUser(diskData.currentUser);
        }
        if (diskData.settings) setSettings(diskData.settings);
        if (diskData.dailyTasks) setDailyTasks(diskData.dailyTasks);
        if (diskData.celebratedMilestones) setCelebratedMilestones(diskData.celebratedMilestones);
        if (Array.isArray(diskData.leetCodeProblems) && diskData.leetCodeProblems.length > 0) {
          setLeetCodeProblems(diskData.leetCodeProblems);
          storageService.saveLeetCodeProblems(diskData.leetCodeProblems);
        }
        if (diskData.applications && diskData.applications.length > 0) {
          showToast(`Loaded ${diskData.applications.length} applications from data/tracker_data.json`, 'info');
        }
      } else if (allApplications.length > 0 || leetCodeProblems.length > 0) {
        // Disk file is empty but localStorage has data: write to disk file immediately
        storageService.syncToDiskFile(allApplications, settings, dailyTasks, celebratedMilestones, users, currentUser, leetCodeProblems);
      }
    }
    initFromDiskFile();
  }, []);

  // Persist applications to localStorage & directly to data/tracker_data.json
  useEffect(() => {
    storageService.saveApplications(allApplications);
    storageService.syncToDiskFile(allApplications, settings, dailyTasks, celebratedMilestones, users, currentUser, leetCodeProblems);
  }, [allApplications, settings, dailyTasks, celebratedMilestones, users, currentUser, leetCodeProblems]);

  // Persist leetcode problems
  useEffect(() => {
    storageService.saveLeetCodeProblems(leetCodeProblems);
  }, [leetCodeProblems]);

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
      userId: currentUser ? currentUser.id : null,
      appliedDate: isSubmitted ? (appData.applicationDate || todayStr) : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const updatedAll = [newApp, ...allApplications];
    setAllApplications(updatedAll);
    showToast(`Added application for "${newApp.companyName}"`);
    
    // Check milestones for current user's apps
    const userApps = updatedAll.filter(app => !app.userId || (currentUser && app.userId === currentUser.id));
    checkMilestonesAfterChange(userApps);
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

    const updatedAll = allApplications.map(app => {
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

    setAllApplications(updatedAll);
    showToast('Application updated successfully');

    if (becameOffer) {
      triggerCelebration(
        `OFFER RECEIVED! 🎉🥳`,
        `HUGE congratulations on receiving an offer! Your hard work and dedication paid off!`,
        'Offer Received'
      );
    } else if (wasMovedToApplied) {
      const userApps = updatedAll.filter(app => !app.userId || (currentUser && app.userId === currentUser.id));
      checkMilestonesAfterChange(userApps);
    }

    return true;
  };

  // Delete application
  const deleteApplication = (id) => {
    const target = allApplications.find(a => a.id === id);
    const updatedAll = allApplications.filter(a => a.id !== id);
    setAllApplications(updatedAll);
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

    const imported = validation.applications.map(app => ({
      ...app,
      userId: app.userId || (currentUser ? currentUser.id : null),
    }));

    setAllApplications(imported);
    if (validation.settings) {
      setSettings(validation.settings);
    }
    showToast(`Successfully restored ${validation.validCount} applications!`);
    return { success: true, count: validation.validCount, warnings: validation.warnings };
  };

  // Load sample data
  const loadSampleData = () => {
    const samples = getRealisticSampleApplications().map(app => ({
      ...app,
      userId: currentUser ? currentUser.id : null,
    }));
    setAllApplications(prev => [...samples, ...prev]);
    showToast('Loaded 7 sample applications for Moroccan/remote tech opportunities');
  };

  // Restore directly from disk file (e.g. data/tracker_backup.json)
  const restoreFromDiskBackup = async () => {
    const diskBackup = await storageService.fetchDiskBackup();
    if (diskBackup && Array.isArray(diskBackup.applications) && diskBackup.applications.length > 0) {
      setAllApplications(diskBackup.applications);
      if (diskBackup.settings) setSettings(diskBackup.settings);
      showToast(`Restored ${diskBackup.applications.length} applications from project disk file!`);
      return true;
    }
    showToast('No disk backup file found yet.', 'info');
    return false;
  };

  // LeetCode Practice Actions
  const updateProblemStatus = (problemId, newStatus) => {
    let targetTitle = '';
    let becameSolved = false;

    setLeetCodeProblems(prev => {
      return prev.map(prob => {
        if (prob.id === problemId) {
          targetTitle = prob.title;
          if (prob.status !== 'solved' && newStatus === 'solved') {
            becameSolved = true;
          }
          return {
            ...prob,
            status: newStatus,
            solvedAt: newStatus === 'solved' ? (prob.solvedAt || new Date().toISOString()) : null,
            lastUpdated: new Date().toISOString(),
          };
        }
        return prob;
      });
    });

    if (becameSolved) {
      triggerCelebration(
        `Problem Solved! 🚀`,
        `Awesome job solving "${targetTitle}". Technical assessment prep pays off!`,
        'LeetCode'
      );
      showToast(`Marked "${targetTitle}" as Solved! 🎯`, 'success');
    } else if (newStatus === 'working') {
      showToast(`Now working on "${targetTitle}" ⚡`, 'info');
    } else if (newStatus === 'todo') {
      showToast(`Reset "${targetTitle}" to Todo.`, 'info');
    }
  };

  const addLeetCodeProblem = (newProblem) => {
    const title = (newProblem.title || '').trim();
    if (!title) {
      showToast('Problem title is required', 'error');
      return { success: false, reason: 'Problem title is required' };
    }

    const id = 'custom_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 6);
    const problem = {
      id,
      number: newProblem.number ? parseInt(newProblem.number, 10) : null,
      title,
      difficulty: newProblem.difficulty || 'Medium',
      category: newProblem.category || 'General OA / Assessment',
      url: (newProblem.url || '').trim() || `https://leetcode.com/problemset/all/?search=${encodeURIComponent(title)}`,
      status: newProblem.status || 'todo',
      companies: Array.isArray(newProblem.companies)
        ? newProblem.companies
        : (typeof newProblem.companies === 'string' ? newProblem.companies.split(',').map(c => c.trim()).filter(Boolean) : []),
      notes: newProblem.notes || '',
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      isCustom: true,
    };

    setLeetCodeProblems(prev => [problem, ...prev]);
    showToast(`Added "${title}" to your LeetCode list!`);
    return { success: true, problem };
  };

  const updateLeetCodeProblem = (problemId, updates) => {
    setLeetCodeProblems(prev =>
      prev.map(p => (p.id === problemId ? { ...p, ...updates, lastUpdated: new Date().toISOString() } : p))
    );
    showToast('Problem updated');
  };

  const deleteLeetCodeProblem = (problemId) => {
    setLeetCodeProblems(prev => prev.filter(p => p.id !== problemId));
    showToast('Problem removed from list', 'info');
  };

  const resetLeetCodeProblems = () => {
    setLeetCodeProblems(DEFAULT_LEETCODE_PROBLEMS);
    storageService.saveLeetCodeProblems(DEFAULT_LEETCODE_PROBLEMS);
    showToast('Reset LeetCode problems to curated defaults', 'info');
  };

  // Reset all data for current user
  const resetAllData = () => {
    if (currentUser) {
      const remaining = allApplications.filter(app => app.userId && app.userId !== currentUser.id);
      setAllApplications(remaining);
    } else {
      setAllApplications([]);
    }
    setSettings(DEFAULT_SETTINGS);
    setCelebratedMilestones([]);
    setDailyTasks({
      date: toLocalDateString(new Date()),
      items: DEFAULT_DAILY_CHECKLIST.map(t => ({ ...t, completed: false }))
    });
    showToast('Your application records have been cleared', 'info');
  };

  // User Auth Actions
  const login = async (usernameOrEmail, password) => {
    const cleanInput = (usernameOrEmail || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    // Pool all known users from memory and localStorage
    let pool = Array.isArray(users) ? [...users] : [];
    const localUsers = storageService.getUsers();
    if (Array.isArray(localUsers)) {
      for (const u of localUsers) {
        if (!pool.some(existing => existing.id === u.id)) {
          pool.push(u);
        }
      }
    }

    const matchesUser = (u) => {
      if (!u) return false;
      const uName = (u.username || '').trim().toLowerCase();
      const uEmail = (u.email || '').trim().toLowerCase();
      const matchIdentity = 
        uName === cleanInput || 
        uEmail === cleanInput ||
        (cleanInput === 'yhajji' && uName === 'yahajji') ||
        (cleanInput === 'yahajji' && uName === 'yhajji');
      
      const matchPass = u.password === password || (u.password && u.password.trim() === cleanPassword);
      return matchIdentity && matchPass;
    };

    let found = pool.find(matchesUser);

    // If not found in memory/localStorage, query data/tracker_data.json directly
    if (!found) {
      try {
        const diskData = await storageService.fetchDiskFile();
        if (diskData && Array.isArray(diskData.users)) {
          pool = diskData.users;
          setUsers(diskData.users);
          storageService.saveUsers(diskData.users);
          found = diskData.users.find(matchesUser);
        }
      } catch (e) {
        console.error('Error fetching disk users during login:', e);
      }
    }

    if (!found) {
      return { success: false, error: 'Invalid username/email or password' };
    }

    setCurrentUser(found);
    storageService.setCurrentUser(found);
    showToast(`Welcome back, ${found.fullName}!`);
    return { success: true, user: found };
  };

  const register = ({ fullName, username, email, campus, password }) => {
    const cleanUser = (username || '').trim().toLowerCase();
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!fullName || !fullName.trim()) {
      return { success: false, error: 'Full name is required' };
    }
    if (!cleanUser) {
      return { success: false, error: 'Username is required' };
    }
    if (!cleanEmail) {
      return { success: false, error: 'Email is required' };
    }
    if (!password || password.length < 4) {
      return { success: false, error: 'Password must be at least 4 characters' };
    }

    if (users.some(u => u.username.toLowerCase() === cleanUser)) {
      return { success: false, error: 'Username is already taken' };
    }
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'Email is already registered' };
    }

    const newUser = {
      id: 'user_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 5),
      fullName: fullName.trim(),
      username: cleanUser,
      email: cleanEmail,
      campus: campus || '1337 Khouribga',
      password,
      role: '1337 Student',
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    storageService.saveUsers(updatedUsers);

    setCurrentUser(newUser);
    storageService.setCurrentUser(newUser);
    storageService.syncToDiskFile(allApplications, settings, dailyTasks, celebratedMilestones, updatedUsers, newUser);

    showToast(`Account created! Welcome to Track1337, ${newUser.fullName}!`);
    return { success: true, user: newUser };
  };

  const logout = () => {
    setCurrentUser(null);
    storageService.clearCurrentUser();
    showToast('You have logged out.');
  };

  const switchUser = (userId) => {
    const target = users.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
      storageService.setCurrentUser(target);
      showToast(`Switched account to ${target.fullName}`);
    }
  };

  const value = {
    users,
    currentUser,
    login,
    register,
    logout,
    switchUser,
    applications,
    allApplications,
    settings,
    theme,
    dailyTasks,
    stats,
    toast,
    celebration,
    celebratedMilestones,
    leetCodeProblems,
    updateProblemStatus,
    addLeetCodeProblem,
    updateLeetCodeProblem,
    deleteLeetCodeProblem,
    resetLeetCodeProblems,
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
