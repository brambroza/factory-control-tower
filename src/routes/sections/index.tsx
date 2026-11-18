import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import { paths } from 'src/routes/paths';

import { FactoryLayout } from 'src/layouts/factory';

import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

const DemoPage = lazy(() => import('src/pages/demo'));

// module ตัวอย่าง "ศูนย์ควบคุมการผลิต"
const FactoryDashboardPage = lazy(() => import('src/pages/factory/dashboard'));
const FactoryDispatchPage = lazy(() => import('src/pages/factory/dispatch'));
const FactoryNewOrderPage = lazy(() => import('src/pages/factory/new-order'));
const FactoryWorkOrderPage = lazy(() => import('src/pages/factory/work-order'));
const FactoryLivePage = lazy(() => import('src/pages/factory/live'));
const FactorySequencePage = lazy(() => import('src/pages/factory/sequence'));
const FactoryInboxPage = lazy(() => import('src/pages/factory/inbox'));

/**
 * Route tree ของ starter
 * - `/` พาไป `/factory` · `/theme` หน้า demo สำหรับตรวจ theme
 * - `/factory/*` module ตัวอย่าง (layout มี Suspense + page transition ของตัวเอง)
 * หน้าใหม่: เพิ่ม `lazy(() => import('src/pages/<x>'))` แล้วใส่ใน `children`
 */
export function Router() {
  return useRoutes([
    {
      path: '/',
      element: (
        <Suspense fallback={<LoadingScreen />}>
          <Outlet />
        </Suspense>
      ),
      children: [
        { index: true, element: <Navigate to={paths.factory.root} replace /> },
        { path: 'theme', element: <DemoPage /> },
      ],
    },
    {
      path: 'factory',
      element: <FactoryLayout />,
      children: [
        { index: true, element: <FactoryDashboardPage /> },
        { path: 'dispatch', element: <FactoryDispatchPage /> },
        { path: 'orders/new', element: <FactoryNewOrderPage /> },
        { path: 'orders/:id', element: <FactoryWorkOrderPage /> },
        { path: 'live', element: <FactoryLivePage /> },
        { path: 'sequence', element: <FactorySequencePage /> },
        { path: 'inbox', element: <FactoryInboxPage /> },
      ],
    },
    { path: '*', element: <Navigate to={paths.factory.root} replace /> },
  ]);
}
