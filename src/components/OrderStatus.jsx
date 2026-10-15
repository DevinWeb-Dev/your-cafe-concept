import {
  useMemo,
  useState,
} from "react";

import {
  Link,
  useLocation,
} from "react-router-dom";

import {
  ArrowRight,
  Check,
  Clock3,
  Coffee,
  Search,
  ShoppingBag,
  XCircle,
} from "lucide-react";

import {
  ORDER_STATUSES,
  formatPeso,
} from "../data/config.js";

import { useCafe } from "../context/CafeContext.jsx";

import "../styles/coffee-ordering.css";

const STAGES = [
  [
    "received",
    "Received",
    "Your order has joined the demo queue",
  ],
  [
    "accepted",
    "Accepted",
    "The staff demo accepted the order",
  ],
  [
    "preparing",
    "Preparing",
    "Your selection is being prepared",
  ],
  [
    "ready",
    "Ready",
    "Prepared for pickup or serving",
  ],
  [
    "completed",
    "Completed",
    "This local order is marked fulfilled",
  ],
];

function displayTime(value) {
  if (!value) return "Not available";

  const number = new Date(value);

  return Number.isNaN(number.getTime())
    ? "Not available"
    : new Intl.DateTimeFormat("en-PH", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(number);
}

export default function OrderStatus({
  initialReference = "",
}) {
  const location = useLocation();
  const { orders, now } = useCafe();

  const fromCheckout =
    location.state?.reference ||
    initialReference;

  const [search, setSearch] =
    useState(fromCheckout);

  const [reference, setReference] =
    useState(fromCheckout.trim());

  const selected = useMemo(
    () =>
      reference
        ? orders.find(
            (item) =>
              item.reference.toLowerCase() ===
              reference.toLowerCase()
          ) || null
        : orders[0] || null,
    [orders, reference]
  );

  const recent = orders.slice(0, 4);

  const currentStep = selected
    ? STAGES.findIndex(
        ([id]) => id === selected.status
      )
    : -1;

  const cancelled =
    selected?.status === "cancelled";

  const age = selected?.createdAt
    ? Math.max(
        0,
        Math.floor(
          (now - selected.createdAt) / 60000
        )
      )
    : null;

  return (
    <div className="cj2-tracking">
      <section className="cj2-tracking-hero">
        <div className="cj2-wide">
          <span className="cj2-overline cj2-overline--light">
            YOUR CAFÉ. / THE ORDER JOURNAL
          </span>

          <h1>
            Every cup has
            <br />
            <em>a little story.</em>
          </h1>

          <p>
            Follow the progress of an order
            created in this browser, from
            received to ready. This is a
            staff-connected demo, not live
            order tracking.
          </p>

          <span className="cj2-tracking-hero-meta">
            04 / THE JOURNEY FROM CUP TO CUSTOMER
          </span>
        </div>
      </section>

      <div className="cj2-wide cj2-tracking-content">
        <form
          className="cj2-track-search"
          onSubmit={(event) => {
            event.preventDefault();
            setReference(search.trim());
          }}
        >
          <label htmlFor="cj2-reference">
            FIND YOUR DEMO ORDER
          </label>

          <div>
            <Search size={19} />

            <input
              id="cj2-reference"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="CAFE-DEMO-..."
              autoComplete="off"
            />

            <button type="submit">
              TRACK ORDER
              <ArrowRight size={17} />
            </button>
          </div>

          <small>
            Only orders saved in this browser
            can appear here.
          </small>
        </form>

        {!selected ? (
          <div className="cj2-track-empty">
            <Coffee
              size={45}
              strokeWidth={1.3}
            />

            <h2>
              {orders.length
                ? "We couldn't find that."
                : "No coffee in the queue."}
            </h2>

            <p>
              {orders.length
                ? "Double-check the demo reference, or select a recent order below."
                : "Browse our menu and place a demo order to see its progress here."}
            </p>

            <Link to="/menu">
              EXPLORE THE MENU
              <ArrowRight size={17} />
            </Link>
          </div>
        ) : (
          <article className="cj2-track-card">
            <div className="cj2-track-card-head">
              <div>
                <span>
                  ORDER REFERENCE / YOUR CAFÉ.
                </span>

                <h2>
                  {selected.reference}
                </h2>

                <p>
                  {selected.type === "pickup"
                    ? "Pickup"
                    : "Dine-in"}

                  {selected.tableId
                    ? ` / ${selected.tableId}`
                    : ""}
                </p>
              </div>

              <strong className="cj2-track-status">
                {cancelled ? (
                  <XCircle size={18} />
                ) : selected.status ===
                  "completed" ? (
                  <Check size={18} />
                ) : (
                  <Clock3 size={18} />
                )}

                {ORDER_STATUSES[
                  selected.status
                ]?.label || selected.status}
              </strong>
            </div>

            {cancelled ? (
              <div className="cj2-track-cancelled">
                <XCircle size={26} />

                <div>
                  <strong>
                    Order cancelled
                  </strong>

                  <p>
                    This demo order will not
                    progress any further.
                  </p>
                </div>
              </div>
            ) : (
              <ol
                className="cj2-track-progress"
                aria-label="Order preparation steps"
              >
                {STAGES.map(
                  ([id, name, detail], index) => {
                    const reached =
                      index <= currentStep;

                    const active =
                      index === currentStep;

                    return (
                      <li
                        key={id}
                        className={`${
                          reached
                            ? "is-done"
                            : ""
                        } ${
                          active
                            ? "is-current"
                            : ""
                        }`}
                        aria-current={
                          active
                            ? "step"
                            : undefined
                        }
                      >
                        <span className="cj2-stage-icon">
                          {reached ? (
                            <Check size={18} />
                          ) : (
                            String(
                              index + 1
                            ).padStart(2, "0")
                          )}
                        </span>

                        <strong>
                          {name}
                        </strong>

                        <small>
                          {detail}
                        </small>
                      </li>
                    );
                  }
                )}
              </ol>
            )}

            <div className="cj2-track-details">
              <div>
                <span>PLACED</span>

                <strong>
                  {displayTime(
                    selected.createdAt
                  )}
                </strong>
              </div>

              <div>
                <span>LAST UPDATED</span>

                <strong>
                  {displayTime(
                    selected.updatedAt
                  )}
                </strong>
              </div>

              <div>
                <span>ELAPSED</span>

                <strong>
                  {age === null
                    ? "—"
                    : `${age} min`}
                </strong>
              </div>

              <div>
                <span>PAYMENT</span>

                <strong>
                  {selected.paymentStatus ===
                  "paid"
                    ? "Recorded in demo"
                    : "Not recorded"}
                </strong>
              </div>
            </div>

            <div className="cj2-track-bill">
              <h3>
                The <em>selection.</em>
              </h3>

              {(selected.lines || []).map(
                (line, index) => (
                  <div
                    key={`${line.productId}-${index}`}
                  >
                    <span>
                      {line.quantity} ×{" "}
                      {line.name}
                    </span>

                    <strong>
                      {formatPeso(
                        line.lineTotal
                      )}
                    </strong>
                  </div>
                )
              )}

              <div className="cj2-track-bill-total">
                <span>
                  DEMO ORDER TOTAL
                </span>

                <strong>
                  {formatPeso(
                    selected.total
                  )}
                </strong>
              </div>
            </div>
          </article>
        )}

        {recent.length > 0 && (
          <section className="cj2-track-recent">
            <span className="cj2-overline">
              RECENT ACTIVITY / THIS BROWSER
            </span>

            <h2>
              From the <em>journal.</em>
            </h2>

            <div className="cj2-track-recent-list">
              {recent.map((order) => (
                <button
                  key={order.id}
                  type="button"
                  className={
                    selected?.id === order.id
                      ? "active"
                      : ""
                  }
                  onClick={() => {
                    setReference(
                      order.reference
                    );

                    setSearch(
                      order.reference
                    );
                  }}
                >
                  <span>
                    {order.reference}
                  </span>

                  <strong>
                    {ORDER_STATUSES[
                      order.status
                    ]?.label || order.status}
                  </strong>

                  <ArrowRight size={17} />
                </button>
              ))}
            </div>
          </section>
        )}

        <div className="cj2-track-note">
          <ShoppingBag size={19} />

          Changes to the local order status
          can be simulated in the staff
          Barista board. No real café order
          is being processed.
        </div>
      </div>
    </div>
  );
}