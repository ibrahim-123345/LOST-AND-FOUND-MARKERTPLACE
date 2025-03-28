import {create} from "zustand";

const useThemeStore = create((set) => ({
  isDarkMode: localStorage.getItem("isDarkMode") === "true", 
  toggleDarkMode: () => {
    set((state) => {
      const newMode = !state.isDarkMode;
      localStorage.setItem("isDarkMode", newMode);
      return { isDarkMode: newMode };
    });
  },
}));

export default useThemeStore;
