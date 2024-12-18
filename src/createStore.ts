import produce, { Draft } from "immer";
import { PersistOptions } from "./types";

type Listener<T> = (state: T) => void;
type StateCreator<T> = (set: (updater: (state: Draft<T>) => void) => void) => T;

interface CreateStoreOptions<T> {
  persist?: PersistOptions<T>;
}

export function createStore<T>(
  stateCreator: StateCreator<T>,
  options?: CreateStoreOptions<T>
) {
  let state: T;
  const listeners = new Set<Listener<T>>();

  const getState = () => state;

  const setState = (updater: (state: Draft<T>) => void) => {
    state = produce(state, updater);
    listeners.forEach((listener) => listener(state));
    if (options?.persist?.key) {
      const { key, selector } = options.persist;
      const stateToPersist = selector ? selector(state) : state;
      localStorage.setItem(key, JSON.stringify(stateToPersist));
    }
  };

  // Initialize state with optional persistence
  if (options?.persist?.key) {
    const savedState = localStorage.getItem(options.persist.key);
    if (savedState) {
      try {
        state = JSON.parse(savedState);
      } catch (e) {
        console.warn("Failed to parse persisted state:", e);
        state = stateCreator(setState);
      }
    } else {
      state = stateCreator(setState);
    }
  } else {
    state = stateCreator(setState);
  }

  const subscribe = (listener: Listener<T>) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  return { getState, setState, subscribe };
}
