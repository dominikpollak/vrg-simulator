import { create } from "zustand";

interface MeasureDialogState {
  isMeasureDialogOpen: boolean;
  setIsMeasureDialogOpen: (isOpen: boolean) => void;
}

export const useMeasureDialogStore = create<MeasureDialogState>((set) => ({
  isMeasureDialogOpen: false,
  setIsMeasureDialogOpen: (state) =>
    set({
      isMeasureDialogOpen: state,
    }),
}));
