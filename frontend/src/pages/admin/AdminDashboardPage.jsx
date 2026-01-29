import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet, apiAdmin, getAdminKey } from "../../api.js";

export default function AdminDashboardPage() {
  const [products, setProducts] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setErr("");
    setLoading(true);
    try {
      const data = await apiAdmin("/admin/products", { method: "GET" });
      setProducts(data);
    } catch (e) {
      setErr(String(e));
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("ADMIN_KEY");
    window.location.href = "/admin";
  }

  const hasKey = getAdminKey();

  if (!hasKey) {
    return (
      <div>
        <p style={{ color: "crimson" }}>No admin key set. Please <Link to="/admin">enter your admin key</Link>.</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2>Admin Dashboard</h2>
        <button 
          onClick={handleLogout}
          style={{ padding: "8px 12px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}
        >
          Logout
        </button>
      </div>

      {err && <p style={{ color: "crimson" }}>{err}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Quick Actions */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={{ margin: 0 }}>Quick Actions</h3>
              <Link 
                to="/admin/guide"
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: 6,
                  fontSize: "0.9em"
                }}
              >
                📖 View Guide
              </Link>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link 
                to="/admin/products"
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#0066cc",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: 6,
                  display: "inline-block"
                }}
              >
                Manage Products
              </Link>
              <Link 
                to="/admin/products"
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#28a745",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: 6,
                  display: "inline-block"
                }}
              >
                Manage Sections
              </Link>
              <Link 
                to="/admin/products"
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#ffc107",
                  color: "black",
                  textDecoration: "none",
                  borderRadius: 6,
                  display: "inline-block"
                }}
              >
                Manage Articles
              </Link>
            </div>
          </div>

          {/* Products List */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3>Products Overview</h3>
              <Link 
                to="/admin/products"
                style={{ textDecoration: "none", color: "#0066cc" }}
              >
                View All →
              </Link>
            </div>

            {products.length === 0 ? (
              <p style={{ opacity: 0.7 }}>No products yet. <Link to="/admin/products">Create your first product</Link></p>
            ) : (
              <div style={{ display: "grid", gap: 16 }}>
                {products.map((product) => (
                  <div 
                    key={product.id} 
                    style={{ 
                      border: "1px solid #ddd", 
                      padding: 16, 
                      borderRadius: 8,
                      backgroundColor: "white"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: "0 0 8px 0" }}>
                          <Link 
                            to={`/admin/products/${product.id}/sections`}
                            style={{ textDecoration: "none", color: "inherit" }}
                          >
                            {product.name}
                          </Link>
                        </h4>
                        <p style={{ margin: "4px 0", opacity: 0.7, fontSize: "0.9em" }}>
                          Slug: {product.slug}
                        </p>
                        {product.description && (
                          <p style={{ margin: "8px 0 0 0", opacity: 0.8 }}>
                            {product.description}
                          </p>
                        )}
                        <div style={{ marginTop: 12, display: "flex", gap: 16, fontSize: "0.9em" }}>
                          <span style={{ opacity: 0.7 }}>
                            Sections: <strong>{product.sections?.length || 0}</strong>
                          </span>
                          <span style={{ opacity: 0.7 }}>
                            Articles: <strong>
                              {product.sections?.reduce((sum, s) => sum + (s.articles?.length || 0), 0) || 0}
                            </strong>
                          </span>
                        </div>
                      </div>
                      <Link 
                        to={`/admin/products/${product.id}/sections`}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "#0066cc",
                          color: "white",
                          textDecoration: "none",
                          borderRadius: 4,
                          fontSize: "0.9em"
                        }}
                      >
                        Manage →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
