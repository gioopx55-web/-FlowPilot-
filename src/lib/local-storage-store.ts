/**
 * A minimal external store over a single localStorage key, built for
 * `useSyncExternalStore` — the React-sanctioned way to read/write a
 * per-viewer browser-storage preference (sidebar collapse, theme, etc.)
 * without the SSR/hydration-mismatch problems of reading localStorage
 * inside a `useEffect` + `setState`.
 */
export function createLocalStorageStore<T>(
  key: string,
  parse: (raw: string | null) => T,
  serialize: (value: T) => string,
) {
  let listeners: Array<() => void> = [];

  function subscribe(listener: () => void) {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }

  function getSnapshot(): T {
    try {
      return parse(window.localStorage.getItem(key));
    } catch {
      return parse(null);
    }
  }

  function getServerSnapshot(): T {
    return parse(null);
  }

  function set(value: T) {
    try {
      window.localStorage.setItem(key, serialize(value));
    } catch {
      // Ignore storage failures — the value still applies for this session.
    }
    listeners.forEach((listener) => listener());
  }

  return { subscribe, getSnapshot, getServerSnapshot, set };
}
