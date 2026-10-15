import { Link } from "react-router-dom";

import {
  ArrowRight,
  ArrowUpRight,
  Armchair,
  BarChart3,
  Boxes,
  Coffee,
  LayoutDashboard,
  ShoppingBag,
} from "lucide-react";

import "../styles/coffee-final-edition.css";

export default function ClientDemoGateway() {
  return (
    <>
      {/* ===================================
          FLOATING STAFF DEMO BUTTON

          DIRECT ACCESS TO DASHBOARD
          NO POPUP OR DEPARTMENT SELECTION
      =================================== */}

      <Link
        to="/staff"
        className="cj5-demo-floating"
        aria-label="Open Staff Demo Dashboard"
        title="Enter the Staff Dashboard"
      >
        <span className="cj5-demo-floating-icon">
          <LayoutDashboard size={20} />
        </span>

        <span className="cj5-demo-floating-copy">
          <strong>
            EXPLORE STAFF DEMO
          </strong>

          <small>
            INTERACTIVE MANAGEMENT SYSTEM
          </small>
        </span>

        <ArrowUpRight size={19} />
      </Link>

      {/* ===================================
          STAFF DEMO SHOWCASE SECTION
      =================================== */}

      <section
        className="cj5-demo-showcase"
        aria-labelledby="cj5-demo-showcase-title"
      >
        <div className="cj5-demo-showcase-copy">
          <span className="cj5-demo-kicker">
            BEHIND THE COUNTER / A CLOSER LOOK
          </span>

          <h2 id="cj5-demo-showcase-title">
            Beautiful outside.
            <br />
            <em>Brilliant inside.</em>
          </h2>

          <p>
            There's more to YOUR CAFÉ.
            than the customer-facing experience.

            Discover how ordering, seating,
            inventory, staff workflows, and
            reports work together inside one
            interactive café management concept.
          </p>

          <div className="cj5-showcase-actions">
            {/* DIRECT DASHBOARD ACCESS */}

            <Link
              to="/staff"
              className="cj5-showcase-primary"
            >
              ENTER STAFF DASHBOARD

              <ArrowUpRight size={19} />
            </Link>

            {/* PUBLIC WEBSITE */}

            <Link to="/menu">
              EXPLORE THE MENU

              <ArrowRight size={18} />
            </Link>
          </div>

          <small className="cj5-demo-disclaimer">
            No login required /
            Frontend demonstration /
            Local browser data only.
          </small>
        </div>

        {/* ===================================
            DECORATIVE DASHBOARD PREVIEW
        =================================== */}

        <div
          className="cj5-demo-showcase-art"
          aria-hidden="true"
        >
          <div className="cj5-demo-art-head">
            <span>
              YOUR CAFÉ / OPERATIONS
            </span>

            <span>
              ISSUE NO. 05
            </span>
          </div>

          <div className="cj5-demo-art-window">
            <span>
              STAFF STUDIO
            </span>

            <div className="cj5-demo-art-bars">
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>

            <div className="cj5-demo-art-mini-grid">
              <span>
                <ShoppingBag />
                ORDERS
              </span>

              <span>
                <Armchair />
                TABLES
              </span>

              <span>
                <Boxes />
                STOCK
              </span>

              <span>
                <BarChart3 />
                REPORTS
              </span>
            </div>
          </div>

          <strong className="cj5-demo-art-type">
            THE WORK
            <br />
            BEHIND
            <br />
            THE CUP.
          </strong>

          <span className="cj5-demo-art-bottom">
            CUSTOMER TO COUNTER /
            ONE CONNECTED CONCEPT
          </span>
        </div>
      </section>
    </>
  );
}