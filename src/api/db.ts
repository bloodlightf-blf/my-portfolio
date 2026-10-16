// 统一的 localStorage 数据访问层，模拟后端数据库。
//
// 后续接入真实后端时，只需替换 src/api 下各模块的内部实现，
// 保持对外函数签名不变，即可实现无缝切换。

/** 所有数据在 localStorage 中的存储键 */
export const STORAGE_KEYS = {
  profile: 'portfolio_profile',
  skills: 'portfolio_skills',
  projects: 'portfolio_projects',
  blogs: 'portfolio_blogs',
} as const;

/** 读取 JSON 数据，解析失败时返回默认值 */
export function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

/** 写入 JSON 数据 */
export function writeJSON<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

/** 生成唯一 id */
export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

/** 模拟网络延迟，方便后续切换为真实接口时行为一致 */
export function delay(ms = 200): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
