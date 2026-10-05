import { useSyncExternalStore } from "react";

function subscribe(cb: () => void) {
  document.addEventListener("visibilitychange", cb);
  return () => document.removeEventListener("visibilitychange", cb);
}

/** False while the tab is hidden. Server-safe: renders as visible on the server and during hydration. */
export function useDocumentVisible(): boolean {
  return useSyncExternalStore(subscribe, () => document.visibilityState === "visible", () => true);
}
