import { useMemo } from "react";

import {
  Link,
} from "react-router-dom";

import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Boxes,
  CalendarDays,
  ChefHat,
  Coffee,
  CreditCard,
  LayoutGrid,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  formatPeso,
} from "../../data/config.js";

import {
  useCafe,
} from "../../context/CafeContext.jsx";

import "../../styles/coffee-staff-studio.css";

const dayKey = (value) => {
  const date = new Date(value);

  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
};

const time = (value) =>
  new Intl.DateTimeFormat(
    "en-PH",
    {
      hour: "numeric",
      minute: "2-digit",
    }
  ).format(value);

const activeStatuses = [
  "received",
  "accepted",
  "preparing",
  "ready",
];

function Metric({
  icon: Icon,
  label,
  value,
  note,
  variant = "",
}) {
  return (
    <article
      className={`cj4-metric ${variant}`}
    >
      <div className="cj4-metric-top">
        <span>{label}</span>

        <Icon
          size={19}
          strokeWidth={1.6}
        />
      </div>

      <strong>{value}</strong>

      <small>{note}</small>
    </article>
  );
}

function Panel({
  number,
  title,
  action,
  children,
}) {
  return (
    <section className="cj4-panel">
      <div className="cj4-panel-top">
        <span>
          {number} /{" "}
          {title.toUpperCase()}
        </span>

        {action}
      </div>

      {children}
    </section>
  );
}

