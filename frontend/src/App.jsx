import { Routes, Route, Link } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import SectionPage from "./pages/SectionPage.jsx";
import ArticlePage from "./pages/ArticlePage.jsx";
import HelpDeskPage from "./pages/HelpDeskPage.jsx";
import MembershipAppPage from "./pages/MembershipAppPage.jsx";

import AdminKeyPage from "./pages/admin/AdminKeyPage.jsx";
import AdminProductsPage from "./pages/admin/AdminProductsPage.jsx";
import AdminSectionsPage from "./pages/admin/AdminSectionsPage.jsx";
import AdminArticlesPage from "./pages/admin/AdminArticlesPage.jsx";

export default function App() {
  return (
    <div style={{ fontFamily: "system-ui", padding: 16 }}>
      <header style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Link to="/" style={{ fontWeight: 700, textDecoration: "none" }}>
          CoreDev Help
        </Link>
        <Link to="/admin" style={{ textDecoration: "none" }}>
          Admin
        </Link>
      </header>

      <hr style={{ margin: "16px 0" }} />

      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/product/:slug" element={<ProductPage />} />
        <Route path="/section/:slug" element={<SectionPage />} />
        <Route path="/article/:slug" element={<ArticlePage />} />
        <Route path="/helpdesk" element={<HelpDeskPage />} />
        <Route path="/membership-app" element={<MembershipAppPage />} />

        {/* ADMIN */}
        <Route path="/admin" element={<AdminKeyPage />} />
        <Route path="/admin/products" element={<AdminProductsPage />} />
        <Route path="/admin/sections" element={<AdminSectionsPage />} />
        <Route path="/admin/articles" element={<AdminArticlesPage />} />
      </Routes>
    </div>
  );
}
