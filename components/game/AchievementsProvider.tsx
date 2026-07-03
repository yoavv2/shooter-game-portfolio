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

/** Full registry. `hint` is shown in the medals panel while still locked. */
export const ACHIEVEMENTS = {
  RECON: {
    title: "Recon — visited all sectors",
    hint: "Sweep every sector: MAIN, MISSIONS, LOADOUT, COMMS.",
  },
  KONAMI: {
    title: "Cheat code accepted",
    hint: "The oldest code in the book still works: ↑ ↑ ↓ ↓ ← → ← → B A",
  },
  INSPECTED_ITEM: {
    title: "Armory check — inspected an item",
    hint: "Take a closer look at a piece of gear in the LOADOUT.",
  },
  FOUND_TERMINAL: {
    title: "Backdoor — used the terminal",
    hint: "A terminal is buried at the bottom of COMMS. Run any command.",
  },
  SUDO_HIRE: {
    title: "Privilege escalation — sudo hire",
    hint: "Some terminal commands require elevated privileges…",
  },
} as const;

export type AchievementId = keyof typeof ACHIEVEMENTS;

const STORAGE_KEY = "achievements-v1";

type AchApi = {
  unlocked: AchievementId[];
  unlock: (id: AchievementId) => void;
  total: number;
  openPanel: () => void;
};

const AchContext = createContext<AchApi>({
  unlocked: [],
  unlock: () => {},
  total: Object.keys(ACHIEVEMENTS).length,
  openPanel: () => {},
});

export const useAchievements = () => useContext(AchContext);

export default function AchievementsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { play } = useSound();
  const [unlocked, setUnlocked] = useState<AchievementId[]>([]);
  const [panelOpen, setPanelOpen] = useState(false);
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

  const openPanel = useCallback(() => setPanelOpen(true), []);

  // Escape closes the medals panel
  useEffect(() => {
    if (!panelOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPanelOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [panelOpen]);

  const ids = Object.keys(ACHIEVEMENTS) as AchievementId[];

  return (
    <AchContext.Provider
      value={{ unlocked, unlock, total: ids.length, openPanel }}
    >
      {children}

      {/* medals panel — locked entries show their hint */}
      {panelOpen && (
        <div
          className="fixed inset-0 z-[95] flex items-center justify-center bg-[rgba(5,7,10,0.78)] px-4 backdrop-blur-sm"
          onClick={() => setPanelOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="medals and hints"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[520px] border border-line bg-[rgba(13,17,23,0.97)]"
          >
            <div className="flex items-center justify-between border-b border-line2 px-5 py-3">
              <span className="font-mono text-[11px] font-semibold tracking-wide3 text-gold">
                ★ MEDALS // {unlocked.length}/{ids.length}
              </span>
              <button
                onClick={() => setPanelOpen(false)}
                aria-label="close medals panel"
                className="border border-[#39424e] px-2 py-0.5 font-mono text-[11px] text-steel hover:border-ink hover:text-ink"
              >
                ESC
              </button>
            </div>
            <ul className="flex flex-col">
              {ids.map((id) => {
                const got = unlocked.includes(id);
                return (
                  <li
                    key={id}
                    className="flex items-start gap-3 border-b border-line2 px-5 py-3.5 last:border-b-0"
                  >
                    <span
                      className={`mt-0.5 flex h-6 w-6 flex-none items-center justify-center border font-mono text-[11px] font-bold ${
                        got
                          ? "border-[#4d3d14] bg-[rgba(77,61,20,0.25)] text-gold"
                          : "border-line2 text-faint"
                      }`}
                    >
                      {got ? "★" : "?"}
                    </span>
                    <div className="flex flex-col gap-0.5">
                      <span
                        className={`text-[13px] font-semibold ${
                          got ? "text-ink2" : "text-steel"
                        }`}
                      >
                        {got ? ACHIEVEMENTS[id].title : "LOCKED"}
                      </span>
                      <span className="font-mono text-[11.5px] leading-[1.6] text-[#8a94a0]">
                        {got ? "Unlocked." : ACHIEVEMENTS[id].hint}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="px-5 py-3 font-mono text-[10px] tracking-wide2 text-faint">
              PROGRESS SAVED LOCALLY // GO EARN THEM
            </div>
          </div>
        </div>
      )}

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
                {ACHIEVEMENTS[t.id].title}
              </span>
            </div>
          </div>
        ))}
      </div>
    </AchContext.Provider>
  );
}
