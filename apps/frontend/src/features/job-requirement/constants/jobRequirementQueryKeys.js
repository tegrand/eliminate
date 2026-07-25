export const jobRequirementKeys = {
  all: ["job-requirements"],
  lists: () => [...jobRequirementKeys.all, "list"],
  list: (filters) => [...jobRequirementKeys.lists(), { filters }],
  details: () => [...jobRequirementKeys.all, "detail"],
  detail: (id) => [...jobRequirementKeys.details(), id],
};
