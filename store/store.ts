import { create } from "zustand";

interface UserStore {
  userId: string | null;
  Dark: boolean;
  setUserId: (id: string) => void;
  setDarkMode: (mode: boolean) => void;
}

const use_Store = create<UserStore>((set) => ({
  userId: "",
  Dark: false,
  setUserId: (id) => set({ userId: id }),
  setDarkMode: (mode: boolean) => {
    localStorage.setItem("dark", String(mode));
    set({ Dark: mode });
  },
}));

export default use_Store;
