export interface PersistOptions<T> {
  key: string; // The key for storing state in localStorage
  selector?: (state: T) => Partial<T>; // Optional state selector for persistence
}
