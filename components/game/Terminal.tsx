"use client";

import { useEffect, useRef, useState } from "react";
import { missions, profile } from "@/lib/data";
import { useSound } from "./SoundProvider";
import { useAchievements } from "./AchievementsProvider";

type Kind = "in" | "out" | "err" | "sys";
type Line = { kind: Kind; text: string };

const PROMPT = "guest@portfolio:~$";

const HELP: string[] = [
  "AVAILABLE COMMANDS:",
  "  help      — this list",
  "  whoami    — operative dossier",
  "  missions  — deployed projects",
  "  email     — open a contact channel",
  "  cv        — download the service record",
  "  clear     — wipe the console",
  "  (psst… try 'sudo hire')",
];

const BOOT: Line[] = [
  { kind: "sys", text: "COMMS TERMINAL // backdoor access granted." },
  { kind: "sys", text: "type 'help' for commands." },
];

/**
 * Interactive fake shell on /comms. Opening it grants FOUND_TERMINAL; the
 * `sudo hire` easter egg grants SUDO_HIRE. All output is driven off lib/data
 * so it stays in sync with the rest of the site.
 */
export default function Terminal() {
  const { play } = useSound();
  const { unlock } = useAchievements();
  const [lines, setLines] = useState<Line[]>(BOOT);
  const [value, setValue] = useState("");
  const history = useRef<string[]>([]);
  const histPos = useRef(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // opening the terminal is itself an achievement
  useEffect(() => {
    unlock("FOUND_TERMINAL");
  }, [unlock]);

  // keep the log pinned to the newest line
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const print = (kind: Kind, text: string | string[]) =>
    setLines((prev) => [
      ...prev,
      ...(Array.isArray(text) ? text : [text]).map((t) => ({ kind, text: t })),
    ]);

  const run = (raw: string) => {
    print("in", `${PROMPT} ${raw}`);
    const cmd = raw.trim().toLowerCase().replace(/\s+/g, " ");
    if (!cmd) return;

    switch (cmd) {
      case "help":
        print("out", HELP);
        play("blip");
        break;
      case "whoami":
        print("out", [
          profile.displayName,
          profile.role,
          `Base: ${profile.base} · ${profile.years} yrs`,
          `Status: ${profile.status}`,
        ]);
        play("blip");
        break;
      case "missions":
        print(
          "out",
          missions.map((m) => `[${m.rarity}] ${m.name} — ${m.blurb}`),
        );
        play("blip");
        break;
      case "email":
        print("out", `→ ${profile.email}`);
        window.location.href = `mailto:${profile.email}`;
        play("blip");
        break;
      case "cv":
        print("out", `opening ${profile.cv} …`);
        window.open(profile.cv, "_blank");
        play("deploy");
        break;
      case "clear":
        setLines([]);
        return;
      case "sudo hire":
        print("out", [
          "[sudo] escalating privileges …",
          "ACCESS GRANTED. deploying operative to your team.",
          "→ start the mission: " + profile.email,
        ]);
        unlock("SUDO_HIRE");
        play("deploy");
        break;
      case "sudo":
        print("err", "usage: sudo <command>. try: sudo hire");
        play("deny");
        break;
      default:
        print("err", `command not found: ${cmd} — type 'help'`);
        play("deny");
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = value;
    if (raw.trim()) {
      history.current.unshift(raw);
      histPos.current = -1;
    }
    setValue("");
    run(raw);
  };

  // simple ↑/↓ command history
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (histPos.current < history.current.length - 1) {
        histPos.current += 1;
        setValue(history.current[histPos.current]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histPos.current > 0) {
        histPos.current -= 1;
        setValue(history.current[histPos.current]);
      } else {
        histPos.current = -1;
        setValue("");
      }
    }
  };

  const color: Record<Kind, string> = {
    in: "text-ink",
    out: "text-[#b9c2cc]",
    err: "text-[#ff6b6b]",
    sys: "text-green",
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="flex h-[320px] flex-col border border-line bg-[rgba(7,9,13,0.94)]"
    >
      <div className="flex items-center gap-2 border-b border-line2 px-3.5 py-2">
        <span className="h-[7px] w-[7px] animate-blinkdot bg-green" />
        <span className="font-mono text-[10px] font-semibold tracking-wide2 text-steel">
          TERMINAL // COMMS
        </span>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-3.5 py-3 font-mono text-[12.5px] leading-[1.75]"
      >
        {lines.map((l, i) => (
          <div key={i} className={`whitespace-pre-wrap ${color[l.kind]}`}>
            {l.text}
          </div>
        ))}
      </div>

      <form
        onSubmit={onSubmit}
        className="flex items-center gap-2 border-t border-line2 px-3.5 py-2.5 font-mono text-[12.5px]"
      >
        <span className="text-green">{PROMPT}</span>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoComplete="off"
          aria-label="terminal input"
          className="min-w-0 flex-1 bg-transparent text-ink caret-gold outline-none"
        />
      </form>
    </div>
  );
}
