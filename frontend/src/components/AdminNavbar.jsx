import { Link, useLocation } from "react-router-dom";
import coreDevLogo from "../assets/coredevlogo.png";

export default function AdminNavbar() {
    const location = useLocation();

    return (
        <div className="admin-sidebar">
            {/* LOGO AREA */}
            <div style={{ padding: "24px", borderBottom: "1px solid #374151", marginBottom: "20px" }}>
                <Link to="/admin/products" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
                    <img src={coreDevLogo} alt="CoreDev Logo" style={{ height: "32px" }} />
                    <div style={{ display: "flex", flexDirection: "column", lineHeight: "1" }}>
                        <div style={{ fontWeight: "700", fontSize: "18px", color: "#fff" }}>
                            <span style={{ color: "#ff6c00" }}>Core</span>Dev
                        </div>
                        <div style={{ fontSize: "11px", color: "#9ca3af", letterSpacing: "0.5px" }}>
                            Admin Panel
                        </div>
                    </div>
                </Link>
            </div>

            {/* NAVIGATION LINKS */}
            <nav style={{ flex: 1, padding: "0 12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <Link
                    to="/admin/products"
                    className="sidebar-link"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "12px 16px",
                        color: location.pathname.startsWith('/admin/products') || location.pathname.startsWith('/admin/product-view') ? "#fff" : "#9ca3af",
                        background: location.pathname.startsWith('/admin/products') || location.pathname.startsWith('/admin/product-view') ? "#374151" : "transparent",
                        borderRadius: "8px",
                        textDecoration: "none",
                        fontWeight: "500",
                        transition: "all 0.2s"
                    }}
                >
                    <span style={{ marginRight: "12px" }}>📦</span>
                    Products
                </Link>
            </nav>

            {/* USER / LOGOUT AREA */}
            <div style={{ padding: "24px", borderTop: "1px solid #374151", marginTop: "auto" }}>
                <button
                    onClick={() => {
                        if (window.confirm("Are you sure you want to logout?")) {
                            localStorage.removeItem("ADMIN_KEY");
                            window.location.href = "/admin";
                        }
                    }}
                    style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "10px",
                        background: "#dc2626",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "14px",
                        transition: "background 0.2s"
                    }}
                    onMouseEnter={e => e.target.style.background = "#b91c1c"}
                    onMouseLeave={e => e.target.style.background = "#dc2626"}
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
