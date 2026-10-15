import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Coffee,
  Gift,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import {
  PROMOTIONS,
  formatPeso,
} from "../../data/config.js";

import { quoteCart } from "../../engine/cafeEngine.js";
import { useCafe } from "../../context/CafeContext.jsx";

import "../../styles/coffee-ordering.css";

function optionSummary(options = {}) {
  return [
    options.size,
    options.temperature,
    options.milk,
    options.sweetness,
    ...(options.extras || []),
  ]
    .filter(Boolean)
    .join(" / ") || "As prepared";
}

export default function CartPage() {
  const navigate = useNavigate();

  const {
    cart,
    cartPreview,
    cartActions,
    placeCartOrder,
    tables,
  } = useCafe();

  const [type, setType] = useState("pickup");
  const [tableId, setTableId] = useState("");

  const [nickname, setNickname] = useState("");
  const [note, setNote] = useState("");
  const [promoCode, setPromoCode] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const quote = useMemo(() => {
    if (!cart.length) {
      return {
        data: cartPreview,
        error: "",
      };
    }

    try {
      return {
        data: quoteCart(cart, promoCode),
        error: "",
      };
    } catch (e) {
      return {
        data: cartPreview,
        error: e.message,
      };
    }
  }, [
    cart,
    cartPreview,
    promoCode,
  ]);

  const occupiedTables = tables.filter(
    (table) => table.visit
  );

  const activePromos = PROMOTIONS.filter(
    (item) => item.active
  );

  function checkout(event) {
    event.preventDefault();

    setError("");

    if (!cart.length) {
      setError(
        "Add something to the basket first."
      );
      return;
    }

    if (!nickname.trim()) {
      setError(
        "Enter a demo nickname before continuing."
      );
      return;
    }

    if (quote.error) {
      setError(quote.error);
      return;
    }

    if (
      type === "dinein" &&
      tableId &&
      !occupiedTables.some(
        (table) => table.id === tableId
      )
    ) {
      setError(
        "Choose a currently occupied demo table or leave this order unassigned."
      );
      return;
    }

    setBusy(true);

    try {
      const result = placeCartOrder({
        type,

        tableId:
          type === "dinein"
            ? tableId || null
            : null,

        nickname: nickname.trim(),
        note,
        promoCode: promoCode.trim(),
      });

      if (result.ok) {
        const reference =
          result.state?.orders?.[0]?.reference ||
          "";

        navigate("/orders", {
          state: { reference },
        });
      } else {
        setError(
          result.error ||
            "Unable to prepare the demo order."
        );
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="cj2-checkout">
      <section className="cj2-checkout-hero">
        <div className="cj2-wide">
          <span className="cj2-overline cj2-overline--light">
            YOUR CAFÉ. / THE FINAL POUR
          </span>

          <h1>
            Make it <em>a moment.</em>
          </h1>

          <div className="cj2-checkout-hero-foot">
            <span>
              03 / YOUR ORDER JOURNAL
            </span>

            <span>
              EVERYTHING HERE IS A FRONTEND DEMO
            </span>
          </div>
        </div>
      </section>

      <div className="cj2-wide cj2-checkout-content">
        {cart.length === 0 ? (
          <div className="cj2-checkout-empty">
            <ShoppingBag
              size={43}
              strokeWidth={1.3}
            />

            <h2>
              Your next favorite
              <br />
              <em>is waiting.</em>
            </h2>

            <p>
              Nothing in your basket just yet.
              Explore our illustrative menu
              to begin.
            </p>

            <Link to="/menu">
              FIND SOMETHING GOOD
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <form
            className="cj2-checkout-grid"
            onSubmit={checkout}
          >
            <div className="cj2-checkout-selection">
              <div className="cj2-checkout-section-title">
                <span>
                  01 / THE SELECTION
                </span>

                <h2>
                  Your <em>favorites.</em>
                </h2>
              </div>

              {cart.map((entry, index) => {
                const line =
                  cartPreview.lines[index];

                return (
                  <article
                    key={entry.key}
                    className="cj2-checkout-line"
                  >
                    <div className="cj2-checkout-photo">
                      {line?.image ? (
                        <img
                          src={line.image}
                          alt=""
                          loading="lazy"
                        />
                      ) : (
                        <Coffee size={25} />
                      )}

                      <span>
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </span>
                    </div>

                    <div className="cj2-checkout-item-body">
                      <span className="cj2-overline">
                        PREPARED YOUR WAY
                      </span>

                      <h3>
                        {line?.name ||
                          entry.productId}
                      </h3>

                      <p>
                        {optionSummary(
                          entry.options
                        )}
                      </p>

                      <div className="cj2-checkout-item-foot">
                        <strong>
                          {formatPeso(
                            line?.lineTotal || 0
                          )}
                        </strong>

                        <div className="cj2-stepper cj2-stepper--small">
                          <button
                            type="button"
                            aria-label={`Decrease ${
                              line?.name || "item"
                            } quantity`}
                            onClick={() =>
                              cartActions.quantity(
                                entry.key,
                                entry.quantity - 1
                              )
                            }
                          >
                            <Minus size={15} />
                          </button>

                          <span>
                            {entry.quantity}
                          </span>

                          <button
                            type="button"
                            disabled={
                              entry.quantity >= 30
                            }
                            aria-label={`Increase ${
                              line?.name || "item"
                            } quantity`}
                            onClick={() =>
                              cartActions.quantity(
                                entry.key,
                                entry.quantity + 1
                              )
                            }
                          >
                            <Plus size={15} />
                          </button>
                        </div>

                        <button
                          type="button"
                          className="cj2-remove"
                          onClick={() =>
                            cartActions.remove(
                              entry.key
                            )
                          }
                          aria-label={`Remove ${
                            line?.name || "item"
                          }`}
                        >
                          <Trash2 size={16} />
                          REMOVE
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}

              <Link
                to="/menu"
                className="cj2-back-menu"
              >
                <ArrowLeft size={16} />
                ADD SOMETHING ELSE
              </Link>

              <div className="cj2-checkout-promise">
                <Coffee size={22} />

                Each price is an illustrative
                calculation from the existing
                café pricing engine.
              </div>
            </div>

            <aside className="cj2-checkout-summary">
              <div className="cj2-checkout-section-title">
                <span>
                  02 / THE FINISHING DETAILS
                </span>

                <h2>
                  Almost <em>there.</em>
                </h2>
              </div>

              <span className="cj2-summary-label">
                HOW WOULD YOU LIKE IT?
              </span>

              <div
                className="cj2-order-types"
                role="group"
                aria-label="Order type"
              >
                <button
                  type="button"
                  aria-pressed={
                    type === "pickup"
                  }
                  className={
                    type === "pickup"
                      ? "active"
                      : ""
                  }
                  onClick={() => {
                    setType("pickup");
                    setTableId("");
                  }}
                >
                  PICKUP

                  <small>
                    TAKE IT WITH YOU
                  </small>
                </button>

                <button
                  type="button"
                  aria-pressed={
                    type === "dinein"
                  }
                  className={
                    type === "dinein"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setType("dinein")
                  }
                >
                  DINE-IN

                  <small>
                    STAY FOR A WHILE
                  </small>
                </button>
              </div>

              {type === "dinein" && (
                <label className="cj2-checkout-field">
                  TABLE ASSIGNMENT

                  <small>
                    OPTIONAL · FOR CHECKED-IN DEMO GUESTS
                  </small>

                  <select
                    value={tableId}
                    onChange={(e) =>
                      setTableId(e.target.value)
                    }
                  >
                    <option value="">
                      Unassigned dine-in order
                    </option>

                    {occupiedTables.map(
                      (table) => (
                        <option
                          key={table.id}
                          value={table.id}
                        >
                          {table.id} —{" "}
                          {table.visit.nickname}
                        </option>
                      )
                    )}
                  </select>
                </label>
              )}

              <label className="cj2-checkout-field">
                DEMO CUSTOMER NICKNAME

                <small>REQUIRED</small>

                <input
                  required
                  maxLength={40}
                  value={nickname}
                  onChange={(e) =>
                    setNickname(e.target.value)
                  }
                  placeholder="How should we call you?"
                  autoComplete="off"
                />
              </label>

              <label className="cj2-checkout-field">
                A NOTE FOR THE BARISTA

                <small>OPTIONAL</small>

                <textarea
                  rows={3}
                  maxLength={220}
                  value={note}
                  onChange={(e) =>
                    setNote(e.target.value)
                  }
                  placeholder="Any special details?"
                />
              </label>

              <div className="cj2-promo-header">
                <Gift size={17} />

                THE LITTLE EXTRAS

                <span>
                  DEMO PROMOS
                </span>
              </div>

              <label className="cj2-checkout-field">
                PROMO CODE

                <input
                  value={promoCode}
                  onChange={(e) =>
                    setPromoCode(
                      e.target.value.toUpperCase()
                    )
                  }
                  placeholder="Enter a demo code"
                  autoComplete="off"
                />
              </label>

              <div className="cj2-promo-pills">
                {activePromos.map((promo) => (
                  <button
                    type="button"
                    key={promo.id}
                    className={
                      promoCode === promo.code
                        ? "selected"
                        : ""
                    }
                    onClick={() =>
                      setPromoCode(promo.code)
                    }
                    title={promo.description}
                  >
                    {promo.code}
                  </button>
                ))}
              </div>

              {quote.error && (
                <p
                  className="cj2-inline-error"
                  role="alert"
                >
                  {quote.error}
                </p>
              )}

              <div className="cj2-summary-money">
                <div>
                  <span>SUBTOTAL</span>

                  <strong>
                    {formatPeso(
                      quote.data.subtotal || 0
                    )}
                  </strong>
                </div>

                <div>
                  <span>DISCOUNT</span>

                  <strong>
                    −{" "}
                    {formatPeso(
                      quote.data.discount || 0
                    )}
                  </strong>
                </div>

                <div className="cj2-grand-total">
                  <span>DEMO TOTAL</span>

                  <strong>
                    {formatPeso(
                      quote.data.total || 0
                    )}
                  </strong>
                </div>
              </div>

              {error && (
                <p
                  className="cj2-inline-error"
                  role="alert"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="cj2-place-order"
                disabled={
                  busy || Boolean(quote.error)
                }
              >
                {busy
                  ? "PREPARING..."
                  : "PLACE DEMO ORDER"}

                <ArrowRight size={18} />
              </button>

              <p className="cj2-summary-disclaimer">
                <Check size={16} />

                No money is collected. This creates
                a local demonstration order that
                can appear in the staff demo board
                on the same browser.
              </p>
            </aside>
          </form>
        )}
      </div>
    </div>
  );
}