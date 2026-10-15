import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowRight,
  Coffee,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";

import { formatPeso } from "../data/config.js";
import { useCafe } from "../context/CafeContext.jsx";

import "../styles/coffee-ordering.css";

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

export default function CartDrawer({
  open,
  onClose,
}) {
  const navigate = useNavigate();

  const {
    cart,
    cartActions,
    cartPreview,
    cartCount,
  } = useCafe();

  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const onCloseRef = useRef(onClose);

  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;

    const previousFocus =
      document.activeElement;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    closeRef.current?.focus();

    const handleKey = (event) => {
      if (event.key === "Escape") {
        onCloseRef.current?.();
      }

      if (
        event.key !== "Tab" ||
        !dialogRef.current
      ) {
        return;
      }

      const elements = Array.from(
        dialogRef.current.querySelectorAll(
          'button:not([disabled]), a[href]'
        )
      ).filter(
        (node) =>
          node.getClientRects().length > 0
      );

      if (!elements.length) return;

      if (
        event.shiftKey &&
        document.activeElement === elements[0]
      ) {
        event.preventDefault();

        elements[elements.length - 1].focus();
      } else if (
        !event.shiftKey &&
        document.activeElement ===
          elements[elements.length - 1]
      ) {
        event.preventDefault();

        elements[0].focus();
      }
    };

    window.addEventListener(
      "keydown",
      handleKey
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKey
      );

      document.body.style.overflow =
        previousOverflow;

      previousFocus?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  const total = cartPreview.total ?? 0;

  function proceed() {
    onClose?.();
    navigate("/cart");
  }

  return createPortal(
    <div
      className="cj2-drawer-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      <aside
        className="cj2-drawer"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Your café basket"
      >
        <div className="cj2-drawer-head">
          <div>
            <span className="cj2-overline">
              YOUR CAFÉ / YOUR SELECTION
            </span>

            <h2>
              The <em>basket.</em>
            </h2>

            <p>
              {cartCount} ITEM
              {cartCount === 1 ? "" : "S"}
              {" "} / READY FOR REVIEW
            </p>
          </div>

          <button
            type="button"
            className="cj2-close"
            ref={closeRef}
            onClick={onClose}
            aria-label="Close basket"
          >
            <X size={23} />
          </button>
        </div>

        <div className="cj2-drawer-scroll">
          {cart.length === 0 ? (
            <div className="cj2-drawer-empty">
              <Coffee
                size={45}
                strokeWidth={1.3}
              />

              <h3>
                Something good
                <br />
                <em>belongs here.</em>
              </h3>

              <p>
                Explore the journal and add
                your first little coffee moment.
              </p>

              <Link
                to="/menu"
                onClick={onClose}
              >
                BROWSE THE MENU
                <ArrowRight size={17} />
              </Link>
            </div>
          ) : (
            <div className="cj2-basket-items">
              {cart.map((entry, index) => {
                const line = cartPreview.lines[index];

                return (
                  <article
                    className="cj2-basket-item"
                    key={entry.key}
                  >
                    <div className="cj2-basket-image">
                      {line?.image ? (
                        <img
                          src={line.image}
                          alt=""
                          loading="lazy"
                        />
                      ) : (
                        <Coffee size={23} />
                      )}
                    </div>

                    <div className="cj2-basket-info">
                      <span>
                        SELECTION{" "}
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
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

                      <strong>
                        {formatPeso(
                          line?.lineTotal || 0
                        )}
                      </strong>

                      <div className="cj2-basket-controls">
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
                            aria-label={`Increase ${
                              line?.name || "item"
                            } quantity`}
                            disabled={
                              entry.quantity >= 30
                            }
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
                          <Trash2 size={17} />
                          REMOVE
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="cj2-drawer-bottom">
            <div>
              <span>SUBTOTAL</span>

              <strong>
                {formatPeso(
                  cartPreview.subtotal
                )}
              </strong>
            </div>

            <p>
              Final discounts are calculated
              at demo checkout. No real payment
              is involved.
            </p>

            <button
              type="button"
              onClick={proceed}
            >
              REVIEW YOUR ORDER

              <strong>
                {formatPeso(total)}
              </strong>

              <ArrowRight size={18} />
            </button>
          </div>
        )}

        <div className="cj2-drawer-edition">
          THE COFFEE JOURNAL /
          A FRONTEND EXPERIENCE
        </div>
      </aside>
    </div>,
    document.body
  );
}