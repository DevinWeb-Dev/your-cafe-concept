import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  Clock3,
  Coffee,
  Info,
  Search,
  Sparkles,
  Users,
} from "lucide-react";

import {
  PHOTOS,
  POLICIES,
  SEATING_ZONES,
} from "../../data/config.js";

import {
  isTableFreeForPeriod,
} from "../../engine/cafeEngine.js";

import {
  useCafe,
} from "../../context/CafeContext.jsx";

import CoffeeSeatingPlan from "../../components/CoffeeSeatingPlan.jsx";
import "../../styles/coffee-experience.css";

function defaultDateTime() {
  const date = new Date();

  date.setDate(date.getDate() + 1);
  date.setHours(14, 0, 0, 0);

  const pad = (n) =>
    String(n).padStart(2, "0");

  return `${date.getFullYear()}-${pad(
    date.getMonth() + 1
  )}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

export default function AvailabilityPage() {
  const {
    state,
    tables,
    now,
  } = useCafe();

  const [mode, setMode] = useState("now");
  const [zone, setZone] = useState("all");
  const [party, setParty] = useState(2);

  const [dateTime, setDateTime] =
    useState(defaultDateTime);

  const [duration, setDuration] =
    useState(
      POLICIES.reservationDurationMinutes
    );

  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] =
    useState("");

  const startAt = new Date(dateTime).getTime();
  const endAt = startAt + duration * 60000;

  const validFuture =
    Number.isFinite(startAt) &&
    startAt >=
      now +
        POLICIES.minimumReservationNoticeMinutes *
          60000 &&
    startAt <=
      now +
        POLICIES.maximumAdvanceBookingDays *
          86400000;

  const rows = useMemo(
    () =>
      tables
        .filter(
          (table) =>
            (zone === "all" ||
              table.zoneId === zone) &&
            table.id
              .toLowerCase()
              .includes(
                query.trim().toLowerCase()
              )
        )
        .map((table) => {
          const fits =
            table.capacity >= party;

          const free =
            mode === "now"
              ? table.status === "available"
              : validFuture &&
                isTableFreeForPeriod(
                  state,
                  table.id,
                  startAt,
                  endAt,
                  now
                );

          return {
            ...table,
            bookable: fits && free,

            reason: !fits
              ? "Insufficient seating capacity"
              : mode === "future" &&
                  !validFuture
                ? "Select a valid future date"
                : free
                  ? "Selectable in demo"
                  : "Unavailable in demo",
          };
        }),
    [
      tables,
      zone,
      party,
      query,
      mode,
      validFuture,
      state,
      startAt,
      endAt,
      now,
    ]
  );

  const availableCount = rows.filter(
    (table) => table.bookable
  ).length;

  const chosen = rows.find(
    (table) =>
      table.id === selectedId &&
      table.bookable
  );

  const reserveUrl = chosen && mode === "future"
    ? `/reserve?datetime=${encodeURIComponent(
        dateTime
      )}&party=${party}&zone=${encodeURIComponent(
        zone
      )}&duration=${duration}&table=${encodeURIComponent(
        chosen.id
      )}`
    : "/reserve";

  function update(setter, value) {
    setter(value);
    setSelectedId("");
  }

  return (
    <div className="cj3-page">
      <section className="cj3-hero cj3-hero--availability">
        <div className="cj3-hero-copy">
          <span className="cj3-kicker cj3-kicker--light">
            YOUR CAFÉ / THE SEATING INDEX
          </span>

          <h1>
            Make yourself
            <br />
            <em>comfortable.</em>
          </h1>

          <p>
            A front-row espresso seat, a quiet
            window corner, or a garden table.
            Explore where your next coffee
            moment could begin.
          </p>

          <a
            href="#cj3-availability-editor"
            className="cj3-hero-link"
          >
            EXPLORE THE FLOOR
            <ArrowRight size={18} />
          </a>

          <span className="cj3-hero-foot">
            THE COFFEE JOURNAL / CHAPTER 04
          </span>
        </div>

        <div className="cj3-hero-photo">
          <img
            src={PHOTOS.cafeInterior}
            alt="Illustrative specialty café interior"
            fetchPriority="high"
          />

          <span>
            THERE IS ALWAYS ROOM
            FOR A GOOD MOMENT.
          </span>
        </div>
      </section>

      <section
        className="cj3-availability-content"
        id="cj3-availability-editor"
      >
        <div className="cj3-wide">
          <div className="cj3-section-heading">
            <div>
              <span className="cj3-kicker">
                01 / THE SEATING INDEX
              </span>

              <h2>
                Find your <em>kind of space.</em>
              </h2>
            </div>

            <div className="cj3-availability-metric">
              <strong>
                {String(
                  availableCount
                ).padStart(2, "0")}
              </strong>

              <span>
                {mode === "now"
                  ? "FREE IN CURRENT DEMO"
                  : "FREE FOR SELECTED SLOT"}
              </span>
            </div>
          </div>

          <div
            className="cj3-mode-tabs"
            role="group"
            aria-label="Availability view"
          >
            <button
              type="button"
              aria-pressed={mode === "now"}
              className={
                mode === "now"
                  ? "is-active"
                  : ""
              }
              onClick={() =>
                update(setMode, "now")
              }
            >
              <Clock3 size={17} />

              CURRENT DEMO STATUS
            </button>

            <button
              type="button"
              aria-pressed={mode === "future"}
              className={
                mode === "future"
                  ? "is-active"
                  : ""
              }
              onClick={() =>
                update(setMode, "future")
              }
            >
              <CalendarClock size={17} />

              EXPLORE A FUTURE SLOT
            </button>
          </div>

          <div className="cj3-availability-filters">
            <label className="cj3-field">
              <span>SEATING AREA</span>

              <select
                value={zone}
                onChange={(event) =>
                  update(
                    setZone,
                    event.target.value
                  )
                }
              >
                <option value="all">
                  All seating areas
                </option>

                {SEATING_ZONES.map(
                  (item) => (
                    <option
                      key={item.id}
                      value={item.id}
                    >
                      {item.name}
                    </option>
                  )
                )}
              </select>
            </label>

            <label className="cj3-field">
              <span>PARTY SIZE</span>

              <select
                value={party}
                onChange={(event) =>
                  update(
                    setParty,
                    Number(
                      event.target.value
                    )
                  )
                }
              >
                {Array.from(
                  {
                    length:
                      POLICIES.maximumPartySize,
                  },
                  (_, index) => index + 1
                ).map((value) => (
                  <option
                    key={value}
                    value={value}
                  >
                    {value}{" "}
                    {value === 1
                      ? "guest"
                      : "guests"}
                  </option>
                ))}
              </select>
            </label>

            <label className="cj3-field">
              <span>SEARCH TABLE ID</span>

              <div className="cj3-search-field">
                <Search size={17} />

                <input
                  value={query}
                  onChange={(event) =>
                    update(
                      setQuery,
                      event.target.value
                    )
                  }
                  placeholder="e.g. T-001"
                />
              </div>
            </label>

            {mode === "future" && (
              <>
                <label className="cj3-field">
                  <span>
                    PREFERRED DATE & TIME
                  </span>

                  <input
                    type="datetime-local"
                    value={dateTime}
                    onChange={(event) =>
                      update(
                        setDateTime,
                        event.target.value
                      )
                    }
                  />
                </label>

                <label className="cj3-field">
                  <span>
                    DURATION
                  </span>

                  <select
                    value={duration}
                    onChange={(event) =>
                      update(
                        setDuration,
                        Number(
                          event.target.value
                        )
                      )
                    }
                  >
                    {[60, 90, 120, 180].map(
                      (value) => (
                        <option
                          key={value}
                          value={value}
                        >
                          {value} minutes
                        </option>
                      )
                    )}
                  </select>
                </label>
              </>
            )}
          </div>

          <div className="cj3-availability-note">
            <Info size={18} />

            <p>
              {mode === "now"
                ? "Current mode reflects simulated table occupancy and cleaning status in this browser. It does not check a real café."
                : validFuture
                  ? "Future mode checks local reservation conflicts and seating rules. A free table is not a confirmed real-world booking."
                  : "Choose a future date within the demonstration booking window to see selectable seats."}
            </p>
          </div>

          <CoffeeSeatingPlan
            rows={rows}
            selectedId={selectedId}
            onSelect={setSelectedId}
            heading="The seating journal."
            description={
              mode === "now"
                ? "Green-marked seating choices are free in the current local demonstration."
                : "Select a suitable table for the future time you are exploring."
            }
          />

          <div className="cj3-selected-table">
            <div>
              <span>
                YOUR SELECTED TABLE
              </span>

              <h3>
                {chosen
                  ? chosen.id
                  : "Your next favorite spot."}
              </h3>

              <p>
                {chosen
                  ? `${chosen.capacity} seats · ${
                      SEATING_ZONES.find(
                        (item) =>
                          item.id ===
                          chosen.zoneId
                      )?.name
                    }`
                  : "Select a suitable seat on the floor plan to explore its details."}
              </p>

              <small>
                NO LIVE RESERVATION IS BEING MADE
              </small>
            </div>

            <Link
              to={reserveUrl}
              className="cj3-primary-button"
            >
              {chosen && mode === "future"
                ? "CONTINUE WITH THIS TABLE"
                : "PLAN A FUTURE VISIT"}

              <ArrowUpRight size={19} />
            </Link>
          </div>
        </div>
      </section>

      <section className="cj3-availability-story">
        <div>
          <span className="cj3-kicker">
            02 / A LITTLE MORE ROOM
          </span>

          <h2>
            Every corner
            <br />
            <em>has its charm.</em>
          </h2>

          <p>
            Sunlit tables, a bustling coffee
            bar, quiet seating, and garden
            air. Our five illustrative areas
            make it easy to imagine
            different coffee moments.
          </p>

          <Link to="/reserve">
            SAVE A DEMO SEAT
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="cj3-availability-story-photo">
          <img
            src={PHOTOS.interior}
            alt="Illustrative café seating area"
            loading="lazy"
          />

          <span>
            YOUR SPACE / YOUR MOMENT
          </span>
        </div>
      </section>
    </div>
  );
}