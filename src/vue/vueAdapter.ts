import { createStore } from "../createStore";
import { reactive, computed } from "vue";
import { Draft } from "immer";
import { PersistOptions } from "../types";

export function vueAdapter<T, S>(
  initialState: (set: (updater: (state: Draft<T>) => void) => void) => T,
  selector: (state: T) => S,
  options?: { persist?: PersistOptions<T> }
): S {
  const store = createStore(initialState as (set: (updater: (state: Draft<T>) => void) => void) => T, options);

  const state = reactive({ selected: selector(store.getState()) });

  store.subscribe((newState) => {
    state.selected = selector(newState);
  });

  return computed(() => state.selected).value;
}
