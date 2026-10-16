// 登录态（token）的轻量外部存储，使用 useSyncExternalStore 订阅，
// 保证任意组件登录/退出后，依赖登录态的组件都能同步刷新。

const TOKEN_KEY = 'portfolio_token';

// 初始化时从 localStorage 读取（仅存 token，不存任何密码）
let token: string | null = null;
try {
  token = localStorage.getItem(TOKEN_KEY);
} catch {
  token = null;
}

const listeners = new Set<() => void>();

function emit(): void {
  listeners.forEach((listener) => listener());
}

export const authStore = {
  getToken: (): string | null => token,

  setToken: (value: string): void => {
    token = value;
    try {
      localStorage.setItem(TOKEN_KEY, value);
    } catch {
      // 忽略存储异常（如隐私模式）
    }
    emit();
  },

  clearToken: (): void => {
    token = null;
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      // 忽略存储异常
    }
    emit();
  },

  subscribe: (listener: () => void): (() => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
