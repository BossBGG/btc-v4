import { RouteObject } from 'react-router-dom';
import React from 'react';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import RoleBasedRoute from '../core/guards/RoleBasedRoute';
import ProtectedRoute from '../core/guards/ProtectedRoute';
import ProfilePage from '../pages/ProfilePage';
import EventTypePage from '../pages/EventTypePage';
import SearchEventPage from '../pages/SearchEventPage';
import EventDetailPage from '../pages/EventDetailPage';
import StaffDashboardPage from '../pages/StaffDashboardPage';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import staffRoutes from './staff.routes';
import adminRoutes from './admin.routes';
import Error500Page from '../pages/Error500Page';

const HomePage = React.lazy(() => import('../pages/HomePage'));
const ActivitiesPage = React.lazy(() => import('../pages/ActivitiesPage'));
const HistoryPage = React.lazy(() => import('../pages/HistoryPage'));
const NotFoundPage = React.lazy(() => import('../pages/NotFound404.page'));

/**
 * กำหนดเส้นทางทั้งหมดในแอปพลิเคชัน
 * รวมถึงการป้องกันเส้นทางตามบทบาทผู้ใช้
 */
const routes: RouteObject[] = [
  // หน้าหลักที่ทุกคนเข้าถึงได้
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  // หน้าล็อกอิน
  {
    path: '/login',
    element: <LoginPage />,
  },
  // หน้าสมัครสมาชิก
  {
    path: '/register',
    element: <RegisterPage />,
  },
  // หน้ากิจกรรมของฉัน - ต้องล็อกอินก่อน และไม่ใช่แอดมิน
  {
    path: '/activities',
    element: (
      <RoleBasedRoute allowedRoles={['student', 'staff']}>
        <ActivitiesPage />
      </RoleBasedRoute>
    ),
  },
  // หน้าประวัติกิจกรรม - ต้องล็อกอินก่อน และไม่ใช่แอดมิน
  {
    path: '/history',
    element: (
      <RoleBasedRoute allowedRoles={['student', 'staff']}>
        <HistoryPage />
      </RoleBasedRoute>
    ),
  },
   // หน้าโปรไฟล์ - ต้องล็อกอินแล้วเท่านั้น
   {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
  // หน้าประเภทกิจกรรม
  {
    path: '/events/:type',
    element: <EventTypePage />,
  },
  // หน้าแสดงรายละเอียดกิจกรรม
  {
    path: '/events/detail/:id',
    element: <EventDetailPage />,
  },
  // หน้าค้นหากิจกรรม
  {
    path: '/search',
    element: <SearchEventPage />,
  },
  // แดชบอร์ดเจ้าหน้าที่ - เข้าถึงได้เฉพาะเจ้าหน้าที่
  {
    path: '/staff-dashboard',
    element: (
      <RoleBasedRoute allowedRoles={['staff']}>
        <StaffDashboardPage />
      </RoleBasedRoute>
    ),
  },
  // แดชบอร์ดแอดมิน - เข้าถึงได้เฉพาะแอดมิน
  {
    path: '/admin',
    element: (
      <RoleBasedRoute allowedRoles={['admin']}>
        <AdminDashboardPage />
      </RoleBasedRoute>
    ),
  },
  // นำเข้าเส้นทางย่อยสำหรับเจ้าหน้าที่ (ยกเว้น staff-dashboard ที่กำหนดด้านบนแล้ว)
  ...staffRoutes.filter(route => route.path !== '/staff-dashboard'),
  // นำเข้าเส้นทางย่อยสำหรับแอดมิน (ยกเว้น admin ที่กำหนดด้านบนแล้ว)
  ...adminRoutes.filter(route => route.path !== '/admin'),
  // หน้า 404 สำหรับเส้นทางที่ไม่มีอยู่
  {
    path: '*',
    element: <NotFoundPage />,
  },
  {
    path: '/error-500',
    element: <Error500Page />,
  }
 
];

export default routes;