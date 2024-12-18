import { createStore } from "../createStore";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";
import { Draft } from "immer";
import { PersistOptions } from "../types";

@Injectable({
  providedIn: "root",
})
export class angularAdapter<T> {
  private store: ReturnType<typeof createStore<T>>;
  private subject: BehaviorSubject<T>;

  constructor(
    initialState: (set: (updater: (state: Draft<T>) => void) => void) => T,
    options?: { persist?: PersistOptions<T> }
  ) {
    this.store = createStore(initialState, options);
    this.subject = new BehaviorSubject(this.store.getState());
    this.store.subscribe((newState) => this.subject.next(newState));
  }

  /** Get the current state */
  getState(): T {
    return this.subject.getValue();
  }

  /** Subscribe to state changes */
  select<S>(selector: (state: T) => S) {
    return this.subject.asObservable().pipe(map(selector));
  }

  /** Update the state */
  setState(updater: (state: Draft<T>) => void) {
    this.store.setState(updater);
  }
}
