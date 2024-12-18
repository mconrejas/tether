import { createStore } from "../createStore";
import { writable } from "svelte/store";
import { Draft } from "immer";
import { PersistOptions } from "../types";

export function svelteAdapter<T, S>(
  initialState: (set: (updater: (state: Draft<T>) => void) => void) => T,
  selector: (state: T) => S,
  options?: { persist?: PersistOptions<T> }
) {
  const store = createStore(initialState as (set: (updater: (state: Draft<T>) => void) => void) => T, options);

  const svelteStore = writable(selector(store.getState()));

  store.subscribe((newState) => {
    svelteStore.set(selector(newState));
  });

  return svelteStore;
}
