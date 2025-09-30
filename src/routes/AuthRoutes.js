import {Navigate, useLocation} from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const PrivateRoute = ({ children }) => {
    const { user, checking } = useAuth();

    if (checking) return <div>Loading...</div>; // wait for Firebase

    console.log("PrivateRoute", { user, checking });
    if (!user) {
        // user is null after checking = false
        return <Navigate to="/auth/login" replace />;
    }

    return children;
};

export const PublicRoute = ({ children }) => {
    const { user, checking } = useAuth();
    const location = useLocation();

    if (checking) return <div>Loading...</div>;

    if (user && location.pathname.startsWith("/auth")) {
        return <Navigate to="/app" replace />;
    }

    return children;
};
