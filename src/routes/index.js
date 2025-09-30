import { Suspense, lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import DashboardLayout from "../layouts/dashboard";
import MainLayout from "../layouts/main";
import LoadingScreen from "../components/LoadingScreen";
import { PrivateRoute, PublicRoute } from "./AuthRoutes";
import Welcome from "../pages/Welcome";
import UsersList from "../pages/UsersList";

const Loadable = (Component) => (props) => (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
);

export default function Router() {
  return useRoutes([
    {
      path: "/auth",
      element: <PublicRoute><MainLayout /></PublicRoute>, // <-- Wrap MainLayout in PublicRoute
      children: [
        { path: "login", element: <LoginPage /> },        // <-- Remove PublicRoute from children
        { path: "register", element: <RegisterPage /> },  // <-- Remove PublicRoute from children
        { path: "reset-password", element: <ResetPasswordPage /> },
        { path: "new-password", element: <NewPasswordPage /> },
      ],
    },
    {
      path: "/",
      element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
      children: [
        { index: true, element: <GeneralApp /> },
        { path: "app", element: <GeneralApp /> },
        { path: "settings", element: <Settings /> },
        { path: "group", element: <GroupPage /> },
        { path: "call", element: <CallPage /> },
        { path: "profile", element: <ProfilePage /> },
        { path: "welcome", element: <Welcome /> },
        { path: "users", element: <UsersList /> },

        { path: "404", element: <Page404 /> },
        { path: "*", element: <Navigate to="/404" replace /> },
      ],
    },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}

const GeneralApp = Loadable(lazy(() => import("../pages/dashboard/GeneralApp")));
const LoginPage = Loadable(lazy(() => import("../pages/auth/Login")));
const RegisterPage = Loadable(lazy(() => import("../pages/auth/Register")));
const ResetPasswordPage = Loadable(lazy(() => import("../pages/auth/ResetPassword")));
const NewPasswordPage = Loadable(lazy(() => import("../pages/auth/NewPassword")));
const GroupPage = Loadable(lazy(() => import("../pages/dashboard/Group")));
const Settings = Loadable(lazy(() => import("../pages/dashboard/Settings")));
const CallPage = Loadable(lazy(() => import("../pages/dashboard/Call")));
const ProfilePage = Loadable(lazy(() => import("../pages/dashboard/Profile")));
const Page404 = Loadable(lazy(() => import("../pages/Page404")));
