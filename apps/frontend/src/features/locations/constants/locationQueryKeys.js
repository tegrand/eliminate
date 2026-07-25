export const locationKeys = {
  all: ["locations"],
  lists: () => [...locationKeys.all, "list"],
  list: (filters) => [...locationKeys.lists(), { filters }],
  details: () => [...locationKeys.all, "detail"],
  detail: (id) => [...locationKeys.details(), id],
};
