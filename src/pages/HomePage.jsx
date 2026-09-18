import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../api';
import ProductGrid from '../components/product/ProductGrid';

const BRANDS = [
  { name: 'Apple',   slug: 'apple',   category: 'Electronics',  icon: 'laptop',             color: '#185fa5', bg: '#e6f1fb', badge: 'top' },
  { name: 'Nike',    slug: 'nike',    category: 'Sportswear',   icon: 'shirt',              color: '#534ab7', bg: '#eeedfe', badge: 'hot' },
  { name: 'Sony',    slug: 'sony',    category: 'Audio',        icon: 'headphones',         color: '#3b6d11', bg: '#eaf3de', badge: 'new' },
  { name: 'IKEA',    slug: 'ikea',    category: 'Home',         icon: 'armchair',           color: '#854f0b', bg: '#faeeda', badge: 'top' },
  { name: "L'Oréal", slug: 'loreal',  category: 'Beauty',       icon: 'sparkles',           color: '#993556', bg: '#fbeaf0', badge: 'pro' },
  { name: 'Penguin', slug: 'penguin', category: 'Books',        icon: 'book-2',             color: '#0f6e56', bg: '#e1f5ee', badge: 'new' },
  { name: 'Samsung', slug: 'samsung', category: 'Electronics',  icon: 'cpu',                color: '#185fa5', bg: '#e6f1fb', badge: 'hot' },
  { name: 'Adidas',  slug: 'adidas',  category: 'Sportswear',   icon: 'run',                color: '#534ab7', bg: '#eeedfe', badge: 'top' },
  { name: 'Canon',   slug: 'canon',   category: 'Photography',  icon: 'camera',             color: '#a32d2d', bg: '#fcebeb', badge: 'pro' },
  { name: 'Ashley',  slug: 'ashley',  category: 'Furniture',    icon: 'sofa',               color: '#854f0b', bg: '#faeeda', badge: 'new' },
  { name: 'Fitbit',  slug: 'fitbit',  category: 'Wellness',     icon: 'heart-rate-monitor', color: '#3b6d11', bg: '#eaf3de', badge: 'hot' },
  { name: 'MAC',     slug: 'mac',     category: 'Cosmetics',    icon: 'brush',              color: '#993556', bg: '#fbeaf0', badge: 'pro' },
];

const TICKER = [
  { name: 'Dyson',       icon: 'wind'      },
  { name: 'Ray-Ban',     icon: 'eyeglass'  },
  { name: 'Logitech',    icon: 'keyboard'  },
  { name: 'Weber',       icon: 'flame'     },
  { name: 'Fossil',      icon: 'clock'     },
  { name: 'New Balance', icon: 'shoe'      },
  { name: 'Clinique',    icon: 'droplet'   },
  { name: 'HP',          icon: 'printer'   },
  { name: 'Bose',        icon: 'headset'   },
  { name: 'LG',          icon: 'device-tv' },
];

const CATEGORIES = [
  { name: 'Electronics',   slug: 'electronics', icon: 'bolt',         color: '#534ab7', bg: '#eeedfe', count: '12.4K' },
  { name: 'Fashion',       slug: 'fashion',     icon: 'hanger',       color: '#993556', bg: '#fbeaf0', count: '8.2K'  },
  { name: 'Home & Living', slug: 'home',        icon: 'home',         color: '#0f6e56', bg: '#e1f5ee', count: '5.7K'  },
  { name: 'Sports',        slug: 'sports',      icon: 'ball-football',color: '#854f0b', bg: '#faeeda', count: '3.9K'  },
  { name: 'Beauty',        slug: 'beauty',      icon: 'sparkles',     color: '#7e22ce', bg: '#f3e8ff', count: '7.1K'  },
  { name: 'Books',         slug: 'books',       icon: 'books',        color: '#3b6d11', bg: '#eaf3de', count: '15K'   },
];

