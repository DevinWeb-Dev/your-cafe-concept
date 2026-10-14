import { useMemo, useState } from "react";
import { ArrowRight, Check, Clock3, Coffee, Search, ShoppingBag, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { ORDER_STATUSES, formatPeso } from "../data/config.js";
import { useCafe } from "../context/CafeContext.jsx";

const STEPS = [
  { id: "received", label: "Received", description: "Order entered our demo queue" },
  { id: "accepted", label: "Accepted", description: "Staff has accepted the order" },
  { id: "preparing", label: "Preparing", description: "Being prepared by our barista" },
  { id: "ready", label: "Ready", description: "Ready for pickup or serving" },
  { id: "completed", label: "Completed", description: "Demo order fulfilled" },
];

function localTime(timestamp) {
  return timestamp
    ? new Intl.DateTimeFormat("en-PH", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(timestamp))
    : "Not available";
}

/**
 * Order status reads the same local demo orders as Staff > Barista.
 * It does NOT contact a café server or expose real tracking.
 */
export default function OrderStatus({ initialReference = "" }) {
  const { orders, now } = useCafe();
  const [searchText, setSearchText] = useState(initialReference);
  const [selectedReference, setSelectedReference] = useState(initialReference.trim());

  const selected = useMemo(() => {
    if (selectedReference) {
      return orders.find(
        (o) => o.reference.toLowerCase() === selectedReference.toLowerCase()
      ) || null;
    }
    return orders[0] || null;
  }, [orders, selectedReference]);

  const latest = useMemo(() => orders.slice(0, 4), [orders]);
  const currentStep = selected ? STEPS.findIndex((s) => s.id === selected.status) : -1;
  const cancelled = selected?.status === "cancelled";
  const orderAge = selected?.createdAt
    ? Math.max(0, Math.floor((now - selected.createdAt) / 60000))
    : null;

  function handleSearch(event) {
    event.preventDefault();
    setSelectedReference(searchText.trim());
  }

  return (
    <section className="yc-track-section" aria-labelledby="yc-track-title">
      <div className="yc-track-container">
        <div className="yc-track-intro">
          <span className="yc-track-kicker"><Coffee size={15} /> YOUR COFFEE MOMENT</span>
          <h1 id="yc-track-title">Every order has <em>a little story.</em></h1>
          <p>Follow your coffee from the moment it enters our demonstration queue until it is ready.</p>
          <div className="yc-track-demo"><Clock3 size={15} /> Same-browser prototype · Not a real café tracking service</div>
        </div>

        <form className="yc-track-search" onSubmit={handleSearch}>
          <label htmlFor="yc-order-reference">ORDER REFERENCE</label>
          <div className="yc-track-searchrow">
            <input
              id="yc-order-reference"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="CAFE-DEMO-..."
              spellCheck="false"
              autoComplete="off"
            />
            <button type="submit"><Search size={17} /> Track order</button>
          </div>
          <small>Only orders created in this browser can be found.</small>
        </form>

        {!selected ? (
          <div className="yc-track-empty">
            <ShoppingBag size={35} strokeWidth={1.3} />
            <h2>{orders.length ? "No matching demo order." : "No coffee in the queue yet."}</h2>
            <p>{orders.length ? "Double-check the reference, or select a recent order below." : "Explore the menu, customize your drink, and place a simulated order to see the journey."}</p>
            <Link to="/menu">Explore the menu <ArrowRight size={17} /></Link>
          </div>
        ) : (
          <article className="yc-track-card">
            <div className="yc-track-cardtop">
              <div>
                <small>ORDER REFERENCE</small>
                <h2>{selected.reference}</h2>
                <span>{selected.type === "pickup" ? "Pickup order" : "Dine-in order"}{selected.tableId ? ` · ${selected.tableId}` : ""}</span>
              </div>
              <span className={`yc-track-status yc-track-status--${selected.status}`}>
                {cancelled ? <XCircle size={15} /> : selected.status === "completed" ? <Check size={15} /> : <Clock3 size={15} />}
                {ORDER_STATUSES[selected.status]?.label || selected.status}
              </span>
            </div>

            {cancelled ? (
              <div className="yc-track-cancelled"><XCircle size={23} /><div><strong>Order cancelled</strong><p>This demonstration order will not advance through preparation.</p></div></div>
            ) : (
              <ol className="yc-track-steps" aria-label="Order preparation progress">
                {STEPS.map((step, index) => {
                  const done = currentStep >= index;
                  const current = currentStep === index;
                  return (
                    <li key={step.id} className={`${done ? "is-done" : ""} ${current ? "is-current" : ""}`} aria-current={current ? "step" : undefined}>
                      <span className="yc-track-stepicon">{done ? <Check size={17} /> : String(index + 1).padStart(2, "0")}</span>
                      <div><strong>{step.label}</strong><small>{step.description}</small></div>
                    </li>
                  );
                })}
              </ol>
            )}

            <div className="yc-track-detailgrid">
              <div><small>ORDERED</small><strong>{localTime(selected.createdAt)}</strong></div>
              <div><small>LAST UPDATED</small><strong>{localTime(selected.updatedAt)}</strong></div>
              <div><small>TIME SINCE ORDER</small><strong>{orderAge !== null ? `${orderAge} minute${orderAge === 1 ? "" : "s"}` : "—"}</strong></div>
              <div><small>PAYMENT</small><strong>{selected.paymentStatus === "paid" ? "Recorded (demo)" : "Not recorded"}</strong></div>
            </div>

            <div className="yc-track-orderlines">
              <h3>Your selections</h3>
              {(selected.lines || []).map((line, index) => (
                <div className="yc-track-orderline" key={`${line.productId}-${index}`}>
                  <span><b>{line.quantity}×</b> {line.name}</span>
                  <strong>{formatPeso(line.lineTotal)}</strong>
                </div>
              ))}
              <div className="yc-track-total"><span>Order total</span><strong>{formatPeso(selected.total)}</strong></div>
            </div>
          </article>
        )}

        {latest.length > 0 && (
          <div className="yc-track-recent">
            <h3>Recent demo orders</h3>
            <div className="yc-track-recentgrid">
              {latest.map((order) => (
                <button
                  key={order.id}
                  className={selected?.id === order.id ? "is-active" : ""}
                  type="button"
                  onClick={() => {
                    setSelectedReference(order.reference);
                    setSearchText(order.reference);
                  }}
                >
                  <strong>{order.reference}</strong>
                  <span>{ORDER_STATUSES[order.status]?.label || order.status} <ArrowRight size={14} /></span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
