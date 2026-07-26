export const skillKeys = {
  all: ["skills"],
  lists: () => [...skillKeys.all, "list"],
  list: (filters) => [...skillKeys.lists(), { filters }],
  details: () => [...skillKeys.all, "detail"],
  detail: (id) => [...skillKeys.details(), id],
};
