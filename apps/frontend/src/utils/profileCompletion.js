export const calculateWorkerProfileCompletion = (user) => {
  if (!user || user.profileType !== 'WORKER') return 0;
  let score = 0;
  let total = 5;

  if (user.name) score += 1;
  if (user.phone || user.email) score += 1;
  if (user.profileImage) score += 1;
  if (user.worker) score += 1;
  if (user.worker?.agencyId) score += 1;

  return Math.round((score / total) * 100);
};
