// YOUR CAFÉ — SIGNATURE UPGRADE BATCH 01
// The Coffee Journal homepage.
// Uses existing menu data and DrinkCustomizer.

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Armchair,
  BookOpen,
  Coffee,
  Heart,
  Leaf,
  Plus,
  Sparkles,
  Sun,
  MoveUpRight,
} from "lucide-react";

import {
  BRAND,
  MENU_CATEGORIES,
  MENU_ITEMS,
  PHOTOS,
  SEATING_ZONES,
  formatPeso,
} from "../../data/config.js";

import { useCafe } from "../../context/CafeContext.jsx";
import DrinkCustomizer from "../../components/DrinkCustomizer.jsx";

const issueTags = [
  "THE DAILY RITUAL",
  "SLOW MORNINGS",
  "POURED WITH PURPOSE",
];

function JournalEyebrow({
  children,
  light = false,
}) {
  return (
    <span
      className={`cj-kicker ${
        light ? "cj-kicker--light" : ""
      }`}
    >
      <i aria-hidden="true">✳</i>
      {children}
    </span>
  );
}

function MenuFeature({
  product,
  index,
  onCustomize,
}) {
  const category = MENU_CATEGORIES.find(
    (item) => item.id === product.categoryId
  );

  return (
    <article
      className={`cj-menu-card ${
        index === 0
          ? "cj-menu-card--feature"
          : ""
      }`}
    >
      <div className="cj-menu-image">
        <img
          src={product.image}
          alt={`Illustrative ${product.name}`}
          loading="lazy"
          decoding="async"
        />

        <span className="cj-menu-count">
          {String(index + 1).padStart(2, "0")}
          {" "} / THE SELECTION
        </span>

        {product.signature && (
          <span className="cj-menu-signature">
            HOUSE FAVORITE
          </span>
        )}
      </div>

      <div className="cj-menu-info">
        <span className="cj-menu-category">
          {category?.name || "FROM THE CAFÉ"}
        </span>

        <div className="cj-menu-name-row">
          <h3>{product.name}</h3>

          <strong>
            {formatPeso(product.price)}
          </strong>
        </div>

        <p>{product.description}</p>

        <button
          type="button"
          onClick={() => onCustomize(product)}
        >
          CUSTOMIZE THIS ORDER

          <span>
            <Plus size={18} />
          </span>
        </button>
      </div>
    </article>
  );
}

