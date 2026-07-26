export const payrollKeys = {
  all: ["payrolls"],
  lists: () => [...payrollKeys.all, "list"],
  list: (filters) => [...payrollKeys.lists(), { filters }],
  details: () => [...payrollKeys.all, "detail"],
  detail: (id) => [...payrollKeys.details(), id],
};
