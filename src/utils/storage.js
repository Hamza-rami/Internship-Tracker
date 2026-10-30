/**
 * LocalStorage management module with versioned keys, validation, error handling,
 * and JSON import/export routines.
 */

import { DEFAULT_LEETCODE_PROBLEMS } from '../constants/leetcodeProblems';

export const STORAGE_KEYS = {
  APPLICATIONS: 'track1337_applications_v1',
  SETTINGS: 'track1337_settings_v1',
  DAILY_TASKS: 'track1337_daily_tasks_v1',
  CELEBRATED_MILESTONES: 'track1337_milestones_v1',
  THEME: 'track1337_theme_v1',
  USERS: 'track1337_users_v1',
  CURRENT_USER: 'track1337_current_user_v1',
  LEETCODE_PROBLEMS: 'track1337_leetcode_problems_v1',
};

export const DEFAULT_USERS = [];

export const DEFAULT_SETTINGS = {
  weeklyGoal: 10,
  theme: 'dark',
  viewMode: 'table', // 'table' or 'cards'
  celebrationsEnabled: true,
};

// Safe JSON parser
function safeJsonParse(data, fallback = null) {
  if (!data) return fallback;
  try {
    return JSON.parse(data);
  } catch (err) {
    console.error('Storage JSON parse error:', err);
    return fallback;
  }
}

// Generate unique ID with fallback
export function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'app_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);
}

// Validate single application record
export function validateApplication(app) {
  if (!app || typeof app !== 'object') {
    return { valid: false, reason: 'Record must be a valid object' };
  }
  if (!app.companyName || typeof app.companyName !== 'string' || !app.companyName.trim()) {
    return { valid: false, reason: 'Company name is required' };
  }
  if (!app.jobTitle || typeof app.jobTitle !== 'string' || !app.jobTitle.trim()) {
    return { valid: false, reason: 'Job title is required' };
  }
  if (!app.applicationDate || typeof app.applicationDate !== 'string') {
    return { valid: false, reason: 'Application date is required' };
  }
  return { valid: true };
}

// Sanitize application object
export function sanitizeApplication(rawApp) {
  const nowIso = new Date().toISOString();
  return {
    id: rawApp.id || generateId(),
    userId: rawApp.userId || null,
    companyName: (rawApp.companyName || '').trim(),
    jobTitle: (rawApp.jobTitle || '').trim(),
    applicationDate: rawApp.applicationDate || new Date().toISOString().split('T')[0],
    appliedDate: rawApp.appliedDate || (rawApp.status !== 'Wishlist' && rawApp.status !== 'Preparing' ? rawApp.applicationDate : null),
    applicationMethod: rawApp.applicationMethod || 'Company Website',
    applicationUrl: (rawApp.applicationUrl || '').trim(),
    companyWebsite: (rawApp.companyWebsite || '').trim(),
    location: (rawApp.location || '').trim(),
    workArrangement: rawApp.workArrangement || 'Hybrid',
    opportunityType: rawApp.opportunityType || 'Internship',
    techStack: Array.isArray(rawApp.techStack) 
      ? rawApp.techStack 
      : (typeof rawApp.techStack === 'string' ? rawApp.techStack.split(',').map(s => s.trim()).filter(Boolean) : []),
    status: rawApp.status || 'Applied',
    recruiterName: (rawApp.recruiterName || '').trim(),
    contactInfo: (rawApp.contactInfo || rawApp.contactEmail || '').trim(),
    nextFollowUpDate: rawApp.nextFollowUpDate || '',
    interviewDate: rawApp.interviewDate || '',
    interviewTime: rawApp.interviewTime || '',
    notes: rawApp.notes || '',
    updatedAt: rawApp.updatedAt || nowIso,
    createdAt: rawApp.createdAt || nowIso,
  };
}

