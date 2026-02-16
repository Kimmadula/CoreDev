import { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { getAdminKey } from "../api.js";

export default function RequireAuth() {
    const key = getAdminKey();
    const navigate = useNavigate();

    useEffect(() => {
        const handleUnauthorized = () => {
            navigate("/admin", { replace: true });
        };

        window.addEventListener("admin-unauthorized", handleUnauthorized);
        return () => window.removeEventListener("admin-unauthorized", handleUnauthorized);
    }, [navigate]);

    if (!key) {
        return <Navigate to="/admin" replace />;
    }

    return <Outlet />;
}
