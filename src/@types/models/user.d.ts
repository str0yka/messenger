interface User {
  bio: string | null;
  lastname: string | null;
  name: string;
  username: string | null;
  status: 'ONLINE' | 'OFFLINE';
  id: number;
  email: string;
  isVerified: boolean;
  updatedAt: string;
  createdAt: string;
  avatar: string | null;
}

type UserStatus = 'ONLINE' | 'OFFLINE';
