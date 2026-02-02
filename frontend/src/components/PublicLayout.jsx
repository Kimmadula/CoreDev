import { Outlet, Link } from "react-router-dom";

export default function PublicLayout() {
    return (
        <div style={{ fontFamily: "system-ui", padding: 16 }}>
            <header style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <Link to="/" style={{ fontWeight: 700, textDecoration: "none", color: "#333", fontSize: "1.2rem" }}>
                    CoreDev Help
                </Link>
            </header>

            <hr style={{ margin: "16px 0" }} />

            <Outlet />
        </div>
    );
}
