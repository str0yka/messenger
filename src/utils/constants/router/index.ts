export const PRIVATE_ROUTE = {
  HOME: '/',
  USER: (id: number | string) => `/${id}`,
};

export const PUBLIC_ROUTE = {
  HOME: '/',
  VERIFY: '/verify',
};
