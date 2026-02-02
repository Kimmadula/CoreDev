import { Link, useLocation } from "react-router-dom";

export default function AdminNavbar() {
    const location = useLocation();

    const navItems = [
        { label: "Products", path: "/admin/products" },
        { label: "Sections", path: "/admin/sections" },
        { label: "Articles", path: "/admin/articles" },
    ];

    return (
        <div style={{
            background: "#fff",
            borderBottom: "1px solid #ddd",
            padding: "15px 40px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "20px"
        }}>
            <h3 style={{ margin: 0, marginRight: "20px", color: "#333" }}>Admin Panel</h3>
            {navItems.map(item => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                    <Link
                        key={item.path}
                        to={item.path}
                        style={{
                            textDecoration: "none",
                            color: isActive ? "#4f46e5" : "#666",
                            fontWeight: isActive ? "700" : "500",
                            padding: "8px 12px",
                            borderRadius: "6px",
                            background: isActive ? "#eff6ff" : "transparent"
                        }}
                    >
                        {item.label}
                    </Link>
                );
            })}
            <Link to="/" style={{ marginLeft: "auto", textDecoration: "none", color: "#666", fontSize: "14px" }}>
                View Site &rarr;
            </Link>
        </div>
    );
}
