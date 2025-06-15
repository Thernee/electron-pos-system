declare module 'conf' {
  interface ConfOptions<T> {
    cwd?: string;
    projectName?: string;
    defaults?: T;
  }

  class Conf<T> {
    constructor(options?: ConfOptions<T>);
    get<K extends keyof T>(key: K): T[K];
    set<K extends keyof T>(key: K, value: T[K]): void;
    // Add other methods you use (e.g., clear, delete)
  }

  export default Conf;
}