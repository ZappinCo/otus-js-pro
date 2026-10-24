const STORAGE_KEY = 'spa-routing-state';

export class Store {
  #state;
  #subscribers = [];
  #persistKeys;

  constructor(initialState = {}, persistKeys = []) {
    this.#persistKeys = persistKeys;
    this.#state = this.#mergeWithPersisted(initialState);
  }

  getState() {
    return { ...this.#state };
  }

  select(key) {
    return this.#state[key];
  }

  setState(partial) {
    if (!partial || typeof partial !== 'object') return;
    this.#state = { ...this.#state, ...partial };
    this.#saveToStorage();
    this.#notify();
  }

  replaceState(newState) {
    this.#state = { ...newState };
    this.#saveToStorage();
    this.#notify();
  }

  subscribe(callback) {
    this.#subscribers.push(callback);
    callback(this.getState());

    return () => {
      this.#subscribers = this.#subscribers.filter(cb => cb !== callback);
    };
  }

  reset(initialState = {}) {
    this.#state = { ...initialState };
    localStorage.removeItem(STORAGE_KEY);
    this.#notify();
  }

  #notify() {
    const snapshot = this.getState();
    this.#subscribers.forEach(cb => {
      try { cb(snapshot); }
      catch (e) { console.error('Store subscriber error:', e); }
    });
  }

  #saveToStorage() {
    if (this.#persistKeys.length === 0) return;

    const toSave = {};
    this.#persistKeys.forEach(key => {
      if (key in this.#state) toSave[key] = this.#state[key];
    });

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.warn('Не удалось сохранить состояние:', e);
    }
  }

  #mergeWithPersisted(initialState) {
    return { ...initialState, ...this.#loadFromStorage() };
  }

  #loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (e) {
      console.warn('Повреждённые данные в localStorage, игнорируем:', e);
      return {};
    }
  }
}