// 认证 Hook：提供登录态与登录/退出方法，基于外部存储 + useSyncExternalStore。
import { useCallback, useSyncExternalStore } from 'react';
import { authApi } from '@/api/auth';
import { authStore } from '@/utils/authStore';
import type { LoginPayload } from '@/types';

export function useAuth() {
  // 订阅 token 变化，任何组件登录/退出后都能即时刷新
  const token = useSyncExternalStore(authStore.subscribe, authStore.getToken);

  const login = useCallback(async (payload: LoginPayload) => {
    // 调用接口校验，成功后持久化 token
    const result = await authApi.login(payload);
    authStore.setToken(result.token);
    return result;
  }, []);

  const logout = useCallback(() => {
    authStore.clearToken();
  }, []);

  return {
    token,
    isAuthenticated: Boolean(token),
    login,
    logout,
  };
}
