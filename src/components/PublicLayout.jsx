import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Link,
  NavLink,
  Outlet,
  useLocation,
} from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Camera,
  ChevronDown,
  Coffee,
  LayoutDashboard,
  MapPin,
  Menu,
  ShoppingBag,
  X,
} from "lucide-react";

import {
  BRAND,
} from "../data/config.js";

import {
  useCafe,
} from "../context/CafeContext.jsx";

import CartDrawer from "./CartDrawer.jsx";
import ClientDemoGateway from "./ClientDemoGateway.jsx";

import "../styles/coffee-journal.css";
import "../styles/coffee-final-edition.css";

const mainLinks = [
  {
    to: "/",
    label: "Journal",
    end: true,
  },
  {
    to: "/menu",
    label: "The Menu",
  },
  {
    to: "/reserve",
    label: "Find a Table",
  },
  {
    to: "/story",
    label: "Our Story",
  },
  {
    to: "/membership",
    label: "Rewards",
  },
];

const discoverLinks = [
  {
    to: "/orders",
    label: "Track an Order",
  },
  {
    to: "/availability",
    label: "Table Availability",
  },
  {
    to: "/coffee-beans",
    label: "Coffee Beans",
  },
  {
    to: "/gift-cards",
    label: "Gift Cards",
  },
  {
    to: "/events",
    label: "Events & Workshops",
  },
  {
    to: "/gallery",
    label: "Photo Journal",
  },
  {
    to: "/locations",
    label: "Our Locations",
  },
  {
    to: "/contact",
    label: "Get in Touch",
  },
  {
    to: "/faq",
    label: "Common Questions",
  },
];

const chapters = [
  {
    path: "/story",
    number: "06",
    label: "THE STORY EDITION",
    note: "The philosophy behind a good cup.",
  },
  {
    path: "/locations",
    number: "07",
    label: "THE PLACES EDITION",
    note: "Find your favorite corner.",
  },
  {
    path: "/gallery",
    number: "08",
    label: "THE PHOTO JOURNAL",
    note: "Moments worth keeping.",
  },
  {
    path: "/events",
    number: "09",
    label: "THE GATHERING EDITION",
    note: "Good coffee, better company.",
  },
  {
    path: "/coffee-beans",
    number: "10",
    label: "THE HOME BREW EDITION",
    note: "A little ritual to take home.",
  },
  {
    path: "/gift-cards",
    number: "11",
    label: "THE GIVING EDITION",
    note: "For someone special.",
  },
  {
    path: "/contact",
    number: "12",
    label: "THE LETTERS EDITION",
    note: "A warm hello, whenever you need one.",
  },
  {
    path: "/faq",
    number: "13",
    label: "THE ANSWERS EDITION",
    note: "Good questions deserve warm answers.",
  },
];

const fallbackImage = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="720" viewBox="0 0 900 720">
    <rect width="900" height="720" fill="#291c19"/>
    <ellipse cx="675" cy="360" rx="260" ry="285" fill="#a84342" opacity=".36"/>
    <circle cx="675" cy="360" r="195" fill="none" stroke="#f2e8d8" opacity=".28" stroke-width="2"/>
    <text x="75" y="280" fill="#f2e8d8" font-family="Georgia,serif" font-size="84">YOUR CAFÉ.</text>
    <text x="80" y="335" fill="#b6bc91" font-family="monospace" font-size="22">THE COFFEE JOURNAL</text>
    <path d="M80 385H820" stroke="#f2e8d8" opacity=".35"/>
    <text x="80" y="440" fill="#f2e8d8" font-family="monospace" font-size="17">A LITTLE MOMENT, BEAUTIFULLY BREWED.</text>
  </svg>`
)}`;

function recoverPublicImage(event) {
  const image = event.target;

  if (
    image?.tagName !== "IMG" ||
    image.dataset.cjFallback === "true"
  ) {
    return;
  }

  image.dataset.cjFallback = "true";
  image.src = fallbackImage;
}

