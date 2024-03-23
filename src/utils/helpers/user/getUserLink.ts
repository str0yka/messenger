export const getUserLink = (partner: Pick<User, 'id' | 'username'>) =>
  partner.username ? `@${partner.username}` : partner.id;
