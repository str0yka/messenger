import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UserStore {
  user: {
    id: User['id'];
    email: User['email'];
    isVerified: User['isVerified'];
  } | null;
  setUser: (user: User) => void;
  resetUser: () => void;
}
export const useUserStore = create<UserStore>()(
  devtools((set) => ({
    user: null,
    setUser: (user) => set(() => ({ user })),
    resetUser: () => set(() => ({ user: null })),
  })),
);