// Storage Accessors
export const storageService = {
  // Applications
  getApplications() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      const parsed = safeJsonParse(data, []);
      if (Array.isArray(parsed)) {
        return parsed.map(sanitizeApplication);
      }
      return [];
    } catch (e) {
      console.error('Failed to read applications from localStorage:', e);
      return [];
    }
  },

  saveApplications(applications) {
    try {
      const sanitized = applications.map(sanitizeApplication);
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(sanitized));
      return true;
    } catch (e) {
      console.error('Failed to save applications to localStorage:', e);
      return false;
    }
  },

  // Settings
  getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      const parsed = safeJsonParse(data, {});
      return { ...DEFAULT_SETTINGS, ...parsed };
    } catch (e) {
      return { ...DEFAULT_SETTINGS };
    }
  },

  saveSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      return true;
    } catch (e) {
      console.error('Failed to save settings:', e);
      return false;
    }
  },

  // Daily Tasks
  getDailyTasks() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DAILY_TASKS);
      return safeJsonParse(data, null);
    } catch (e) {
      return null;
    }
  },

  saveDailyTasks(dailyData) {
    try {
      localStorage.setItem(STORAGE_KEYS.DAILY_TASKS, JSON.stringify(dailyData));
      return true;
    } catch (e) {
      return false;
    }
  },

  // Celebrated Milestones
  getMilestones() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CELEBRATED_MILESTONES);
      return safeJsonParse(data, []);
    } catch (e) {
      return [];
    }
  },

  saveMilestones(milestones) {
    try {
      localStorage.setItem(STORAGE_KEYS.CELEBRATED_MILESTONES, JSON.stringify(milestones));
      return true;
    } catch (e) {
      return false;
    }
  },

  // LeetCode Practice Problems
  getLeetCodeProblems() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LEETCODE_PROBLEMS);
      const parsed = safeJsonParse(data, null);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      return DEFAULT_LEETCODE_PROBLEMS;
    } catch (e) {
      return DEFAULT_LEETCODE_PROBLEMS;
    }
  },

  saveLeetCodeProblems(problems) {
    try {
      localStorage.setItem(STORAGE_KEYS.LEETCODE_PROBLEMS, JSON.stringify(problems));
      return true;
    } catch (e) {
      console.error('Failed to save leetcode problems to storage:', e);
      return false;
    }
  },

  // Export complete backup as JSON file
  exportBackupFile(applications, settings, leetCodeProblems = null) {
    try {
      const backupData = {
        app: 'Track1337-Internship-Tracker',
        version: '1.2',
        exportedAt: new Date().toISOString(),
        settings: settings || DEFAULT_SETTINGS,
        applications: applications.map(sanitizeApplication),
        leetCodeProblems: leetCodeProblems || this.getLeetCodeProblems(),
      };

      const jsonStr = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const datePart = new Date().toISOString().split('T')[0];
      a.href = url;
      a.download = `track1337_backup_${datePart}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return { success: true };
    } catch (err) {
      console.error('Export error:', err);
      return { success: false, error: err.message };
    }
  },

  // Validate imported JSON data
  validateImportPayload(content) {
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (err) {
      return {
        valid: false,
        error: 'The uploaded file is not a valid JSON document.'
      };
    }

    // Support either direct array of applications or full backup object { applications: [...] }
    let rawApps = [];
    let settings = null;

    if (Array.isArray(parsed)) {
      rawApps = parsed;
    } else if (parsed && typeof parsed === 'object') {
      if (Array.isArray(parsed.applications)) {
        rawApps = parsed.applications;
        settings = parsed.settings || null;
      } else {
        return {
          valid: false,
          error: 'JSON structure unrecognized. Expected an array of applications or a backup object with an "applications" array.'
        };
      }
    } else {
      return {
        valid: false,
        error: 'Invalid file format.'
      };
    }

    if (rawApps.length === 0) {
      return {
        valid: false,
        error: 'The imported file contains no applications.'
      };
    }

    // Validate entries
    const invalidItems = [];
    const validApps = [];

    rawApps.forEach((item, index) => {
      const val = validateApplication(item);
      if (val.valid) {
        validApps.push(sanitizeApplication(item));
      } else {
        invalidItems.push(`Item #${index + 1}: ${val.reason}`);
      }
    });

    if (validApps.length === 0) {
      return {
        valid: false,
        error: `All items were invalid:\n${invalidItems.slice(0, 3).join('\n')}`
      };
    }

    return {
      valid: true,
      applications: validApps,
      settings: settings,
      totalCount: rawApps.length,
      validCount: validApps.length,
      invalidCount: invalidItems.length,
      warnings: invalidItems.length > 0 ? invalidItems : null
    };
  },

  // Users
  getUsers() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      const parsed = safeJsonParse(data, null);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [];
    } catch (e) {
      return [];
    }
  },

  saveUsers(users) {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      return true;
    } catch (e) {
      console.error('Failed to save users:', e);
      return false;
    }
  },

  getCurrentUser() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return safeJsonParse(data, null);
    } catch (e) {
      return null;
    }
  },

  setCurrentUser(user) {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
      return true;
    } catch (e) {
      return false;
    }
  },

  clearCurrentUser() {
    try {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      return true;
    } catch (e) {
      return false;
    }
  },

  // Clear all tracker local data
  clearAllTrackerData() {
    try {
      localStorage.removeItem(STORAGE_KEYS.APPLICATIONS);
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
      localStorage.removeItem(STORAGE_KEYS.DAILY_TASKS);
      localStorage.removeItem(STORAGE_KEYS.CELEBRATED_MILESTONES);
      localStorage.removeItem(STORAGE_KEYS.LEETCODE_PROBLEMS);
      return true;
    } catch (e) {
      console.error('Failed to clear storage:', e);
      return false;
    }
  },

  // Storage diagnosis info
  getStorageInfo() {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return { origin: 'unknown', rawBytes: 0, appCount: 0 };
      }
      const raw = localStorage.getItem(STORAGE_KEYS.APPLICATIONS) || '';
      const parsed = safeJsonParse(raw, []);
      return {
        origin: window.location.origin,
        rawBytes: new Blob([raw]).size,
        appCount: Array.isArray(parsed) ? parsed.length : 0,
      };
    } catch (e) {
      return { origin: 'unknown', rawBytes: 0, appCount: 0 };
    }
  },

  // Auto-sync all data to local project disk file (data/tracker_data.json)
  async syncToDiskFile(applications, settings, dailyTasks = null, celebratedMilestones = [], users = null, currentUser = null, leetCodeProblems = null) {
    try {
      if (typeof window === 'undefined' || !window.fetch) return false;
      const payload = {
        app: 'Track1337-Internship-Tracker',
        version: '1.2',
        lastUpdated: new Date().toISOString(),
        settings: settings || DEFAULT_SETTINGS,
        dailyTasks: dailyTasks || null,
        celebratedMilestones: celebratedMilestones || [],
        users: users || this.getUsers(),
        currentUser: currentUser || this.getCurrentUser(),
        leetCodeProblems: leetCodeProblems || this.getLeetCodeProblems(),
        applications: applications.map(sanitizeApplication),
      };
      const res = await fetch('/api/storage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload, null, 2),
      });
      return res.ok;
    } catch (e) {
      return false;
    }
  },

  // Fetch from local project disk file (data/tracker_data.json)
  async fetchDiskFile() {
    try {
      if (typeof window === 'undefined' || !window.fetch) return null;
      const res = await fetch('/api/storage');
      if (!res.ok) return null;
      const data = await res.json();
      if (data && typeof data === 'object') {
        const apps = Array.isArray(data.applications) ? data.applications.map(sanitizeApplication) : [];
        return {
          applications: apps,
          settings: data.settings || null,
          dailyTasks: data.dailyTasks || null,
          celebratedMilestones: data.celebratedMilestones || [],
          users: Array.isArray(data.users) ? data.users : null,
          currentUser: data.currentUser || null,
          leetCodeProblems: Array.isArray(data.leetCodeProblems) ? data.leetCodeProblems : null,
          lastUpdated: data.lastUpdated || null,
        };
      }
      return null;
    } catch (e) {
      return null;
    }
  },

  // Compatibility aliases
  async syncToDiskBackup(applications, settings) {
    return this.syncToDiskFile(applications, settings);
  },

  async fetchDiskBackup() {
    return this.fetchDiskFile();
  }
};
