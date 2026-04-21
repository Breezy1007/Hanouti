import Head from "next/head";
import { useState } from "react";

const FEATURES = [
  { icon: "🏪", title: "متجرك في دقيقة", desc: "افتح متجرك أونلاين بدون تقنية — غير اسمك وصورتك وابدا تبيع" },
  { icon: "📦", title: "أضف منتجاتك بسهولة", desc: "صور، أسعار، ألوان، مقاسات — كلشي في واجهة بسيطة بالدارجة" },
  { icon: "📱", title: "طلبات واتساب تلقائية", desc: "كل طلب كيوصلك مباشرة على واتساب ديالك — بدون تطبيق إضافي" },
  { icon: "💰", title: "دفع أونلاين مغربي", desc: "CIH، CMI، باريدي موبايل — زبونك كيدفع بالطريقة اللي يحبها" },
  { icon: "🤖", title: "AI يكتب ليك", desc: "وصف المنتج، السعر المناسب، البوست ديال إنستغرام — كلشي بكليك واحد" },
  { icon: "📊", title: "Dashboard مبيعاتك", desc: "شوف شحال بعت، شحال ربحت، وأي منتج كيمشي أكثر" },
];

const STEPS = [
  { num: "01", title: "سجل مجاناً", desc: "غير إيميلك وكلمة السر" },
  { num: "02", title: "سمي متجرك", desc: "اختار اسم وصورة ولون" },
  { num: "03", title: "أضف منتجاتك", desc: "صور وأسعار في دقائق" },
  { num: "04", title: "شارك الرابط", desc: "وابدا تستقبل طلبات" },
];

