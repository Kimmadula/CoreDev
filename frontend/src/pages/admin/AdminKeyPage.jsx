import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function AdminKeyPage() {
  const [key, setKey] = useState(localStorage.getItem("ADMIN_KEY") || "");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isHovering, setIsHovering] = useState(null);
  const nav = useNavigate();

  const handleResize = () => setIsMobile(window.innerWidth < 768);
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function save() {
    if (!key.trim()) {
      alert("Please enter an admin key");
      return;
    }
    localStorage.setItem("ADMIN_KEY", key.trim());
    nav("/admin/products");
  }

  const responsivePadding = isMobile ? "2rem 1.5rem" : "3rem 2.5rem";
  const responsiveHeaderSize = isMobile ? "1.75rem" : "2.25rem";
  const responsiveFontSize = isMobile ? "0.95rem" : "1rem";

  const navItems = [
    { to: "/admin/products", icon: "📦", label: "Manage Products", desc: "Add, edit, or delete products" },
    { to: "/admin/sections", icon: "📂", label: "Manage Sections", desc: "Organize products into sections" },
    { to: "/admin/articles", icon: "📄", label: "Manage Articles", desc: "Create detailed content" }
  ];

  return (
    <div style={{ 
      minHeight: "100vh", 
      width: "100%", 
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)", 
      padding: isMobile ? "1.5rem" : "2rem", 
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      position: "relative"
    }}>
      {/* Animated background circles */}
      <div style={{ position: "absolute", top: "10%", left: "10%", width: "300px", height: "300px", background: "rgba(255, 255, 255, 0.1)", borderRadius: "50%", filter: "blur(60px)", animation: "float 8s ease-in-out infinite" }} />
      <div style={{ position: "absolute", bottom: "10%", right: "10%", width: "400px", height: "400px", background: "rgba(255, 255, 255, 0.08)", borderRadius: "50%", filter: "blur(80px)", animation: "float 10s ease-in-out infinite reverse" }} />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: slideUp 0.6s ease-out forwards; }
        .fade-in-delay-1 { animation: slideUp 0.6s ease-out 0.1s forwards; opacity: 0; }
        .fade-in-delay-2 { animation: slideUp 0.6s ease-out 0.2s forwards; opacity: 0; }
        .fade-in-delay-3 { animation: slideUp 0.6s ease-out 0.3s forwards; opacity: 0; }
      `}</style>

      <div style={{ 
        background: "rgba(255, 255, 255, 0.98)", 
        backdropFilter: "blur(20px)",
        borderRadius: "24px", 
        padding: responsivePadding, 
        maxWidth: "640px", 
        width: "100%",
        margin: "0 auto",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)",
        position: "relative",
        zIndex: 1
      }}>
        {/* Header */}
        <div className="fade-in" style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ 
            width: "80px", 
            height: "80px", 
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", 
            borderRadius: "20px", 
            margin: "0 auto 1.5rem", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            boxShadow: "0 8px 24px rgba(102, 126, 234, 0.4)",
            fontSize: "2.5rem"
          }}>
            🔐
          </div>
          <h1 style={{ 
            fontSize: responsiveHeaderSize, 
            fontWeight: 800, 
            marginBottom: "0.75rem", 
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", 
            WebkitBackgroundClip: "text", 
            WebkitTextFillColor: "transparent", 
            backgroundClip: "text",
            letterSpacing: "-0.02em"
          }}>
            Admin Access
          </h1>
          <p style={{ 
            fontSize: responsiveFontSize, 
            color: "#64748b", 
            marginBottom: 0,
            fontWeight: 500
          }}>
            Enter your admin key to manage content
          </p>
        </div>

        {/* Key Input Form */}
        <div className="fade-in-delay-1" style={{ marginBottom: "2.5rem" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "0.75rem", 
              fontWeight: 600, 
              color: "#1e293b",
              fontSize: "0.95rem"
            }}>
              Admin Key
            </label>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Enter your admin key..."
              onKeyPress={(e) => e.key === "Enter" && save()}
              style={{ 
                width: "100%", 
                padding: "1rem 1.25rem", 
                border: "2px solid #e2e8f0", 
                borderRadius: "12px", 
                fontSize: responsiveFontSize, 
                fontFamily: "'Inter', sans-serif", 
                transition: "all 0.3s ease", 
                boxSizing: "border-box",
                background: "#f8fafc"
              }}
              onFocus={(e) => { 
                e.target.style.borderColor = "#667eea"; 
                e.target.style.boxShadow = "0 0 0 4px rgba(102, 126, 234, 0.1)"; 
                e.target.style.background = "white"; 
              }}
              onBlur={(e) => { 
                e.target.style.borderColor = "#e2e8f0"; 
                e.target.style.boxShadow = "none"; 
                e.target.style.background = "#f8fafc"; 
              }}
            />
          </div>

          <button 
            onClick={save} 
            style={{ 
              width: "100%", 
              padding: isMobile ? "1rem" : "1.125rem", 
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", 
              color: "white", 
              border: "none", 
              borderRadius: "12px", 
              fontSize: responsiveFontSize, 
              fontWeight: 700, 
              cursor: "pointer", 
              transition: "all 0.3s ease",
              letterSpacing: "0.02em",
              boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)"
            }}
            onMouseEnter={(e) => { 
              e.target.style.transform = "translateY(-2px)"; 
              e.target.style.boxShadow = "0 8px 24px rgba(102, 126, 234, 0.4)"; 
            }}
            onMouseLeave={(e) => { 
              e.target.style.transform = "translateY(0)"; 
              e.target.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.3)"; 
            }}
          >
            Continue to Admin Panel →
          </button>
        </div>

        {/* Divider */}
        <div style={{ 
          height: "1px", 
          background: "linear-gradient(90deg, transparent, #e2e8f0, transparent)", 
          margin: "2.5rem 0" 
        }} />

        {/* Quick Navigation */}
        <div className="fade-in-delay-2" style={{ marginBottom: "2.5rem" }}>
          <h3 style={{ 
            fontSize: isMobile ? "1.05rem" : "1.15rem", 
            fontWeight: 700, 
            marginBottom: "1.25rem", 
            color: "#1e293b",
            letterSpacing: "-0.01em"
          }}>
            Quick Navigation
          </h3>
          <nav style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            {navItems.map((item, idx) => (
              <Link 
                key={idx}
                to={item.to} 
                onMouseEnter={() => setIsHovering(idx)}
                onMouseLeave={() => setIsHovering(null)}
                style={{ 
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "1rem 1.25rem", 
                  background: isHovering === idx ? "linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 100%)" : "#f8fafc",
                  borderRadius: "12px", 
                  textDecoration: "none", 
                  transition: "all 0.3s ease", 
                  border: `2px solid ${isHovering === idx ? "#667eea" : "transparent"}`,
                  transform: isHovering === idx ? "translateX(4px)" : "translateX(0)",
                  boxShadow: isHovering === idx ? "0 4px 12px rgba(102, 126, 234, 0.15)" : "none"
                }}
              >
                <div style={{ 
                  fontSize: "1.5rem",
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: isHovering === idx ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "#e2e8f0",
                  borderRadius: "10px",
                  transition: "all 0.3s ease"
                }}>
                  {isHovering === idx ? "✨" : item.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    color: isHovering === idx ? "#667eea" : "#1e293b", 
                    fontWeight: 600,
                    fontSize: responsiveFontSize,
                    marginBottom: "0.15rem",
                    transition: "color 0.3s ease"
                  }}>
                    {item.label}
                  </div>
                  <div style={{ 
                    color: "#64748b", 
                    fontSize: isMobile ? "0.8rem" : "0.85rem",
                    lineHeight: 1.4
                  }}>
                    {item.desc}
                  </div>
                </div>
                <div style={{ 
                  color: isHovering === idx ? "#667eea" : "#cbd5e1",
                  transition: "all 0.3s ease",
                  transform: isHovering === idx ? "translateX(4px)" : "translateX(0)",
                  fontSize: "1.25rem"
                }}>
                  →
                </div>
              </Link>
            ))}
          </nav>
        </div>

        {/* Divider */}
        <div style={{ 
          height: "1px", 
          background: "linear-gradient(90deg, transparent, #e2e8f0, transparent)", 
          margin: "2.5rem 0" 
        }} />

        {/* About Section */}
        <div className="fade-in-delay-3" style={{ marginTop: "2rem" }}>
          <h3 style={{ 
            fontSize: isMobile ? "1.05rem" : "1.15rem", 
            fontWeight: 700, 
            marginBottom: "1rem", 
            color: "#1e293b",
            letterSpacing: "-0.01em"
          }}>
            About This Admin Panel
          </h3>
          <p style={{ 
            color: "#64748b", 
            marginBottom: "1.25rem", 
            lineHeight: 1.7, 
            fontSize: responsiveFontSize 
          }}>
            Manage all aspects of your site's content through this centralized admin panel. Make changes that reflect immediately on your public site.
          </p>
          
          <div style={{ 
            background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)", 
            borderLeft: "4px solid #3b82f6", 
            padding: "1.25rem", 
            borderRadius: "12px", 
            fontSize: isMobile ? "0.85rem" : "0.9rem", 
            color: "#1e40af",
            lineHeight: 1.7,
            boxShadow: "0 2px 8px rgba(59, 130, 246, 0.1)"
          }}>
            <div style={{ fontWeight: 700, marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "1.25rem" }}>💡</span>
              Quick Tip
            </div>
            Content changes are immediately reflected on the public site. You can edit text, headings, and content, but cannot reposition elements.
          </div>
        </div>
      </div>
    </div>
  );
} 