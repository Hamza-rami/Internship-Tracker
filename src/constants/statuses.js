export const APPLICATION_STATUSES = {
  WISHLIST: 'Wishlist',
  PREPARING: 'Preparing',
  APPLIED: 'Applied',
  FOLLOW_UP: 'Follow-up',
  INTERVIEW: 'Interview',
  TECHNICAL_ASSESSMENT: 'Technical Assessment',
  OFFER: 'Offer',
  REJECTED: 'Rejected',
  WITHDRAWN: 'Withdrawn',
};

export const STATUS_CONFIG = {
  [APPLICATION_STATUSES.WISHLIST]: {
    label: 'Wishlist',
    color: 'text-purple-400 bg-purple-500/10 border-purple-500/20 dark:text-purple-300 dark:bg-purple-900/30 dark:border-purple-800/40',
    dotColor: 'bg-purple-400',
    accentColor: '#c084fc',
    stage: 'Planning',
    description: 'Companies and roles you want to apply to.',
  },
  [APPLICATION_STATUSES.PREPARING]: {
    label: 'Preparing',
    color: 'text-blue-400 bg-blue-500/10 border-blue-500/20 dark:text-blue-300 dark:bg-blue-900/30 dark:border-blue-800/40',
    dotColor: 'bg-blue-400',
    accentColor: '#60a5fa',
    stage: 'Planning',
    description: 'Tailoring CV, cover letter, or portfolio for this role.',
  },
  [APPLICATION_STATUSES.APPLIED]: {
    label: 'Applied',
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/20 dark:text-amber-300 dark:bg-amber-900/30 dark:border-amber-800/40',
    dotColor: 'bg-amber-400',
    accentColor: '#fbbf24',
    stage: 'Active',
    description: 'Application successfully submitted, awaiting response.',
  },
  [APPLICATION_STATUSES.FOLLOW_UP]: {
    label: 'Follow-up',
    color: 'text-orange-400 bg-orange-500/10 border-orange-500/20 dark:text-orange-300 dark:bg-orange-900/30 dark:border-orange-800/40',
    dotColor: 'bg-orange-400',
    accentColor: '#fb923c',
    stage: 'Active',
    description: 'Follow-up message sent or scheduled to recruiter.',
  },
  [APPLICATION_STATUSES.INTERVIEW]: {
    label: 'Interview',
    color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20 dark:text-cyan-300 dark:bg-cyan-900/30 dark:border-cyan-800/40',
    dotColor: 'bg-cyan-400',
    accentColor: '#22d3ee',
    stage: 'Interviewing',
    description: 'HR screening or technical interview scheduled.',
  },
  [APPLICATION_STATUSES.TECHNICAL_ASSESSMENT]: {
    label: 'Technical Assessment',
    color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20 dark:text-indigo-300 dark:bg-indigo-900/30 dark:border-indigo-800/40',
    dotColor: 'bg-indigo-400',
    accentColor: '#818cf8',
    stage: 'Interviewing',
    description: 'Take-home project, coding test, or pair programming.',
  },
  [APPLICATION_STATUSES.OFFER]: {
    label: 'Offer',
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 dark:text-emerald-300 dark:bg-emerald-900/30 dark:border-emerald-800/40',
    dotColor: 'bg-emerald-400',
    accentColor: '#34d399',
    stage: 'Concluded',
    description: 'Formal internship or job offer received!',
  },
  [APPLICATION_STATUSES.REJECTED]: {
    label: 'Rejected',
    color: 'text-rose-400 bg-rose-500/10 border-rose-500/20 dark:text-rose-300 dark:bg-rose-900/30 dark:border-rose-800/40',
    dotColor: 'bg-rose-400',
    accentColor: '#f43f5e',
    stage: 'Concluded',
    description: 'Application was not selected. Keep going!',
  },
  [APPLICATION_STATUSES.WITHDRAWN]: {
    label: 'Withdrawn',
    color: 'text-slate-400 bg-slate-500/10 border-slate-500/20 dark:text-slate-400 dark:bg-slate-800/40 dark:border-slate-700/50',
    dotColor: 'bg-slate-400',
    accentColor: '#94a3b8',
    stage: 'Concluded',
    description: 'You decided to withdraw your application.',
  },
};

export const APPLICATION_METHODS = [
  'Company Website',
  'LinkedIn',
  'Email',
  'Referral',
  'Job Board',
  'Other'
];

export const WORK_ARRANGEMENTS = [
  'Onsite',
  'Remote',
  'Hybrid'
];

export const OPPORTUNITY_TYPES = [
  'Internship',
  'Junior Job',
  'Other'
];

export const DEFAULT_DAILY_CHECKLIST = [
  { id: 'find_opportunities', text: 'Find 3 relevant internship opportunities (LinkedIn, Welcome to the Jungle, Rekrute, direct career pages)', completed: false },
  { id: 'submit_applications', text: 'Submit target applications with tailored notes or portfolio links', completed: false },
  { id: 'follow_up', text: 'Follow up on previous applications or connect with recruiters', completed: false },
  { id: 'improve_skills', text: 'Work on portfolio project, GitHub code, or 1337 peer curriculum', completed: false },
];

export const MILESTONES = [
  { count: 5, title: 'First Steps', description: '5 applications submitted. Momentum is building!' },
  { count: 10, title: 'Double Digits', description: '10 applications submitted. Consistency pays off.' },
  { count: 25, title: 'Dedicated Job Hunter', description: '25 applications tracked. Your network is expanding.' },
  { count: 50, title: 'Half Century', description: '50 applications sent. True resilience and focus!' },
  { count: 100, title: 'Century Club', description: '100 applications reached. Unstoppable dedication.' },
];
