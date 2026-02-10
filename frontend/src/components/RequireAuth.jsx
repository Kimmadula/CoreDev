import { Navigate, Outlet } from "react-router-dom";
import { getAdminKey } from "../api";

export default function RequireAuth() {
    const key = getAdminKey();

    if (!key) {
        // Redirect to the key entry page if no key is found
        return <Navigate to="/admin" replace />;
    }

    return <Outlet />;
}
