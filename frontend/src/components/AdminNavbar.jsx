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
            background: "#353635",
            borderBottom: "1px solid #444",
            padding: "15px 40px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "20px"
        }}>
            <h3 style={{ margin: 0, marginRight: "20px", color: "#fff" }}>Admin Panel</h3>
            {navItems.map(item => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                    <Link
                        key={item.path}
                        to={item.path}
                        style={{
                            textDecoration: "none",
                            color: isActive ? "#fff" : "#ccc",
                            fontWeight: isActive ? "700" : "500",
                            padding: "8px 12px",
                            borderRadius: "6px",
                            background: isActive ? "#4f46e5" : "transparent"
                        }}
                    >
                        {item.label}
                    </Link>
                );
            })}
            <button
                onClick={() => {
                    if (window.confirm("Are you sure you want to logout?")) {
                        localStorage.removeItem("ADMIN_KEY");
                        window.location.href = "/admin";
                    }
                }}
                style={{
                    marginLeft: "auto",
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "14px"
                }}
            >
                Logout
            </button>
            <Link to="/" style={{ textDecoration: "none", color: "#ccc", fontSize: "14px" }}>
                View Site &rarr;
            </Link>
        </div>
    );
}
