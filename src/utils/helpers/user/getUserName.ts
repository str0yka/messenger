export const getUserName = ({
  name,
  lastname,
  email,
}: Pick<User, 'name' | 'lastname' | 'email'>) => {
  let username = '';
  if (name) username = name;
  if (lastname) username = `${username} ${lastname}`;
  return username || email;
};
