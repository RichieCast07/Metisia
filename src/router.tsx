import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthGuard from '@/presentation/components/layout/AuthGuard';
import AppLayout from '@/presentation/components/layout/AppLayout';
import LoginPage from '@/presentation/pages/auth/LoginPage';
import RegisterPage from '@/presentation/pages/auth/RegisterPage';
import DashboardPage from '@/presentation/pages/dashboard/DashboardPage';
import PosPage from '@/presentation/pages/pos/PosPage';
import ProductsPage from '@/presentation/pages/products/ProductsPage';
import IngredientsPage from '@/presentation/pages/ingredients/IngredientsPage';
import SalesPage from '@/presentation/pages/sales/SalesPage';
import PromotionsPage from '@/presentation/pages/promotions/PromotionsPage';
import CashRegisterPage from '@/presentation/pages/cash/CashRegisterPage';
import ExpensesPage from '@/presentation/pages/expenses/ExpensesPage';
import WorkersPage from '@/presentation/pages/workers/WorkersPage';
import ReportsPage from '@/presentation/pages/reports/ReportsPage';
import SettingsPage from '@/presentation/pages/settings/SettingsPage';

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    element: <AuthGuard />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/pos', element: <PosPage /> },
          { path: '/products', element: <ProductsPage /> },
          { path: '/ingredients', element: <IngredientsPage /> },
          { path: '/sales', element: <SalesPage /> },
          { path: '/promotions', element: <PromotionsPage /> },
          { path: '/cash-register', element: <CashRegisterPage /> },
          { path: '/expenses', element: <ExpensesPage /> },
          { path: '/workers', element: <WorkersPage /> },
          { path: '/reports', element: <ReportsPage /> },
          { path: '/settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/dashboard" replace /> },
]);
