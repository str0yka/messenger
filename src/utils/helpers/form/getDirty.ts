export const getDirty = <
  T extends Record<string, unknown>,
  K extends { [J in keyof T]?: boolean | T[J] },
>(
  values: T,
  dirtyFields: K,
) => Object.fromEntries(Object.entries(values).filter(([key]) => !!dirtyFields[key]));
