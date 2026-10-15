import { useMemo, useState } from "react";
import {
  Link,
  useSearchParams,
} from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  Clock3,
  Coffee,
  MapPin,
  Ticket,
  Users,
  X,
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

const OWN_KEY = "your-cafe-journal-reservation-ids-v1";

const pad = (number) =>
  String(number).padStart(2, "0");

function localInputValue(date) {
  return [
    date.getFullYear(),
    "-",
    pad(date.getMonth() + 1),
    "-",
    pad(date.getDate()),
    "T",
    pad(date.getHours()),
    ":",
    pad(date.getMinutes()),
  ].join("");
}

function defaultDate() {
  const date = new Date();

  date.setDate(date.getDate() + 1);
  date.setHours(14, 0, 0, 0);

  return localInputValue(date);
}

function formattedDate(timestamp) {
  return new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));
}

function readOwnIds() {
  try {
    const saved = JSON.parse(
      sessionStorage.getItem(OWN_KEY) || "[]"
    );

    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export default function ReservationsPage() {
  const [params] = useSearchParams();

  const {
    state,
    tables,
    reservations,
    actions,
    now,
  } = useCafe();

  const [dateTime, setDateTime] = useState(
    () => {
      const value = params.get("datetime");

      return value &&
        Number.isFinite(new Date(value).getTime())
        ? value
        : defaultDate();
    }
  );

  const [partySize, setPartySize] = useState(
    () => {
      const value = Number(params.get("party"));

      return Number.isInteger(value) &&
        value >= 1 &&
        value <= POLICIES.maximumPartySize
        ? value
        : 2;
    }
  );

  const [zoneId, setZoneId] = useState(
    () => {
      const value = params.get("zone") || "all";

      return value === "all" ||
        SEATING_ZONES.some(
          (zone) => zone.id === value
        )
        ? value
        : "all";
    }
  );

  const [duration, setDuration] = useState(
    () => {
      const value = Number(
        params.get("duration")
      );

      return [60, 90, 120, 180].includes(value)
        ? value
        : POLICIES.reservationDurationMinutes;
    }
  );

  const [selectedId, setSelectedId] =
    useState(
      () => params.get("table") || ""
    );

  const [nickname, setNickname] =
    useState("");

  const [result, setResult] =
    useState(null);

  const [ownIds, setOwnIds] =
    useState(readOwnIds);

  const startAt = new Date(dateTime).getTime();
  const endAt = startAt + duration * 60000;

  const validDate =
    Number.isFinite(startAt) &&
    startAt >=
      now +
        POLICIES.minimumReservationNoticeMinutes *
          60000 &&
    startAt <=
      now +
        POLICIES.maximumAdvanceBookingDays *
          86400000;

  const maxInputDate = localInputValue(
    new Date(
      now +
        POLICIES.maximumAdvanceBookingDays *
          86400000
    )
  );

  const todayInputDate = localInputValue(
    new Date(now)
  );

  const rows = useMemo(
    () =>
      tables
        .filter(
          (table) =>
            zoneId === "all" ||
            table.zoneId === zoneId
        )
        .map((table) => {
          const fits =
            table.capacity >= partySize;

          const free =
            validDate &&
            fits &&
            isTableFreeForPeriod(
              state,
              table.id,
              startAt,
              endAt,
              now
            );

          return {
            ...table,
            bookable: Boolean(free),

            reason: !fits
              ? "Insufficient seating capacity"
              : !validDate
                ? "Choose a valid date"
                : free
                  ? "Available in this demo"
                  : "Unavailable for this slot",
          };
        }),
    [
      tables,
      zoneId,
      partySize,
      validDate,
      state,
      startAt,
      endAt,
      now,
    ]
  );

  const availableCount = rows.filter(
    (table) => table.bookable
  ).length;

  const choice = rows.find(
    (table) =>
      table.id === selectedId &&
      table.bookable
  );

  const ownedReservations = reservations.filter(
    (reservation) =>
      ownIds.includes(reservation.id)
  );

  function changeField(setter, value) {
    setter(value);
    setSelectedId("");
    setResult(null);
  }

  function submit(event) {
    event.preventDefault();

    setResult(null);

    if (!validDate) {
      setResult({
        ok: false,
        message:
          `Choose a date between ${
            POLICIES.minimumReservationNoticeMinutes
          } minutes from now and ${
            POLICIES.maximumAdvanceBookingDays
          } days ahead.`,
      });

      return;
    }

    if (!choice) {
      setResult({
        ok: false,
        message:
          "Select a table that is available for your chosen party and time.",
      });

      return;
    }

    if (!nickname.trim()) {
      setResult({
        ok: false,
        message:
          "Please enter a demonstration nickname.",
      });

      return;
    }

    const response = actions.reserveTable({
      tableId: choice.id,
      nickname: nickname.trim(),
      partySize,
      startAt,
      durationMinutes: duration,
    });

    if (!response.ok) {
      setResult({
        ok: false,
        message: response.error,
      });

      return;
    }

    const created =
      response.state.reservations[0];

    if (created) {
      setOwnIds((previous) => {
        const updated = [
          created.id,
          ...previous.filter(
            (id) => id !== created.id
          ),
        ];

        try {
          sessionStorage.setItem(
            OWN_KEY,
            JSON.stringify(updated)
          );
        } catch {
          // Continue without session persistence.
        }

        return updated;
      });
    }

    setResult({
      ok: true,
      booking: created,
      message:
        "Your demonstration reservation has been created.",
    });

    setSelectedId("");
  }

  function cancelBooking(reservation) {
    const response =
      actions.cancelReservation(
        reservation.id
      );

    if (response.ok) {
      setResult({
        ok: true,
        message:
          "The local demo reservation was cancelled.",
      });
    } else {
      setResult({
        ok: false,
        message: response.error,
      });
    }
  }

  return (
    <div className="cj3-page">
      <section className="cj3-hero cj3-hero--reserve">
        <div className="cj3-hero-copy">
          <span className="cj3-kicker cj3-kicker--light">
            YOUR CAFÉ / SEATING JOURNAL
          </span>

          <h1>
            Stay a
            <br />
            <em>little longer.</em>
          </h1>

          <p>
            A sunlit corner. A table for
            friends. A spot near the espresso
            bar. Find the place that feels
            like yours.
          </p>

          <a
            href="#cj3-reservation-editor"
            className="cj3-hero-link"
          >
            CHOOSE YOUR SEAT
            <ArrowRight size={18} />
          </a>

          <span className="cj3-hero-foot">
            CHAPTER 03 / THE SEATING EDIT
          </span>
        </div>

        <div className="cj3-hero-photo">
          <img
            src={PHOTOS.interior}
            alt="Illustrative café interior seating"
            fetchPriority="high"
          />

          <span>
            A TABLE FOR THE MOMENTS
            THAT MATTER
          </span>
        </div>
      </section>

      <section
        className="cj3-reservation-workspace"
        id="cj3-reservation-editor"
      >
        <div className="cj3-wide">
          <div className="cj3-section-heading">
            <div>
              <span className="cj3-kicker">
                01 / YOUR VISIT
              </span>

              <h2>
                Plan a <em>little pause.</em>
              </h2>
            </div>

            <p>
              Explore the café's 28 illustrative
              seating units. Table conditions
              and conflicts are calculated
              from local demo records.
            </p>
          </div>

          <div className="cj3-workspace-grid">
            <div className="cj3-reservation-main">
              <form
                id="cj3-reservation-form"
                onSubmit={submit}
                className="cj3-reservation-form"
              >
                <div className="cj3-form-heading">
                  <span>THE RESERVATION CARD</span>

                  <CalendarDays size={22} />
                </div>

                <div className="cj3-form-grid">
                  <label className="cj3-field">
                    <span>
                      PREFERRED DATE & TIME
                    </span>

                    <input
                      type="datetime-local"
                      required
                      min={todayInputDate}
                      max={maxInputDate}
                      value={dateTime}
                      onChange={(event) =>
                        changeField(
                          setDateTime,
                          event.target.value
                        )
                      }
                    />
                  </label>

                  <label className="cj3-field">
                    <span>NUMBER OF GUESTS</span>

                    <select
                      value={partySize}
                      onChange={(event) =>
                        changeField(
                          setPartySize,
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
                        (_, i) => i + 1
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
                    <span>YOUR FAVORITE AREA</span>

                    <select
                      value={zoneId}
                      onChange={(event) =>
                        changeField(
                          setZoneId,
                          event.target.value
                        )
                      }
                    >
                      <option value="all">
                        Any lovely corner
                      </option>

                      {SEATING_ZONES.map(
                        (zone) => (
                          <option
                            key={zone.id}
                            value={zone.id}
                          >
                            {zone.name}
                          </option>
                        )
                      )}
                    </select>
                  </label>

                  <label className="cj3-field">
                    <span>HOW LONG?</span>

                    <select
                      value={duration}
                      onChange={(event) =>
                        changeField(
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

                  <label className="cj3-field cj3-field--full">
                    <span>
                      YOUR DEMO NICKNAME
                    </span>

                    <input
                      value={nickname}
                      maxLength={40}
                      required
                      placeholder="e.g. Coffee Explorer"
                      autoComplete="off"
                      onChange={(event) => {
                        setNickname(
                          event.target.value
                        );

                        setResult(null);
                      }}
                    />
                  </label>
                </div>

                <div className="cj3-form-summary">
                  <span>
                    <Users size={17} />
                    {partySize}{" "}
                    {partySize === 1
                      ? "GUEST"
                      : "GUESTS"}
                  </span>

                  <span>
                    <Clock3 size={17} />
                    {duration} MINUTES
                  </span>

                  <strong>
                    {availableCount} SUITABLE
                    TABLES
                  </strong>
                </div>

                {!validDate && (
                  <p className="cj3-warning">
                    Select an eligible future
                    date and time. The local
                    booking rules require at
                    least 30 minutes' notice.
                  </p>
                )}

                {partySize >
                  Math.max(
                    0,
                    ...tables.map(
                      (table) =>
                        table.capacity
                    )
                  ) && (
                  <p className="cj3-warning">
                    No single demo table
                    can seat this group.
                    Choose a smaller party.
                  </p>
                )}

                <CoffeeSeatingPlan
                  rows={rows}
                  selectedId={selectedId}
                  onSelect={(id) => {
                    setSelectedId(id);
                    setResult(null);
                  }}
                  heading="Pick your place."
                  description="Only tables suitable for the chosen date, party size and duration can be selected."
                />

                <div className="cj3-selection-summary">
                  <div>
                    <span>YOUR SELECTED SEAT</span>

                    <strong>
                      {choice
                        ? choice.id
                        : "Not selected yet"}
                    </strong>

                    <small>
                      {choice
                        ? SEATING_ZONES.find(
                            (zone) =>
                              zone.id ===
                              choice.zoneId
                          )?.name
                        : "Choose a highlighted table on the map."}
                    </small>
                  </div>

                  <Ticket size={31} />
                </div>

                <button
                  type="submit"
                  className="cj3-primary-button"
                  disabled={
                    !choice || !validDate
                  }
                >
                  PREPARE DEMO RESERVATION
                  <ArrowUpRight size={19} />
                </button>

                <p className="cj3-small-print">
                  Frontend simulation only.
                  This does not reserve
                  a real café table.
                </p>

                {result && (
                  <div
                    className={`cj3-result ${
                      result.ok
                        ? "cj3-result--good"
                        : "cj3-result--error"
                    }`}
                    role={
                      result.ok
                        ? "status"
                        : "alert"
                    }
                  >
                    {result.ok ? (
                      <Check size={19} />
                    ) : (
                      <X size={19} />
                    )}

                    <div>
                      <strong>
                        {result.message}
                      </strong>

                      {result.booking && (
                        <>
                          <p>
                            Reference:{" "}
                            {
                              result.booking.reference
                            }
                          </p>

                          <p>
                            {result.booking.tableId}
                            {" "}·{" "}
                            {formattedDate(
                              result.booking.startAt
                            )}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </form>
            </div>

            <aside className="cj3-reservation-side">
              <div className="cj3-side-photo">
                <img
                  src={PHOTOS.cafeInterior}
                  alt="Illustrative café atmosphere"
                  loading="lazy"
                />

                <span>
                  YOUR FAVORITE CORNER AWAITS.
                </span>
              </div>

              <div className="cj3-side-content">
                <span className="cj3-kicker">
                  THE VISIT JOURNAL
                </span>

                <h3>
                  Your time,
                  <br />
                  <em>your table.</em>
                </h3>

                <p>
                  Plan a comfortable café visit
                  with our interactive demo
                  seating system.
                </p>

                <div className="cj3-side-rule">
                  <MapPin size={17} />
                  FIVE DISTINCT SEATING ZONES
                </div>

                <div className="cj3-side-rule">
                  <CalendarDays size={17} />
                  UP TO 30 DAYS AHEAD
                </div>

                <Link
                  to="/availability"
                  className="cj3-side-link"
                >
                  EXPLORE TABLE AVAILABILITY
                  <ArrowRight size={17} />
                </Link>
              </div>

              <div className="cj3-my-bookings">
                <span className="cj3-kicker">
                  02 / MY DEMO REQUESTS
                </span>

                <h3>Saved moments.</h3>

                {ownedReservations.length === 0 ? (
                  <p>
                    Reservations you create in
                    this browser tab will appear
                    here. No actual café is
                    receiving the requests.
                  </p>
                ) : (
                  ownedReservations
                    .slice(0, 6)
                    .map((reservation) => (
                      <article
                        key={reservation.id}
                        className="cj3-booking-card"
                      >
                        <div>
                          <strong>
                            {reservation.tableId}
                          </strong>

                          <span>
                            {reservation.status.toUpperCase()}
                          </span>
                        </div>

                        <p>
                          {formattedDate(
                            reservation.startAt
                          )}
                        </p>

                        <small>
                          {
                            reservation.reference
                          }
                        </small>

                        {reservation.status ===
                          "reserved" && (
                          <button
                            type="button"
                            onClick={() =>
                              cancelBooking(
                                reservation
                              )
                            }
                          >
                            CANCEL DEMO RESERVATION
                            <X size={15} />
                          </button>
                        )}
                      </article>
                    ))
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="cj3-quiet-cta">
        <span>
          THE COFFEE JOURNAL / THE NEXT CHAPTER
        </span>

        <h2>
          A table is better
          <br />
          <em>with coffee.</em>
        </h2>

        <Link to="/menu">
          EXPLORE THE MENU
          <ArrowRight size={19} />
        </Link>
      </section>
    </div>
  );
}