import assert from 'node:assert';
import { 
  toLocalDateString, 
  parseLocalDate, 
  calculateStreaks, 
  getFollowUpStatus 
} from '../src/utils/dateUtils.js';
import { 
  computeApplicationStats 
} from '../src/utils/stats.js';
import { 
  validateApplication, 
  sanitizeApplication, 
  storageService 
} from '../src/utils/storage.js';
import { 
  getRealisticSampleApplications 
} from '../src/utils/sampleData.js';
import { APPLICATION_STATUSES } from '../src/constants/statuses.js';

console.log('🧪 Starting Tracker Verification Test Suite...');

// 1. Date utilities test
{
  const today = new Date();
  const todayStr = toLocalDateString(today);
  assert.match(todayStr, /^\d{4}-\d{2}-\d{2}$/, 'Today format must be YYYY-MM-DD');

  const parsed = parseLocalDate('2026-10-09');
  assert.strictEqual(parsed.getFullYear(), 2026);
  assert.strictEqual(parsed.getMonth(), 9); // October is 9
  assert.strictEqual(parsed.getDate(), 9);

  // Follow-up status
  const overdueStatus = getFollowUpStatus('2026-10-01');
  assert.strictEqual(overdueStatus.type, 'overdue');

  console.log('✓ Date utilities verified.');
}

// 2. Streak calculation test
{
  const apps = [
    { id: '1', status: 'Applied', applicationDate: '2026-10-09', appliedDate: '2026-10-09' },
    { id: '2', status: 'Applied', applicationDate: '2026-10-08', appliedDate: '2026-10-08' },
    { id: '3', status: 'Applied', applicationDate: '2026-10-07', appliedDate: '2026-10-07' },
    // Multiple on same day should count once
    { id: '4', status: 'Applied', applicationDate: '2026-10-07', appliedDate: '2026-10-07' },
  ];

  const streaks = calculateStreaks(apps);
  assert.strictEqual(streaks.activeDaysCount, 3, 'Active days count should be 3 unique days');
  assert.ok(streaks.longestStreak >= 3, 'Longest streak should be at least 3');
  console.log('✓ Streak calculations verified.');
}

// 3. Stats and Response Rate test
{
  const testApps = [
    { id: '1', status: APPLICATION_STATUSES.APPLIED, applicationDate: '2026-10-09' },
    { id: '2', status: APPLICATION_STATUSES.INTERVIEW, applicationDate: '2026-10-08' },
    { id: '3', status: APPLICATION_STATUSES.REJECTED, applicationDate: '2026-10-07' },
    { id: '4', status: APPLICATION_STATUSES.OFFER, applicationDate: '2026-10-06' },
    { id: '5', status: APPLICATION_STATUSES.WISHLIST, applicationDate: '2026-10-09' }, // not submitted
  ];

  const stats = computeApplicationStats(testApps, 10);
  assert.strictEqual(stats.total, 5);
  assert.strictEqual(stats.totalSubmitted, 4); // wishlist excluded
  // Responded: Interview (1) + Rejected (1) + Offer (1) = 3
  // Response rate: 3 / 4 * 100 = 75%
  assert.strictEqual(stats.responseRate, 75);
  assert.strictEqual(stats.offersReceived, 1);
  assert.strictEqual(stats.interviewsScheduled, 1);
  assert.strictEqual(stats.rejections, 1);
  console.log('✓ Stats and Response Rate formulas verified.');
}

// 4. Validation and Sanitization test
{
  const validApp = {
    companyName: 'OCP Group',
    jobTitle: 'Software Intern',
    applicationDate: '2026-10-09'
  };
  const val = validateApplication(validApp);
  assert.strictEqual(val.valid, true);

  const invalidApp = {
    companyName: '',
    jobTitle: 'Software Intern'
  };
  const invalidVal = validateApplication(invalidApp);
  assert.strictEqual(invalidVal.valid, false);

  const sanitized = sanitizeApplication(validApp);
  assert.ok(sanitized.id, 'Should generate an ID');
  assert.strictEqual(sanitized.status, 'Applied');
  assert.strictEqual(sanitized.workArrangement, 'Hybrid');
  console.log('✓ Validation and sanitization verified.');
}

// 5. JSON Import validation test
{
  const validPayload = JSON.stringify({
    applications: [
      { companyName: 'Company A', jobTitle: 'Junior Dev', applicationDate: '2026-10-09' },
      { companyName: 'Company B', jobTitle: 'Intern', applicationDate: '2026-10-08' },
    ]
  });

  const res = storageService.validateImportPayload(validPayload);
  assert.strictEqual(res.valid, true);
  assert.strictEqual(res.validCount, 2);

  const invalidJson = '{ bad json ';
  const badRes = storageService.validateImportPayload(invalidJson);
  assert.strictEqual(badRes.valid, false);

  console.log('✓ JSON Import validation routines verified.');
}

// 6. Realistic Sample Dataset test
{
  const samples = getRealisticSampleApplications();
  assert.ok(samples.length >= 7, 'Should have at least 7 realistic samples');
  samples.forEach(s => {
    const v = validateApplication(s);
    assert.strictEqual(v.valid, true, `Sample ${s.companyName} must be valid`);
  });
  console.log('✓ Sample dataset structure verified.');
}

console.log('🎉 ALL VERIFICATION TESTS PASSED SUCCESSFULLY!');
