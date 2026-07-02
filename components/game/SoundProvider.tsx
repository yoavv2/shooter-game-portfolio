"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export type SfxName = "blip" | "click" | "sting" | "deploy" | "deny";

type SoundApi = {
  play: (name: SfxName) => void;
  muted: boolean;
  toggleMute: () => void;
};

const SoundContext = createContext<SoundApi>({
  play: () => {},
  muted: true,
  toggleMute: () => {},
});

export const useSound = () => useContext(SoundContext);

/** One-oscillator note into a shared gain, synthesized — no audio assets. */
function note(
  ctx: AudioContext,
  out: GainNode,
  {
    freq,
    type = "square",
    at = 0,
    dur = 0.06,
    vol = 0.06,
    slide,
  }: {
    freq: number;
    type?: OscillatorType;
    at?: number;
    dur?: number;
    vol?: number;
    slide?: number;
  },
) {
  const t = ctx.currentTime + at;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (slide) osc.frequency.exponentialRampToValueAtTime(slide, t + dur);
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(out);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

export default function SoundProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [muted, setMuted] = useState(true);
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // restore preference; default = sound on (muted only if user chose it)
  useEffect(() => {
    setMuted(localStorage.getItem("sfx-muted") === "1");
  }, []);

  const ensureCtx = useCallback(() => {
    if (!ctxRef.current) {
      const Ctx =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctx) return null;
      ctxRef.current = new Ctx();
      gainRef.current = ctxRef.current.createGain();
      gainRef.current.connect(ctxRef.current.destination);
    }
    if (ctxRef.current.state === "suspended") void ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  const play = useCallback(
    (name: SfxName) => {
      if (muted) return;
      const ctx = ensureCtx();
      const out = gainRef.current;
      if (!ctx || !out || ctx.state !== "running") return;
      switch (name) {
        case "blip":
          note(ctx, out, { freq: 1400, dur: 0.035, vol: 0.025 });
          break;
        case "click":
          note(ctx, out, { freq: 900, dur: 0.05, vol: 0.05 });
          note(ctx, out, { freq: 1500, at: 0.045, dur: 0.05, vol: 0.04 });
          break;
        case "deploy":
          note(ctx, out, { freq: 300, dur: 0.12, vol: 0.06, slide: 900 });
          note(ctx, out, { freq: 1200, at: 0.1, dur: 0.08, vol: 0.05 });
          break;
        case "sting": // achievement arpeggio
          note(ctx, out, { freq: 660, dur: 0.09, vol: 0.05 });
          note(ctx, out, { freq: 880, at: 0.08, dur: 0.09, vol: 0.05 });
          note(ctx, out, { freq: 1320, at: 0.16, dur: 0.14, vol: 0.05 });
          break;
        case "deny":
          note(ctx, out, { freq: 220, dur: 0.1, vol: 0.05, slide: 140 });
          break;
      }
    },
    [muted, ensureCtx],
  );

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      localStorage.setItem("sfx-muted", next ? "1" : "0");
      return next;
    });
  }, []);

  return (
    <SoundContext.Provider value={{ play, muted, toggleMute }}>
      {children}
    </SoundContext.Provider>
  );
}
