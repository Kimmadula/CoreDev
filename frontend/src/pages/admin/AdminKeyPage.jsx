import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminKeyPage() {
  const [key, setKey] = useState(localStorage.getItem("ADMIN_KEY") || "");
  const nav = useNavigate();

  function save() {
    localStorage.setItem("ADMIN_KEY", key.trim());
    nav("/admin/products");
  }

  return (
    <div>
      <h2>Admin Access</h2>
      <p>Enter Admin Key to manage content.</p>

      <input
        value={key}
        onChange={(e) => setKey(e.target.value)}
        placeholder="Admin Key"
        style={{ padding: 8, width: "min(420px, 100%)" }}
      />
      <div style={{ marginTop: 12 }}>
        <button onClick={save} style={{ padding: "8px 12px" }}>
          Continue
        </button>
      </div>
    </div>
  );
}
