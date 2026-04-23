import { useState, useEffect } from "react";
import Head from "next/head";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://bcbfbghmgavxhehhqbyc.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjYmZiZ2htZ2F2eGhlaGhxYnljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3NTM3ODMsImV4cCI6MjA5MjMyOTc4M30.gYadQRtC6VY3U6X3RzMsR1PjL9aPN5CKFDRqaEYjLsU"
);

const USER_ID = typeof window !== "undefined" ? (localStorage.getItem("hanouti_uid") || (() => { const id = "u_" + Date.now(); localStorage.setItem("hanouti_uid", id); return id; })()) : "ssr";

const TABS = ["المتجر", "المنتجات", "الطلبات"];

export default function Dashboard() {
  const [tab, setTab] = useState("المتجر");
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [storeName, setStoreName] = useState("");
  const [storeDesc, setStoreDesc] = useState("");
  const [storePhone, setStorePhone] = useState("");
  const [storeColor, setStoreColor] = useState("#ff6b2b");
  const [prodName, setProdName] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodDesc, setProdDesc] = useState("");
  const [showAddProd, setShowAddProd] = useState(false);
  const [saving, setSaving] = useState(false);

  const showMsg = (m) => { setMsg(m); setTimeout(() => setMsg(""), 3000); };

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const uid = localStorage.getItem("hanouti_uid") || (() => { const id = "u_" + Date.now(); localStorage.setItem("hanouti_uid", id); return id; })();
    const { data: s } = await supabase.from("stores").select("*").eq("user_id", uid).maybeSingle();
    if (s) {
      setStore(s);
      setStoreName(s.name || "");
      setStoreDesc(s.description || "");
      setStorePhone(s.phone || "");
      setStoreColor(s.color || "#ff6b2b");
      const { data: p } = await supabase.from("products").select("*").eq("store_id", s.id).order("created_at", { ascending: false });
      setProducts(p || []);
      const { data: o } = await supabase.from("orders").select("*").eq("store_id", s.id).order("created_at", { ascending: false });
      setOrders(o || []);
    }
    setLoading(false);
  };

  const saveStore = async () => {
    if (!storeName || !storePhone) { showMsg("⚠️ الاسم ورقم الواتساب مطلوبين!"); return; }
    setSaving(true);
    const uid = localStorage.getItem("hanouti_uid");
    if (store) {
      await supabase.from("stores").update({ name: storeName, description: storeDesc, phone: storePhone, color: storeColor }).eq("id", store.id);
    } else {
      const { data } = await supabase.from("stores").insert({ user_id: uid, name: storeName, description: storeDesc, phone: storePhone, color: storeColor }).select().single();
      setStore(data);
    }
    setSaving(false);
    showMsg("✅ تم الحفظ!");
    loadData();
  };

  const addProduct = async () => {
    if (!prodName || !prodPrice) { showMsg("⚠️ الاسم والسعر مطلوبين!"); return; }
    if (!store) { showMsg("⚠️ احفظ المتجر أولاً!"); return; }
    await supabase.from("products").insert({ store_id: store.id, name: prodName, price: parseFloat(prodPrice), description: prodDesc, available: true });
    setProdName(""); setProdPrice(""); setProdDesc("");
    setShowAddProd(false);
    showMsg("✅ تم إضافة المنتج!");
    loadData();
  };

  const toggleProduct = async (id, available) => {
    await supabase.from("products").update({ available: !available }).eq("id", id);
    loadData();
  };

  const deleteProduct = async (id) => {
    await supabase.from("products").delete().eq("id", id);
    loadData();
  };

  const storeUrl = store ? `${typeof window !== "undefined" ? window.location.origin : ""}/store/${store.id}` : "";
  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);

  return (
    <>
      <Head>
        <title>Hanouti — لوحة التحكم</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap" rel="stylesheet" />
      </Head>

      <div className="root">
        <div className="bg-glow" />

        <aside className="sidebar">
          <div className="logo"><span>🏪</span><span className="logo-text">Hanouti</span></div>
          <nav className="sidenav">
            {TABS.map(t => (
              <button key={t} className={`nav-item ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
                <span className="nav-icon">{t === "المتجر" ? "🏪" : t === "المنتجات" ? "📦" : "🛍️"}</span>
                <span>{t}</span>
              </button>
            ))}
          </nav>
          {store && storeUrl && (
            <div className="store-link">
              <p className="store-link-label">رابط متجرك</p>
              <p className="store-link-url">{storeUrl}</p>
              <button className="copy-btn" onClick={() => { navigator.clipboard.writeText(storeUrl); showMsg("✅ تم النسخ!"); }}>نسخ الرابط 📋</button>
              <a className="open-btn" href={storeUrl} target="_blank" rel="noreferrer">فتح المتجر ↗</a>
            </div>
          )}
        </aside>

        <main className="main">
          <div className="header">
            <div>
              <h1 className="header-title">{tab === "المتجر" ? "إعدادات المتجر" : tab === "المنتجات" ? "المنتجات" : "الطلبات"}</h1>
              <p className="header-sub">{tab === "المتجر" ? "خصص متجرك كيفما تبغي" : tab === "المنتجات" ? `${products.length} منتج` : `${orders.length} طلب`}</p>
            </div>
            {msg && <div className={`msg-badge ${msg.includes("⚠️") ? "msg-warn" : ""}`}>{msg}</div>}
          </div>

          {loading ? (
            <div className="loading"><div className="spinner" /><p>جاري التحميل...</p></div>
          ) : (
            <>
              <div className="stats">
                <div className="stat-card"><p className="stat-label">المنتجات</p><p className="stat-val">{products.length}</p></div>
                <div className="stat-card"><p className="stat-label">الطلبات</p><p className="stat-val">{orders.length}</p></div>
                <div className="stat-card"><p className="stat-label">المبيعات</p><p className="stat-val">{totalRevenue} درهم</p></div>
                <div className="stat-card"><p className="stat-label">متاح</p><p className="stat-val">{products.filter(p => p.available).length}</p></div>
              </div>

              {tab === "المتجر" && (
                <div className="card">
                  <h2 className="card-title">معلومات المتجر</h2>
                  <div className="form-grid">
                    <div className="field">
                      <label>اسم المتجر *</label>
                      <input value={storeName} onChange={e => setStoreName(e.target.value)} placeholder="مثال: متجر سلمى للملابس" />
                    </div>
                    <div className="field">
                      <label>رقم الواتساب *</label>
                      <input value={storePhone} onChange={e => setStorePhone(e.target.value)} placeholder="212612345678" dir="ltr" />
                    </div>
                    <div className="field full">
                      <label>وصف المتجر</label>
                      <textarea value={storeDesc} onChange={e => setStoreDesc(e.target.value)} placeholder="اكتب وصفاً لمتجرك..." rows={3} />
                    </div>
                    <div className="field">
                      <label>لون المتجر</label>
                      <div className="color-row">
                        {["#ff6b2b", "#7c3aed", "#00b37e", "#0ea5e9", "#e11d48", "#f59e0b"].map(c => (
                          <button key={c} className={`color-dot ${storeColor === c ? "active" : ""}`} style={{ background: c }} onClick={() => setStoreColor(c)} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <button className="save-btn" onClick={saveStore} disabled={saving}>
                    {saving ? "جاري الحفظ..." : "حفظ المتجر ✓"}
                  </button>
                  {store && storeUrl && (
                    <a className="store-url-btn" href={storeUrl} target="_blank" rel="noreferrer">
                      🔗 فتح متجري: {storeUrl}
                    </a>
                  )}
                </div>
              )}

              {tab === "المنتجات" && (
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">قائمة المنتجات</h2>
                    <button className="add-btn" onClick={() => setShowAddProd(!showAddProd)}>{showAddProd ? "إلغاء ✕" : "+ إضافة منتج"}</button>
                  </div>
                  {showAddProd && (
                    <div className="add-form">
                      <div className="form-grid">
                        <div className="field"><label>اسم المنتج *</label><input value={prodName} onChange={e => setProdName(e.target.value)} placeholder="مثال: فستان صيفي" /></div>
                        <div className="field"><label>السعر (درهم) *</label><input value={prodPrice} onChange={e => setProdPrice(e.target.value)} placeholder="299" type="number" dir="ltr" /></div>
                        <div className="field full"><label>الوصف</label><input value={prodDesc} onChange={e => setProdDesc(e.target.value)} placeholder="وصف مختصر..." /></div>
                      </div>
                      <button className="save-btn" onClick={addProduct}>إضافة المنتج ✓</button>
                    </div>
                  )}
                  {products.length === 0 ? (
                    <div className="empty"><p className="empty-icon">📦</p><p>أضف أول منتج!</p></div>
                  ) : (
                    <div className="products-list">
                      {products.map(p => (
                        <div key={p.id} className="product-item">
                          <div className="product-info">
                            <p className="product-name">{p.name}</p>
                            <p className="product-price">{p.price} درهم</p>
                            {p.description && <p className="product-desc">{p.description}</p>}
                          </div>
                          <div className="product-actions">
                            <button className={`toggle-btn ${p.available ? "available" : "unavailable"}`} onClick={() => toggleProduct(p.id, p.available)}>
                              {p.available ? "متاح ✓" : "غير متاح"}
                            </button>
                            <button className="delete-btn" onClick={() => deleteProduct(p.id)}>🗑️</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {tab === "الطلبات" && (
                <div className="card">
                  <h2 className="card-title">الطلبات</h2>
                  {orders.length === 0 ? (
                    <div className="empty"><p className="empty-icon">🛍️</p><p>ما كاين حتى طلب بعد — شارك رابط متجرك!</p></div>
                  ) : (
                    <div className="orders-list">
                      {orders.map(o => (
                        <div key={o.id} className="order-item">
                          <div>
                            <p className="order-name">{o.customer_name}</p>
                            <p className="order-phone">{o.customer_phone}</p>
                            <p className="order-date">{new Date(o.created_at).toLocaleDateString("ar-MA")}</p>
                          </div>
                          <div>
                            <p className="order-total">{o.total} درهم</p>
                            <span className="order-status">جديد</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </main>

        <div className="mobile-nav">
          {TABS.map(t => (
            <button key={t} className={`mobile-nav-item ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
              <span>{t === "المتجر" ? "🏪" : t === "المنتجات" ? "📦" : "🛍️"}</span>
              <span>{t}</span>
            </button>
          ))}
          {store && storeUrl && (
            <a className="mobile-nav-item" href={storeUrl} target="_blank" rel="noreferrer">
              <span>🔗</span>
              <span>متجري</span>
            </a>
          )}
        </div>
      </div>

      <style jsx global>{`
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        :root { --bg: #f8f5f0; --surface: #ffffff; --surface2: #f2ede6; --border: rgba(0,0,0,0.08); --orange: #ff6b2b; --dark: #1a1208; --text: #2d2416; --muted: #8a7a6a; --green: #00b37e; --red: #e11d48; }
        html, body { height: 100%; }
        body { background: var(--bg); color: var(--text); font-family: "Tajawal", sans-serif; direction: rtl; }
        .root { display: flex; min-height: 100vh; position: relative; }
        .bg-glow { position: fixed; top: -200px; right: -200px; width: 600px; height: 600px; background: radial-gradient(circle, rgba(255,107,43,0.08) 0%, transparent 65%); pointer-events: none; z-index: 0; }
        .sidebar { width: 240px; flex-shrink: 0; background: var(--dark); display: flex; flex-direction: column; padding: 24px 16px; position: sticky; top: 0; height: 100vh; z-index: 10; }
        .logo { display: flex; align-items: center; gap: 8px; padding: 0 8px 28px; font-size: 22px; }
        .logo-text { font-size: 20px; font-weight: 800; color: var(--orange); }
        .sidenav { display: flex; flex-direction: column; gap: 4px; flex: 1; }
        .nav-item { display: flex; align-items: center; gap: 10px; width: 100%; padding: 11px 14px; background: none; border: none; border-radius: 10px; color: rgba(255,255,255,0.5); font-family: "Tajawal", sans-serif; font-size: 15px; font-weight: 500; cursor: pointer; transition: all 0.15s; text-align: right; }
        .nav-item:hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.8); }
        .nav-item.active { background: rgba(255,107,43,0.15); color: var(--orange); }
        .nav-icon { font-size: 18px; }
        .store-link { background: rgba(255,255,255,0.05); border-radius: 12px; padding: 14px; margin-top: auto; display: flex; flex-direction: column; gap: 8px; }
        .store-link-label { font-size: 11px; color: rgba(255,255,255,0.4); }
        .store-link-url { font-size: 10px; color: rgba(255,255,255,0.6); word-break: break-all; direction: ltr; }
        .copy-btn { width: 100%; padding: 7px; background: rgba(255,107,43,0.2); border: 1px solid rgba(255,107,43,0.3); border-radius: 8px; color: var(--orange); font-family: "Tajawal", sans-serif; font-size: 12px; cursor: pointer; }
        .open-btn { width: 100%; padding: 7px; background: rgba(0,179,126,0.15); border: 1px solid rgba(0,179,126,0.3); border-radius: 8px; color: #00b37e; font-family: "Tajawal", sans-serif; font-size: 12px; cursor: pointer; text-align: center; text-decoration: none; display: block; }
        .main { flex: 1; padding: 32px 32px 90px; min-width: 0; position: relative; z-index: 10; }
        .header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
        .header-title { font-size: 26px; font-weight: 800; color: var(--dark); }
        .header-sub { font-size: 14px; color: var(--muted); margin-top: 4px; }
        .msg-badge { background: rgba(0,179,126,0.1); border: 1px solid rgba(0,179,126,0.2); color: var(--green); padding: 8px 16px; border-radius: 10px; font-size: 14px; font-weight: 600; }
        .msg-badge.msg-warn { background: rgba(245,158,11,0.1); border-color: rgba(245,158,11,0.2); color: #d97706; }
        .loading { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 300px; gap: 16px; color: var(--muted); }
        .spinner { width: 36px; height: 36px; border: 3px solid var(--border); border-top-color: var(--orange); border-radius: 50%; animation: spin 0.7s linear infinite; }
        .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
        .stat-card { background: white; border: 1px solid var(--border); border-radius: 14px; padding: 20px; }
        .stat-label { font-size: 12px; color: var(--muted); margin-bottom: 8px; }
        .stat-val { font-size: 24px; font-weight: 800; color: var(--dark); }
        .card { background: white; border: 1px solid var(--border); border-radius: 16px; padding: 28px; margin-bottom: 20px; }
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .card-title { font-size: 18px; font-weight: 700; color: var(--dark); margin-bottom: 20px; }
        .card-header .card-title { margin-bottom: 0; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
        .field { display: flex; flex-direction: column; gap: 7px; }
        .field.full { grid-column: span 2; }
        .field label { font-size: 13px; font-weight: 600; color: var(--muted); }
        .field input, .field textarea { background: var(--surface2); border: 1px solid var(--border); border-radius: 10px; padding: 11px 14px; color: var(--text); font-family: "Tajawal", sans-serif; font-size: 14px; outline: none; transition: border-color 0.2s; resize: none; }
        .field input:focus, .field textarea:focus { border-color: var(--orange); background: white; }
        .color-row { display: flex; gap: 10px; padding: 8px 0; flex-wrap: wrap; }
        .color-dot { width: 30px; height: 30px; border-radius: 50%; border: 3px solid transparent; cursor: pointer; transition: all 0.2s; }
        .color-dot.active { border-color: var(--dark); transform: scale(1.2); }
        .save-btn { padding: 12px 28px; background: var(--orange); border: none; border-radius: 10px; color: white; font-family: "Tajawal", sans-serif; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .save-btn:hover:not(:disabled) { background: #e55a1e; }
        .save-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .store-url-btn { display: block; margin-top: 14px; padding: 12px 16px; background: rgba(0,179,126,0.08); border: 1px solid rgba(0,179,126,0.2); border-radius: 10px; color: #00b37e; font-family: "Tajawal", sans-serif; font-size: 13px; font-weight: 600; text-decoration: none; word-break: break-all; direction: ltr; text-align: center; }
        .add-btn { padding: 10px 20px; background: var(--dark); border: none; border-radius: 10px; color: white; font-family: "Tajawal", sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; }
        .add-form { background: var(--surface2); border-radius: 12px; padding: 20px; margin-bottom: 20px; }
        .empty { text-align: center; padding: 48px 24px; color: var(--muted); }
        .empty-icon { font-size: 48px; margin-bottom: 12px; }
        .products-list { display: flex; flex-direction: column; gap: 12px; }
        .product-item { display: flex; justify-content: space-between; align-items: center; padding: 16px; background: var(--surface2); border-radius: 12px; }
        .product-name { font-size: 15px; font-weight: 700; color: var(--dark); margin-bottom: 4px; }
        .product-price { font-size: 16px; font-weight: 800; color: var(--orange); margin-bottom: 4px; }
        .product-desc { font-size: 12px; color: var(--muted); }
        .product-actions { display: flex; gap: 8px; align-items: center; flex-shrink: 0; }
        .toggle-btn { padding: 7px 14px; border-radius: 8px; border: none; font-family: "Tajawal", sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; white-space: nowrap; }
        .toggle-btn.available { background: rgba(0,179,126,0.1); color: var(--green); }
        .toggle-btn.unavailable { background: rgba(225,29,72,0.1); color: var(--red); }
        .delete-btn { background: none; border: none; cursor: pointer; font-size: 18px; padding: 6px; border-radius: 8px; }
        .orders-list { display: flex; flex-direction: column; gap: 12px; }
        .order-item { display: flex; justify-content: space-between; align-items: center; padding: 16px; background: var(--surface2); border-radius: 12px; }
        .order-name { font-size: 15px; font-weight: 700; color: var(--dark); }
        .order-phone { font-size: 13px; color: var(--muted); direction: ltr; }
        .order-date { font-size: 12px; color: var(--muted); }
        .order-total { font-size: 18px; font-weight: 800; color: var(--orange); margin-bottom: 4px; text-align: left; }
        .order-status { font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 20px; background: rgba(245,158,11,0.1); color: #d97706; }
        .mobile-nav { display: none; position: fixed; bottom: 0; left: 0; right: 0; background: var(--dark); border-top: 1px solid rgba(255,255,255,0.1); z-index: 100; padding: 8px 0; }
        .mobile-nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; background: none; border: none; color: rgba(255,255,255,0.5); font-family: "Tajawal", sans-serif; font-size: 11px; cursor: pointer; padding: 6px; transition: color 0.15s; text-decoration: none; }
        .mobile-nav-item.active { color: var(--orange); }
        .mobile-nav-item span:first-child { font-size: 22px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .sidebar { display: none; }
          .mobile-nav { display: flex !important; }
          .main { padding: 20px 16px 90px; }
          .stats { grid-template-columns: repeat(2, 1fr); }
          .form-grid { grid-template-columns: 1fr; }
          .field.full { grid-column: span 1; }
          .header-title { font-size: 20px; }
        }
      `}</style>
    </>
  );
}
