import { Suspense, lazy } from "react";// use to loading , loading screen until full page is load
import { Navigate, useRoutes } from "react-router-dom";

// layouts
import DashboardLayout from "../layouts/dashboard";
import MainLayout from "../layouts/main";

// config
// import { DEFAULT_PATH } from "../config";
import LoadingScreen from "../components/LoadingScreen";
import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute";
//import Settings from "../pages/dashboard/Settings";

const Loadable = (Component) => (props) => {
  return (
    <Suspense fallback={<LoadingScreen />}> 
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    // Public routes (no auth required)
    {
      path: '/auth/login',
      element: <PublicRoute><MainLayout><LoginPage /></MainLayout></PublicRoute>
    },
    {
      path: '/auth/register',
      element: <PublicRoute><MainLayout><RegisterPage /></MainLayout></PublicRoute>
    },
    {
      path: '/auth/reset-password',
      element: <PublicRoute><MainLayout><ResetPasswordPage /></MainLayout></PublicRoute>
    },
    {
      path: '/auth/new-password',
      element: <PublicRoute><MainLayout><NewPasswordPage /></MainLayout></PublicRoute>
    },
    
    // Protected routes (auth required)
    {
      path: "/welcome",
      element: <ProtectedRoute><WelcomePage /></ProtectedRoute>
    },
    {
      path: "/users",
      element: <ProtectedRoute><UsersPage /></ProtectedRoute>
    },
    {
      path: "/app",
      element: <ProtectedRoute><DashboardLayout><GeneralApp /></DashboardLayout></ProtectedRoute>
    },
    {
      path: "/app/settings",
      element: <ProtectedRoute><DashboardLayout><Settings /></DashboardLayout></ProtectedRoute>
    },
    {
      path: "/app/group",
      element: <ProtectedRoute><DashboardLayout><GroupPage /></DashboardLayout></ProtectedRoute>
    },
    {
      path: "/app/call",
      element: <ProtectedRoute><DashboardLayout><CallPage /></DashboardLayout></ProtectedRoute>
    },
    {
      path: "/app/profile",
      element: <ProtectedRoute><DashboardLayout><ProfilePage /></DashboardLayout></ProtectedRoute>
    },
    
    // Default routes
    {
      path: '/',
      element: <Navigate to="/welcome" replace />
    },
    {
      path: "/404",
      element: <Page404 />
    },
    { 
      path: "*", 
      element: <Navigate to="/404" replace /> 
    },
  ]);
}

const GeneralApp = Loadable(
  lazy(() => import("../pages/dashboard/GeneralApp")),
);

const LoginPage = Loadable(
  lazy(() => import("../pages/auth/Login")),
);

const RegisterPage = Loadable(
  lazy(() => import("../pages/auth/Register")),
);

const ResetPasswordPage = Loadable(
  lazy(() => import("../pages/auth/ResetPassword")),
);

const NewPasswordPage = Loadable(
  lazy(() => import("../pages/auth/NewPassword")),
);

const GroupPage = Loadable(
  lazy(() => import("../pages/dashboard/Group")),
);

const Settings = Loadable(
  lazy(() => import("../pages/dashboard/Settings")),
);

const CallPage = Loadable(
  lazy(() => import("../pages/dashboard/Call")),
);

const ProfilePage = Loadable(
  lazy(() => import("../pages/dashboard/Profile")),
);

const WelcomePage = Loadable(
  lazy(() => import("../pages/dashboard/Welcome")),
);

const UsersPage = Loadable(
  lazy(() => import("../pages/dashboard/Users")),
);

const Page404 = Loadable(lazy(() => import("../pages/Page404")));
