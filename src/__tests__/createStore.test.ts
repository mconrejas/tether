import { createStore } from "../createStore";

interface CounterState {
  counter: number;
}

describe("Global State Manager", () => {
  // Mock localStorage before running tests
  beforeEach(() => {
    const mockLocalStorage: Record<string, string> = {};
    global.localStorage = {
      getItem: jest.fn((key) => mockLocalStorage[key] || null),
      setItem: jest.fn((key, value) => {
        mockLocalStorage[key] = value;
      }),
      removeItem: jest.fn((key) => {
        delete mockLocalStorage[key];
      }),
      clear: jest.fn(() => {
        Object.keys(mockLocalStorage).forEach((key) => delete mockLocalStorage[key]);
      }),
    } as unknown as Storage;
  });
  
  it("should initialize the state", () => {
    const store = createStore<CounterState>((set) => ({ counter: 0 }));
    expect(store.getState().counter).toBe(0);
  });

  it("should update the state", () => {
    const store = createStore<CounterState>((set) => ({ counter: 0 }));
    store.setState((state) => {
      state.counter += 1; // Update state using the draft
    });
    expect(store.getState().counter).toBe(1);
  });

  it("should persist state in localStorage", () => {
    const store = createStore<CounterState>(
      (set) => ({ counter: 0 }),
      { persist: { key: "test" } }
    );

    store.setState((state) => {
      state.counter = 5; // Update state using the draft
    });
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "test",
      JSON.stringify({ counter: 5 })
    );
    expect(localStorage.getItem("test")).toBe(JSON.stringify({ counter: 5 }));
  });
});
