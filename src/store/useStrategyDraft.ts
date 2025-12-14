import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Strategy } from "@/types";

interface DraftState {
  draft: Partial<Strategy> & {
    name?: string;
    id?: string;
    timeframe?: 'M1' | 'M5' | 'M15';
    cycleFrequency?: '5min' | '10min';
    referenceCandles?: number[];
    entryCandle?: number;
    mgMode?: 'sequenciado' | 'alternado';
  };
  isDirty: boolean;
  setField: (key: keyof Strategy | "name" | "id", value: any) => void;
  reset: () => void;
}

export const useStrategyDraft = create<DraftState>()(
  persist(
    (set, get) => ({
      draft: {
        name: "Nova Estratégia",
        id: "custom-estrategia",
        timeframe: "M1",
        cycleFrequency: "10min",
        quadrantSize: 5,
        analysisSize: 3,
        decisionRule: "minority",
        entryOffset: 0,
        referenceCandles: [1, 2, 3],
        entryCandle: 1,
        mgMode: "sequenciado",
      },
      isDirty: false,
      setField: (key, value) =>
        set({
          draft: { ...get().draft, [key]: value },
          isDirty: true,
        }),
      reset: () =>
        set({
          draft: {
            name: "Nova Estratégia",
            id: "custom-estrategia",
            timeframe: "M1",
            cycleFrequency: "10min",
            quadrantSize: 5,
            analysisSize: 3,
            decisionRule: "minority",
            entryOffset: 0,
            referenceCandles: [1, 2, 3],
            entryCandle: 1,
            mgMode: "sequenciado",
          },
          isDirty: false,
        }),
    }),
    { name: "strategy-draft" }
  )
);
