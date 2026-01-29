import { Link } from "react-router-dom";

export default function AdminGuidePage() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <Link to="/admin/dashboard" style={{ textDecoration: "none" }}>← Back to Dashboard</Link>
      </div>

      <h1>Admin Guide: Step-by-Step Instructions</h1>
      <p style={{ fontSize: "1.1em", opacity: 0.8, marginBottom: 32 }}>
        Learn how to add, edit, and delete Products, Sections, and Articles in your help system.
      </p>

      {/* Structure Overview */}
      <div style={{ 
        backgroundColor: "#f8f9fa", 
        padding: 20, 
        borderRadius: 8, 
        marginBottom: 32,
        border: "2px solid #0066cc"
      }}>
        <h2 style={{ marginTop: 0 }}>📚 Content Structure</h2>
        <p style={{ fontSize: "1.1em", marginBottom: 16 }}>
          Your content is organized in a hierarchical structure:
        </p>
        <div style={{ marginLeft: 20 }}>
          <div style={{ marginBottom: 12 }}>
            <strong style={{ color: "#0066cc", fontSize: "1.2em" }}>Product</strong>
            <p style={{ margin: "4px 0", opacity: 0.8 }}>Top-level category (e.g., "SAP SCM", "CoreDev Platform")</p>
          </div>
          <div style={{ marginLeft: 30, marginBottom: 12 }}>
            <strong style={{ color: "#28a745", fontSize: "1.1em" }}>↓ Section</strong>
            <p style={{ margin: "4px 0", opacity: 0.8 }}>Sub-category within a product (e.g., "Installation", "Configuration")</p>
          </div>
          <div style={{ marginLeft: 60, marginBottom: 12 }}>
            <strong style={{ color: "#ffc107", fontSize: "1em" }}>↓ Article</strong>
            <p style={{ margin: "4px 0", opacity: 0.8 }}>Individual help article with content</p>
          </div>
        </div>
      </div>

      {/* Step-by-Step Guide */}
      <div style={{ marginBottom: 40 }}>
        <h2>🚀 Step-by-Step: Creating Your First Content</h2>

        {/* Step 1 */}
        <div style={{ 
          border: "1px solid #ddd", 
          padding: 20, 
          borderRadius: 8, 
          marginBottom: 24,
          backgroundColor: "white"
        }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
            <div style={{
              backgroundColor: "#0066cc",
              color: "white",
              borderRadius: "50%",
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              marginRight: 16
            }}>
              1
            </div>
            <h3 style={{ margin: 0 }}>Create a Product</h3>
          </div>
          
          <div style={{ marginLeft: 56 }}>
            <p><strong>Where:</strong> Go to <Link to="/admin/products">Admin → Products</Link></p>
            <p><strong>How to Add:</strong></p>
            <ol style={{ marginLeft: 20, marginTop: 8 }}>
              <li>Scroll to the <strong>"Add Product"</strong> section at the top</li>
              <li>Enter the <strong>Name</strong> (e.g., "SAP SCM")</li>
              <li>Enter the <strong>Slug</strong> (optional - auto-generated if empty, e.g., "sap-scm")</li>
              <li>Enter a <strong>Description</strong> (optional)</li>
              <li>Click <strong>"Create"</strong> button</li>
            </ol>
            
            <p style={{ marginTop: 16 }}><strong>How to Edit:</strong></p>
            <ol style={{ marginLeft: 20, marginTop: 8 }}>
              <li>Find the product in the "Existing Products" list</li>
              <li>Click the <strong>"Edit"</strong> button next to the product</li>
              <li>Modify the fields (Name, Slug, Description)</li>
              <li>Click <strong>"Save"</strong> to update or <strong>"Cancel"</strong> to discard</li>
            </ol>

            <p style={{ marginTop: 16 }}><strong>How to Delete:</strong></p>
            <ol style={{ marginLeft: 20, marginTop: 8 }}>
              <li>Find the product in the list</li>
              <li>Click the <strong>"Delete"</strong> button</li>
              <li>Confirm the deletion (⚠️ This will delete all sections and articles under this product!)</li>
            </ol>
          </div>
        </div>

        {/* Step 2 */}
        <div style={{ 
          border: "1px solid #ddd", 
          padding: 20, 
          borderRadius: 8, 
          marginBottom: 24,
          backgroundColor: "white"
        }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
            <div style={{
              backgroundColor: "#28a745",
              color: "white",
              borderRadius: "50%",
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              marginRight: 16
            }}>
              2
            </div>
            <h3 style={{ margin: 0 }}>Add Sections to Your Product</h3>
          </div>
          
          <div style={{ marginLeft: 56 }}>
            <p><strong>Where:</strong> From Products page, click <strong>"Manage Sections →"</strong> on any product</p>
            <p><strong>How to Add:</strong></p>
            <ol style={{ marginLeft: 20, marginTop: 8 }}>
              <li>You'll see the "Add Section" form at the top</li>
              <li>Enter the <strong>Title</strong> (e.g., "Installation Guide")</li>
              <li>Enter the <strong>Slug</strong> (optional - auto-generated if empty, e.g., "installation-guide")</li>
              <li>Click <strong>"Create"</strong> button</li>
            </ol>
            
            <p style={{ marginTop: 16 }}><strong>How to Edit:</strong></p>
            <ol style={{ marginLeft: 20, marginTop: 8 }}>
              <li>Find the section in the "Existing Sections" list</li>
              <li>Click the <strong>"Edit"</strong> button</li>
              <li>Modify the Title or Slug</li>
              <li>Click <strong>"Save"</strong> or <strong>"Cancel"</strong></li>
            </ol>

            <p style={{ marginTop: 16 }}><strong>How to Delete:</strong></p>
            <ol style={{ marginLeft: 20, marginTop: 8 }}>
              <li>Click the <strong>"Delete"</strong> button next to a section</li>
              <li>Confirm deletion (⚠️ This will delete all articles in this section!)</li>
            </ol>
          </div>
        </div>

        {/* Step 3 */}
        <div style={{ 
          border: "1px solid #ddd", 
          padding: 20, 
          borderRadius: 8, 
          marginBottom: 24,
          backgroundColor: "white"
        }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
            <div style={{
              backgroundColor: "#ffc107",
              color: "black",
              borderRadius: "50%",
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              marginRight: 16
            }}>
              3
            </div>
            <h3 style={{ margin: 0 }}>Create Articles in Your Section</h3>
          </div>
          
          <div style={{ marginLeft: 56 }}>
            <p><strong>Where:</strong> From Sections page, click <strong>"Manage Articles →"</strong> on any section</p>
            <p><strong>How to Add:</strong></p>
            <ol style={{ marginLeft: 20, marginTop: 8 }}>
              <li>You'll see the "Add Article" form at the top</li>
              <li>Enter the <strong>Title</strong> (e.g., "How to Install SAP SCM")</li>
              <li>Enter the <strong>Slug</strong> (optional - auto-generated if empty)</li>
              <li>Enter the <strong>Content</strong> (supports HTML formatting)</li>
              <li>Click <strong>"Create"</strong> button</li>
            </ol>
            
            <p style={{ marginTop: 16 }}><strong>How to Edit:</strong></p>
            <ol style={{ marginLeft: 20, marginTop: 8 }}>
              <li>Find the article in the "Existing Articles" list</li>
              <li>Click the <strong>"Edit"</strong> button</li>
              <li>Modify Title, Slug, or Content</li>
              <li>Click <strong>"Save"</strong> or <strong>"Cancel"</strong></li>
            </ol>

            <p style={{ marginTop: 16 }}><strong>How to Delete:</strong></p>
            <ol style={{ marginLeft: 20, marginTop: 8 }}>
              <li>Click the <strong>"Delete"</strong> button next to an article</li>
              <li>Confirm deletion</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Quick Reference */}
      <div style={{ 
        backgroundColor: "#e7f3ff", 
        padding: 20, 
        borderRadius: 8, 
        marginBottom: 32,
        border: "1px solid #0066cc"
      }}>
        <h2 style={{ marginTop: 0 }}>📋 Quick Reference: Where to Find Everything</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#0066cc", color: "white" }}>
              <th style={{ padding: 12, textAlign: "left", border: "1px solid #0052a3" }}>Action</th>
              <th style={{ padding: 12, textAlign: "left", border: "1px solid #0052a3" }}>Location</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: 12, border: "1px solid #ddd" }}><strong>Add Product</strong></td>
              <td style={{ padding: 12, border: "1px solid #ddd" }}><Link to="/admin/products">Admin → Products</Link> (top form)</td>
            </tr>
            <tr style={{ backgroundColor: "#f8f9fa" }}>
              <td style={{ padding: 12, border: "1px solid #ddd" }}><strong>Edit Product</strong></td>
              <td style={{ padding: 12, border: "1px solid #ddd" }}><Link to="/admin/products">Admin → Products</Link> (click "Edit" button)</td>
            </tr>
            <tr>
              <td style={{ padding: 12, border: "1px solid #ddd" }}><strong>Delete Product</strong></td>
              <td style={{ padding: 12, border: "1px solid #ddd" }}><Link to="/admin/products">Admin → Products</Link> (click "Delete" button)</td>
            </tr>
            <tr style={{ backgroundColor: "#f8f9fa" }}>
              <td style={{ padding: 12, border: "1px solid #ddd" }}><strong>Add Section</strong></td>
              <td style={{ padding: 12, border: "1px solid #ddd" }}>Products page → Click "Manage Sections" → (top form)</td>
            </tr>
            <tr>
              <td style={{ padding: 12, border: "1px solid #ddd" }}><strong>Edit Section</strong></td>
              <td style={{ padding: 12, border: "1px solid #ddd" }}>Sections page → Click "Edit" button</td>
            </tr>
            <tr style={{ backgroundColor: "#f8f9fa" }}>
              <td style={{ padding: 12, border: "1px solid #ddd" }}><strong>Delete Section</strong></td>
              <td style={{ padding: 12, border: "1px solid #ddd" }}>Sections page → Click "Delete" button</td>
            </tr>
            <tr>
              <td style={{ padding: 12, border: "1px solid #ddd" }}><strong>Add Article</strong></td>
              <td style={{ padding: 12, border: "1px solid #ddd" }}>Sections page → Click "Manage Articles" → (top form)</td>
            </tr>
            <tr style={{ backgroundColor: "#f8f9fa" }}>
              <td style={{ padding: 12, border: "1px solid #ddd" }}><strong>Edit Article</strong></td>
              <td style={{ padding: 12, border: "1px solid #ddd" }}>Articles page → Click "Edit" button</td>
            </tr>
            <tr>
              <td style={{ padding: 12, border: "1px solid #ddd" }}><strong>Delete Article</strong></td>
              <td style={{ padding: 12, border: "1px solid #ddd" }}>Articles page → Click "Delete" button</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Tips */}
      <div style={{ 
        backgroundColor: "#fff3cd", 
        padding: 20, 
        borderRadius: 8,
        border: "1px solid #ffc107"
      }}>
        <h2 style={{ marginTop: 0 }}>💡 Tips & Best Practices</h2>
        <ul style={{ marginLeft: 20 }}>
          <li><strong>Slugs are auto-generated:</strong> If you leave the slug field empty, it will be automatically created from the name/title</li>
          <li><strong>Slugs must be unique:</strong> If a slug already exists, a number will be added automatically (e.g., "my-product-2")</li>
          <li><strong>Cascade deletion:</strong> Deleting a Product deletes all its Sections and Articles. Deleting a Section deletes all its Articles</li>
          <li><strong>HTML in articles:</strong> Article content supports HTML formatting for rich text</li>
          <li><strong>Navigation:</strong> Use the breadcrumb links at the top of each page to navigate back</li>
          <li><strong>Dashboard overview:</strong> Visit the <Link to="/admin/dashboard">Dashboard</Link> to see statistics and quick access to all content</li>
        </ul>
      </div>

      <div style={{ marginTop: 32, textAlign: "center" }}>
        <Link 
          to="/admin/dashboard"
          style={{
            padding: "12px 24px",
            backgroundColor: "#0066cc",
            color: "white",
            textDecoration: "none",
            borderRadius: 6,
            display: "inline-block"
          }}
        >
          Go to Dashboard →
        </Link>
      </div>
    </div>
  );
}
