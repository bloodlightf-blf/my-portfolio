// 路由守卫：未登录时重定向到 /admin 登录页。
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';

export default function RequireAuth() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // 记录来源地址，登录成功后可按需跳回
    return <Navigate to="/admin" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
