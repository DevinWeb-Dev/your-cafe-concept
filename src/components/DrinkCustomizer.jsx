import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { createPortal } from "react-dom";

import {
  ArrowRight,
  Check,
  Coffee,
  Minus,
  Plus,
  ShoppingBag,
  Snowflake,
  Sparkles,
  ThermometerSun,
  X,
} from "lucide-react";

import {
  DRINK_EXTRAS,
  DRINK_SIZES,
  MILK_OPTIONS,
  SWEETNESS_OPTIONS,
  formatPeso,
  getCustomizationProfile,
} from "../data/config.js";

import { quoteMenuItem } from "../engine/cafeEngine.js";
import { useCafe } from "../context/CafeContext.jsx";

import "../styles/coffee-ordering.css";

function Choice({
  selected,
  title,
  caption,
  icon: Icon,
  onClick,
}) {
  return (
    <button
      type="button"
      className={`cj2-choice ${
        selected ? "is-selected" : ""
      }`}
      onClick={onClick}
      aria-pressed={selected}
    >
      <span>
        {Icon ? (
          <Icon size={17} />
        ) : selected ? (
          <Check size={15} />
        ) : null}

        {title}
      </span>

      {caption && <small>{caption}</small>}
    </button>
  );
}

export default function DrinkCustomizer({
  product,
  open,
  onClose,
}) {
  const { cartActions } = useCafe();

  const closeRef = useRef(null);
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);

  onCloseRef.current = onClose;

  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("medium");

  const [
    temperature,
    setTemperature,
  ] = useState("hot");

  const [milk, setMilk] = useState("dairy");

  const [
    sweetness,
    setSweetness,
  ] = useState("regular");

  const [extras, setExtras] = useState([]);
  const [error, setError] = useState("");

  const profile = useMemo(
    () =>
      product
        ? getCustomizationProfile(
            product.customizationProfile
          )
        : null,
    [product?.customizationProfile]
  );

  const temperatures = useMemo(
    () =>
      product && profile
        ? product.allowedTemperatures ||
          profile.temperatures
        : [],
    [product?.id, profile]
  );

  useEffect(() => {
    if (!open || !product || !profile) return;

    setQuantity(1);

    setSize(
      profile.sizes.includes("medium")
        ? "medium"
        : profile.sizes[0] || ""
    );

    setTemperature(
      temperatures[0] || ""
    );

    setMilk(
      profile.milks.includes("dairy")
        ? "dairy"
        : profile.milks[0] || ""
    );

    setSweetness("regular");
    setExtras([]);
    setError("");
  }, [
    open,
    product?.id,
    profile,
    temperatures,
  ]);

  useEffect(() => {
    if (!open) return;

    const prior = document.activeElement;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    closeRef.current?.focus();

    function handleKey(event) {
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
          "button:not([disabled]), a[href]"
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
    }

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

      prior?.focus?.();
    };
  }, [open]);

  const options = useMemo(
    () => ({
      ...(profile?.sizes.length
        ? { size }
        : {}),

      ...(temperatures.length
        ? { temperature }
        : {}),

      ...(profile?.milks.length
        ? { milk }
        : {}),

      ...(profile?.sweetness
        ? { sweetness }
        : {}),

      extras,
    }),
    [
      profile,
      temperatures,
      size,
      temperature,
      milk,
      sweetness,
      extras,
    ]
  );

  const preview = useMemo(() => {
    if (!open || !product) {
      return {
        quote: null,
        error: "",
      };
    }

    try {
      return {
        quote: quoteMenuItem(
          product.id,
          quantity,
          options
        ),
        error: "",
      };
    } catch (e) {
      return {
        quote: null,
        error: e.message,
      };
    }
  }, [
    open,
    product?.id,
    quantity,
    options,
  ]);

  if (!open || !product || !profile) {
    return null;
  }

  function toggleExtra(id) {
    setExtras((current) =>
      current.includes(id)
        ? current.filter(
            (item) => item !== id
          )
        : current.length < 5
          ? [...current, id]
          : current
    );
  }

  function addToCart() {
    setError("");

    if (!preview.quote) return;

    const result = cartActions.add(
      product.id,
      quantity,
      options
    );

    if (result.ok) {
      onClose?.();
    } else {
      setError(
        result.error ||
          "Could not add this selection."
      );
    }
  }

  const isDrink = product.kind === "drink";

  return createPortal(
    <div
      className="cj2-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose?.();
        }
      }}
    >
      <section
        className="cj2-customizer"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Customize ${product.name}`}
      >
        <div className="cj2-customizer-visual">
          <img
            src={product.image}
            alt={`Illustrative ${product.name}`}
          />

          <span className="cj2-customizer-photo-index">
            THE COFFEE JOURNAL / CUSTOM EDITION
          </span>

          <div className="cj2-customizer-visual-caption">
            <span>MADE YOUR WAY</span>

            <strong>
              {product.name}
            </strong>
          </div>
        </div>

        <div className="cj2-customizer-content">
          <div className="cj2-customizer-top">
            <span className="cj2-overline">
              02 / MAKE IT YOURS
            </span>

            <button
              type="button"
              className="cj2-close"
              onClick={onClose}
              ref={closeRef}
              aria-label="Close customizer"
            >
              <X size={23} />
            </button>
          </div>

          <h2>
            A little <em>personal.</em>
          </h2>

          <div className="cj2-customizer-product-head">
            <strong>
              {product.name}
            </strong>

            <span>
              BASE {formatPeso(product.price)}
            </span>
          </div>

          <p className="cj2-customizer-description">
            {product.description}
          </p>

          {profile.sizes.length > 0 && (
            <fieldset className="cj2-fieldset">
              <legend>
                <span>01</span>
                Choose your size
              </legend>

              <div className="cj2-choices">
                {DRINK_SIZES.filter(
                  (item) =>
                    profile.sizes.includes(
                      item.id
                    )
                ).map((item) => (
                  <Choice
                    key={item.id}
                    selected={size === item.id}
                    title={item.name}
                    caption={
                      item.priceDelta === 0
                        ? "Included"
                        : `${
                            item.priceDelta > 0
                              ? "+"
                              : "−"
                          }${formatPeso(
                            Math.abs(
                              item.priceDelta
                            )
                          )}`
                    }
                    onClick={() =>
                      setSize(item.id)
                    }
                  />
                ))}
              </div>
            </fieldset>
          )}

          {temperatures.length > 1 && (
            <fieldset className="cj2-fieldset">
              <legend>
                <span>02</span>
                How do you take it?
              </legend>

              <div className="cj2-choices">
                {temperatures.map((id) => (
                  <Choice
                    key={id}
                    selected={
                      temperature === id
                    }
                    title={
                      id === "iced"
                        ? "Iced"
                        : id === "hot"
                          ? "Hot"
                          : id
                    }
                    icon={
                      id === "iced"
                        ? Snowflake
                        : ThermometerSun
                    }
                    onClick={() =>
                      setTemperature(id)
                    }
                  />
                ))}
              </div>
            </fieldset>
          )}

          {profile.milks.length > 0 && (
            <fieldset className="cj2-fieldset">
              <legend>
                <span>03</span>
                Choose your milk
              </legend>

              <div className="cj2-choices cj2-choices--four">
                {MILK_OPTIONS.filter(
                  (item) =>
                    profile.milks.includes(
                      item.id
                    )
                ).map((item) => (
                  <Choice
                    key={item.id}
                    selected={milk === item.id}
                    title={item.name}
                    caption={
                      item.priceDelta
                        ? `+${formatPeso(
                            item.priceDelta
                          )}`
                        : "Included"
                    }
                    onClick={() =>
                      setMilk(item.id)
                    }
                  />
                ))}
              </div>
            </fieldset>
          )}

          {profile.sweetness && (
            <fieldset className="cj2-fieldset">
              <legend>
                <span>04</span>
                How sweet?
              </legend>

              <div className="cj2-choices cj2-choices--four">
                {SWEETNESS_OPTIONS.map(
                  (item) => (
                    <Choice
                      key={item.id}
                      selected={
                        sweetness === item.id
                      }
                      title={item.name}
                      onClick={() =>
                        setSweetness(item.id)
                      }
                    />
                  )
                )}
              </div>
            </fieldset>
          )}

          {profile.extras.length > 0 && (
            <fieldset className="cj2-fieldset">
              <legend>
                <span>05</span>
                The finishing touch
                <small>
                  Optional · max 5
                </small>
              </legend>

              <div className="cj2-choices cj2-choices--two">
                {DRINK_EXTRAS.filter(
                  (item) =>
                    profile.extras.includes(
                      item.id
                    )
                ).map((item) => (
                  <Choice
                    key={item.id}
                    selected={extras.includes(
                      item.id
                    )}
                    title={item.name}
                    icon={
                      extras.includes(item.id)
                        ? Check
                        : Plus
                    }
                    caption={`+${formatPeso(
                      item.price
                    )}`}
                    onClick={() =>
                      toggleExtra(item.id)
                    }
                  />
                ))}
              </div>
            </fieldset>
          )}

          {!isDrink && (
            <div className="cj2-customizer-hint">
              <Coffee size={17} />
              Prepared as listed. Just choose
              your quantity below.
            </div>
          )}

          {(error || preview.error) && (
            <p
              className="cj2-inline-error"
              role="alert"
            >
              {error || preview.error}
            </p>
          )}

          <div className="cj2-customizer-bottom">
            <div
              className="cj2-stepper"
              aria-label="Item quantity"
            >
              <button
                type="button"
                onClick={() =>
                  setQuantity((n) =>
                    Math.max(1, n - 1)
                  )
                }
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                <Minus size={17} />
              </button>

              <span aria-live="polite">
                {quantity}
              </span>

              <button
                type="button"
                onClick={() =>
                  setQuantity((n) =>
                    Math.min(30, n + 1)
                  )
                }
                disabled={quantity >= 30}
                aria-label="Increase quantity"
              >
                <Plus size={17} />
              </button>
            </div>

            <button
              type="button"
              className="cj2-add-bag"
              disabled={!preview.quote}
              onClick={addToCart}
            >
              <ShoppingBag size={18} />

              ADD TO BASKET

              <strong>
                {formatPeso(
                  preview.quote?.lineTotal || 0
                )}
              </strong>

              <ArrowRight size={17} />
            </button>
          </div>

          <p className="cj2-customizer-demo">
            <Sparkles size={13} />
            Illustrative prices. Adds items
            to the local demo basket only.
          </p>
        </div>
      </section>
    </div>,
    document.body
  );
}