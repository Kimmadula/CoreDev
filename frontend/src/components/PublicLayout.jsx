import { Outlet, Link } from "react-router-dom";
import coreDevLogo from "../assets/coredevlogo.png";

export default function PublicLayout() {
    return (
        <div style={{ fontFamily: "system-ui" }}>
            <header style={{
                height: "50px",
                background: "#353635",
                borderBottom: "1px solid #444",
                display: "flex",
                alignItems: "center",
                padding: "0 15px",
                justifyContent: "space-between",
                marginBottom: "20px"
            }}>
                <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "5px" }}>
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
                </Link>
            </header>

            <Outlet />
        </div>
    );
}
