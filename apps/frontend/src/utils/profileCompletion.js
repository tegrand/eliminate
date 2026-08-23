export const calculateWorkerProfileCompletion = (user) => {
  if (!user || user.profileType !== 'WORKER') return 0;
  
  const profileData = user.workerProfile || {};
  
  const requiredFields = [
    profileData.firstName,
    profileData.phone,
    profileData.gender,
    profileData.dateOfBirth,
    profileData.city,
    profileData.district,
    profileData.jobType || (profileData.skills && profileData.skills.length > 0),
    profileData.totalExperienceYears !== null && profileData.totalExperienceYears !== undefined,
    profileData.expectedDailyWage,
    profileData.resumeUrl || profileData.aadhaarNumber,
  ];
  
  const filledFields = requiredFields.filter(field => Boolean(field));
  return Math.round((filledFields.length / requiredFields.length) * 100);
};
