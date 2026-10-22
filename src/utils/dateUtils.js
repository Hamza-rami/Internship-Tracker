/**
 * Date utility functions designed to work strictly with user's local timezone.
 */

// Formats a Date object to YYYY-MM-DD local date string
export function toLocalDateString(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Parses a YYYY-MM-DD or ISO string into a local Date object safely
export function parseLocalDate(dateStr) {
  if (!dateStr) return null;
  // If format is YYYY-MM-DD, extract parts directly to avoid UTC shift
  if (typeof dateStr === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

// Format friendly date like "Oct 9, 2026"
export function formatDisplayDate(dateStr) {
  if (!dateStr) return '—';
  const d = parseLocalDate(dateStr);
  if (!d) return '—';
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

// Format follow-up relative status
export function getFollowUpStatus(dateStr) {
  if (!dateStr) return null;
  const target = parseLocalDate(dateStr);
  if (!target) return null;

  const todayStr = toLocalDateString(new Date());
  const today = parseLocalDate(todayStr);

  const diffMs = target.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const daysAgo = Math.abs(diffDays);
    return {
      type: 'overdue',
      label: `${daysAgo} day${daysAgo === 1 ? '' : 's'} overdue`,
      days: diffDays,
      badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/30 dark:bg-rose-950/40 dark:text-rose-300'
    };
  } else if (diffDays === 0) {
    return {
      type: 'today',
      label: 'Due today',
      days: 0,
      badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-300'
    };
  } else if (diffDays === 1) {
    return {
      type: 'tomorrow',
      label: 'Due tomorrow',
      days: 1,
      badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/30 dark:bg-blue-950/40 dark:text-blue-300'
    };
  } else {
    return {
      type: 'upcoming',
      label: `In ${diffDays} days`,
      days: diffDays,
      badgeClass: 'bg-slate-500/10 text-slate-400 border-slate-500/30 dark:bg-slate-800/60 dark:text-slate-300'
    };
  }
}

// Check if date falls in current calendar week (Monday to Sunday)
export function isThisWeek(dateStr) {
  if (!dateStr) return false;
  const d = parseLocalDate(dateStr);
  if (!d) return false;

  const now = new Date();
  const currentDayOfWeek = (now.getDay() + 6) % 7; // Monday = 0, Sunday = 6
  
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - currentDayOfWeek);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return d >= monday && d <= sunday;
}

// Check if date falls in current calendar month
export function isThisMonth(dateStr) {
  if (!dateStr) return false;
  const d = parseLocalDate(dateStr);
  if (!d) return false;

  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
}

/**
 * Calculates streaks based on unique application dates.
 * A day counts as an application day if an application was applied on that date.
 * Uses local dates.
 */
export function calculateStreaks(applications = []) {
  // Collect unique local dates where application was applied
  // Only count applications that have reached at least 'Applied', 'Follow-up', 'Interview',
  // 'Technical Assessment', 'Offer', 'Rejected', 'Withdrawn' if they had an appliedDate
  const appliedDatesSet = new Set();

  applications.forEach(app => {
    // We check app.appliedDate or app.appliedAt or app.applicationDate
    const dateStr = app.appliedDate || (app.status !== 'Wishlist' && app.status !== 'Preparing' ? app.applicationDate : null);
    if (dateStr) {
      const normalized = toLocalDateString(parseLocalDate(dateStr));
      if (normalized) {
        appliedDatesSet.add(normalized);
      }
    }
  });

  const sortedDates = Array.from(appliedDatesSet).sort().reverse(); // newest first
  if (sortedDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0, activeDaysCount: 0, appliedDates: [] };
  }

  const todayStr = toLocalDateString(new Date());
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = toLocalDateString(yesterday);

  // Check current streak: must include today or yesterday to still be alive
  let currentStreak = 0;
  let checkDate = appliedDatesSet.has(todayStr) 
    ? new Date() 
    : (appliedDatesSet.has(yesterdayStr) ? yesterday : null);

  if (checkDate) {
    while (true) {
      const checkStr = toLocalDateString(checkDate);
      if (appliedDatesSet.has(checkStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Calculate longest streak across all history
  const allAscending = Array.from(appliedDatesSet).sort();
  let longestStreak = 0;
  let tempStreak = 0;
  let prevDate = null;

  for (const dateStr of allAscending) {
    const curDate = parseLocalDate(dateStr);
    if (!prevDate) {
      tempStreak = 1;
    } else {
      const diffMs = curDate.getTime() - prevDate.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        tempStreak++;
      } else if (diffDays > 1) {
        tempStreak = 1;
      }
    }
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
    prevDate = curDate;
  }

  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
    activeDaysCount: appliedDatesSet.size,
    appliedDates: Array.from(appliedDatesSet)
  };
}

/**
 * Generate heatmap grid data for the last N weeks (e.g., 16 weeks ~ 112 days)
 */
export function generateHeatmapData(applications = [], weeksCount = 16) {
  const dateCounts = {};
  
  applications.forEach(app => {
    const dateStr = app.appliedDate || (app.status !== 'Wishlist' && app.status !== 'Preparing' ? app.applicationDate : null);
    if (dateStr) {
      const normalized = toLocalDateString(parseLocalDate(dateStr));
      if (normalized) {
        dateCounts[normalized] = (dateCounts[normalized] || 0) + 1;
      }
    }
  });

  const totalDays = weeksCount * 7;
  const today = new Date();
  
  // Find current day of week (Monday = 0, Sunday = 6)
  const currentDayOfWeek = (today.getDay() + 6) % 7;
  
  // Start date should align so that the end is today or end of this week
  const endDate = new Date(today);
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - totalDays + (6 - currentDayOfWeek));

  const days = [];
  const cur = new Date(startDate);
  
  while (cur <= endDate) {
    const dateStr = toLocalDateString(cur);
    const count = dateCounts[dateStr] || 0;
    days.push({
      date: dateStr,
      count,
      isToday: dateStr === toLocalDateString(today),
      dayOfWeek: (cur.getDay() + 6) % 7 // Mon=0, Sun=6
    });
    cur.setDate(cur.getDate() + 1);
  }

  return days;
}