const BADGE = {
  hot: { label: 'Hot',      bg: '#fee2e2', color: '#b91c1c' },
  new: { label: 'New in',   bg: '#dcfce7', color: '#15803d' },
  top: { label: 'Top pick', bg: '#dbeafe', color: '#1d4ed8' },
  pro: { label: 'Premium',  bg: '#f3e8ff', color: '#7e22ce' },
};

const css = `
  @import url('https://cdnjs.cloudflare.com/ajax/libs/tabler-icons/3.3.0/tabler-icons.min.css');

  .hp { display:flex; flex-direction:column; gap:3.5rem; padding-bottom:4rem; }

  /* Section header */
  .hp-hd { display:flex; align-items:flex-end; justify-content:space-between; margin-bottom:1.25rem; }
  .hp-hd__left p { font-size:11px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:#9ca3af; margin:0 0 3px; }
  .hp-hd__left h2 { font-size:1.3rem; font-weight:800; color:#111; margin:0; }
  .hp-see-all { display:inline-flex; align-items:center; gap:4px; font-size:13px; font-weight:600; color:#185fa5; text-decoration:none; transition:gap .15s; }
  .hp-see-all:hover { gap:8px; }

  /* Buttons */
  .hp-btn { display:inline-flex; align-items:center; gap:6px; font-size:14px; font-weight:700; border-radius:8px; padding:11px 22px; text-decoration:none; transition:opacity .15s,transform .12s; cursor:pointer; border:none; }
  .hp-btn:active { transform:scale(.97); }
  .hp-btn-primary { background:#111; color:#fff; }
  .hp-btn-primary:hover { opacity:.85; }
  .hp-btn-ghost { background:transparent; color:#111; border:1.5px solid #e5e7eb; }
  .hp-btn-ghost:hover { background:#f9fafb; }
  .hp-btn-promo { background:#fff; color:#1a1a2e; font-weight:800; }
  .hp-btn-promo:hover { opacity:.9; }

  /* Hero */
  .hp-hero { display:grid; grid-template-columns:1fr 1fr; gap:2rem; align-items:center; padding-top:2rem; }
  .hp-hero__badge { display:inline-flex; align-items:center; gap:6px; font-size:12px; font-weight:700; background:#e6f1fb; color:#185fa5; border-radius:20px; padding:5px 13px; margin-bottom:1rem; }
  .hp-hero__title { font-size:clamp(1.8rem,4vw,2.8rem); font-weight:900; line-height:1.12; color:#111; margin:0 0 1rem; }
  .hp-hero__accent { color:#185fa5; }
  .hp-hero__sub { font-size:15px; color:#6b7280; line-height:1.65; max-width:420px; margin:0 0 1.5rem; }
  .hp-hero__actions { display:flex; gap:10px; flex-wrap:wrap; margin-bottom:2rem; }
  .hp-hero__stats { display:flex; align-items:center; gap:1.5rem; }
  .hp-hero__stat { display:flex; flex-direction:column; gap:2px; }
  .hp-hero__stat .ti { font-size:13px; color:#185fa5; }
  .hp-hero__stat-num { font-size:18px; font-weight:900; color:#111; line-height:1; }
  .hp-hero__stat-lbl { font-size:10px; color:#9ca3af; }
  .hp-hero__stat-div { width:1px; height:36px; background:#e5e7eb; }
  .hp-hero__visual { position:relative; height:300px; display:flex; align-items:center; justify-content:center; }
  .hp-hero__orbit { width:230px; height:230px; border-radius:50%; border:1.5px dashed #e5e7eb; }
  .hp-hero__float { position:absolute; display:flex; align-items:center; gap:8px; background:#fff; border:1px solid #e5e7eb; border-radius:10px; padding:8px 14px; font-size:12px; font-weight:600; color:#111; white-space:nowrap; box-shadow:0 1px 4px rgba(0,0,0,.06); }
  .hp-hero__float .ti { font-size:16px; color:#185fa5; }
  .hp-hero__float-1 { top:28px; right:16px; }
  .hp-hero__float-2 { bottom:48px; left:8px; }

  /* Brands grid */
  .hp-brands-grid { display:grid; grid-template-columns:repeat(6,1fr); gap:10px; margin-bottom:1.25rem; }
  .hp-brand-card { display:flex; flex-direction:column; align-items:center; gap:6px; padding:1rem .5rem; background:#fff; border:1px solid #e5e7eb; border-radius:12px; text-decoration:none; transition:border-color .15s,transform .12s; }
  .hp-brand-card:hover { border-color:#185fa5; transform:translateY(-2px); }
  .hp-brand-card:focus-visible { outline:2px solid #185fa5; outline-offset:2px; }
  .hp-brand-icon { width:44px; height:44px; border-radius:10px; display:flex; align-items:center; justify-content:center; }
  .hp-brand-name { font-size:12px; font-weight:700; color:#111; text-align:center; }
  .hp-brand-cat { font-size:10px; color:#9ca3af; text-align:center; }
  .hp-badge { font-size:9px; font-weight:700; padding:2px 7px; border-radius:20px; }

  /* Ticker */
  .hp-ticker-wrap { overflow:hidden; mask-image:linear-gradient(to right,transparent,black 8%,black 92%,transparent); -webkit-mask-image:linear-gradient(to right,transparent,black 8%,black 92%,transparent); padding:2px 0; }
  .hp-ticker { display:flex; gap:10px; width:max-content; animation:hp-scroll 32s linear infinite; }
  @keyframes hp-scroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @media(prefers-reduced-motion:reduce){ .hp-ticker{animation:none} .hp-ticker-wrap{overflow-x:auto} }
  .hp-ticker-pill { display:flex; align-items:center; gap:6px; padding:5px 13px; background:#fff; border:1px solid #e5e7eb; border-radius:20px; white-space:nowrap; user-select:none; }
  .hp-ticker-pill .ti { font-size:13px; color:#9ca3af; }
  .hp-ticker-pill span { font-size:12px; font-weight:600; color:#6b7280; }

  /* Categories */
  .hp-cats-grid { display:grid; grid-template-columns:repeat(6,1fr); gap:10px; }
  .hp-cat-card { display:flex; flex-direction:column; align-items:center; gap:8px; padding:1.25rem .75rem; background:#fff; border:1px solid #e5e7eb; border-radius:12px; text-decoration:none; transition:border-color .15s,transform .12s; }
  .hp-cat-card:hover { border-color:#d1d5db; transform:translateY(-2px); }
  .hp-cat-icon { width:52px; height:52px; border-radius:12px; display:flex; align-items:center; justify-content:center; }
  .hp-cat-name { font-size:12px; font-weight:700; color:#111; text-align:center; }
  .hp-cat-count { font-size:10px; color:#9ca3af; }

  /* Promo */
  .hp-promo { position:relative; background:#1a1a2e; border-radius:16px; overflow:hidden; padding:2.5rem; display:flex; align-items:center; justify-content:space-between; }
  .hp-promo__body { position:relative; z-index:1; }
  .hp-promo__tag { display:inline-flex; align-items:center; gap:5px; font-size:11px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; background:rgba(255,255,255,.1); color:#e2c97e; border-radius:20px; padding:4px 12px; margin-bottom:.75rem; }
  .hp-promo__h2 { font-size:1.75rem; font-weight:900; color:#fff; margin:0 0 .5rem; }
  .hp-promo__sub { font-size:14px; color:rgba(255,255,255,.6); margin:0 0 1.25rem; }
  .hp-promo__deco { position:absolute; right:0; top:0; bottom:0; width:260px; pointer-events:none; }
  .hp-promo__c1,.hp-promo__c2 { position:absolute; border-radius:50%; border:1.5px solid rgba(255,255,255,.07); }
  .hp-promo__c1 { width:220px; height:220px; top:-40px; right:-40px; }
  .hp-promo__c2 { width:140px; height:140px; bottom:-20px; right:40px; }
  .hp-promo__bigicon { position:absolute; font-size:90px; color:rgba(255,255,255,.04); right:24px; top:50%; transform:translateY(-50%); }

  /* Responsive */
  @media(max-width:1024px){
    .hp-brands-grid,.hp-cats-grid { grid-template-columns:repeat(4,1fr); }
    .hp-hero { grid-template-columns:1fr; }
    .hp-hero__visual { display:none; }
  }
  @media(max-width:640px){
    .hp-brands-grid { grid-template-columns:repeat(3,1fr); }
    .hp-cats-grid { grid-template-columns:repeat(2,1fr); }
    .hp-promo { padding:1.5rem; }
    .hp-promo__deco { display:none; }
    .hp-promo__h2 { font-size:1.25rem; }
  }
`;

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const tickerRef = useRef(null);

  useEffect(() => {
    Promise.all([
      productAPI.getFeatured(),
      productAPI.getAll({ sort: 'trending', limit: 8 }),
    ]).then(([f, t]) => {
      setFeatured(f.data);
      setTrending(t.data.products);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const wrap = tickerRef.current?.parentElement;
    if (!wrap) return;
    const pause  = () => { if (tickerRef.current) tickerRef.current.style.animationPlayState = 'paused'; };
    const resume = () => { if (tickerRef.current) tickerRef.current.style.animationPlayState = 'running'; };
    wrap.addEventListener('mouseenter', pause);
    wrap.addEventListener('mouseleave', resume);
    return () => { wrap.removeEventListener('mouseenter', pause); wrap.removeEventListener('mouseleave', resume); };
  }, []);

  const tickerItems = [...TICKER, ...TICKER];

  return (
    <>
      <style>{css}</style>

      <div className="hp">

        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="hp-hero">
          <div>
            <div className="hp-hero__badge">
              <i className="ti ti-sparkles" aria-hidden="true" /> AI-Powered Shopping
            </div>
            <h1 className="hp-hero__title">
              Discover Products<br />
              <span className="hp-hero__accent">Curated for You</span>
            </h1>
            <p className="hp-hero__sub">
              Intelligent recommendations, real-time inventory, and personalized deals — all in one place.
            </p>
            <div className="hp-hero__actions">
              <Link to="/shop" className="hp-btn hp-btn-primary">
                <i className="ti ti-shopping-bag" aria-hidden="true" /> Explore shop
              </Link>
              <Link to="/shop/new" className="hp-btn hp-btn-ghost">
                New arrivals <i className="ti ti-arrow-right" aria-hidden="true" />
              </Link>
            </div>
            <div className="hp-hero__stats">
              {[
                { num: '50K+', label: 'Products',   icon: 'package' },
                { num: '4.9',  label: 'Star rating', icon: 'star'   },
                { num: '24/7', label: 'AI support',  icon: 'robot'  },
              ].map((s, i) => (
                <React.Fragment key={s.label}>
                  {i > 0 && <div className="hp-hero__stat-div" aria-hidden="true" />}
                  <div className="hp-hero__stat">
                    <i className={`ti ti-${s.icon}`} aria-hidden="true" />
                    <span className="hp-hero__stat-num">{s.num}</span>
                    <span className="hp-hero__stat-lbl">{s.label}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="hp-hero__visual" aria-hidden="true">
            <div className="hp-hero__orbit" />
            <div className="hp-hero__float hp-hero__float-1">
              <i className="ti ti-robot" /> AI found the perfect match
            </div>
            <div className="hp-hero__float hp-hero__float-2">
              <i className="ti ti-truck-delivery" /> Order shipped in real-time
            </div>
          </div>
        </section>

        {/* ── Top Brands ───────────────────────────────────── */}
        <section aria-labelledby="brands-h">
          <div className="hp-hd">
            <div className="hp-hd__left">
              <p>Trusted by millions</p>
              <h2 id="brands-h">Shop top brands</h2>
            </div>
            <Link to="/shop/brands" className="hp-see-all">
              All brands <i className="ti ti-arrow-right" aria-hidden="true" />
            </Link>
          </div>

          <div className="hp-brands-grid" role="list">
            {BRANDS.map(b => {
              const badge = BADGE[b.badge];
              return (
                <Link key={b.slug} to={`/shop/brand/${b.slug}`} className="hp-brand-card" role="listitem" aria-label={`${b.name} — ${b.category}`}>
                  <div className="hp-brand-icon" style={{ background: b.bg }} aria-hidden="true">
                    <i className={`ti ti-${b.icon}`} style={{ color: b.color, fontSize: 22 }} aria-hidden="true" />
                  </div>
                  <span className="hp-brand-name">{b.name}</span>
                  <span className="hp-brand-cat">{b.category}</span>
                  {badge && (
                    <span className="hp-badge" style={{ background: badge.bg, color: badge.color }}>
                      {badge.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="hp-ticker-wrap" aria-label="More brands available">
            <div className="hp-ticker" ref={tickerRef}>
              {tickerItems.map((b, i) => (
                <div className="hp-ticker-pill" key={`${b.name}-${i}`} aria-hidden="true">
                  <i className={`ti ti-${b.icon}`} aria-hidden="true" />
                  <span>{b.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Categories ───────────────────────────────────── */}
        <section aria-labelledby="cats-h">
          <div className="hp-hd">
            <div className="hp-hd__left">
              <p>Browse by interest</p>
              <h2 id="cats-h">Shop by category</h2>
            </div>
            <Link to="/shop" className="hp-see-all">
              See all <i className="ti ti-arrow-right" aria-hidden="true" />
            </Link>
          </div>
          <div className="hp-cats-grid">
            {CATEGORIES.map(c => (
              <Link key={c.slug} to={`/shop/${c.slug}`} className="hp-cat-card" aria-label={`${c.name} — ${c.count} items`}>
                <div className="hp-cat-icon" style={{ background: c.bg }} aria-hidden="true">
                  <i className={`ti ti-${c.icon}`} style={{ color: c.color, fontSize: 26 }} aria-hidden="true" />
                </div>
                <span className="hp-cat-name">{c.name}</span>
                <span className="hp-cat-count">{c.count} items</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Featured Products ─────────────────────────────── */}
        <section aria-labelledby="feat-h">
          <div className="hp-hd">
            <div className="hp-hd__left">
              <p>Handpicked by AI</p>
              <h2 id="feat-h">Featured picks</h2>
            </div>
            <Link to="/shop" className="hp-see-all">
              View all <i className="ti ti-arrow-right" aria-hidden="true" />
            </Link>
          </div>
          <ProductGrid products={featured} loading={loading} />
        </section>

        {/* ── Promo Banner ─────────────────────────────────── */}
        <section className="hp-promo" aria-label="Up to 60% off electronics">
          <div className="hp-promo__body">
            <span className="hp-promo__tag">
              <i className="ti ti-clock" aria-hidden="true" /> Limited time
            </span>
            <h2 className="hp-promo__h2">Up to 60% off electronics</h2>
            <p className="hp-promo__sub">Our AI has found the best deals. Don't miss out.</p>
            <Link to="/shop/electronics" className="hp-btn hp-btn-promo">
              Shop deals <i className="ti ti-arrow-right" aria-hidden="true" />
            </Link>
          </div>
          <div className="hp-promo__deco" aria-hidden="true">
            <div className="hp-promo__c1" />
            <div className="hp-promo__c2" />
            <i className="ti ti-tag hp-promo__bigicon" />
          </div>
        </section>

        {/* ── Trending ─────────────────────────────────────── */}
        <section aria-labelledby="trend-h">
          <div className="hp-hd">
            <div className="hp-hd__left">
              <p>What everyone's buying</p>
              <h2 id="trend-h">Trending now</h2>
            </div>
            <Link to="/shop?sort=trending" className="hp-see-all">
              View all <i className="ti ti-arrow-right" aria-hidden="true" />
            </Link>
          </div>
          <ProductGrid products={trending} loading={loading} />
        </section>

      </div>
    </>
  );
}
