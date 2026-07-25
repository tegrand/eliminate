export const attendanceKeys = {
  all: ["attendance"],
  lists: () => [...attendanceKeys.all, "list"],
  list: (filters) => [...attendanceKeys.lists(), { filters }],
  details: () => [...attendanceKeys.all, "detail"],
  detail: (id) => [...attendanceKeys.details(), id],
};
