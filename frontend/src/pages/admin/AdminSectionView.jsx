import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { apiGet, apiAdmin } from "../../api.js";
import AdminNavbar from "../../components/AdminNavbar.jsx";
import "./Admin.css";
import ConfirmationModal from "../../components/ConfirmationModal";

export default function AdminSectionView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [section, setSection] = useState(null);
    const [subSections, setSubSections] = useState([]);
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

    // Edit State (reusing same vars to simplify)
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
            // Fetch Section Details
            // Note: We might need a direct GET /admin/sections/:id endpoint, 
            // but for now filtering from list is safer if endpoint doesn't exist yet.
            // Actually SectionAdminController resource usually has show method? Check controllers later.
            // Using list filter for safety as we did in ProductView.
            const allSections = await apiAdmin("/admin/sections", { method: "GET" });
            const s = allSections.find(x => x.id == id);
            if (!s) throw new Error("Section not found");
            setSection(s);

            // Fetch Sub Sections
            const allSubSections = await apiAdmin("/admin/sub-sections", { method: "GET" });
            const filtered = allSubSections.filter(ss => ss.section_id == id);
            filtered.sort((a, b) => (parseInt(a.sort_order) - parseInt(b.sort_order)) || (parseInt(a.id) - parseInt(b.id)));
            setSubSections(filtered);

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
        setShowForm(true);
    }

    function startEdit(sub) {
        setEditingId(sub.id);
        setEditTitle(sub.title);
        setEditSlug(sub.slug);
        setEditSortOrder(sub.sort_order || 0);
        setEditAutoSlug(sub.slug === slugify(sub.title));
        setShowForm(true);
    }

    async function handleSave() {
        setErr("");
        setSuccess("");

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
                section_id: id,
                title: currentTitle,
                slug: slugify(currentSlug),
                sort_order: parseInt(currentOrder) || 0
            };

            if (isEdit) {
                await apiAdmin(`/admin/sub-sections/${editingId}`, { method: "PUT", body: payload });
                setSuccess("Sub Section updated");
            } else {
                await apiAdmin("/admin/sub-sections", { method: "POST", body: payload });
                setSuccess("Sub Section created");
            }

            setShowForm(false);
            setEditingId(null);
            fetchData();
        } catch (e) {
            setErr(String(e));
        }
    }

    // Confirmation State
    const [deleteId, setDeleteId] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const confirmDelete = (subId) => {
        setDeleteId(subId);
        setShowDeleteConfirm(true);
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await apiAdmin(`/admin/sub-sections/${deleteId}`, { method: "DELETE" });
            setSuccess("Sub Section deleted");
            fetchData();
        } catch (e) {
            setErr(String(e));
        } finally {
            setShowDeleteConfirm(false);
            setDeleteId(null);
        }
    };

    if (loading) return <div className="admin-page-container"><AdminNavbar /><div style={{ padding: 40 }}>Loading...</div></div>;
    if (!section) return <div className="admin-page-container"><AdminNavbar /><div style={{ padding: 40 }}>Section not found.</div></div>;

    return (
        <div className="admin-page-container">
            <AdminNavbar />
            <div className="admin-wrapper">
                <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                            <Link to="/admin/products" style={{ textDecoration: 'none', color: '#6b7280' }}>Products</Link>
                            <span style={{ color: '#9ca3af' }}>/</span>
                            <Link to={`/admin/product-view/${section.product_id}`} style={{ textDecoration: 'none', color: '#6b7280' }}>
                                {section.product ? section.product.name : 'Product'}
                            </Link>
                            <span style={{ color: '#9ca3af' }}>/</span>
                            <span style={{ color: '#111827', fontWeight: 600 }}>{section.title}</span>
                        </div>
                        <h1>{section.title} <span style={{ fontSize: '0.6em', color: '#6b7280', fontWeight: 400 }}>Sub Sections</span></h1>
                        <p>Manage sub sections / topics for this section.</p>
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
                        New Sub Section
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
                            <h2 className="card-title" style={{ marginTop: 0 }}>{editingId ? "Edit Sub Section" : "New Sub Section"}</h2>

                            <div className="form-group">
                                <label className="form-label">Title <span style={{ color: 'red' }}>*</span></label>
                                <input className="form-input"
                                    value={editingId ? editTitle : title}
                                    onChange={e => {
                                        const v = e.target.value;
                                        if (editingId) {
                                            setEditTitle(v);
                                            if (editAutoSlug) setEditSlug(slugify(v));
                                        } else {
                                            setTitle(v);
                                            if (autoSlug) setSlug(slugify(v));
                                        }
                                    }}
                                    autoFocus
                                />
                            </div>

                            <div className="form-group">
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
                    {subSections.length === 0 ? (
                        <div style={{ padding: 40, textAlign: 'center', background: 'white', borderRadius: 8 }}>No sub sections found.</div>
                    ) : (
                        subSections.map(sub => (
                            <div key={sub.id} className="section-item" style={{ cursor: 'pointer' }} onClick={() => navigate(`/admin/articles?sub_section=${sub.id}`)}>
                                <div>
                                    <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                                        {sub.title}
                                        <span style={{ fontSize: '0.7em', background: '#eff6ff', padding: '2px 6px', borderRadius: 4, color: '#2563eb' }}>View Articles</span>
                                    </h3>
                                    <span style={{ fontSize: '0.85em', color: '#6b7280' }}>/{sub.slug} (Order: {sub.sort_order})</span>
                                </div>
                                <div style={{ display: 'flex', gap: 5 }}>
                                    <button onClick={(e) => { e.stopPropagation(); startEdit(sub); }} className="btn-edit">Edit</button>
                                    <button onClick={(e) => { e.stopPropagation(); confirmDelete(sub.id); }} className="btn-delete">Delete</button>
                                </div>
                            </div>
                        ))
                    )}
                    <ConfirmationModal
                        isOpen={showDeleteConfirm}
                        onClose={() => setShowDeleteConfirm(false)}
                        onConfirm={handleDelete}
                        title="Delete Sub Section"
                        message="Are you sure you want to delete this sub section? This action cannot be undone."
                        confirmText="Delete Sub Section"
                    />
                </div>
            </div>
        </div>
    );
}
