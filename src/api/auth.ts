// 认证接口：模拟后端登录校验。
// 密码绝不明文存储，登录成功只返回并交由前端保存 token。
import { delay, uid } from './db';
import type { LoginPayload, LoginResult } from '@/types';

// 默认管理员账号（仅用于本地模拟；真实场景应存于服务端，前端只做校验请求）
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

export const authApi = {
  /**
   * 登录校验。
   * 校验通过返回随机 token，由调用方负责持久化；失败抛出错误。
   */
  async login(payload: LoginPayload): Promise<LoginResult> {
    await delay(400);
    if (payload.username === ADMIN_USERNAME && payload.password === ADMIN_PASSWORD) {
      const token = uid() + uid();
      return { token };
    }
    throw new Error('账号或密码错误');
  },
};