export default function DashboardPage() {
  const {
    stats,
    orders,
    reservations,
    transactions,
    events,
    inventory,
    now,
  } = useCafe();

  const queue = useMemo(
    () =>
      orders
        .filter((o) =>
          activeStatuses.includes(o.status)
        )
        .sort(
          (a, b) =>
            a.createdAt - b.createdAt
        )
        .slice(0, 5),
    [orders]
  );

  const upcoming = useMemo(
    () =>
      reservations
        .filter(
          (r) =>
            r.status === "reserved" &&
            r.endAt > now
        )
        .sort(
          (a, b) =>
            a.startAt - b.startAt
        )
        .slice(0, 4),
    [reservations, now]
  );

  const warnings = inventory
    .filter(
      (item) =>
        item.quantity <= item.lowStockAt
    )
    .slice(0, 5);

  const activity = [...events]
    .sort(
      (a, b) =>
        b.at - a.at
    )
    .slice(0, 5);

  const chartData = useMemo(
    () =>
      Array.from(
        { length: 7 },
        (_, i) => {
          const d = new Date(now);

          d.setHours(12, 0, 0, 0);
          d.setDate(
            d.getDate() - (6 - i)
          );

          const revenue = transactions
            .filter(
              (t) =>
                t.status === "paid" &&
                dayKey(t.at) === dayKey(d)
            )
            .reduce(
              (sum, t) =>
                sum +
                Number(t.amount || 0),
              0
            );

          return {
            date: d.toLocaleDateString(
              "en-PH",
              {
                weekday: "short",
              }
            ),

            revenue,
          };
        }
      ),
    [now, transactions]
  );

  const hasSales = chartData.some(
    (d) => d.revenue > 0
  );

  const occupancy = Math.min(
    100,
    Math.max(
      0,
      Number(
        stats.occupancyPercent
      ) || 0
    )
  );

  return (
    <div className="cj4-dashboard">
      {/* EDITORIAL INTRODUCTION */}

      <section className="cj4-dashboard-hero">
        <div>
          <span className="cj4-eyebrow">
            THE DAILY OPERATIONS EDITION /
            NO. 001
          </span>

          <h1>
            Behind every
            <br />
            <em>great cup.</em>
          </h1>

          <p>
            A clearer view of your café's
            people, places and orders.
            All figures are based on local
            demonstration records—not
            real transactions.
          </p>

          <div className="cj4-dashboard-actions">
            <Link to="/staff/pos">
              OPEN POINT OF SALE

              <ArrowUpRight size={17} />
            </Link>

            <Link to="/staff/orders">
              VIEW BARISTA QUEUE

              <ArrowRight size={17} />
            </Link>
          </div>
        </div>

        <div className="cj4-dashboard-hero-art">
          <span>
            YOUR CAFÉ / HOUSE OPERATIONS
          </span>

          <Coffee
            size={90}
            strokeWidth={0.8}
          />

          <strong>
            THE GOOD
            <br />
            WORK.
          </strong>

          <small>
            EST. IN POSSIBILITY /
            PHILIPPINES
          </small>
        </div>
      </section>

      {/* DAILY METRICS */}

      <div className="cj4-dashboard-intro">
        <span>
          01 / THE DAILY NUMBERS
        </span>

        <span>
          THIS BROWSER /{" "}
          {new Date(
            now
          ).toLocaleDateString(
            "en-PH",
            {
              dateStyle: "medium",
            }
          )}
        </span>
      </div>

      <div className="cj4-metric-grid">
        <Metric
          icon={CreditCard}
          label="TODAY'S RECORDED SALES"
          value={formatPeso(
            stats.todayRevenue
          )}
          note="Paid simulation records"
          variant="cj4-metric-feature"
        />

        <Metric
          icon={ShoppingBag}
          label="ACTIVE ORDERS"
          value={stats.activeOrders}
          note={`${stats.received} received · ${stats.preparing} preparing`}
        />

        <Metric
          icon={Users}
          label="OCCUPIED TABLES"
          value={`${stats.occupied} / ${stats.totalTables}`}
          note={`${occupancy}% occupancy`}
        />

        <Metric
          icon={ChefHat}
          label="READY TO SERVE"
          value={stats.ready}
          note="Current demo orders"
        />

        <Metric
          icon={CalendarDays}
          label="TODAY'S VISITS"
          value={stats.todayVisits}
          note="Visits recorded in browser"
        />

        <Metric
          icon={TrendingUp}
          label="AVERAGE PAID TICKET"
          value={formatPeso(
            stats.averagePaidOrder
          )}
          note="Paid demo transactions"
        />

        <Metric
          icon={Boxes}
          label="LOW STOCK ALERTS"
          value={stats.lowStock}
          note="Below demonstration threshold"
        />

        <Metric
          icon={LayoutGrid}
          label="TABLES AVAILABLE"
          value={stats.available}
          note={`${stats.reserved} reserved · ${stats.cleaning} cleaning`}
        />
      </div>

      {/* MAIN DASHBOARD GRID */}

      <div className="cj4-dash-main-grid">
        <div className="cj4-dash-primary">
          {/* REVENUE */}

          <Panel
            number="02"
            title="The revenue rhythm"
            action={
              <Link to="/staff/reports">
                FULL REPORT

                <ArrowUpRight size={15} />
              </Link>
            }
          >
            <h2>
              Seven days{" "}
              <em>in review.</em>
            </h2>

            <p className="cj4-panel-description">
              Actual totals from paid local
              demo transactions, grouped
              by payment date.
            </p>

            {hasSales ? (
              <div className="cj4-revenue-chart">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <AreaChart
                    data={chartData}
                    margin={{
                      top: 15,
                      right: 10,
                      bottom: 0,
                      left: -14,
                    }}
                  >
                    <defs>
                      <linearGradient
                        id="cj4Revenue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#ae5350"
                          stopOpacity={0.35}
                        />

                        <stop
                          offset="100%"
                          stopColor="#ae5350"
                          stopOpacity={0.015}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      vertical={false}
                      stroke="#e2d4c6"
                      strokeDasharray="4 6"
                    />

                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tick={{
                        fill: "#826d62",
                        fontSize: 10,
                      }}
                    />

                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{
                        fill: "#826d62",
                        fontSize: 10,
                      }}
                      tickFormatter={(v) =>
                        v >= 1000
                          ? `${v / 1000}k`
                          : String(v)
                      }
                    />

                    <Tooltip
                      formatter={(value) => [
                        formatPeso(value),
                        "Demo revenue",
                      ]}
                      contentStyle={{
                        border:
                          "1px solid #d9c7b7",
                        background:
                          "#fffaf3",
                        fontSize: 12,
                      }}
                    />

                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#a84342"
                      strokeWidth={2.5}
                      fill="url(#cj4Revenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="cj4-empty">
                <CreditCard size={26} />

                <strong>
                  No demo payments yet.
                </strong>

                <span>
                  Record a payment in POS
                  or the barista queue to
                  see your revenue chart.
                </span>
              </div>
            )}
          </Panel>

          {/* CURRENT ORDERS */}

          <Panel
            number="03"
            title="On the barista board"
            action={
              <Link to="/staff/orders">
                OPEN THE QUEUE

                <ArrowUpRight size={15} />
              </Link>
            }
          >
            <h2>
              Orders <em>in motion.</em>
            </h2>

            {queue.length ? (
              <div className="cj4-dash-list">
                {queue.map((order) => (
                  <Link
                    to="/staff/orders"
                    className="cj4-dash-list-row"
                    key={order.id}
                  >
                    <div>
                      <small>
                        {order.reference}
                      </small>

                      <strong>
                        {order.nickname}
                      </strong>

                      <span>
                        {order.lines
                          .map(
                            (line) =>
                              `${line.quantity}× ${line.name}`
                          )
                          .join(", ")}
                      </span>
                    </div>

                    <span
                      className={`cj4-queue-state is-${order.status}`}
                    >
                      {order.status.toUpperCase()}
                    </span>

                    <ArrowUpRight size={17} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="cj4-empty cj4-empty-small">
                Queue clear. Place a
                demonstration order to
                start the next one.
              </div>
            )}
          </Panel>

          {/* ACTIVITY LOG */}

          <Panel
            number="04"
            title="Latest studio notes"
            action={
              <Link to="/staff/activity">
                ALL ACTIVITY

                <ArrowUpRight size={15} />
              </Link>
            }
          >
            <h2>
              From the <em>logbook.</em>
            </h2>

            {activity.length ? (
              <div className="cj4-dash-list">
                {activity.map((event) => (
                  <div
                    className="cj4-dash-list-row"
                    key={event.id}
                  >
                    <Activity size={17} />

                    <div>
                      <strong>
                        {event.text}
                      </strong>

                      <small>
                        {event.type}
                        {" "}·{" "}
                        {time(event.at)}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="cj4-empty cj4-empty-small">
                No activity yet. The event
                log updates when you use
                staff actions.
              </div>
            )}
          </Panel>
        </div>

        {/* RIGHT-SIDE OPERATIONS PANELS */}

        <aside className="cj4-dash-side">
          <Panel
            number="05"
            title="The floor, at a glance"
            action={
              <Link to="/staff/tables">
                FLOOR MAP

                <ArrowUpRight size={15} />
              </Link>
            }
          >
            <div className="cj4-occupancy-display">
              <div
                className="cj4-occupancy-ring"
                style={{
                  "--cj4-occupancy":
                    `${occupancy}%`,
                }}
              >
                <div>
                  <strong>
                    {occupancy}%
                  </strong>

                  <small>
                    OCCUPIED
                  </small>
                </div>
              </div>

              <p>
                <b>{stats.occupied}</b>
                {" "}occupied
                <br />

                <b>{stats.available}</b>
                {" "}available
                <br />

                <b>{stats.reserved}</b>
                {" "}reserved
                <br />

                <b>{stats.cleaning}</b>
                {" "}cleaning
              </p>
            </div>
          </Panel>

          <Panel
            number="06"
            title="Coming to the café"
            action={
              <Link to="/staff/reservations">
                RESERVATIONS

                <ArrowUpRight size={15} />
              </Link>
            }
          >
            <h2>
              Next <em>arrivals.</em>
            </h2>

            {upcoming.length ? (
              <div className="cj4-dash-list">
                {upcoming.map((r) => (
                  <div
                    className="cj4-dash-list-row"
                    key={r.id}
                  >
                    <CalendarDays
                      size={16}
                    />

                    <div>
                      <strong>
                        {r.nickname}
                      </strong>

                      <span>
                        {r.tableId}
                        {" "}·{" "}
                        {r.partySize}
                        {" "}guests
                      </span>

                      <small>
                        {new Date(
                          r.startAt
                        ).toLocaleString(
                          "en-PH",
                          {
                            dateStyle:
                              "medium",
                            timeStyle:
                              "short",
                          }
                        )}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="cj4-empty cj4-empty-small">
                No upcoming demo
                reservations.
              </div>
            )}
          </Panel>

          <Panel
            number="07"
            title="Keep an eye on"
            action={
              <Link to="/staff/inventory">
                INVENTORY

                <ArrowUpRight size={15} />
              </Link>
            }
          >
            <h2>
              Stock <em>watch.</em>
            </h2>

            {warnings.length ? (
              <div className="cj4-dash-list">
                {warnings.map(
                  (item) => (
                    <div
                      className="cj4-dash-list-row"
                      key={item.id}
                    >
                      <Boxes size={17} />

                      <div>
                        <strong>
                          {item.name}
                        </strong>

                        <span>
                          {item.quantity}
                          {" "}
                          {item.unit}
                          {" "}left · threshold{" "}
                          {item.lowStockAt}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="cj4-empty cj4-empty-small">
                All tracked demo ingredients
                are above their alert threshold.
              </div>
            )}
          </Panel>
        </aside>
      </div>

      <div className="cj4-dashboard-bottom">
        <span>
          <Coffee size={18} />

          THE OPERATIONS JOURNAL /
          A DEV CODEWORKS CONCEPT
        </span>

        <Link to="/staff/reports">
          EXPLORE THE NUMBERS

          <ArrowUpRight size={17} />
        </Link>
      </div>
    </div>
  );
}