export const languageKeys = {
  all: ["languages"],
  lists: () => [...languageKeys.all, "list"],
  list: (filters) => [...languageKeys.lists(), { filters }],
  details: () => [...languageKeys.all, "detail"],
  detail: (id) => [...languageKeys.details(), id],
};
