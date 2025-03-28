import { create } from "zustand";

const useAuthStore = create((set) => ({
 
  token: localStorage.getItem("token") || null,
  username: localStorage.getItem("username") || null,
  role: localStorage.getItem("role") || null,

  setToken: (newToken) => {
    localStorage.setItem("token", newToken);
    set({ token: newToken });
  },

  setUsername: (newUsername) => {
    localStorage.setItem("username", newUsername);
    set({ username: newUsername });
  },

  setRole: (newRole) => {
    localStorage.setItem("role", newRole);
    set({ role: newRole });
  },

  clearToken: () => {
    localStorage.removeItem("token");  
    set({ token: null });
  },

  clearUserData: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    set({ token: null, username: null, role: null });
  },
}));

export default useAuthStore;
