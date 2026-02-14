type Listener = (...args: any[]) => void;

class SimpleEventEmitter {
  private listeners: Record<string, Listener[]> = {};

  on(eventName: string, listener: Listener) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(listener);
  }

  emit(eventName: string, ...data: any[]) {
    if (this.listeners[eventName]) {
      this.listeners[eventName].forEach((listener) => {
        listener(...data);
      });
    }
  }
}

export const errorEmitter = new SimpleEventEmitter();
