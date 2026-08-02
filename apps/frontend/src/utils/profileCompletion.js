export const calculateWorkerProfileCompletion = (user) => {
  if (!user || user.profileType !== 'WORKER') return 0;
  let score = 0;
  let total = 4;

  const isBasicComplete = !!(user.firstName || user.name) && !!(user.phone || user.email);
  if (isBasicComplete) score += 1;

  if (localStorage.getItem("workPrefsSaved") === "true") score += 1;
  if (localStorage.getItem("locPrefsSaved") === "true") score += 1;
  if (localStorage.getItem("docsUploaded") === "true") score += 1;

  return Math.round((score / total) * 100);
};
