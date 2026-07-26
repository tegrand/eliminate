export const agencyKeys = {
  all: ["agencies"],
  lists: () => [...agencyKeys.all, "list"],
  list: (filters) => [...agencyKeys.lists(), { filters }],
  details: () => [...agencyKeys.all, "detail"],
  detail: (id) => [...agencyKeys.details(), id],
};
