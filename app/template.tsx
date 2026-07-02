"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Re-mounts on every route change → plays the "LOADING MISSION" wipe, then
 * reveals content. Pure CSS timing; overlay removed from DOM when done.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [covering, setCovering] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setCovering(false), 420);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {covering && (
        <div className="route-wipe fixed inset-0 z-[80] flex items-center justify-center bg-panel">
          <div className="flex items-center gap-3 font-mono text-[12px] tracking-wide3 text-gold">
            <span className="h-2 w-2 animate-blinkdot bg-gold" />
            LOADING{" "}
            {pathname === "/"
              ? "LOBBY"
              : pathname.slice(1).toUpperCase().split("/")[0]}
            …
          </div>
        </div>
      )}
      <div className={covering ? "opacity-0" : "route-reveal"}>{children}</div>
    </>
  );
}
