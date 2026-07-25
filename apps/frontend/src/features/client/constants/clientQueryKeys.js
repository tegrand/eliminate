export const clientKeys = {
  all: ["clients"],
  lists: () => [...clientKeys.all, "list"],
  list: (filters) => [...clientKeys.lists(), { filters }],
  details: () => [...clientKeys.all, "detail"],
  detail: (id) => [...clientKeys.details(), id],
};
