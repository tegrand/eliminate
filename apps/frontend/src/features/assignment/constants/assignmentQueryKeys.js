export const assignmentKeys = {
  all: ["assignments"],
  lists: () => [...assignmentKeys.all, "list"],
  list: (filters) => [...assignmentKeys.lists(), { filters }],
  details: () => [...assignmentKeys.all, "detail"],
  detail: (id) => [...assignmentKeys.details(), id],
};
