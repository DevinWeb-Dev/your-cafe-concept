import { useMemo } from "react";

import {
  Armchair,
  Check,
  Coffee,
  DoorOpen,
  Leaf,
  LockKeyhole,
  Sun,
  Users,
} from "lucide-react";

import {
  SEATING_ZONES,
} from "../data/config.js";

import "../styles/coffee-experience.css";

const zoneIcons = {
  window: Sun,
  main: Users,
  bar: Coffee,
  lounge: Armchair,
  garden: Leaf,
};

export default function CoffeeSeatingPlan({
  rows = [],
  selectedId = "",
  onSelect,
  readOnly = false,
  heading = "Find your favorite corner.",
  description = "Choose a seat in our illustrated café floor plan.",
}) {
  const sections = useMemo(
    () =>
      SEATING_ZONES.map((zone) => ({
        zone,
        seats: rows.filter(
          (table) => table.zoneId === zone.id
        ),
      })).filter(
        ({ seats }) => seats.length > 0
      ),
    [rows]
  );

  const bookable = rows.filter(
    (table) => table.bookable
  ).length;

  return (
    <section
      className="cj3-plan"
      aria-label="Illustrative interactive café seating plan"
    >
      <div className="cj3-plan-header">
        <div>
          <span className="cj3-kicker">
            THE COFFEE JOURNAL / FLOOR EDITION
          </span>

          <h3>{heading}</h3>

          <p>{description}</p>
        </div>

        <div className="cj3-plan-counter">
          <strong>
            {String(bookable).padStart(2, "0")}
          </strong>

          <span>SELECTABLE SEATS</span>
        </div>
      </div>

      <div className="cj3-plan-legend">
        <span>
          <i className="cj3-dot cj3-dot--free" />
          Selectable
        </span>

        <span>
          <i className="cj3-dot cj3-dot--busy" />
          Unavailable
        </span>

        <span>
          <i className="cj3-dot cj3-dot--chosen" />
          Your selection
        </span>
      </div>

      <div className="cj3-plan-stage">
        <div className="cj3-plan-entrance">
          <DoorOpen size={17} />

          <span>THE ENTRANCE</span>

          <i />
        </div>

        <div className="cj3-plan-bar">
          <Coffee
            size={26}
            strokeWidth={1.3}
          />

          <div>
            <strong>ESPRESSO & PASTRY BAR</strong>

            <small>
              WHERE GOOD DAYS BEGIN
            </small>
          </div>

          <span>YOUR CAFÉ / BREW STATION</span>
        </div>

        <div className="cj3-plan-zones">
          {sections.map(({ zone, seats }) => {
            const Icon =
              zoneIcons[zone.id] || Armchair;

            return (
              <section
                className={`cj3-plan-zone cj3-zone-${zone.id}`}
                key={zone.id}
              >
                <div className="cj3-zone-heading">
                  <div className="cj3-zone-icon">
                    <Icon size={21} />
                  </div>

                  <div>
                    <span>
                      ZONE /{" "}
                      {zone.shortName || zone.id}
                    </span>

                    <h4>{zone.name}</h4>

                    <p>{zone.description}</p>
                  </div>

                  <small>
                    {seats.length} UNITS
                  </small>
                </div>

                <div className="cj3-seats">
                  {seats.map((table) => {
                    const selected =
                      table.id === selectedId;

                    const disabled =
                      !table.bookable;

                    const label = disabled
                      ? table.reason ||
                        "Not available for this selection"
                      : "Selectable";

                    return (
                      <button
                        key={table.id}
                        type="button"
                        className={`cj3-seat ${
                          selected ? "is-selected" : ""
                        } ${
                          disabled ? "is-disabled" : ""
                        }`}
                        disabled={
                          disabled || readOnly
                        }
                        aria-pressed={
                          !readOnly ? selected : undefined
                        }
                        aria-label={`${table.id}, ${
                          table.capacity
                        } seats, ${label}`}
                        onClick={() =>
                          onSelect?.(table.id)
                        }
                      >
                        <span className="cj3-seat-symbol">
                          {selected ? (
                            <Check size={18} />
                          ) : disabled ? (
                            <LockKeyhole size={15} />
                          ) : (
                            <Armchair size={18} />
                          )}
                        </span>

                        <strong>{table.id}</strong>

                        <small>
                          {table.capacity}{" "}
                          {table.capacity === 1
                            ? "SEAT"
                            : "SEATS"}
                        </small>
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        {sections.length === 0 && (
          <div className="cj3-plan-empty">
            <Armchair size={30} />

            <p>
              No seats match the selected filters.
            </p>
          </div>
        )}

        <div className="cj3-plan-footer">
          <Leaf size={18} />

          <span>
            A PLACE FOR ALL THE LITTLE MOMENTS
          </span>

          <span>
            ILLUSTRATIVE / NOT TO SCALE
          </span>
        </div>
      </div>
    </section>
  );
}