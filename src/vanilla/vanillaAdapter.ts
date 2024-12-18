import { createStore } from "../createStore";
import { PersistOptions } from "../types";

export function vanillaAdapter<T>(
  initialState: T,
  options?: { persist?: PersistOptions<T> }
) {
  // Directly create the store with the initial state and options
  const store = createStore((set) => initialState, options);

  // Return the store's API
  return {
    ...store.getState(),
    setState: store.setState,
    subscribe: store.subscribe,
  };
}
