import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { apiGet, apiAdmin } from "../../api.js";
import AdminNavbar from "../../components/AdminNavbar.jsx";
import "./Admin.css";

export default function AdminProductView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");
    const [success, setSuccess] = useState("");

    // Form State
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [sortOrder, setSortOrder] = useState(0);
    const [autoSlug, setAutoSlug] = useState(true);
    const [uniqueId, setUniqueId] = useState(""); // Store random suffix

    // Edit State (reusing same vars for create/edit to simplify)
    const [editTitle, setEditTitle] = useState("");
    const [editSlug, setEditSlug] = useState("");
    const [editSortOrder, setEditSortOrder] = useState(0);
    const [editAutoSlug, setEditAutoSlug] = useState(false);


    useEffect(() => {
        fetchData();
    }, [id]);

    async function fetchData() {
        setLoading(true);
        setErr("");
        try {
            const allProducts = await apiAdmin("/admin/products", { method: "GET" });
            const p = allProducts.find(x => x.id == id);
            if (!p) throw new Error("Product not found");
            setProduct(p);

            const allSections = await apiAdmin("/admin/sections", { method: "GET" });
            const productSections = allSections.filter(s => s.product_id == id);
            productSections.sort((a, b) => (parseInt(a.sort_order) - parseInt(b.sort_order)) || (parseInt(a.id) - parseInt(b.id)));
            setSections(productSections);

        } catch (e) {
            setErr(String(e));
        } finally {
            setLoading(false);
        }
    }

    function slugify(value) {
        return String(value)
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");
    }

    function openCreate() {
        setEditingId(null);
        setTitle("");
        setSlug("");
        setSortOrder(0);
        setAutoSlug(true);
        const uid = Math.random().toString(36).substring(2, 7);
        setUniqueId(uid);
        setShowForm(true);
    }

    function startEdit(section) {
        setEditingId(section.id);
        setEditTitle(section.title);
        setEditSlug(section.slug);
        setEditSortOrder(section.sort_order || 0);
        setEditAutoSlug(section.slug === slugify(section.title));
        setShowForm(true);
    }

    async function handleSave() {
        setErr("");
        setSuccess("");

        // Determine payload and URL
        const isEdit = !!editingId;
        const currentTitle = isEdit ? editTitle : title;
        const currentSlug = isEdit ? editSlug : slug;
        const currentOrder = isEdit ? editSortOrder : sortOrder;

        if (!currentTitle || !currentSlug) {
            setErr("Title and Slug are required");
            return;
        }

        try {
            const payload = {
                product_id: id,
                title: currentTitle,
                slug: slugify(currentSlug),
                sort_order: parseInt(currentOrder) || 0
            };

            if (isEdit) {
                await apiAdmin(`/admin/sections/${editingId}`, { method: "PUT", body: payload });
                setSuccess("Section updated");
            } else {
                await apiAdmin("/admin/sections", { method: "POST", body: payload });
                setSuccess("Section created");
            }

            setShowForm(false);
            setEditingId(null);
            fetchData();
        } catch (e) {
            setErr(String(e));
        }
    }

    async function remove(sectionId) {
        if (!confirm("Are you sure? This will delete the section.")) return;
        try {
            await apiAdmin(`/admin/sections/${sectionId}`, { method: "DELETE" });
            setSuccess("Section deleted");
            fetchData();
        } catch (e) {
            setErr(String(e));
        }
    }

    if (loading) return <div className="admin-page-container"><AdminNavbar /><div style={{ padding: 40 }}>Loading...</div></div>;
    if (!product) return <div className="admin-page-container"><AdminNavbar /><div style={{ padding: 40 }}>Product not found.</div></div>;

    return (
        <div className="admin-page-container">
            <AdminNavbar />
            <div className="admin-wrapper">
                <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                            <Link to="/admin/products" style={{ textDecoration: 'none', color: '#6b7280' }}>Products</Link>
                            <span style={{ color: '#9ca3af' }}>/</span>
                            <span style={{ color: '#111827', fontWeight: 600 }}>{product.name}</span>
                        </div>
                        <h1>{product.name} <span style={{ fontSize: '0.6em', color: '#6b7280', fontWeight: 400 }}>Sections</span></h1>
                        <p>Manage sections for this product.</p>
                    </div>

                    <button
                        onClick={openCreate}
                        className="btn btn-primary"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            fontSize: '0.8rem',
                            padding: '6px 12px',
                            width: 'auto'
                        }}
                    >
                        <span style={{ fontSize: '1.2em', lineHeight: 0.8 }}>+</span>
                        New Section
                    </button>
                </div>

                {err && <div className="admin-alert error">{err}</div>}
                {success && <div className="admin-alert success">{success}</div>}

                {/* Modal Form */}
                {showForm && (
                    <>
                        <div
                            onClick={() => setShowForm(false)}
                            style={{
                                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999, backdropFilter: 'blur(2px)'
                            }}
                        />
                        <div className="admin-card" style={{
                            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                            width: '500px', maxWidth: '90%', zIndex: 1000, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid #4f46e5'
                        }}>
                            <h2 className="card-title" style={{ marginTop: 0 }}>{editingId ? "Edit Section" : "New Section"}</h2>

                            <div className="form-group">
                                <label className="form-label">Title <span style={{ color: 'red' }}>*</span></label>
                                <input className="form-input"
                                    value={editingId ? editTitle : title}
                                    onChange={e => {
                                        const v = e.target.value;
                                        if (editingId) {
                                            setEditTitle(v);
                                            // For edits, we usually preserve existing slug unless explicitly cleared, 
                                            // but if user wants "auto", we can update it. 
                                            // For now, let's keep edit behavior simple (manual slug edit is hidden below anyway so we might need to be careful).
                                            // actually, if we hide slug field, we must auto-update it or keep it as is.
                                            // Let's only auto-update if it was auto-generated.
                                            if (editAutoSlug) {
                                                // existing logic doesn't have uniqueId for edits easily unless we store it. 
                                                // Simple fix: just slugify title. Risk of collision is handled by user if they get error, 
                                                // OR we append a new random string if they rename? 
                                                // Let's stick to standard slugify for Edit to minimize URL changes.
                                                setEditSlug(slugify(v));
                                            }
                                        } else {
                                            setTitle(v);
                                            // New Creation: Use Unique ID
                                            if (autoSlug) setSlug(slugify(v) + "-" + uniqueId);
                                        }
                                    }}
                                    autoFocus
                                />
                            </div>

                            {/* Slug Hidden */}
                            <div className="form-group" style={{ display: 'none' }}>
                                <label className="form-label">Slug <span style={{ color: 'red' }}>*</span></label>
                                <input className="form-input"
                                    value={editingId ? editSlug : slug}
                                    onChange={e => {
                                        if (editingId) {
                                            setEditSlug(e.target.value);
                                            setEditAutoSlug(false);
                                        } else {
                                            setSlug(e.target.value);
                                            setAutoSlug(false);
                                        }
                                    }}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Sort Order</label>
                                <input className="form-input" type="number"
                                    value={editingId ? editSortOrder : sortOrder}
                                    onChange={e => editingId ? setEditSortOrder(e.target.value) : setSortOrder(e.target.value)}
                                />
                            </div>

                            <div className="form-actions" style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                                <button onClick={handleSave} className="btn btn-success">Save</button>
                                <button onClick={() => setShowForm(false)} className="btn btn-cancel">Cancel</button>
                            </div>
                        </div>
                    </>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                    {sections.length === 0 ? (
                        <div style={{ padding: 40, textAlign: 'center', background: 'white', borderRadius: 8 }}>No sections found.</div>
                    ) : (
                        sections.map(section => (
                            <div key={section.id} className="section-item" style={{ cursor: 'pointer' }} onClick={() => navigate(`/admin/section-view/${section.id}`)}>
                                <div>
                                    <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                                        {section.title}
                                        <span style={{ fontSize: '0.7em', background: '#eef2f6', padding: '2px 6px', borderRadius: 4, color: '#6b7280' }}>Click to View Sub Sections</span>
                                    </h3>
                                    <span style={{ fontSize: '0.85em', color: '#6b7280' }}>/{section.slug} (Order: {section.sort_order})</span>
                                </div>
                                <div style={{ display: 'flex', gap: 5 }}>
                                    <button onClick={(e) => { e.stopPropagation(); startEdit(section); }} className="btn-edit">Edit</button>
                                    <button onClick={(e) => { e.stopPropagation(); remove(section.id); }} className="btn-delete">Delete</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
