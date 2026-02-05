import { Routes, Route } from "react-router-dom";
import PublicLayout from "./components/PublicLayout.jsx";
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
import AdminProductView from "./pages/admin/AdminProductView.jsx";
import AdminSectionView from "./pages/admin/AdminSectionView.jsx";

export default function App() {
  return (
    <Routes>
      {/* PUBLIC */}
      {/* PUBLIC */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/membership-app" element={<MembershipAppPage />} />
      <Route element={<PublicLayout />}>
        {/* Other public pages if any */}
      </Route>

      <Route path="/product/:slug" element={<ProductPage />} />
      <Route path="/section/:slug" element={<SectionPage />} />
      <Route path="/article/:slug" element={<ArticlePage />} />

      {/* ADMIN */}
      <Route path="/admin" element={<AdminKeyPage />} />
      <Route path="/admin/products" element={<AdminProductsPage />} />
      <Route path="/admin/sections" element={<AdminSectionsPage />} />
      <Route path="/admin/articles" element={<AdminArticlesPage />} />
      <Route path="/admin/product-view/:id" element={<AdminProductView />} />
      <Route path="/admin/section-view/:id" element={<AdminSectionView />} />

      {/* Standalone Pages (Full Screen) */}
      <Route path="/helpdesk" element={<HelpDeskPage />} />

      {/* 404 Fallback */}
      <Route path="*" element={<div style={{ padding: 40, textAlign: "center", fontSize: 24 }}>404 - Page Not Found</div>} />
    </Routes>
  );
}
