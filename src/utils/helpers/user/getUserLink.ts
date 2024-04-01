export const getUserLink = (user: Pick<User, 'id' | 'username'>) =>
  user.username ? `@${user.username}` : user.id;
