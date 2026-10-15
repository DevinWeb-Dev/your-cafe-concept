import { useEffect, useRef, useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
} from "react-router-dom";

import {
  Activity,
  ArrowUpRight,
  Armchair,
  BarChart3,
  Boxes,
  CalendarDays,
  CheckCircle2,
  ChefHat,
  ChevronRight,
  Clock3,
  Coffee,
  CreditCard,
  FileText,
  LayoutDashboard,
  Menu,
  Settings,
  ShoppingBag,
  Users,
  X,
} from "lucide-react";

import {
  BRAND,
  formatPeso,
} from "../data/config.js";

import {
  useCafe,
} from "../context/CafeContext.jsx";

import "../styles/coffee-staff-studio.css";

const navigation = [
  {
    title: "COMMAND CENTER",
    items: [
      {
        to: "/staff",
        label: "Overview",
        icon: LayoutDashboard,
        end: true,
      },
      {
        to: "/staff/pos",
        label: "Point of sale",
        icon: CreditCard,
      },
      {
        to: "/staff/orders",
        label: "Barista queue",
        icon: ChefHat,
        count: "orders",
      },
      {
        to: "/staff/tables",
        label: "Floor & tables",
        icon: Armchair,
      },
      {
        to: "/staff/reservations",
        label: "Reservations",
        icon: CalendarDays,
        count: "reservations",
      },
    ],
  },
  {
    title: "BACK OF HOUSE",
    items: [
      {
        to: "/staff/inventory",
        label: "Inventory",
        icon: Boxes,
      },
      {
        to: "/staff/menu-management",
        label: "Menu studio",
        icon: Coffee,
      },
      {
        to: "/staff/customers",
        label: "Customer records",
        icon: Users,
      },
      {
        to: "/staff/activity",
        label: "Activity feed",
        icon: Activity,
      },
    ],
  },
  {
    title: "INTELLIGENCE",
    items: [
      {
        to: "/staff/transactions",
        label: "Transactions",
        icon: FileText,
      },
      {
        to: "/staff/reports",
        label: "Reports",
        icon: BarChart3,
      },
      {
        to: "/staff/settings",
        label: "Demo settings",
        icon: Settings,
      },
    ],
  },
];

function StaffNotice() {
  const {
    notice,
    clearNotice,
  } = useCafe();

  if (!notice) return null;

  return (
    <div
      className={`cj4-notice ${
        notice.type === "error"
          ? "is-error"
          : ""
      }`}
      role={
        notice.type === "error"
          ? "alert"
          : "status"
      }
    >
      <CheckCircle2
        size={18}
        aria-hidden="true"
      />

      <span>{notice.text}</span>

      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={clearNotice}
      >
        <X size={19} />
      </button>
    </div>
  );
}