function JournalLogo({
  inverse = false,
  onClick,
}) {
  return (
    <Link
      to="/"
      className={`cj-brand ${
        inverse
          ? "cj-brand--inverse"
          : ""
      }`}
      aria-label="YOUR CAFÉ — Home"
      onClick={onClick}
    >
      <span
        className="cj-brand-symbol"
        aria-hidden="true"
      >
        <span className="cj-brand-bean" />
        <span className="cj-brand-dot" />
      </span>

      <span className="cj-brand-text">
        <strong>
          YOUR CAFÉ
          <span className="cj-brand-period">
            .
          </span>
        </strong>

        <small>
          A DAILY COFFEE JOURNAL
        </small>
      </span>
    </Link>
  );
}

function ToastNotice() {
  const {
    notice,
    clearNotice,
  } = useCafe();

  if (!notice) return null;

  return (
    <div
      className={`toast cj-toast ${
        notice.type || "success"
      }`}
      role={
        notice.type === "error"
          ? "alert"
          : "status"
      }
    >
      <Coffee
        size={17}
        aria-hidden="true"
      />

      <span>{notice.text}</span>

      <button
        type="button"
        onClick={clearNotice}
        aria-label="Dismiss notification"
      >
        <X size={18} />
      </button>
    </div>
  );
}

function ChapterNavigation({
  pathname,
}) {
  const index = chapters.findIndex(
    (chapter) =>
      chapter.path === pathname
  );

  if (index < 0) return null;

  const current = chapters[index];

  const previous =
    chapters[
      (index - 1 + chapters.length) %
        chapters.length
    ];

  const next =
    chapters[
      (index + 1) %
        chapters.length
    ];

  return (
    <nav
      className="cj5-chapter-bar"
      aria-label="Coffee Journal chapters"
    >
      <Link
        to={previous.path}
        className="cj5-chapter-arrow"
        aria-label={`Previous chapter: ${previous.label}`}
      >
        <ArrowLeft size={18} />
      </Link>

      <div className="cj5-chapter-current">
        <span>
          JOURNAL NO. {current.number}
          {" "} /{" "}
          {current.label}
        </span>

        <small>{current.note}</small>
      </div>

      <div
        className="cj5-chapter-dots"
        aria-hidden="true"
      >
        {chapters.map((chapter, i) => (
          <span
            key={chapter.path}
            className={
              i === index ? "active" : ""
            }
          />
        ))}
      </div>

      <Link
        to={next.path}
        className="cj5-chapter-next"
      >
        NEXT CHAPTER
        <ArrowRight size={17} />
      </Link>
    </nav>
  );
}

