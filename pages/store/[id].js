import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function StorePage() {
  const router = useRouter();
  const { id } = router.query;

  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [ordered, setOrdered] = useState(false);

  useEffect(() => {
    if (id) loadStore();
  }, [id]);

  const loadStore = async () => {
    setLoading(true);
    const { data: storeData } = await supabase
      .from("stores").select("*").eq("id", id).single();
    if (storeData) {
      setStore(storeData);
      const { data: prods } = await supabase
        .from("products").select("*")
        .eq("store_id", id).eq("available", true)
        .order("created_at", { ascending: false });
      setProducts(prods || []);
    }
    setLoading(false);
  };

  const addToCart = (product) => {
    const existing = cart.find(c => c.id === product.id);
    if (existing) {
      setCart(cart.map(c => c.id === product.id ? { ...c, qty: c.qty + 1 } : c));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(c => c.id !== id));
  };

  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  const sendOrder = async () => {
    if (!name || !phone || cart.length === 0) return;

    await supabase.from("orders").insert({
      store_id: store.id,
      customer_name: name,
      customer_phone: phone,
      items: cart,
      total: total,
      status: "pending"
    });

    const itemsText = cart.map(c => `• ${c.name} x${c.qty} = ${c.price * c.qty} درهم`).join("\n");
    const msg = `🛍️ طلب جديد من ${name}\n📱 ${phone}\n\n${itemsText}\n\n💰 المجموع: ${total} درهم`;
    const waUrl = `https://wa.me/${store.phone}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, "_blank");
    setOrdered(true);
    setCart([]);
    setShowCart(false);
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#f8f5f0" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🏪</div>
        <p style={{ fontFamily: "Tajawal, sans-serif", color: "#8a7a6a" }}>جاري التحميل...</p>
      </div>
    </div>
  );

  if (!store) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#f8f5f0" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>😕</div>
        <p style={{ fontFamily: "Tajawal, sans-serif", color: "#8a7a6a" }}>المتجر ما كاينش</p>
      </div>
    </div>
  );

  const accent = store.color || "#ff6b2b";

  return (
    <>
      <Head>
        <title>{store.name}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap" rel="stylesheet" />
      </Head>

      <div className="root">
        {/* Header */}
        <div className="header" style={{ borderBottom: `3px solid ${accent}` }}>
          <div className="store-info">
            <div className="store-avatar" style={{ background: `${accent}20`, color: accent }}>
              🏪
            </div>
            <div>
              <h1 className="store-name">{store.name}</h1>
              {store.description && <p className="store-desc">{store.description}</p>}
            </div>
          </div>
          {cartCount > 0 && (
            <button className="cart-btn" style={{ background: accent }} onClick={() => setShowCart(true)}>
              🛒 <span className="cart-count">{cartCount}</span>
            </button>
          )}
        </div>

        {/* Products */}
        <div className="products">
          {ordered && (
            <div className="success-banner">
              ✅ تم إرسال طلبك! سيتواصل معك المتجر قريباً
            </div>
          )}

          {products.length === 0 ? (
            <div className="empty">
              <p style={{ fontSize: 48 }}>📦</p>
              <p>ما كاين حتى منتج دابا</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map(p => (
                <div key={p.id} className="product-card">
                  <div className="product-emoji">🛍️</div>
                  <div className="product-info">
                    <p className="product-name">{p.name}</p>
                    {p.description && <p className="product-desc">{p.description}</p>}
                    <p className="product-price" style={{ color: accent }}>{p.price} درهم</p>
                  </div>
                  <button
                    className="add-btn"
                    style={{ background: accent }}
                    onClick={() => addToCart(p)}
                  >
                    + أضف
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Modal */}
        {showCart && (
          <div className="modal-overlay" onClick={() => setShowCart(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>🛒 سلة الطلبات</h2>
                <button className="close-btn" onClick={() => setShowCart(false)}>✕</button>
              </div>

              <div className="cart-items">
                {cart.map(c => (
                  <div key={c.id} className="cart-item">
                    <div>
                      <p className="cart-name">{c.name}</p>
                      <p className="cart-price" style={{ color: accent }}>{c.price * c.qty} درهم × {c.qty}</p>
                    </div>
                    <button className="remove-btn" onClick={() => removeFromCart(c.id)}>🗑️</button>
                  </div>
                ))}
              </div>

              <div className="cart-total" style={{ color: accent }}>
                المجموع: {total} درهم
              </div>

              <div className="order-form">
                <input
                  placeholder="اسمك الكامل *"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="order-input"
                />
                <input
                  placeholder="رقم الهاتف *"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="order-input"
                  dir="ltr"
                  type="tel"
                />
                <button
                  className="order-btn"
                  style={{ background: accent }}
                  onClick={sendOrder}
                  disabled={!name || !phone}
                >
                  📱 اطلب عبر واتساب
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Float Cart Button */}
        {cartCount > 0 && !showCart && (
          <button
            className="float-cart"
            style={{ background: accent }}
            onClick={() => setShowCart(true)}
          >
            🛒 {cartCount} منتج — {total} درهم
          </button>
        )}
      </div>

      <style jsx global>{`
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #f8f5f0; color: #2d2416; font-family: "Tajawal", sans-serif; direction: rtl; }

        .root { max-width: 600px; margin: 0 auto; min-height: 100vh; padding-bottom: 80px; }

        .header { background: white; padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 50; }
        .store-info { display: flex; align-items: center; gap: 12px; }
        .store-avatar { width: 46px; height: 46px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; }
        .store-name { font-size: 18px; font-weight: 800; color: #1a1208; }
        .store-desc { font-size: 12px; color: #8a7a6a; margin-top: 2px; }
        .cart-btn { display: flex; align-items: center; gap: 6px; padding: 8px 16px; border: none; border-radius: 20px; color: white; font-family: "Tajawal", sans-serif; font-size: 15px; font-weight: 700; cursor: pointer; }
        .cart-count { background: white; color: #1a1208; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; }

        .products { padding: 16px; }
        .success-banner { background: rgba(0,179,126,0.1); border: 1px solid rgba(0,179,126,0.2); color: #00b37e; padding: 12px 16px; border-radius: 12px; margin-bottom: 16px; font-weight: 600; text-align: center; }
        .empty { text-align: center; padding: 60px 24px; color: #8a7a6a; }
        .products-grid { display: flex; flex-direction: column; gap: 12px; }

        .product-card { background: white; border-radius: 14px; padding: 16px; display: flex; align-items: center; gap: 14px; }
        .product-emoji { font-size: 32px; width: 52px; height: 52px; background: #f2ede6; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .product-info { flex: 1; }
        .product-name { font-size: 15px; font-weight: 700; color: #1a1208; margin-bottom: 4px; }
        .product-desc { font-size: 12px; color: #8a7a6a; margin-bottom: 4px; }
        .product-price { font-size: 16px; font-weight: 800; }
        .add-btn { padding: 8px 16px; border: none; border-radius: 10px; color: white; font-family: "Tajawal", sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; white-space: nowrap; }

        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 100; display: flex; align-items: flex-end; }
        .modal { background: white; border-radius: 20px 20px 0 0; padding: 24px; width: 100%; max-height: 85vh; overflow-y: auto; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .modal-header h2 { font-size: 18px; font-weight: 800; }
        .close-btn { background: none; border: none; font-size: 18px; cursor: pointer; color: #8a7a6a; }

        .cart-items { display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px; }
        .cart-item { display: flex; justify-content: space-between; align-items: center; padding: 12px; background: #f2ede6; border-radius: 10px; }
        .cart-name { font-size: 14px; font-weight: 700; color: #1a1208; }
        .cart-price { font-size: 13px; font-weight: 600; margin-top: 2px; }
        .remove-btn { background: none; border: none; cursor: pointer; font-size: 16px; }

        .cart-total { font-size: 20px; font-weight: 900; text-align: center; margin-bottom: 16px; }

        .order-form { display: flex; flex-direction: column; gap: 10px; }
        .order-input { padding: 12px 16px; background: #f2ede6; border: 1px solid rgba(0,0,0,0.08); border-radius: 10px; font-family: "Tajawal", sans-serif; font-size: 15px; color: #2d2416; outline: none; }
        .order-btn { padding: 14px; border: none; border-radius: 12px; color: white; font-family: "Tajawal", sans-serif; font-size: 16px; font-weight: 800; cursor: pointer; }
        .order-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .float-cart { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); padding: 14px 28px; border: none; border-radius: 25px; color: white; font-family: "Tajawal", sans-serif; font-size: 15px; font-weight: 800; cursor: pointer; box-shadow: 0 8px 25px rgba(0,0,0,0.2); white-space: nowrap; z-index: 50; }
      `}</style>
    </>
  );
}
