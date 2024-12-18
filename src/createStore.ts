import { produce, Draft } from "immer";

type Listener<T> = (state: T) => void;
type StateCreator<T> = (set: (updater: (state: Draft<T>) => void) => void, get: () => T) => T;

interface CreateStoreOptions<T> {
  persist?: {
    key: string;
    selector?: (state: T) => Partial<T>;
  };
}

export function createStore<T>(
  stateCreator: StateCreator<T>,
  options?: CreateStoreOptions<T>
): {
  getState: () => T;
  setState: (updater: (state: Draft<T>) => void) => void;
  subscribe: (listener: Listener<T>) => () => void;
} {
  let state: T;
  const listeners = new Set<Listener<T>>();

  const getState = () => state;

  const baseSetState = (updater: (state: Draft<T>) => void) => {
    state = produce(state, updater);
    listeners.forEach((listener) => listener(state));
  };

  const setState = options?.persist
    ? (updater: (state: Draft<T>) => void) => {
        baseSetState(updater);
        const { key, selector } = options.persist!;
        const stateToPersist = selector ? selector(state) : state;
        localStorage.setItem(key, JSON.stringify(stateToPersist));
      }
    : baseSetState;

  // Initialize state (load from persistence if enabled)
  if (options?.persist?.key) {
    const savedState = localStorage.getItem(options.persist.key);
    if (savedState) {
      try {
        state = JSON.parse(savedState);
      } catch (e) {
        console.error("Failed to parse persisted state:", e);
        state = stateCreator(baseSetState, getState);
      }
    } else {
      state = stateCreator(baseSetState, getState);
    }
  } else {
    state = stateCreator(baseSetState, getState);
  }

  return {
    getState,
    setState,
    subscribe: (listener: Listener<T>) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