export default function PublicLayout() {
  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [cartOpen, setCartOpen] =
    useState(false);

  const [scrolled, setScrolled] =
    useState(false);

  const { pathname } = useLocation();
  const { cartCount } = useCafe();

  const menuButton = useRef(null);
  const menuPanel = useRef(null);
  const exploreMenu = useRef(null);
  const previousFocus = useRef(null);

  useEffect(() => {
    setMobileOpen(false);

    if (exploreMenu.current) {
      exploreMenu.current.open = false;
    }
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(
        window.scrollY > 18
      );
    };

    onScroll();

    window.addEventListener(
      "scroll",
      onScroll,
      { passive: true }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        onScroll
      );
    };
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const priorOverflow =
      document.body.style.overflow;

    previousFocus.current =
      document.activeElement;

    document.body.style.overflow =
      "hidden";

    menuPanel.current
      ?.querySelector("a[href]")
      ?.focus();

    function onKeyDown(event) {
      if (event.key === "Escape") {
        setMobileOpen(false);
        menuButton.current?.focus();
      }

      if (
        event.key !== "Tab" ||
        !menuPanel.current
      ) {
        return;
      }

      const elements = Array.from(
        menuPanel.current.querySelectorAll(
          'a[href],button:not([disabled]),summary'
        )
      ).filter(
        (element) =>
          element.getClientRects().length > 0
      );

      if (!elements.length) return;

      const first = elements[0];
      const last = elements[elements.length - 1];

      if (
        event.shiftKey &&
        document.activeElement === first
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === last
      ) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener(
      "keydown",
      onKeyDown
    );

    return () => {
      document.body.style.overflow =
        priorOverflow;

      window.removeEventListener(
        "keydown",
        onKeyDown
      );

      if (
        previousFocus.current?.isConnected
      ) {
        previousFocus.current.focus();
      }
    };
  }, [mobileOpen]);

  function closeMenu() {
    setMobileOpen(false);
  }

  return (
    <div className="public-app yc-public-shell cj-shell cj5-edition">
      <a
        className="cj-skip"
        href="#yc-main"
      >
        Skip to content
      </a>

      <div className="cj-top-issue">
        <span>
          YOUR CAFÉ / THE DAILY EDITION
        </span>

        <span className="cj-top-issue-center">
          TWO EXPERIENCES.
          ONE BEAUTIFULLY CONNECTED
          CAFÉ CONCEPT.
          <i aria-hidden="true">✳</i>
        </span>

        <span>
          DEV CODEWORKS / SIGNATURE SERIES
        </span>
      </div>

      <header
        className={`site-header cj-header ${
          scrolled
            ? "cj-header--scrolled"
            : ""
        }`}
      >
        <div className="cj-header-inner">
          <JournalLogo />

          <nav
            className="cj-desktop-nav"
            aria-label="Primary navigation"
          >
            {mainLinks.map(
              (item, index) => (
                <NavLink
                  to={item.to}
                  end={item.end}
                  key={item.to}
                  className={({
                    isActive,
                  }) =>
                    `cj-nav-item ${
                      isActive
                        ? "is-active"
                        : ""
                    }`
                  }
                >
                  <span>
                    0{index + 1}
                  </span>

                  {item.label}
                </NavLink>
              )
            )}

            <details
              className="cj-explore"
              ref={exploreMenu}
            >
              <summary>
                Explore
                <ChevronDown size={14} />
              </summary>

              <div className="cj-explore-panel">
                <div className="cj-explore-heading">
                  MORE FROM THE JOURNAL
                </div>

                {discoverLinks.map(
                  ({ to, label }) => (
                    <Link
                      to={to}
                      key={to}
                      onClick={() => {
                        if (exploreMenu.current) {
                          exploreMenu.current.open =
                            false;
                        }
                      }}
                    >
                      {label}
                      <ArrowUpRight size={14} />
                    </Link>
                  )
                )}

                <Link
                  className="cj-explore-staff"
                  to="/staff"
                >
                  Staff Operations Demo
                  <ArrowRight size={15} />
                </Link>
              </div>
            </details>
          </nav>

          <div className="cj-header-actions">
            <button
              type="button"
              className="cj-bag"
              aria-label={`Open demo cart, ${cartCount} items`}
              onClick={() => setCartOpen(true)}
            >
              <ShoppingBag
                size={20}
                strokeWidth={1.65}
              />

              <span aria-live="polite">
                {cartCount}
              </span>
            </button>

            <Link
              to="/staff"
              className="cj5-header-staff"
              title="Open interactive staff management demo"
            >
              <LayoutDashboard size={16} />
              STAFF DEMO
              <ArrowUpRight size={16} />
            </Link>

            <Link
              to="/menu"
              className="cj-header-cta"
            >
              ORDER SOMETHING
              <ArrowUpRight size={16} />
            </Link>

            <button
              type="button"
              className="cj-mobile-trigger"
              ref={menuButton}
              aria-label={
                mobileOpen
                  ? "Close navigation"
                  : "Open navigation"
              }
              aria-expanded={mobileOpen}
              aria-controls="cj-mobile-menu"
              onClick={() =>
                setMobileOpen(
                  (value) => !value
                )
              }
            >
              {mobileOpen ? (
                <X size={24} />
              ) : (
                <Menu size={24} />
              )}
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <button
          type="button"
          className="cj-mobile-backdrop"
          aria-label="Close navigation"
          onClick={closeMenu}
        />
      )}

      <div
        id="cj-mobile-menu"
        className={`cj-mobile-panel ${
          mobileOpen
            ? "is-open"
            : ""
        }`}
        role={
          mobileOpen
            ? "dialog"
            : undefined
        }
        aria-modal={
          mobileOpen
            ? "true"
            : undefined
        }
        aria-label="Mobile navigation"
        aria-hidden={!mobileOpen}
        ref={menuPanel}
        inert={!mobileOpen}
      >
        <div className="cj-mobile-panel-top">
          <span>
            THE INDEX / NAVIGATION
          </span>

          <span>
            ISSUE NO. 05
          </span>
        </div>

        <div className="cj-mobile-primary">
          {mainLinks.map(
            (item, index) => (
              <NavLink
                to={item.to}
                end={item.end}
                key={item.to}
                onClick={closeMenu}
              >
                <small>
                  0{index + 1}
                </small>

                <strong>
                  {item.label}
                </strong>

                <ArrowUpRight size={22} />
              </NavLink>
            )
          )}

          <Link
            to="/staff"
            className="cj5-mobile-staff"
            onClick={closeMenu}
          >
            <small>06</small>

            <strong>
              Staff Demo
            </strong>

            <LayoutDashboard size={21} />
          </Link>
        </div>

        <div className="cj-mobile-subtitle">
          MORE FROM THE COFFEE JOURNAL
        </div>

        <div className="cj-mobile-secondary">
          {discoverLinks.map(
            (item) => (
              <Link
                to={item.to}
                key={item.to}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            )
          )}
        </div>

        <div className="cj-mobile-bottom">
          YOUR CAFÉ / FRONTEND DESIGN CONCEPT
        </div>
      </div>

      <ChapterNavigation pathname={pathname} />

      <main
        id="yc-main"
        tabIndex={-1}
        onErrorCapture={recoverPublicImage}
      >
        <Outlet />
      </main>

      <ClientDemoGateway />

      <footer className="site-footer cj-footer">
        <div className="cj-footer-inner">
          <div className="cj-footer-art">
            <div className="cj-footer-art-top">
              <span>
                NOTES FROM THE CAFÉ
              </span>

              <span>
                VOL. 01 / 2026
              </span>
            </div>

            <h2>
              Here's to the
              <em> little things.</em>
            </h2>

            <p>
              Good coffee. Good company.
              A little more time for
              what matters.
            </p>

            <Link
              to="/menu"
              className="cj-footer-feature-link"
            >
              EXPLORE THE MENU
              <ArrowUpRight size={19} />
            </Link>

            <span className="cj-footer-art-bottom">
              SERVED WITH SOUL / YOUR CAFÉ.
            </span>
          </div>

          <div className="cj-footer-details">
            <JournalLogo inverse />

            <p>
              {BRAND.description}
            </p>

            <div className="cj-footer-columns">
              <div>
                <span>
                  THE ESSENTIALS
                </span>

                <Link to="/menu">
                  Food & Drinks
                </Link>

                <Link to="/reserve">
                  Reservations
                </Link>

                <Link to="/availability">
                  Table Availability
                </Link>

                <Link to="/orders">
                  Track an Order
                </Link>

                <Link to="/membership">
                  Rewards
                </Link>

                <Link to="/story">
                  Our Story
                </Link>
              </div>

              <div>
                <span>
                  MORE TO EXPLORE
                </span>

                <Link to="/coffee-beans">
                  Beans & Retail
                </Link>

                <Link to="/gift-cards">
                  Gift Cards
                </Link>

                <Link to="/events">
                  Events
                </Link>

                <Link to="/gallery">
                  Photo Journal
                </Link>

                <Link to="/faq">
                  FAQs
                </Link>

                <Link to="/contact">
                  Contact
                </Link>

                <Link to="/staff">
                  Staff Demo
                </Link>
              </div>
            </div>

            <div className="cj-footer-visit">
              <MapPin size={16} />

              <span>
                {BRAND.address} ·{" "}
                {BRAND.openingHours}
              </span>
            </div>

            {BRAND.instagram && (
              <a
                className="cj-footer-social"
                href={BRAND.instagram}
                target="_blank"
                rel="noreferrer"
              >
                <Camera size={16} />

                Instagram

                <ArrowUpRight size={15} />
              </a>
            )}
          </div>
        </div>

        <div className="cj-footer-legal">
          <span>
            © {new Date().getFullYear()}
            {" "}YOUR CAFÉ. /
            PORTFOLIO CONCEPT
          </span>

          <span>
            Website Concept Made by:
            Web Developer Devin Planas
          </span>

          <span>
            NO LIVE PAYMENTS OR RESERVATIONS
          </span>
        </div>
      </footer>

      <CartDrawer
        open={cartOpen}
        onClose={() =>
          setCartOpen(false)
        }
      />

      <ToastNotice />

      <div
        className="cj-prototype-note"
        aria-hidden="true"
      >
        A DEV CODEWORKS CONCEPT
      </div>
    </div>
  );
}