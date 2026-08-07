export const calculateWorkerProfileCompletion = (user) => {
  if (!user || user.profileType !== 'WORKER') return 0;
  let score = 0;
  let total = 3;

  const worker = user.workerProfile || {};

  // 1. Work Preferences
  const isWorkPrefsComplete = !!(worker.jobType && worker.totalExperienceYears != null);
  if (isWorkPrefsComplete) score += 1;

  // 2. Location Preferences
  const isLocPrefsComplete = !!(worker.district && worker.state);
  if (isLocPrefsComplete) score += 1;

  // 3. Documents (using localStorage as a fallback since Header might not fetch it directly)
  if (localStorage.getItem("docsUploaded") === "true") score += 1;

  return Math.round((score / total) * 100);
};
