export const isUserLinkValid = (value: unknown) => {
  if (typeof value === 'string') {
    return !!value.length && (value.charAt(0) === '@' || !Number.isNaN(Number(value)));
  }

  return false;
};
