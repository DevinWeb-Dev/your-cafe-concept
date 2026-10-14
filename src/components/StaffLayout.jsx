// YOUR CAFÉ — Staff operations layout (frontend demonstration)
// FILE: src/components/StaffLayout.jsx
// Website Concept Made by: Web Developer Devin Planas
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  ArrowUpRight, Armchair, BarChart3, Boxes, CalendarDays,
  ChefHat, Coffee, LayoutDashboard, Menu, Settings, X, CreditCard, FileText, Users, Activity,
} from "lucide-react";
import { BRAND, formatPeso } from "../data/config.js";
import { useCafe } from "../context/CafeContext.jsx";

const ADMIN_NAV = [
  { to: "/staff", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/staff/tables", label: "Floor & Tables", icon: Armchair },
  { to: "/staff/pos", label: "Café POS", icon: CreditCard },
  { to: "/staff/orders", label: "Orders / Barista", icon: ChefHat },
  { to: "/staff/reservations", label: "Reservations", icon: CalendarDays },
  { to: "/staff/inventory", label: "Inventory", icon: Boxes },
  { to: "/staff/menu-management", label: "Menu Studio", icon: Coffee },
  { to: "/staff/customers", label: "Customers", icon: Users },
  { to: "/staff/activity", label: "Activity Feed", icon: Activity },
  { to: "/staff/transactions", label: "Transactions", icon: FileText },
  { to: "/staff/reports", label: "Reports", icon: BarChart3 },
  { to: "/staff/settings", label: "Demo Settings", icon: Settings },
];

function StaffToast() {
  const { notice, clearNotice } = useCafe();
  if (!notice) return null;
  return <div className={`toast ${notice.type || "success"}`} role={notice.type === "error" ? "alert" : "status"}>
    <span>{notice.text}</span>
    <button type="button" aria-label="Dismiss notification" onClick={clearNotice}><X size={18}/></button>
  </div>;
}

export default function StaffLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const { stats, orders, reservations } = useCafe();
  const openButtonRef = useRef(null);

  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  useEffect(() => {
    if (!sidebarOpen) return;
    function onEscape(event) {
      if (event.key === "Escape") {
        setSidebarOpen(false);
        openButtonRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [sidebarOpen]);

  const page = ADMIN_NAV.find((item) => item.to === pathname);
  const pendingOrders = orders.filter((o) => ["received", "accepted", "preparing"].includes(o.status)).length;
  const activeBookings = reservations.filter((r) => r.status === "reserved").length;

  return (
    <div className="staff-app yc-staff-layout">
      {sidebarOpen && <button type="button" className="mobile-shade" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar"/>}
      <aside className={`staff-aside ${sidebarOpen ? "visible" : ""}`} aria-label="Staff navigation">
        <div className="staff-brand">
          <Link to="/staff" className="brand" aria-label={`${BRAND.name} staff dashboard`}>
            <span className="brand-symbol"><Coffee size={23}/></span>
            <span><b>{BRAND.name}</b><small>OPERATIONS STUDIO</small></span>
          </Link>
          <button type="button" className="staff-close" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar"><X size={20}/></button>
        </div>
        <div className="staff-label">WORKSPACE / LOCAL DEMO</div>
        <nav aria-label="Staff sections">
          {ADMIN_NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end}>
              <Icon size={18} strokeWidth={1.7}/>
              <span>{label}</span>
              {to === "/staff/orders" && pendingOrders > 0 && <small className="yc-nav-count">{pendingOrders}</small>}
              {to === "/staff/reservations" && activeBookings > 0 && <small className="yc-nav-count">{activeBookings}</small>}
            </NavLink>
          ))}
        </nav>
        <div className="yc-staff-sidebar-bottom">
          <div className="yc-staff-side-summary">
            <span>CAFÉ STATUS <i>• DEMO</i></span>
            <strong>{stats.occupied} / {stats.totalTables}</strong>
            <small>Seating units occupied</small>
            <div className="yc-staff-meter"><i style={{ width: `${Math.min(100, Math.max(0, stats.occupancyPercent))}%` }}/></div>
          </div>
          <Link className="return-site" to="/">View Customer Website <ArrowUpRight size={17}/></Link>
          <p className="side-note">Local prototype only. No live restaurant bookings, payment processing, or staff authentication.</p>
        </div>
      </aside>
      <div className="staff-workspace">
        <header className="staff-top">
          <div className="yc-staff-top-left">
            <button ref={openButtonRef} className="staff-menu-btn" type="button" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar"><Menu size={21}/></button>
            <div><small>YOUR CAFÉ / OPERATIONS</small><strong>{page?.label || "Café Workspace"}</strong></div>
          </div>
          <div className="yc-staff-top-right">
            <span className="yc-demo-pill">LOCAL DEMO</span>
            <span className="yc-revenue">SALES TODAY <strong>{formatPeso(stats.todayRevenue)}</strong></span>
            <Link to="/" className="staff-live">VIEW WEBSITE <ArrowUpRight size={15}/></Link>
          </div>
        </header>
        <main className="staff-main" id="staff-content"><Outlet/></main>
        <footer className="yc-staff-foot">{BRAND.watermark} · Demonstration data stored in this browser</footer>
      </div>
      <StaffToast />
      <style>{`
        .yc-staff-layout{min-height:100dvh}
        .yc-staff-layout .staff-aside{display:flex;flex-direction:column}
        .yc-staff-layout .staff-aside nav a{display:flex;align-items:center;gap:12px}
        .yc-staff-layout .yc-nav-count{margin-left:auto;border-radius:20px;padding:3px 7px;background:#b58b5a22;color:#d7b48e;font:700 10px 'DM Sans',sans-serif}
        .yc-staff-layout .yc-staff-sidebar-bottom{margin-top:auto}
        .yc-staff-layout .yc-staff-side-summary{margin:18px 0;padding:19px;background:#ffffff0a;border:1px solid #ffffff13;display:flex;flex-direction:column;gap:8px}
        .yc-staff-layout .yc-staff-side-summary span{font-size:9px;letter-spacing:.13em;color:#c3aa91;font-weight:700}
        .yc-staff-layout .yc-staff-side-summary span i{font-style:normal;color:#91a78b}
        .yc-staff-layout .yc-staff-side-summary strong{font:500 38px/.95 'Cormorant Garamond',serif;color:#f5ede2}
        .yc-staff-layout .yc-staff-side-summary small{font-size:11px;color:#a79686}
        .yc-staff-layout .yc-staff-meter{height:4px;margin-top:8px;background:#ffffff20;overflow:hidden}
        .yc-staff-layout .yc-staff-meter i{display:block;height:100%;background:#b58b5a;transition:width .3s}
        .yc-staff-layout .yc-staff-top-left{display:flex;align-items:center;gap:12px;min-width:0}
        .yc-staff-layout .yc-staff-top-left>div{display:flex;flex-direction:column;gap:5px;min-width:0}
        .yc-staff-layout .yc-staff-top-left small{font:700 9px 'DM Sans',sans-serif;letter-spacing:.13em;color:#8f7d6f}
        .yc-staff-layout .yc-staff-top-left strong{font:700 13px 'DM Sans',sans-serif;color:#34261d;overflow-wrap:anywhere}
        .yc-staff-layout .yc-staff-top-right{display:flex;align-items:center;gap:17px}
        .yc-staff-layout .yc-demo-pill{font-size:9px;letter-spacing:.12em;padding:7px 11px;background:#eee8de;color:#75604e;font-weight:800;white-space:nowrap}
        .yc-staff-layout .yc-revenue{font-size:9px;color:#8e7b6c;letter-spacing:.08em;white-space:nowrap}
        .yc-staff-layout .yc-revenue strong{font-size:12px;color:#432e1f;margin-left:8px}
        .yc-staff-layout .yc-staff-foot{padding:16px 30px;color:#958474;font-size:10px}
        @media(max-width:990px){.yc-staff-layout .yc-revenue{display:none}}
        @media(max-width:700px){
          .yc-staff-layout .yc-staff-top-right .staff-live{display:none}
          .yc-staff-layout .yc-staff-top-left small{font-size:8px}
          .yc-staff-layout .yc-staff-side-summary{margin:12px 0}
          .yc-staff-layout .yc-staff-foot{padding:20px;font-size:9px}
        }
      `}</style>
    </div>
  );
}
