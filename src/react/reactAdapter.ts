import { useState, useEffect } from "react";
import { createStore } from "../createStore";
import { Draft } from "immer";
import { PersistOptions } from "../types";

export function reactAdapter<T, S>(
  initialState: (set: (updater: (state: Draft<T>) => void) => void) => T,
  selector: (state: T) => S,
  options?: { persist?: PersistOptions<T> }
): S {
  const store = createStore(initialState as (set: (updater: (state: Draft<T>) => void) => void) => T, options);

  const [state, setState] = useState(() => selector(store.getState()));

  useEffect(() => {
    const unsubscribe = store.subscribe((newState) => {
      setState(selector(newState));
    });
    return unsubscribe;
  }, [store, selector]);

  return state;
}
