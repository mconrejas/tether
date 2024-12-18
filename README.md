# Tether - A Framework-Agnostic Global State Manager

Tether is a lightweight, framework-agnostic state management library that works seamlessly with React, Vue, Svelte, Angular, and Vanilla JavaScript. It offers a clean and intuitive API for managing global state with optional persistence.

## Features

- **Framework-Agnostic**: Works with React, Vue, Svelte, Angular, or Vanilla JavaScript.
- **Vanilla Default**: The default export is the Vanilla adapter for non-framework-specific projects.
- **Framework-Specific Adapters**: Provides tailored integrations for popular frameworks.
- **Optional Persistence**: Easily store state in `localStorage` or `sessionStorage`.
- **Immutable Updates**: Uses Immer for safer state mutations.
- **Tree-Shakable**: Only include the parts of the library you use.

---

## Installation

Install the library via npm or yarn:

```bash
npm install tether
# or
yarn add tether
```

---

## Usage

### **Vanilla JavaScript**

The default export (`useTether`) is the vanilla adapter, which provides a straightforward API for managing state:

```javascript
import useTether from 'tether';

// Define the initial state and actions
const initialState = {
  counter: 0,
  increment: () => store.setState((state) => ({ counter: state.counter + 1 })),
  decrement: () => store.setState((state) => ({ counter: state.counter - 1 })),
};

// Initialize the store
const store = useTether(initialState, {
  persist: {
    key: 'counterState', // Key for persistence in localStorage
    selector: (state) => ({ counter: state.counter }), // Persist only `counter`
  },
});

// Access state and actions
console.log('Counter:', store.counter);
store.increment();
console.log('Counter after increment:', store.counter);
store.decrement();
console.log('Counter after decrement:', store.counter);

// Subscribe to state changes
store.subscribe((state) => {
  console.log('State updated:', state);
});
```

---

### **React**

Use the React adapter for seamless integration with React's hook-based API:

```tsx
import { useTetherReact } from 'tether';

// Define the initial state and actions
const initialState = (set) => ({
  counter: 0,
  increment: () => set((state) => ({ counter: state.counter + 1 })),
  decrement: () => set((state) => ({ counter: state.counter - 1 })),
});

function Counter() {
  const counter = useTetherReact(initialState, (state) => state.counter);

  return (
    <div>
      <p>Counter: {counter}</p>
      <button onClick={() => counter.increment()}>Increment</button>
      <button onClick={() => counter.decrement()}>Decrement</button>
    </div>
  );
}

export default Counter;
```

---

### **Vue**

Use the Vue adapter for reactive state management:

```vue
<script>
import { useTetherVue } from 'tether';

export default {
  setup() {
    const initialState = (set) => ({
      counter: 0,
      increment: () => set((state) => ({ counter: state.counter + 1 })),
      decrement: () => set((state) => ({ counter: state.counter - 1 })),
    });

    const { counter, increment, decrement } = useTetherVue(initialState);

    return { counter, increment, decrement };
  },
};
</script>

<template>
  <div>
    <p>Counter: {{ counter }}</p>
    <button @click="increment">Increment</button>
    <button @click="decrement">Decrement</button>
  </div>
</template>
```

---

### **Svelte**

Use the Svelte adapter to integrate with Svelte stores:

```svelte
<script>
  import { useTetherSvelte } from 'tether';

  const initialState = (set) => ({
    counter: 0,
    increment: () => set((state) => ({ counter: state.counter + 1 })),
    decrement: () => set((state) => ({ counter: state.counter - 1 })),
  });

  const { counter, increment, decrement } = useTetherSvelte(initialState);
</script>

<p>Counter: {counter}</p>
<button on:click={increment}>Increment</button>
<button on:click={decrement}>Decrement</button>
```

---

### **Angular**

Use the Angular adapter to integrate with RxJS observables:

```typescript
import { Component } from '@angular/core';
import { useTetherAngular } from 'tether';

const initialState = (set) => ({
  counter: 0,
  increment: () => set((state) => ({ counter: state.counter + 1 })),
  decrement: () => set((state) => ({ counter: state.counter - 1 })),
});

const { counter, increment, decrement } = useTetherAngular(initialState);

@Component({
  selector: 'app-counter',
  template: `
    <div>
      <p>Counter: {{ counter | async }}</p>
      <button (click)="increment()">Increment</button>
      <button (click)="decrement()">Decrement</button>
    </div>
  `,
})
export class CounterComponent {
  counter = counter;
  increment = increment;
  decrement = decrement;
}
```

---

## API Reference

### `useTether`
The default export for Vanilla JavaScript.

```typescript
useTether<T>(
  initialState: T,
  options?: {
    persist?: {
      key: string; // Key for localStorage or sessionStorage
      selector?: (state: T) => Partial<T>; // Optional state selector
    };
  }
): {
  ...state: T; // State properties
  setState: (updater: (state: Draft<T>) => void) => void;
  subscribe: (listener: (state: T) => void) => () => void;
};
```

### Framework-Specific Adapters
- `useTetherReact`
- `useTetherVue`
- `useTetherSvelte`
- `useTetherAngular`

---

## License

This project is licensed under the [MIT License](LICENSE).