export default function HomePage() {
  const { stats } = useCafe();

  const [activeCategory, setActiveCategory] =
    useState("all");

  const [customProduct, setCustomProduct] =
    useState(null);

  const featured = useMemo(
    () =>
      MENU_ITEMS.filter(
        (item) =>
          item.available && item.featured
      ).slice(0, 10),
    []
  );

  const categories = useMemo(
    () => [
      { id: "all", name: "All picks" },

      ...MENU_CATEGORIES.filter(
        (category) =>
          category.id !== "all" &&
          featured.some(
            (item) =>
              item.categoryId === category.id
          )
      ),
    ],
    [featured]
  );

  const visible = featured
    .filter(
      (item) =>
        activeCategory === "all" ||
        item.categoryId === activeCategory
    )
    .slice(0, 4);

  return (
    <div className="cj-home">
      {/* HERO / COFFEE JOURNAL COVER */}

      <section
        className="cj-hero"
        aria-labelledby="cj-hero-title"
      >
        <div className="cj-hero-topnote">
          <span>
            AN EVERYDAY COFFEE JOURNAL
          </span>

          <span>
            FRESHLY BREWED / VOL. 001
          </span>
        </div>

        <div className="cj-hero-grid">
          <div className="cj-hero-copy">
            <JournalEyebrow>
              THE HOUSE EDIT / YOUR CAFÉ.
            </JournalEyebrow>

            <h1 id="cj-hero-title">
              Life happens.
              <br />
              <em>Coffee helps.</em>
            </h1>

            <p>
              For conversations that run long,
              mornings that start slow, and cups
              you wish would never end.
              Your little pause, beautifully brewed.
            </p>

            <div className="cj-hero-ctas">
              <Link
                className="cj-cta cj-cta--dark"
                to="/menu"
              >
                EXPLORE THE MENU
                <ArrowUpRight size={18} />
              </Link>

              <Link
                className="cj-cta cj-cta--outline"
                to="/reserve"
              >
                FIND YOUR TABLE
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="cj-hero-footnote">
              <span className="cj-footnote-line" />

              A CAFÉ FOR ALL THE IN-BETWEEN MOMENTS
            </div>
          </div>

          <div className="cj-hero-stage">
            <div
              className="cj-hero-oval"
              aria-hidden="true"
            />

            <div className="cj-hero-photo">
              <img
                src={PHOTOS.coffee}
                alt="Fresh coffee served in a cup"
                fetchPriority="high"
                decoding="async"
              />
            </div>

            <div className="cj-hero-inset">
              <img
                src={PHOTOS.interior}
                alt="Illustrative café interior"
                decoding="async"
              />
            </div>

            <div
              className="cj-hero-seal"
              aria-label="Coffee served with care"
            >
              <Coffee size={22} />

              <span>
                BREWED
                <br />
                WITH CARE
              </span>
            </div>

            <span className="cj-stage-index">
              FIG. 01 — THE DAILY RITUAL
            </span>

            <span
              className="cj-stage-scribble"
              aria-hidden="true"
            >
              a little
              <br />
              pause.
            </span>
          </div>
        </div>

        <div className="cj-hero-bottom">
          <span>
            SCROLL TO DISCOVER
            <ArrowDownRight size={15} />
          </span>

          <span>
            EST. IN POSSIBILITY · PHILIPPINES
          </span>
        </div>
      </section>

      {/* THE DAILY RITUAL STRIP */}

      <div
        className="cj-ticker"
        aria-label="Coffee house values"
      >
        <div className="cj-ticker-inner">
          {issueTags.map((tag) => (
            <span key={tag}>
              {tag}
              <i aria-hidden="true">✳</i>
            </span>
          ))}

          <span>
            GOOD COMPANY, ALWAYS
            <i aria-hidden="true">✳</i>
          </span>
        </div>
      </div>

      {/* FEATURED MENU / FUNCTIONAL FILTERS */}

      <section
        className="cj-menu-section"
        aria-labelledby="cj-menu-heading"
      >
        <div className="cj-container">
          <div className="cj-section-top">
            <div>
              <JournalEyebrow>
                01 / THE EDITOR'S PICKS
              </JournalEyebrow>

              <h2 id="cj-menu-heading">
                A good day
                <br />
                starts <em>here.</em>
              </h2>
            </div>

            <div className="cj-section-aside">
              <p>
                A few favorites, thoughtfully
                poured. Explore our illustrative
                menu and make your next cup
                your own.
              </p>

              <Link
                to="/menu"
                className="cj-text-link"
              >
                SEE THE COMPLETE MENU
                <ArrowUpRight size={17} />
              </Link>
            </div>
          </div>

          <div
            className="cj-filter-row"
            role="group"
            aria-label="Featured menu categories"
          >
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() =>
                  setActiveCategory(category.id)
                }
                className={
                  activeCategory === category.id
                    ? "is-active"
                    : ""
                }
                aria-pressed={
                  activeCategory === category.id
                }
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="cj-menu-grid">
            {visible.map((product, index) => (
              <MenuFeature
                key={product.id}
                index={index}
                product={product}
                onCustomize={setCustomProduct}
              />
            ))}
          </div>

          <div className="cj-menu-bottom">
            <span>
              PRICES IN PHP / SAMPLE MENU,
              PHOTOGRAPHY & DETAILS
            </span>

            <Link to="/menu">
              THE ENTIRE COFFEE EDITION
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* EDITORIAL CAFÉ STORY */}

      <section
        className="cj-journal"
        aria-labelledby="cj-journal-heading"
      >
        <div className="cj-journal-photo">
          <img
            src={PHOTOS.cafeInterior}
            alt="Illustrative café interior with welcoming seating"
            loading="lazy"
          />

          <span>
            PLATE 02 — A PLACE TO STAY A WHILE
          </span>
        </div>

        <div className="cj-journal-body">
          <JournalEyebrow>
            02 / THE SPACE BETWEEN SIPS
          </JournalEyebrow>

          <h2 id="cj-journal-heading">
            Somewhere
            <br />
            to <em>slow down.</em>
          </h2>

          <p>
            A seat by the window. A familiar
            face across the table. A cup
            that makes an ordinary afternoon
            feel like something worth remembering.
          </p>

          <p>
            Find the spot that feels like yours,
            with our interactive café table
            and reservation demo.
          </p>

          <div className="cj-journal-stats">
            <span>
              <Armchair size={21} />

              <strong>
                {stats?.totalTables ?? "—"}
              </strong>

              <small>
                DEMO SEATING UNITS
              </small>
            </span>

            <span>
              <Sun size={21} />

              <strong>
                {SEATING_ZONES.length}
              </strong>

              <small>
                SEATING ZONES
              </small>
            </span>
          </div>

          <Link
            to="/reserve"
            className="cj-cta cj-cta--dark"
          >
            FIND A TABLE
            <ArrowUpRight size={19} />
          </Link>

          <span className="cj-journal-side-label">
            NOTES FROM OUR LITTLE CORNER
            OF THE WORLD
          </span>
        </div>
      </section>

      {/* THE CRAFT / IMMERSIVE COFFEE STORY */}

      <section
        className="cj-craft"
        aria-labelledby="cj-craft-heading"
      >
        <div className="cj-container cj-craft-grid">
          <div className="cj-craft-copy">
            <JournalEyebrow light>
              03 / FROM BEAN TO BEAUTIFUL
            </JournalEyebrow>

            <h2 id="cj-craft-heading">
              Never just
              <br />
              <em>coffee.</em>
            </h2>

            <p>
              It's the aroma before the first
              sip. The care behind each pour.
              The conversation that begins with,
              “What are you having?”
            </p>

            <Link
              to="/story"
              className="cj-craft-link"
            >
              READ OUR STORY
              <ArrowUpRight size={18} />
            </Link>

            <div className="cj-craft-values">
              <span>
                <Leaf size={18} />
                Thoughtfully prepared
              </span>

              <span>
                <Heart size={18} />
                Warmly shared
              </span>

              <span>
                <Sparkles size={18} />
                Made for everyday joy
              </span>
            </div>
          </div>

          <div className="cj-craft-visual">
            <div className="cj-craft-main">
              <img
                src={PHOTOS.coffeeCraft}
                loading="lazy"
                alt="Illustrative coffee craft setup"
              />
            </div>

            <div className="cj-craft-detail">
              <img
                src={PHOTOS.beans}
                loading="lazy"
                alt="Roasted coffee beans"
              />
            </div>

            <div className="cj-craft-stamp">
              <BookOpen size={20} />

              <span>
                AN OPEN
                <br />
                COFFEE JOURNAL
              </span>
            </div>

            <span className="cj-craft-plate">
              THE PROCESS / THE PLEASURE /
              THE PAUSE
            </span>
          </div>
        </div>
      </section>

      {/* FOUR FEATURE JOURNEYS */}

      <section
        className="cj-chapters"
        aria-labelledby="cj-chapters-heading"
      >
        <div className="cj-container">
          <div className="cj-section-top cj-chapters-top">
            <div>
              <JournalEyebrow>
                04 / MORE STORIES TO LIVE
              </JournalEyebrow>

              <h2 id="cj-chapters-heading">
                Choose your
                <br />
                <em>next chapter.</em>
              </h2>
            </div>

            <p>
              There is more to a café than a cup.
              Find your own way to stay, discover
              and connect.
            </p>
          </div>

          <div className="cj-chapter-list">
            {[
              {
                number: "01",
                title: "Make it yours.",
                description:
                  "Browse, customize and build a demo order.",
                to: "/menu",
                image: PHOTOS.latte,
                label: "MENU & ORDER",
              },
              {
                number: "02",
                title: "Take your seat.",
                description:
                  "Choose a spot and try a table reservation.",
                to: "/reserve",
                image: PHOTOS.interior,
                label: "SEAT & STAY",
              },
              {
                number: "03",
                title: "Take some home.",
                description:
                  "Discover coffee beans and thoughtful gifts.",
                to: "/coffee-beans",
                image: PHOTOS.beans,
                label: "THE RETAIL EDIT",
              },
              {
                number: "04",
                title: "Be part of it.",
                description:
                  "Discover our rewards and community experience.",
                to: "/membership",
                image: PHOTOS.cafeInterior,
                label: "OUR COMMUNITY",
              },
            ].map((card) => (
              <Link
                to={card.to}
                key={card.number}
                className="cj-chapter"
              >
                <span className="cj-chapter-number">
                  {card.number}
                </span>

                <div className="cj-chapter-image">
                  <img
                    src={card.image}
                    loading="lazy"
                    alt=""
                  />
                </div>

                <div className="cj-chapter-copy">
                  <small>{card.label}</small>

                  <h3>{card.title}</h3>

                  <p>{card.description}</p>
                </div>

                <MoveUpRight
                  size={27}
                  className="cj-chapter-arrow"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL EDITORIAL INVITATION */}

      <section className="cj-last-word">
        <div className="cj-last-word-top">
          <span>
            AN OPEN INVITATION
          </span>

          <span>
            YOUR CAFÉ. / CHAPTER 01
          </span>
        </div>

        <span
          className="cj-last-symbol"
          aria-hidden="true"
        >
          ✳
        </span>

        <h2>
          One more cup?
          <br />
          <em>Always.</em>
        </h2>

        <p>
          Everyday moments, beautifully brewed.
          See you around the table.
        </p>

        <Link to="/menu">
          LET'S GET COFFEE
          <ArrowUpRight size={19} />
        </Link>

        <div className="cj-last-word-bottom">
          <span>
            THE ART OF EVERYDAY COFFEE
          </span>

          <span>
            {BRAND.tagline}
          </span>
        </div>
      </section>

      {/* ORIGINAL DRINK CUSTOMIZER */}

      <DrinkCustomizer
        product={customProduct}
        open={Boolean(customProduct)}
        onClose={() =>
          setCustomProduct(null)
        }
      />
    </div>
  );
}