import createWebStorage from "redux-persist/lib/storage/createWebStorage";

// Fallback for SSR (Server-Side Rendering)
const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

// localStorage wrapper (영구 저장)
const localStorage = typeof window !== "undefined" 
  ? createWebStorage("local") 
  : createNoopStorage();

// sessionStorage wrapper (세션 저장)
const sessionStorage = typeof window !== "undefined" 
  ? createWebStorage("session") 
  : createNoopStorage();

export { localStorage, sessionStorage };
