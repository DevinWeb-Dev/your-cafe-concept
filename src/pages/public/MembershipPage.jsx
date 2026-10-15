import { useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Coffee,
  Gift,
  Heart,
  RotateCcw,
  Sparkles,
  Star,
} from "lucide-react";

import {
  BRAND,
  LOYALTY_TIERS,
  PHOTOS,
  POLICIES,
  getLoyaltyTier,
} from "../../data/config.js";

import {
  useCafe,
} from "../../context/CafeContext.jsx";

import "../../styles/coffee-experience.css";

const PROFILE_KEY =
  "your-cafe-demo-member-nickname-v1";

function loadNickname() {
  try {
    return localStorage.getItem(
      PROFILE_KEY
    ) || "";
  } catch {
    return "";
  }
}

const pointsFormat = new Intl.NumberFormat(
  "en-PH"
);

export default function MembershipPage() {
  const { getMemberPoints } = useCafe();

  const [draft, setDraft] =
    useState(loadNickname);

  const [nickname, setNickname] =
    useState(loadNickname);

  const [previewTierId, setPreviewTierId] =
    useState("");

  const [sampleSpend, setSampleSpend] =
    useState(500);

  const points = nickname.trim()
    ? getMemberPoints(
        nickname.trim()
      )
    : 0;

  const tier =
    getLoyaltyTier(points) ||
    LOYALTY_TIERS[0];

  const currentIndex =
    LOYALTY_TIERS.findIndex(
      (item) => item.id === tier.id
    );

  const next =
    LOYALTY_TIERS[currentIndex + 1] ||
    null;

  const progress = next
    ? Math.min(
        100,
        Math.max(
          0,
          ((points - tier.minPoints) /
            (next.minPoints -
              tier.minPoints)) *
            100
        )
      )
    : 100;

  const remaining = next
    ? Math.max(
        0,
        next.minPoints - points
      )
    : 0;

  const previewTier =
    LOYALTY_TIERS.find(
      (item) =>
        item.id === previewTierId
    ) || tier;

  const estimatedPoints = Math.floor(
    sampleSpend /
      POLICIES.loyaltySpendPerPoint
  );

  function saveNickname(event) {
    event.preventDefault();

    const clean = draft
      .trim()
      .slice(0, 40);

    setNickname(clean);
    setDraft(clean);

    try {
      if (clean) {
        localStorage.setItem(
          PROFILE_KEY,
          clean
        );
      } else {
        localStorage.removeItem(
          PROFILE_KEY
        );
      }
    } catch {
      // Local preview remains usable.
    }
  }

  function clearNickname() {
    setDraft("");
    setNickname("");

    try {
      localStorage.removeItem(
        PROFILE_KEY
      );
    } catch {
      // Browser storage is optional.
    }
  }

  return (
    <div className="cj3-page cj3-membership">
      <section className="cj3-member-hero">
        <div className="cj3-member-hero-photo">
          <img
            src={PHOTOS.latte}
            alt="Illustrative freshly prepared latte"
            fetchPriority="high"
          />
        </div>

        <div className="cj3-member-hero-copy">
          <span className="cj3-kicker cj3-kicker--light">
            YOUR CAFÉ / THE REWARDS JOURNAL
          </span>

          <h1>
            A little more
            <br />
            <em>to love.</em>
          </h1>

          <p>
            The first sip, the next visit,
            the everyday rituals worth
            coming back for. Explore our
            coffee loyalty experience.
          </p>

          <a
            href="#cj3-member-workspace"
            className="cj3-hero-link"
          >
            EXPLORE THE REWARDS
            <ArrowRight size={18} />
          </a>

          <span className="cj3-hero-foot">
            CHAPTER 05 / THE REWARDS EDIT
          </span>
        </div>
      </section>

      <section
        className="cj3-member-workspace"
        id="cj3-member-workspace"
      >
        <div className="cj3-wide">
          <div className="cj3-section-heading">
            <div>
              <span className="cj3-kicker">
                01 / THE REWARDS PASSPORT
              </span>

              <h2>
                Made for
                <em> regulars.</em>
              </h2>
            </div>

            <p>
              Preview a digital loyalty
              passport using the same nickname
              attached to paid demo orders
              in this browser.
            </p>
          </div>

          <div className="cj3-member-grid">
            <div className="cj3-member-console">
              <div className="cj3-console-heading">
                <span>
                  YOUR REWARDS PROFILE
                </span>

                <Coffee size={21} />
              </div>

              <h3>
                Every cup
                <br />
                <em>counts.</em>
              </h3>

              <p>
                Enter a demo nickname used on
                a paid demonstration order.
                No account registration
                or identity verification
                is involved.
              </p>

              <form
                className="cj3-member-form"
                onSubmit={saveNickname}
              >
                <label
                  htmlFor="cj3-member-nickname"
                >
                  DEMO CUSTOMER NICKNAME
                </label>

                <div>
                  <input
                    id="cj3-member-nickname"
                    value={draft}
                    maxLength={40}
                    autoComplete="off"
                    placeholder="e.g. Coffee Explorer"
                    onChange={(event) =>
                      setDraft(
                        event.target.value
                      )
                    }
                  />

                  <button type="submit">
                    PREVIEW
                    <ArrowRight size={17} />
                  </button>
                </div>
              </form>

              {nickname && (
                <button
                  type="button"
                  className="cj3-member-clear"
                  onClick={clearNickname}
                >
                  <RotateCcw size={14} />
                  CLEAR LOCAL NICKNAME
                </button>
              )}

              <div className="cj3-points-display">
                <span>
                  YOUR CURRENT DEMO POINTS
                </span>

                <strong>
                  {pointsFormat.format(points)}
                </strong>

                <small>
                  {tier.name}
                </small>
              </div>

              <div
                className="cj3-progress"
                role="progressbar"
                aria-label="Progress to next membership tier"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(
                  progress
                )}
              >
                <span
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              <div className="cj3-progress-labels">
                <span>{tier.name}</span>

                <span>
                  {next
                    ? `${pointsFormat.format(
                        remaining
                      )} points to ${next.name}`
                    : "HIGHEST DEMO TIER"}
                </span>
              </div>

              <div className="cj3-member-rule">
                <Star size={19} />

                Points are calculated from
                recorded paid demo orders,
                not from browsing or
                unsubmitted carts.
              </div>
            </div>

            <div className="cj3-member-card-stage">
              <div className="cj3-member-card-note">
                <span>
                  THE DAILY COFFEE PASSPORT
                </span>

                <span>
                  VOL. 001
                </span>
              </div>

              <div className="cj3-member-card">
                <div className="cj3-member-card-top">
                  <strong>
                    YOUR CAFÉ.
                  </strong>

                  <Coffee size={25} />
                </div>

                <div className="cj3-member-card-middle">
                  <span>
                    THE COFFEE JOURNAL /
                    MEMBER EDITION
                  </span>

                  <h3>
                    {tier.name}
                  </h3>

                  <small>
                    A LITTLE MORE TO LOVE
                  </small>
                </div>

                <div className="cj3-member-card-bottom">
                  <span>
                    {nickname.trim() ||
                      "YOUR NAME HERE"}
                  </span>

                  <span>
                    DEMO / NOT REDEEMABLE
                  </span>
                </div>

                <i className="cj3-card-orbit" />
              </div>

              <div className="cj3-member-card-caption">
                <Heart size={20} />

                <span>
                  A PERSONALIZED CARD PREVIEW
                  WITH NO REAL ACCOUNT
                  OR REDEEMABLE BALANCE.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cj3-tier-section">
        <div className="cj3-wide">
          <div className="cj3-section-heading">
            <div>
              <span className="cj3-kicker">
                02 / THE COFFEE JOURNEY
              </span>

              <h2>
                More reasons
                <br />
                <em>to come back.</em>
              </h2>
            </div>

            <p>
              Four illustrative rewards
              chapters. Choose any tier to
              explore its benefits. The
              preview won't change your
              earned demo points.
            </p>
          </div>

          <div className="cj3-tier-grid">
            {LOYALTY_TIERS.map(
              (level, index) => {
                const current =
                  level.id === tier.id;

                const previewing =
                  level.id ===
                  previewTier.id;

                return (
                  <button
                    key={level.id}
                    type="button"
                    className={`cj3-tier ${
                      current
                        ? "is-current"
                        : ""
                    } ${
                      previewing
                        ? "is-preview"
                        : ""
                    }`}
                    onClick={() =>
                      setPreviewTierId(
                        level.id
                      )
                    }
                    aria-pressed={
                      previewing
                    }
                  >
                    <span className="cj3-tier-index">
                      0{index + 1}

                      <Sparkles size={18} />
                    </span>

                    <span className="cj3-tier-threshold">
                      {pointsFormat.format(
                        level.minPoints
                      )}
                      + POINTS
                    </span>

                    <strong>
                      {level.name}
                    </strong>

                    <span className="cj3-tier-status">
                      {current
                        ? "YOUR CURRENT DEMO TIER"
                        : previewing
                          ? "CURRENTLY PREVIEWING"
                          : "VIEW BENEFITS"}
                    </span>

                    <ArrowUpRight size={21} />
                  </button>
                );
              }
            )}
          </div>

          <div className="cj3-benefits-panel">
            <div>
              <span className="cj3-kicker">
                REWARDS CHAPTER /
                BENEFITS PREVIEW
              </span>

              <h3>
                {previewTier.name}
              </h3>

              <p>
                Available concept benefits
                at this illustrative tier.
                Nothing can be redeemed
                at an actual café.
              </p>
            </div>

            <ul>
              {previewTier.benefits.map(
                (benefit) => (
                  <li key={benefit}>
                    <Check size={17} />
                    {benefit}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </section>

      <section className="cj3-points-explorer">
        <div className="cj3-points-visual">
          <img
            src={PHOTOS.coffee}
            alt="Illustrative coffee served in a cup"
            loading="lazy"
          />

          <span>
            SMALL MOMENTS / BIGGER RITUALS
          </span>
        </div>

        <div className="cj3-points-content">
          <span className="cj3-kicker">
            03 / REWARDS CALCULATOR
          </span>

          <h2>
            Count the
            <br />
            <em>little things.</em>
          </h2>

          <p>
            Try a sample spending amount to
            see how many points that order
            might earn under the existing
            demo loyalty formula.
          </p>

          <label
            className="cj3-spend-label"
            htmlFor="cj3-spend-range"
          >
            ILLUSTRATIVE ORDER VALUE

            <strong>
              ₱{pointsFormat.format(
                sampleSpend
              )}
            </strong>
          </label>

          <input
            id="cj3-spend-range"
            className="cj3-spend-range"
            type="range"
            min="100"
            max="3000"
            step="50"
            value={sampleSpend}
            onChange={(event) =>
              setSampleSpend(
                Number(
                  event.target.value
                )
              )
            }
          />

          <div className="cj3-estimated-points">
            <div>
              <strong>
                +{estimatedPoints}
              </strong>

              <span>
                ESTIMATED DEMO POINTS
              </span>
            </div>

            <Gift size={35} />
          </div>

          <small>
            1 point per ₱
            {
              POLICIES.loyaltySpendPerPoint
            } of eligible paid demo spending.
            This calculator does not add points
            to your balance.
          </small>

          <Link
            to="/menu"
            className="cj3-primary-button"
          >
            EXPLORE THE COFFEE MENU
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>

      <div className="cj3-member-disclaimer">
        <div className="cj3-wide">
          <Coffee size={20} />

          <p>
            YOUR CAFÉ. is a frontend-only
            prototype. Membership nicknames
            are not authenticated, point
            balances come from local demo
            records, and all benefits are
            illustrative and non-redeemable.
            Avoid entering real customer
            information.
          </p>
        </div>
      </div>
    </div>
  );
}