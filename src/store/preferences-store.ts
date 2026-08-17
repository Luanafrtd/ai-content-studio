import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PreferencesState {
  tablePageSize: number;
  setTablePageSize: (size: number) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      tablePageSize: 10,
      setTablePageSize: (size) => set({ tablePageSize: size }),
    }),
    { name: "quill-preferences" },
  ),
);
