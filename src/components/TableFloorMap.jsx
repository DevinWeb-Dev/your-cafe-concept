import { useMemo } from "react";
import {
  Armchair, Coffee, DoorOpen, Leaf, Users,
  Sun, CheckCircle2, Clock3, Sparkles,
} from "lucide-react";
import { SEATING_ZONES, TABLE_STATUSES } from "../data/config.js";
import { useCafe } from "../context/CafeContext.jsx";

const ICONS = {
  window: Sun,
  main: Users,
  bar: Coffee,
  lounge: Armchair,
  garden: Leaf,
};

function StatusSymbol({ status }) {
  if (status === "occupied") return <Users size={12} />;
  if (status === "reserved") return <Clock3 size={12} />;
  if (status === "cleaning") return <Sparkles size={12} />;
  if (status === "available") return <CheckCircle2 size={12} />;
  return <Clock3 size={12} />;
}

/**
 * Props:
 * - selectedTableId: selected ID controlled by parent
 * - onSelect(tableId): callback for the staff control panel
 * - readOnly: disable selection, for a public preview
 */
export default function TableFloorMap({ selectedTableId, onSelect, readOnly = false }) {
  const { tables, stats } = useCafe();
  const grouped = useMemo(() => SEATING_ZONES.map((zone) => ({
    zone,
    tables: tables.filter((table) => table.zoneId === zone.id),
  })), [tables]);

  return (
    <div className="yc-floor" aria-label="Interactive café seating layout">
      <div className="yc-floor-toolbar">
        <div>
          <p className="yc-eyebrow">YOUR CAFÉ · SEATING PLAN</p>
          <h2>Find your place.</h2>
          <span>Locally simulated occupancy, not live business availability.</span>
        </div>
        <div className="yc-floor-stats"><strong>{stats.available}</strong><small>AVAILABLE UNITS</small></div>
      </div>
      <div className="yc-floor-legend">
        {Object.entries(TABLE_STATUSES).map(([key, status]) => (
          <span key={key}><i style={{ background: status.color }} />{status.label}</span>
        ))}
      </div>
      <div className="yc-floor-canvas">
        <div className="yc-floor-entry"><DoorOpen size={16} /> MAIN ENTRANCE <span className="yc-entry-line" /></div>
        <div className="yc-floor-counter"><Coffee size={26} strokeWidth={1.5} /><div><strong>ESPRESSO & PASTRY BAR</strong><small>HANDCRAFTED WITH CARE</small></div><span>BARISTA STATION</span></div>
        <div className="yc-floor-zone-list">
          {grouped.map(({ zone, tables: items }) => {
            const Icon = ICONS[zone.id] || Armchair;
            return (
              <section key={zone.id} className={`yc-floor-zone yc-zone-${zone.id}`} style={{ "--yc-zone": zone.color }}>
                <header className="yc-zone-header"><Icon size={20} /><div><h3>{zone.name}</h3><p>{zone.description}</p></div><small>{items.length} UNITS</small></header>
                <div className={`yc-floor-seats yc-shape-${zone.shape}`}>
                  {items.map((table) => {
                    const currentStatus = TABLE_STATUSES[table.status] || TABLE_STATUSES.unavailable;
                    const selected = table.id === selectedTableId;
                    return (
                      <button
                        key={table.id}
                        type="button"
                        disabled={readOnly}
                        className={`yc-table-seat yc-table-${table.shape} ${selected ? "is-selected" : ""}`}
                        style={{ "--yc-status": currentStatus.color }}
                        aria-label={`${table.id}, ${currentStatus.label.toLowerCase()}, ${table.capacity} ${table.capacity === 1 ? "seat" : "seats"}${table.visit ? `, occupied for ${table.elapsedLabel}` : ""}`}
                        aria-pressed={!readOnly ? selected : undefined}
                        onClick={() => onSelect?.(table.id)}
                        title={`${table.id} • ${currentStatus.label}`}
                      >
                        <span className="yc-table-shape"><Armchair size={17} strokeWidth={1.7} /></span>
                        <strong>{table.id}</strong>
                        <small><StatusSymbol status={table.status}/>{currentStatus.label}</small>
                        {table.visit ? <em>{table.elapsedLabel}</em> : <em>{table.capacity} {table.capacity === 1 ? "seat" : "seats"}</em>}
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
        <div className="yc-floor-bottom"><Leaf size={18} /><span>Thoughtful spaces · Beautiful coffee moments</span><span>NOT TO SCALE</span></div>
      </div>
    </div>
  );
}
