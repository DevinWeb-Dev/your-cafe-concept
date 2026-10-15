import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowRight,
  ArrowUpRight,
  Coffee,
  Heart,
  Plus,
  RotateCcw,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";

import {
  MENU_CATEGORIES,
  MENU_ITEMS,
  PHOTOS,
  formatPeso,
} from "../../data/config.js";

import { useCafe } from "../../context/CafeContext.jsx";
import DrinkCustomizer from "../../components/DrinkCustomizer.jsx";
import "../../styles/coffee-ordering.css";

const FAVORITES_KEY = "your-cafe-favorite-products-v1";

const SORTS = [
  ["editorial", "Journal selection"],
  ["low", "Price: low to high"],
  ["high", "Price: high to low"],
  ["az", "Name: A to Z"],
];

function loadFavorites() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(FAVORITES_KEY) || "[]"
    );

    return Array.isArray(saved)
      ? saved.filter((id) => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

export default function MenuPage() {
  const { cartCount } = useCafe();

  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("editorial");
  const [limit, setLimit] = useState("all");

  const [signaturesOnly, setSignaturesOnly] =
    useState(false);

  const [favoritesOnly, setFavoritesOnly] =
    useState(false);

  const [favorites, setFavorites] =
    useState(loadFavorites);

  const [
    productToCustomize,
    setProductToCustomize,
  ] = useState(null);

  const available = useMemo(
    () => MENU_ITEMS.filter((item) => item.available),
    []
  );

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();

    const items = available.filter(
      (item) =>
        (category === "all" ||
          item.categoryId === category) &&
        (!term ||
          `${item.name} ${item.description} ${item.categoryId}`
            .toLowerCase()
            .includes(term)) &&
        (limit === "all" ||
          item.price <= Number(limit)) &&
        (!signaturesOnly || item.signature) &&
        (!favoritesOnly ||
          favorites.includes(item.id))
    );

    return items.sort((a, b) => {
      if (sort === "low") return a.price - b.price;
      if (sort === "high") return b.price - a.price;
      if (sort === "az") {
        return a.name.localeCompare(b.name);
      }

      return (
        Number(Boolean(b.featured)) -
        Number(Boolean(a.featured))
      );
    });
  }, [
    available,
    category,
    search,
    sort,
    limit,
    signaturesOnly,
    favoritesOnly,
    favorites,
  ]);

  const selectedCategory = MENU_CATEGORIES.find(
    (item) => item.id === category
  );

  const isFiltered =
    category !== "all" ||
    !!search ||
    limit !== "all" ||
    signaturesOnly ||
    favoritesOnly;

  function reset() {
    setCategory("all");
    setSearch("");
    setLimit("all");
    setSort("editorial");
    setSignaturesOnly(false);
    setFavoritesOnly(false);
  }

  function toggleFavorite(id) {
    setFavorites((current) => {
      const next = current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id];

      try {
        localStorage.setItem(
          FAVORITES_KEY,
          JSON.stringify(next)
        );
      } catch {
        // Browser storage is optional.
      }

      return next;
    });
  }

  return (
    <div className="cj2-menu">
      <section className="cj2-menu-hero">
        <div className="cj2-menu-cover-copy">
          <span className="cj2-overline cj2-overline--light">
            YOUR CAFÉ. / THE MENU ISSUE — 02
          </span>

          <h1>
            The good
            <br />
            stuff, <em>poured.</em>
          </h1>

          <p>
            Thoughtful drinks. Comforting bites.
            Tiny rituals that deserve a little
            more attention.
          </p>

          <a
            className="cj2-hero-explore"
            href="#cj2-catalog"
          >
            OPEN THE MENU
            <ArrowRight size={18} />
          </a>

          <span className="cj2-menu-hero-number">
            THE DAILY EDIT / VOL. 001
          </span>
        </div>

        <div className="cj2-menu-cover-photo">
          <img
            src={PHOTOS.coffeeCraft}
            alt="Coffee pouring and café craft, illustrative photography"
            fetchPriority="high"
          />

          <span className="cj2-cover-stamp">
            GOOD
            <br />
            THINGS
            <br />
            BREWING ✳
          </span>

          <span className="cj2-cover-caption">
            FIG. 02 / COFFEE, IN ITS OWN TIME
          </span>
        </div>
      </section>

      <section
        className="cj2-catalog"
        id="cj2-catalog"
      >
        <div className="cj2-wide">
          <div className="cj2-catalog-head">
            <div>
              <span className="cj2-overline">
                01 / THE OPEN MENU
              </span>

              <h2>
                Something for
                <br />
                <em>every mood.</em>
              </h2>
            </div>

            <div className="cj2-catalog-note">
              <p>
                Curated from our demo coffee bar
                and kitchen. Customize a favorite,
                save it for later, or build a
                little basket.
              </p>

              <Link
                to="/cart"
                className="cj2-text-arrow"
              >
                <ShoppingBag size={17} />
                YOUR BASKET ({cartCount})
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>

          <div
            className="cj2-categories"
            role="group"
            aria-label="Menu categories"
          >
            {MENU_CATEGORIES.map((item) => (
              <button
                key={item.id}
                type="button"
                className={
                  category === item.id
                    ? "is-active"
                    : ""
                }
                aria-pressed={category === item.id}
                onClick={() =>
                  setCategory(item.id)
                }
              >
                {item.name}

                <sup>
                  {String(
                    item.id === "all"
                      ? available.length
                      : available.filter(
                          (p) =>
                            p.categoryId === item.id
                        ).length
                  ).padStart(2, "0")}
                </sup>
              </button>
            ))}
          </div>

          <div className="cj2-catalog-toolbar">
            <label className="cj2-search">
              <Search size={19} />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                type="search"
                placeholder="Search a drink, a flavor, a craving..."
                aria-label="Search menu"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  <X size={17} />
                </button>
              )}
            </label>

            <label className="cj2-filter-select">
              <SlidersHorizontal size={16} />

              <span>Sort</span>

              <select
                value={sort}
                onChange={(e) =>
                  setSort(e.target.value)
                }
                aria-label="Sort menu"
              >
                {SORTS.map(([value, label]) => (
                  <option
                    key={value}
                    value={value}
                  >
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className="cj2-filter-select">
              <span>Budget</span>

              <select
                value={limit}
                onChange={(e) =>
                  setLimit(e.target.value)
                }
                aria-label="Maximum base price"
              >
                <option value="all">
                  Any price
                </option>

                <option value="150">
                  Up to ₱150
                </option>

                <option value="200">
                  Up to ₱200
                </option>

                <option value="250">
                  Up to ₱250
                </option>

                <option value="350">
                  Up to ₱350
                </option>
              </select>
            </label>
          </div>

          <div className="cj2-menu-controls">
            <div className="cj2-chip-row">
              <button
                type="button"
                className={
                  signaturesOnly ? "active" : ""
                }
                aria-pressed={signaturesOnly}
                onClick={() =>
                  setSignaturesOnly((v) => !v)
                }
              >
                <Sparkles size={15} />
                Signature picks
              </button>

              <button
                type="button"
                className={
                  favoritesOnly ? "active" : ""
                }
                aria-pressed={favoritesOnly}
                onClick={() =>
                  setFavoritesOnly((v) => !v)
                }
              >
                <Heart size={15} />
                Saved ({favorites.length})
              </button>

              {isFiltered && (
                <button
                  type="button"
                  className="cj2-reset"
                  onClick={reset}
                >
                  <RotateCcw size={14} />
                  Reset filters
                </button>
              )}
            </div>

            <span
              className="cj2-result-count"
              aria-live="polite"
            >
              {filtered.length} OF {available.length} /
              {" "}
              {selectedCategory?.name.toUpperCase()}
            </span>
          </div>

          {filtered.length > 0 ? (
            <div className="cj2-products">
              {filtered.map((product, index) => {
                const isSaved = favorites.includes(
                  product.id
                );

                const cat = MENU_CATEGORIES.find(
                  (item) =>
                    item.id === product.categoryId
                );

                return (
                  <article
                    className={`cj2-product ${
                      index === 0 &&
                      category === "all" &&
                      !isFiltered
                        ? "cj2-product--lead"
                        : ""
                    }`}
                    key={product.id}
                  >
                    <div className="cj2-product-media">
                      <img
                        src={product.image}
                        alt={`Illustrative ${product.name}`}
                        loading="lazy"
                        decoding="async"
                      />

                      <span className="cj2-product-num">
                        THE EDIT /{" "}
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      {product.signature && (
                        <span className="cj2-product-tag">
                          HOUSE FAVORITE
                        </span>
                      )}

                      <button
                        type="button"
                        className={`cj2-heart ${
                          isSaved ? "is-saved" : ""
                        }`}
                        aria-label={`${
                          isSaved ? "Remove" : "Save"
                        } ${product.name} ${
                          isSaved ? "from" : "to"
                        } favorites`}
                        aria-pressed={isSaved}
                        onClick={() =>
                          toggleFavorite(product.id)
                        }
                      >
                        <Heart
                          size={18}
                          fill={
                            isSaved
                              ? "currentColor"
                              : "none"
                          }
                        />
                      </button>
                    </div>

                    <div className="cj2-product-body">
                      <span className="cj2-product-category">
                        {cat?.name ||
                          "CAFÉ FAVORITE"}
                      </span>

                      <h3>{product.name}</h3>
                      <p>{product.description}</p>

                      <div className="cj2-product-foot">
                        <span>
                          <small>STARTING AT</small>

                          <strong>
                            {formatPeso(product.price)}
                          </strong>
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            setProductToCustomize(product)
                          }
                        >
                          MAKE IT YOURS
                          <Plus size={18} />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="cj2-menu-empty">
              <Coffee
                size={39}
                strokeWidth={1.3}
              />

              <h3>
                No match for{" "}
                <em>that craving.</em>
              </h3>

              <p>
                Try another flavor, category,
                or price range.
              </p>

              <button
                type="button"
                onClick={reset}
              >
                SEE THE ENTIRE MENU
                <ArrowRight size={17} />
              </button>
            </div>
          )}

          <div className="cj2-catalog-end">
            <span>
              ILLUSTRATIVE PRODUCTS, PRICING &
              PHOTOGRAPHY / NO LIVE STOCK
            </span>

            <Link to="/cart">
              REVIEW YOUR DEMO ORDER
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="cj2-menu-closing">
        <span>
          FROM OUR JOURNAL / A FRIENDLY REMINDER
        </span>

        <h2>
          Made for your
          <br />
          <em>kind of day.</em>
        </h2>

        <p>
          All order interactions take place
          in this browser. Nothing is
          transmitted to a real café.
        </p>

        <Link to="/story">
          GET TO KNOW THE CAFÉ
          <ArrowUpRight size={18} />
        </Link>
      </section>

      <DrinkCustomizer
        product={productToCustomize}
        open={Boolean(productToCustomize)}
        onClose={() =>
          setProductToCustomize(null)
        }
      />
    </div>
  );
}