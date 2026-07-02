"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSound } from "./SoundProvider";

/** Full registry — later-phase ids ship locked, like any honest game. */
export const ACHIEVEMENTS = {
  RECON: "Recon — visited all sectors",
  KONAMI: "Cheat code accepted",
  INSPECTED_ITEM: "Armory check — inspected an item",
  FOUND_TERMINAL: "Backdoor — opened the terminal",
  SUDO_HIRE: "Privilege escalation — sudo hire",
} as const;

export type AchievementId = keyof typeof ACHIEVEMENTS;

const STORAGE_KEY = "achievements-v1";

type AchApi = {
  unlocked: AchievementId[];
  unlock: (id: AchievementId) => void;
  total: number;
};

const AchContext = createContext<AchApi>({
  unlocked: [],
  unlock: () => {},
  total: Object.keys(ACHIEVEMENTS).length,
});

export const useAchievements = () => useContext(AchContext);

export default function AchievementsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { play } = useSound();
  const [unlocked, setUnlocked] = useState<AchievementId[]>([]);
  const [toasts, setToasts] = useState<{ id: AchievementId; key: number }[]>(
    [],
  );
  const keyRef = useRef(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const ids = (JSON.parse(raw) as string[]).filter(
          (x): x is AchievementId => x in ACHIEVEMENTS,
        );
        setUnlocked(ids);
      }
    } catch {
      /* corrupted storage — start clean */
    }
  }, []);

  const unlock = useCallback(
    (id: AchievementId) => {
      setUnlocked((prev) => {
        if (prev.includes(id)) return prev;
        const next = [...prev, id];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        const key = ++keyRef.current;
        setToasts((t) => [...t, { id, key }]);
        play("sting");
        setTimeout(
          () => setToasts((t) => t.filter((x) => x.key !== key)),
          4200,
        );
        return next;
      });
    },
    [play],
  );

  return (
    <AchContext.Provider
      value={{ unlocked, unlock, total: Object.keys(ACHIEVEMENTS).length }}
    >
      {children}
      {/* toast stack */}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[90] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.key}
            className="animate-toast-in flex items-center gap-3 border border-gold bg-[rgba(13,17,23,0.96)] px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.6)]"
          >
            <span className="flex h-7 w-7 items-center justify-center border border-[#4d3d14] bg-[rgba(77,61,20,0.25)] font-mono text-[12px] font-bold text-gold">
              ★
            </span>
            <div className="flex flex-col">
              <span className="font-mono text-[9px] font-semibold tracking-wide2 text-legendary">
                ACHIEVEMENT UNLOCKED
              </span>
              <span className="text-[13px] font-semibold text-ink2">
                {ACHIEVEMENTS[t.id]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </AchContext.Provider>
  );
}
