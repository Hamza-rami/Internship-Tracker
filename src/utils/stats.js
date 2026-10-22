import { APPLICATION_STATUSES } from '../constants/statuses.js';
import { isThisWeek, isThisMonth, calculateStreaks, parseLocalDate, toLocalDateString, getFollowUpStatus } from './dateUtils.js';

/**
 * Computes all dashboard and analytics metrics from the applications collection.
 */
export function computeApplicationStats(applications = [], weeklyGoal = 10) {
  const total = applications.length;

  // Submitted applications: those that have actually been applied (not Wishlist or Preparing)
  const submittedApps = applications.filter(app => 
    app.status !== APPLICATION_STATUSES.WISHLIST &&
    app.status !== APPLICATION_STATUSES.PREPARING
  );
  const totalSubmitted = submittedApps.length;

  // Sent this week
  const sentThisWeek = submittedApps.filter(app => isThisWeek(app.applicationDate)).length;

  // Sent this month
  const sentThisMonth = submittedApps.filter(app => isThisMonth(app.applicationDate)).length;

  // Sent today
  const todayStr = toLocalDateString(new Date());
  const sentToday = submittedApps.filter(app => {
    const dStr = app.appliedDate || app.applicationDate;
    return dStr === todayStr;
  }).length;

  // Awaiting response: submitted applications that are in Applied or Follow-up status
  const awaitingResponse = applications.filter(app => 
    app.status === APPLICATION_STATUSES.APPLIED ||
    app.status === APPLICATION_STATUSES.FOLLOW_UP
  ).length;

  // Interviews scheduled: in Interview stage or with an interview date
  const interviewsScheduled = applications.filter(app => 
    app.status === APPLICATION_STATUSES.INTERVIEW ||
    Boolean(app.interviewDate)
  ).length;

  // Offers
  const offersReceived = applications.filter(app => 
    app.status === APPLICATION_STATUSES.OFFER
  ).length;

  // Rejections
  const rejections = applications.filter(app => 
    app.status === APPLICATION_STATUSES.REJECTED
  ).length;

  // Technical assessments
  const technicalAssessments = applications.filter(app =>
    app.status === APPLICATION_STATUSES.TECHNICAL_ASSESSMENT
  ).length;

  // Responded applications: received some response (Interview, Tech Assessment, Offer, Rejection)
  const respondedApps = applications.filter(app => 
    app.status === APPLICATION_STATUSES.INTERVIEW ||
    app.status === APPLICATION_STATUSES.TECHNICAL_ASSESSMENT ||
    app.status === APPLICATION_STATUSES.OFFER ||
    app.status === APPLICATION_STATUSES.REJECTED
  ).length;

  // Response rate calculation:
  // (Responded / Total Submitted) * 100
  const responseRate = totalSubmitted > 0 
    ? Math.round((respondedApps / totalSubmitted) * 100) 
    : 0;

  // Interview conversion rate: (Interview + Tech + Offer) / Total Submitted * 100
  const interviewConversionRate = totalSubmitted > 0
    ? Math.round(((interviewsScheduled + technicalAssessments + offersReceived) / totalSubmitted) * 100)
    : 0;

  // Offer conversion rate: Offers / Total Submitted * 100
  const offerConversionRate = totalSubmitted > 0
    ? Math.round((offersReceived / totalSubmitted) * 100)
    : 0;

  // Weekly progress
  const weeklyProgress = Math.min(100, Math.round((sentThisWeek / (weeklyGoal || 1)) * 100));

  // Streaks
  const { currentStreak, longestStreak, activeDaysCount } = calculateStreaks(applications);

  // Status breakdown
  const statusCounts = {};
  Object.values(APPLICATION_STATUSES).forEach(st => {
    statusCounts[st] = 0;
  });
  applications.forEach(app => {
    if (statusCounts[app.status] !== undefined) {
      statusCounts[app.status]++;
    } else {
      statusCounts[app.status] = 1;
    }
  });

  // Method breakdown
  const methodCounts = {};
  applications.forEach(app => {
    const m = app.applicationMethod || 'Other';
    methodCounts[m] = (methodCounts[m] || 0) + 1;
  });

  // Follow-ups: upcoming & overdue
  const pendingFollowUps = applications
    .filter(app => Boolean(app.nextFollowUpDate) && app.status !== APPLICATION_STATUSES.OFFER && app.status !== APPLICATION_STATUSES.WITHDRAWN)
    .map(app => ({
      ...app,
      followUpStatus: getFollowUpStatus(app.nextFollowUpDate)
    }))
    .sort((a, b) => {
      const dateA = parseLocalDate(a.nextFollowUpDate)?.getTime() || 0;
      const dateB = parseLocalDate(b.nextFollowUpDate)?.getTime() || 0;
      return dateA - dateB;
    });

  const overdueFollowUps = pendingFollowUps.filter(app => app.followUpStatus?.type === 'overdue');
  const upcomingFollowUps = pendingFollowUps.filter(app => app.followUpStatus?.type !== 'overdue');

  return {
    total,
    totalSubmitted,
    sentThisWeek,
    sentThisMonth,
    sentToday,
    awaitingResponse,
    interviewsScheduled,
    offersReceived,
    rejections,
    technicalAssessments,
    responseRate,
    interviewConversionRate,
    offerConversionRate,
    weeklyGoal,
    weeklyProgress,
    currentStreak,
    longestStreak,
    activeDaysCount,
    statusCounts,
    methodCounts,
    pendingFollowUps,
    overdueFollowUps,
    upcomingFollowUps,
    hasReachedWeeklyGoal: sentThisWeek >= weeklyGoal,
  };
}

/**
 * Prepares timeline data for Recharts (e.g., grouped by month or week)
 */
export function generateTimelineData(applications = []) {
  if (!applications.length) return [];

  // Group submitted applications by week or month
  const countsByDate = {};
  
  // Sort applications by applicationDate ascending
  const sorted = [...applications]
    .filter(a => a.applicationDate)
    .sort((a, b) => (parseLocalDate(a.applicationDate)?.getTime() || 0) - (parseLocalDate(b.applicationDate)?.getTime() || 0));

  if (!sorted.length) return [];

  sorted.forEach(app => {
    const d = parseLocalDate(app.applicationDate);
    if (!d) return;
    // Format Month Day or Month Year
    const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    countsByDate[key] = (countsByDate[key] || 0) + 1;
  });

  // Convert to chart data
  let cumulative = 0;
  return Object.entries(countsByDate).map(([date, count]) => {
    cumulative += count;
    return {
      date,
      count,
      cumulative
    };
  });
}
