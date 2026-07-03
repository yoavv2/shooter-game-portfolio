"use client";

import { useEffect, useState } from "react";

/**
 * Live local time at base (Asia/Jerusalem) with the correct UTC offset —
 * Israel flips between UTC+2 and UTC+3, so it's computed, not hardcoded.
 * Renders nothing until mounted to avoid a server/client hydration mismatch.
 */
export default function TlvClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) return <span>TLV</span>;

  const time = now.toLocaleTimeString("en-GB", {
    timeZone: "Asia/Jerusalem",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const offset =
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Jerusalem",
      timeZoneName: "shortOffset",
    })
      .formatToParts(now)
      .find((p) => p.type === "timeZoneName")?.value ?? "";

  return (
    <span>
      TLV {time} · {offset.replace("GMT", "UTC")}
    </span>
  );
}