export default function StaffLayout() {
  const { pathname } = useLocation();

  const {
    stats,
    orders,
    reservations,
    now,
  } = useCafe();

  const [open, setOpen] = useState(false);

  const openButton = useRef(null);
  const drawer = useRef(null);

  const orderCount = orders.filter(
    (item) =>
      [
        "received",
        "accepted",
        "preparing",
      ].includes(item.status)
  ).length;

  const bookingCount =
    reservations.filter(
      (item) =>
        item.status === "reserved"
    ).length;

  const current = navigation
    .flatMap((section) => section.items)
    .find(
      (item) => item.to === pathname
    );

  const clock = new Intl.DateTimeFormat(
    "en-PH",
    {
      timeZone: "Asia/Manila",
      hour: "numeric",
      minute: "2-digit",
    }
  ).format(now);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const prior =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    drawer.current
      ?.querySelector("a[href]")
      ?.focus();

    const onKey = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        openButton.current?.focus();
      }

      if (
        event.key !== "Tab" ||
        !drawer.current
      ) {
        return;
      }

      const links = [
        ...drawer.current.querySelectorAll(
          'a[href],button:not([disabled])'
        ),
      ].filter(
        (el) =>
          el.getClientRects().length
      );

      if (!links.length) return;

      if (
        event.shiftKey &&
        document.activeElement ===
          links[0]
      ) {
        event.preventDefault();

        links.at(-1).focus();
      }

      if (
        !event.shiftKey &&
        document.activeElement ===
          links.at(-1)
      ) {
        event.preventDefault();

        links[0].focus();
      }
    };

    window.addEventListener(
      "keydown",
      onKey
    );

    return () => {
      document.body.style.overflow =
        prior;

      window.removeEventListener(
        "keydown",
        onKey
      );
    };
  }, [open]);

  return (
    <div className="staff-app cj4-studio">
      {open && (
        <button
          type="button"
          className="cj4-backdrop"
          aria-label="Close workspace navigation"
          onClick={() => {
            setOpen(false);
            openButton.current?.focus();
          }}
        />
      )}

      <aside
        className={`cj4-sidebar ${
          open ? "is-open" : ""
        }`}
        ref={drawer}
        aria-label="Staff workspace navigation"
        inert={
          !open &&
          typeof window !==
            "undefined" &&
          window.innerWidth <= 1100
            ? true
            : undefined
        }
      >
        <div className="cj4-sidebar-head">
          <Link
            to="/staff"
            className="cj4-identity"
            aria-label="Your Café Operations Studio home"
          >
            <span className="cj4-identity-symbol">
              <Coffee size={24} />
            </span>

            <span>
              <strong>
                YOUR CAFÉ
                <span>.</span>
              </strong>

              <small>
                THE OPERATIONS JOURNAL
              </small>
            </span>
          </Link>

          <button
            className="cj4-close"
            type="button"
            aria-label="Close navigation"
            onClick={() => {
              setOpen(false);
              openButton.current?.focus();
            }}
          >
            <X size={21} />
          </button>
        </div>

        <div className="cj4-sidebar-intro">
          <span>
            VOL. 01 / OPERATIONS
          </span>

          <span className="cj4-online-dot" />

          LOCAL SIMULATION
        </div>

        <nav
          className="cj4-navigation"
          aria-label="Staff sections"
        >
          {navigation.map((group) => (
            <div
              className="cj4-navigation-group"
              key={group.title}
            >
              <p>{group.title}</p>

              {group.items.map(
                ({
                  to,
                  label,
                  icon: Icon,
                  end,
                  count,
                }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    className={({
                      isActive,
                    }) =>
                      `cj4-nav-link ${
                        isActive
                          ? "is-active"
                          : ""
                      }`
                    }
                  >
                    <Icon
                      size={18}
                      strokeWidth={1.7}
                    />

                    <span>{label}</span>

                    {count &&
                    (count === "orders"
                      ? orderCount
                      : bookingCount) > 0 ? (
                      <small>
                        {count === "orders"
                          ? orderCount
                          : bookingCount}
                      </small>
                    ) : (
                      <ChevronRight
                        size={13}
                        className="cj4-nav-arrow"
                      />
                    )}
                  </NavLink>
                )
              )}
            </div>
          ))}
        </nav>

        <div className="cj4-sidebar-bottom">
          <div className="cj4-sidebar-occupancy">
            <span>
              THE FLOOR / NOW
            </span>

            <strong>
              {stats.occupied}
              <i>
                {" "}
                / {stats.totalTables}
              </i>
            </strong>

            <small>
              Tables currently occupied
              in the demo
            </small>

            <div className="cj4-meter">
              <span
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(
                      0,
                      stats.occupancyPercent
                    )
                  )}%`,
                }}
              />
            </div>
          </div>

          <Link
            to="/"
            className="cj4-back-to-site"
          >
            VIEW CUSTOMER WEBSITE
            <ArrowUpRight size={17} />
          </Link>

          <p>
            Portfolio concept. No live
            staff login, payments, or
            bookings.
          </p>
        </div>
      </aside>

      <div className="cj4-content">
        <header className="cj4-topbar">
          <div className="cj4-topbar-left">
            <button
              ref={openButton}
              type="button"
              className="cj4-hamburger"
              aria-label="Open staff navigation"
              aria-controls="cj4-menu"
              aria-expanded={open}
              onClick={() =>
                setOpen(true)
              }
            >
              <Menu size={22} />
            </button>

            <div>
              <span>
                OPERATIONS JOURNAL
                <i>
                  {" "}
                  /{" "}
                  {current?.label.toUpperCase() ||
                    "WORKSPACE"}
                </i>
              </span>

              <strong>
                {current?.label ||
                  "Staff workspace"}
              </strong>
            </div>
          </div>

          <div className="cj4-topbar-right">
            <span className="cj4-clock">
              <Clock3 size={14} />
              {clock} PHT
            </span>

            <span className="cj4-daily-tally">
              RECORDED TODAY
              <strong>
                {formatPeso(
                  stats.todayRevenue
                )}
              </strong>
            </span>

            <Link
              to="/staff/pos"
              className="cj4-new-ticket"
            >
              <ShoppingBag size={16} />

              NEW TICKET

              <ArrowUpRight size={15} />
            </Link>
          </div>
        </header>

        <main
          id="staff-content"
          className="staff-main cj4-main"
        >
          <Outlet />
        </main>

        <footer className="cj4-workspace-footer">
          <span>
            © {new Date().getFullYear()}
            {" "}YOUR CAFÉ. / STAFF STUDIO
          </span>

          <span>
            {BRAND.watermark}
          </span>

          <span>
            FRONTEND DEMO / LOCAL
            BROWSER DATA
          </span>
        </footer>
      </div>

      <StaffNotice />
    </div>
  );
}