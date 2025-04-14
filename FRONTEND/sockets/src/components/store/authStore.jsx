import { create } from "zustand";
import axiosInstance from "../../axiosInstance";



const useAuthStore = create((set) => ({
 
  token: localStorage.getItem("token") || null,
  username: localStorage.getItem("username") || null,
  role: localStorage.getItem("role") || null,
  userid: localStorage.getItem("userid") || null,
  status: localStorage.getItem("status") || null,

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

  setUserId: (newUserId) => {
    localStorage.setItem("userid", newUserId);
    set({ userid: newUserId });
  },

  setStatus: (newStatus) => {
    localStorage.setItem("status", newStatus);
    set({ status: newStatus});
  },


  clearToken: () => {
    localStorage.removeItem("token");  
    set({ token: null });
  },

  clearUserData: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("userid"); // Clear userid
    localStorage.removeItem("status");
    set({ token: null, username: null, role: null, userid: null ,status:null}); // Reset userid
  },
}));

export default useAuthStore;
