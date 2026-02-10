import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { apiGet } from "../api.js";
import coreDevLogo from "../assets/coredevlogo.png";

export default function AdminNavbar() {
    const location = useLocation();
    const [products, setProducts] = useState([]);

    // Dropdown States
    const [showAddMenu, setShowAddMenu] = useState(false);

    useEffect(() => {
        apiGet("/products").then(setProducts).catch(console.error);
    }, []);

    // Styles for Dropdown
    const dropdownStyle = {
        position: "absolute",
        top: "100%",
        display: "block",
        left: 0,
        background: "#2c2d2c",
        border: "1px solid #444",
        borderRadius: "6px",
        minWidth: "200px",
        padding: "5px 0",
        zIndex: 1000,
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
    };

    const itemStyle = {
        display: "block",
        padding: "8px 16px",
        color: "#ccc",
        textDecoration: "none",
        fontSize: "0.9rem",
        cursor: "pointer",
        transition: "background 0.2s"
    };

    return (
        <div style={{
            background: "#353635",
            borderBottom: "1px solid #444",
            padding: "0 40px",
            height: "60px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
        }}>
            {/* LEFT SIDE */}
            <div style={{ display: "flex", alignItems: "center", gap: "20px", height: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "15px", cursor: "default" }}>
                    <div style={{ fontWeight: "700", fontSize: "16px", display: "flex", alignItems: "center", gap: "5px" }}>
                        <img src={coreDevLogo} alt="CoreDev Logo" style={{ height: "24px" }} />
                        <div style={{ display: "flex", flexDirection: "column", lineHeight: "1", justifyContent: "center" }}>
                            <div style={{ fontWeight: "700", fontSize: "16px" }}>
                                <span style={{ color: "#ff6c00" }}>Core</span><span style={{ color: "#fff" }}>Dev</span>
                            </div>
                            <div style={{ fontSize: "10px", color: "#ccc", fontWeight: "400", letterSpacing: "0.5px" }}>
                                Solutions Inc.
                            </div>
                        </div>
                    </div>
                    <div style={{ height: "20px", width: "1px", background: "#666" }}></div>
                    <h3 style={{ margin: 0, color: "#fff" }}>Admin</h3>
                </div>

                {/* PRODUCTS LINK (SIMPLE) */}
                <Link
                    to="/admin/products"
                    style={{
                        color: "#fff",
                        fontWeight: "500",
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        height: "100%",
                        padding: "0 10px",
                        borderBottom: location.pathname.startsWith('/admin/products') || location.pathname.startsWith('/admin/product-view') ? "2px solid #fbbf24" : "2px solid transparent"
                    }}
                    onMouseEnter={e => e.target.style.color = "#fbbf24"}
                    onMouseLeave={e => e.target.style.color = "#fff"}
                >
                    Products
                </Link>

                {/* ADD BUTTON REMOVED */}
            </div>

            {/* RIGHT SIDE */}
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <button
                    onClick={() => {
                        if (window.confirm("Are you sure you want to logout?")) {
                            localStorage.removeItem("ADMIN_KEY");
                            window.location.href = "/admin";
                        }
                    }}
                    style={{
                        background: "#ef4444",
                        color: "white",
                        border: "none",
                        padding: "6px 14px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "13px"
                    }}
                >
                    Logout
                </button>
                <Link to="/" style={{ textDecoration: "none", color: "#ccc", fontSize: "14px" }}>
                    View Site &rarr;
                </Link>
            </div>
        </div>
    );
}