const PLANS = [
  { name: "مجاني", price: "0", period: "للأبد", features: ["5 منتجات", "رابط متجر", "طلبات واتساب"], cta: "ابدا مجاناً", featured: false },
  { name: "Pro", price: "199", period: "درهم/شهر", features: ["منتجات غير محدودة", "دفع أونلاين", "AI كاتب المحتوى", "Dashboard مبيعات", "دعم أولوي"], cta: "ابدا 14 يوم مجاناً", featured: true },
  { name: "Business", price: "499", period: "درهم/شهر", features: ["كلشي في Pro", "متاجر متعددة", "تقارير متقدمة", "API خاص", "مدير حساب"], cta: "تواصل معنا", featured: false },
];

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (email) setSubmitted(true);
  };

  return (
    <>
      <Head>
        <title>Hanouti — افتح متجرك أونلاين في دقيقة</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="منصة التجارة الإلكترونية الأولى بالدارجة المغربية" />
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&family=Clash+Display:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="root">
        {/* BG Effects */}
        <div className="bg-pattern" />
        <div className="glow-1" />
        <div className="glow-2" />
        <div className="glow-3" />

        {/* NAV */}
        <nav className="nav">
          <div className="nav-inner">
            <div className="logo">
              <span className="logo-icon">🏪</span>
              <span className="logo-text">Hanouti</span>
            </div>
            <div className="nav-links">
              <a href="#features">المميزات</a>
              <a href="#how">كيفاش</a>
              <a href="#pricing">الأسعار</a>
            </div>
            <a href="#signup" className="nav-cta">ابدا مجاناً ←</a>
          </div>
        </nav>

        {/* HERO */}
        <section className="hero">
          <div className="hero-badge">🇲🇦 منصة مغربية 100%</div>
          <h1 className="hero-title">
            افتح <span className="highlight">حانوتك</span>
            <br />أونلاين في دقيقة
          </h1>
          <p className="hero-sub">
            بدون تقنية، بدون تعقيد، بدون رأس مال كبير
            <br />كل شيء بالدارجة — من فتح المتجر لاستقبال الفلوس
          </p>

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-num">+2,400</span>
              <span className="stat-label">تاجر مغربي</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-num">+180K</span>
              <span className="stat-label">طلب تم</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-num">4.9 ⭐</span>
              <span className="stat-label">تقييم التجار</span>
            </div>
          </div>

          <div className="hero-cta" id="signup">
            {!submitted ? (
              <div className="email-form">
                <input
                  type="email"
                  placeholder="إيميلك هنا..."
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  dir="ltr"
                  className="email-input"
                />
                <button className="cta-btn" onClick={handleSubmit}>
                  ابدا مجاناً ←
                </button>
              </div>
            ) : (
              <div className="success-msg">
                ✅ مزيان! غادي نتواصلو معك قريباً
              </div>
            )}
            <p className="cta-note">مجاني — بدون بطاقة بنكية</p>
          </div>

          {/* Mock Store Preview */}
          <div className="store-preview">
            <div className="store-card">
              <div className="store-header">
                <div className="store-avatar">👗</div>
                <div>
                  <p className="store-name">متجر سلمى للملابس</p>
                  <p className="store-url">hanouti.ma/salma</p>
                </div>
                <div className="store-badge">🟢 مفتوح</div>
              </div>
              <div className="store-products">
                {["👗 فستان صيفي — 299 درهم", "👠 حذاء كعب — 450 درهم", "👜 شنطة جلد — 380 درهم"].map((p, i) => (
                  <div key={i} className="store-product">
                    <span>{p}</span>
                    <button className="add-btn">أضف 🛒</button>
                  </div>
                ))}
              </div>
              <button className="whatsapp-btn">📱 اطلب عبر واتساب</button>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="section" id="features">
          <div className="section-tag">المميزات</div>
          <h2 className="section-title">كلشي اللي محتاجو<br /><span className="highlight">تاجر ناجح</span></h2>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="feature-card">
                <span className="feature-icon">{f.icon}</span>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="section" id="how">
          <div className="section-tag">كيفاش</div>
          <h2 className="section-title">4 خطوات و<span className="highlight">متجرك جاهز</span></h2>
          <div className="steps">
            {STEPS.map((s, i) => (
              <div key={i} className="step">
                <div className="step-num">{s.num}</div>
                <div className="step-line" />
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PRICING */}
        <section className="section" id="pricing">
          <div className="section-tag">الأسعار</div>
          <h2 className="section-title">ابدا <span className="highlight">مجاناً</span> — كبر بعدين</h2>
          <div className="plans-grid">
            {PLANS.map((p, i) => (
              <div key={i} className={`plan-card ${p.featured ? "plan-featured" : ""}`}>
                {p.featured && <div className="plan-popular">الأكثر استخداماً ⚡</div>}
                <h3 className="plan-name">{p.name}</h3>
                <div className="plan-price">
                  <span className="plan-amount">{p.price}</span>
                  <span className="plan-period">{p.period}</span>
                </div>
                <ul className="plan-features">
                  {p.features.map((f, j) => (
                    <li key={j}>✓ {f}</li>
                  ))}
                </ul>
                <button className={`plan-cta ${p.featured ? "plan-cta-featured" : ""}`}>
                  {p.cta}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="final-cta">
          <h2 className="final-title">جاهز تبدا تبيع؟</h2>
          <p className="final-sub">+2400 تاجر مغربي بداو معنا — أنت التالي</p>
          <a href="#signup" className="final-btn">افتح حانوتك دابا — مجاناً ←</a>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <div className="footer-logo">
            <span>🏪</span>
            <span>Hanouti</span>
          </div>
          <p className="footer-text">صنع بـ ❤️ فالمغرب — للمغاربة</p>
          <p className="footer-copy">© 2026 Hanouti. جميع الحقوق محفوظة.</p>
        </footer>
      </div>

      <style jsx global>{`
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
          --bg: #f8f5f0;
          --surface: #ffffff;
          --surface2: #f2ede6;
          --border: rgba(0,0,0,0.08);
          --orange: #ff6b2b;
          --orange2: #ff8c42;
          --dark: #1a1208;
          --text: #2d2416;
          --muted: #8a7a6a;
          --green: #00b37e;
        }

        html { scroll-behavior: smooth; }

        body {
          background: var(--bg);
          color: var(--text);
          font-family: "Tajawal", sans-serif;
          direction: rtl;
          overflow-x: hidden;
        }

        .root { position: relative; min-height: 100vh; }

        .bg-pattern {
          position: fixed; inset: 0;
          background-image: radial-gradient(circle, rgba(255,107,43,0.06) 1px, transparent 1px);
          background-size: 32px 32px;
          pointer-events: none; z-index: 0;
        }

        .glow-1 { position: fixed; top: -100px; right: -100px; width: 500px; height: 500px; background: radial-gradient(circle, rgba(255,107,43,0.12) 0%, transparent 65%); pointer-events: none; z-index: 0; }
        .glow-2 { position: fixed; bottom: 0; left: -100px; width: 400px; height: 400px; background: radial-gradient(circle, rgba(255,140,66,0.08) 0%, transparent 65%); pointer-events: none; z-index: 0; }
        .glow-3 { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 800px; height: 800px; background: radial-gradient(circle, rgba(255,107,43,0.04) 0%, transparent 65%); pointer-events: none; z-index: 0; }

        /* NAV */
        .nav { position: sticky; top: 0; z-index: 100; background: rgba(248,245,240,0.9); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border); }
        .nav-inner { max-width: 1100px; margin: 0 auto; padding: 14px 24px; display: flex; align-items: center; justify-content: space-between; }
        .logo { display: flex; align-items: center; gap: 8px; }
        .logo-icon { font-size: 22px; }
        .logo-text { font-family: "Clash Display", "Tajawal", sans-serif; font-size: 20px; font-weight: 700; color: var(--dark); }
        .nav-links { display: flex; gap: 24px; }
        .nav-links a { font-size: 14px; color: var(--muted); text-decoration: none; transition: color 0.2s; font-weight: 500; }
        .nav-links a:hover { color: var(--orange); }
        .nav-cta { background: var(--dark); color: white; padding: 9px 20px; border-radius: 10px; font-size: 14px; font-weight: 700; text-decoration: none; transition: all 0.2s; font-family: "Tajawal", sans-serif; }
        .nav-cta:hover { background: var(--orange); transform: translateY(-1px); }

        /* HERO */
        .hero { position: relative; z-index: 10; max-width: 900px; margin: 0 auto; padding: 80px 24px 60px; text-align: center; }
        .hero-badge { display: inline-block; background: rgba(255,107,43,0.1); border: 1px solid rgba(255,107,43,0.2); color: var(--orange); padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 700; margin-bottom: 24px; animation: fadeUp 0.5s ease both; }
        .hero-title { font-family: "Clash Display", "Tajawal", sans-serif; font-size: clamp(40px, 7vw, 72px); font-weight: 700; line-height: 1.1; color: var(--dark); margin-bottom: 20px; animation: fadeUp 0.5s ease 0.1s both; }
        .highlight { color: var(--orange); position: relative; }
        .hero-sub { font-size: clamp(16px, 2vw, 20px); color: var(--muted); line-height: 1.7; margin-bottom: 36px; animation: fadeUp 0.5s ease 0.2s both; }

        .hero-stats { display: flex; align-items: center; justify-content: center; gap: 24px; margin-bottom: 40px; animation: fadeUp 0.5s ease 0.3s both; }
        .stat { text-align: center; }
        .stat-num { display: block; font-size: 22px; font-weight: 800; color: var(--dark); }
        .stat-label { font-size: 12px; color: var(--muted); }
        .stat-divider { width: 1px; height: 36px; background: var(--border); }

        .hero-cta { animation: fadeUp 0.5s ease 0.4s both; }
        .email-form { display: flex; gap: 10px; max-width: 480px; margin: 0 auto 10px; }
        .email-input { flex: 1; padding: 14px 18px; background: white; border: 1.5px solid var(--border); border-radius: 12px; font-family: "Tajawal", sans-serif; font-size: 15px; color: var(--text); outline: none; transition: border-color 0.2s; direction: ltr; }
        .email-input:focus { border-color: var(--orange); }
        .email-input::placeholder { color: var(--muted); }
        .cta-btn { padding: 14px 28px; background: var(--orange); border: none; border-radius: 12px; color: white; font-family: "Tajawal", sans-serif; font-size: 16px; font-weight: 800; cursor: pointer; white-space: nowrap; transition: all 0.2s; }
        .cta-btn:hover { background: #e55a1e; transform: translateY(-2px); box-shadow: 0 8px 25px rgba(255,107,43,0.3); }
        .success-msg { background: rgba(0,179,126,0.1); border: 1px solid rgba(0,179,126,0.2); color: var(--green); padding: 16px 24px; border-radius: 12px; font-size: 16px; font-weight: 700; max-width: 400px; margin: 0 auto 10px; }
        .cta-note { font-size: 12px; color: var(--muted); }

        /* STORE PREVIEW */
        .store-preview { margin-top: 60px; animation: fadeUp 0.6s ease 0.5s both; }
        .store-card { background: white; border: 1px solid var(--border); border-radius: 20px; padding: 24px; max-width: 420px; margin: 0 auto; box-shadow: 0 20px 60px rgba(0,0,0,0.08); }
        .store-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid var(--border); }
        .store-avatar { font-size: 28px; width: 48px; height: 48px; background: rgba(255,107,43,0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .store-name { font-size: 15px; font-weight: 700; color: var(--dark); }
        .store-url { font-size: 12px; color: var(--orange); }
        .store-badge { margin-right: auto; font-size: 12px; background: rgba(0,179,126,0.1); color: var(--green); padding: 4px 10px; border-radius: 20px; font-weight: 600; }
        .store-products { display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px; }
        .store-product { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: var(--surface2); border-radius: 10px; font-size: 14px; }
        .add-btn { background: var(--orange); color: white; border: none; padding: 5px 12px; border-radius: 8px; font-size: 12px; cursor: pointer; font-family: "Tajawal", sans-serif; }
        .whatsapp-btn { width: 100%; padding: 12px; background: #25d366; border: none; border-radius: 12px; color: white; font-family: "Tajawal", sans-serif; font-size: 15px; font-weight: 700; cursor: pointer; }

        /* SECTIONS */
        .section { position: relative; z-index: 10; max-width: 1100px; margin: 0 auto; padding: 80px 24px; text-align: center; }
        .section-tag { display: inline-block; background: rgba(255,107,43,0.1); color: var(--orange); padding: 5px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; margin-bottom: 16px; letter-spacing: 0.08em; }
        .section-title { font-family: "Clash Display", "Tajawal", sans-serif; font-size: clamp(28px, 4vw, 44px); font-weight: 700; color: var(--dark); line-height: 1.2; margin-bottom: 48px; }

        /* FEATURES */
        .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .feature-card { background: white; border: 1px solid var(--border); border-radius: 16px; padding: 28px 24px; text-align: right; transition: all 0.2s; }
        .feature-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.08); border-color: rgba(255,107,43,0.2); }
        .feature-icon { font-size: 32px; display: block; margin-bottom: 14px; }
        .feature-title { font-size: 17px; font-weight: 700; color: var(--dark); margin-bottom: 8px; }
        .feature-desc { font-size: 14px; color: var(--muted); line-height: 1.6; }

        /* STEPS */
        .steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .step { text-align: center; position: relative; }
        .step-num { font-family: "Clash Display", sans-serif; font-size: 48px; font-weight: 700; color: rgba(255,107,43,0.15); margin-bottom: 12px; }
        .step-line { display: none; }
        .step-title { font-size: 17px; font-weight: 700; color: var(--dark); margin-bottom: 8px; }
        .step-desc { font-size: 14px; color: var(--muted); }

        /* PRICING */
        .plans-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .plan-card { background: white; border: 1px solid var(--border); border-radius: 20px; padding: 32px 28px; text-align: right; position: relative; transition: all 0.2s; }
        .plan-featured { border-color: var(--orange); border-width: 2px; transform: scale(1.03); box-shadow: 0 20px 60px rgba(255,107,43,0.15); }
        .plan-popular { position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: var(--orange); color: white; font-size: 12px; font-weight: 700; padding: 4px 16px; border-radius: 20px; white-space: nowrap; }
        .plan-name { font-size: 20px; font-weight: 800; color: var(--dark); margin-bottom: 12px; }
        .plan-price { margin-bottom: 24px; }
        .plan-amount { font-size: 40px; font-weight: 900; color: var(--dark); }
        .plan-period { font-size: 14px; color: var(--muted); margin-right: 4px; }
        .plan-features { list-style: none; display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px; }
        .plan-features li { font-size: 14px; color: var(--text); display: flex; align-items: center; gap: 8px; }
        .plan-cta { width: 100%; padding: 13px; background: var(--surface2); border: 1px solid var(--border); border-radius: 12px; color: var(--dark); font-family: "Tajawal", sans-serif; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .plan-cta:hover { background: var(--dark); color: white; }
        .plan-cta-featured { background: var(--orange); border-color: var(--orange); color: white; }
        .plan-cta-featured:hover { background: #e55a1e; }

        /* FINAL CTA */
        .final-cta { position: relative; z-index: 10; background: var(--dark); margin: 40px 24px; border-radius: 24px; padding: 80px 24px; text-align: center; overflow: hidden; }
        .final-cta::before { content: ""; position: absolute; inset: 0; background: radial-gradient(circle at 30% 50%, rgba(255,107,43,0.2) 0%, transparent 60%); pointer-events: none; }
        .final-title { font-family: "Clash Display", "Tajawal", sans-serif; font-size: clamp(28px, 4vw, 48px); font-weight: 700; color: white; margin-bottom: 12px; }
        .final-sub { font-size: 16px; color: rgba(255,255,255,0.6); margin-bottom: 32px; }
        .final-btn { display: inline-block; background: var(--orange); color: white; padding: 16px 36px; border-radius: 14px; font-size: 18px; font-weight: 800; text-decoration: none; transition: all 0.2s; font-family: "Tajawal", sans-serif; }
        .final-btn:hover { background: var(--orange2); transform: translateY(-2px); box-shadow: 0 8px 30px rgba(255,107,43,0.4); }

        /* FOOTER */
        .footer { position: relative; z-index: 10; text-align: center; padding: 40px 24px; border-top: 1px solid var(--border); }
        .footer-logo { display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 20px; font-weight: 700; color: var(--dark); margin-bottom: 8px; }
        .footer-text { font-size: 14px; color: var(--muted); margin-bottom: 4px; }
        .footer-copy { font-size: 12px; color: var(--muted); opacity: 0.6; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .nav-links { display: none; }
          .features-grid { grid-template-columns: 1fr; }
          .steps { grid-template-columns: repeat(2, 1fr); }
          .plans-grid { grid-template-columns: 1fr; }
          .plan-featured { transform: scale(1); }
          .email-form { flex-direction: column; }
          .hero-stats { gap: 16px; }
          .stat-num { font-size: 18px; }
        }
      `}</style>
    </>
  );
}
