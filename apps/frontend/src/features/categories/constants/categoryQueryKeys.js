export const categoryKeys = {
  all: ["categories"],
  lists: () => [...categoryKeys.all, "list"],
  list: (filters) => [...categoryKeys.lists(), { filters }],
  details: () => [...categoryKeys.all, "detail"],
  detail: (id) => [...categoryKeys.details(), id],
};
