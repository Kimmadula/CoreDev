import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./AdminKeyPage.css";

export default function AdminKeyPage() {
  const [key, setKey] = useState(localStorage.getItem("ADMIN_KEY") || "");
  const nav = useNavigate();

  function save() {
    if (!key.trim()) {
      alert("Please enter an admin key");
      return;
    }
    localStorage.setItem("ADMIN_KEY", key.trim());
    nav("/admin/products");
  }

  return (
    <div className="admin-key-container">
      <div className="admin-key-content">
        <div className="admin-header">
          <h1>Admin Access</h1>
          <p className="admin-subtitle">Enter your admin key to manage content</p>
        </div>

        <div className="admin-form">
          <div className="form-group">
            <label htmlFor="adminKey">Admin Key</label>
            <input
              id="adminKey"
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Enter your admin key..."
              onKeyPress={(e) => e.key === "Enter" && save()}
              className="admin-input"
            />
          </div>

          <button onClick={save} className="admin-button">
            Continue to Admin Panel
          </button>
        </div>

        <hr className="divider" />

        <div className="admin-menu-section">
          <h3>Quick Navigation</h3>
          <nav className="admin-menu">
            <Link to="/admin/products" className="menu-link">
              📦 Manage Products
            </Link>
            <Link to="/admin/sections" className="menu-link">
              📂 Manage Sections
            </Link>
            <Link to="/admin/articles" className="menu-link">
              📄 Manage Articles
            </Link>
          </nav>
        </div>

        <hr className="divider" />

        <div className="admin-info">
          <h3>About This Admin Panel</h3>
          <p>
            This admin panel allows you to manage content on your site. You can:
          </p>
          <ul>
            <li>📦 <strong>Products:</strong> Add, edit, or delete products</li>
            <li>📂 <strong>Sections:</strong> Organize products into sections</li>
            <li>📄 <strong>Articles:</strong> Create detailed content within sections</li>
          </ul>
          <p className="info-note">
            Content changes are immediately reflected on the public site. You can edit text, headings, and content, but cannot reposition elements.
          </p>
        </div>
      </div>
    </div>
  );
}
