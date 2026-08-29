import { Users, X } from "lucide-react";
import { categoryOf } from "../data/categories";
import { formatChipDate } from "../lib/format";
import { mapsLink } from "../lib/geo";
import { useApp } from "../context/AppContext";

export function MapIsland() {
  const { selected, selectActivity, joinActivity, joinedIds, user, removeActivity } = useApp();
  if (!selected) return null;

  const cat = categoryOf(selected.category);
  const joined = joinedIds.includes(selected.id);

  return (
    <aside className="map-island" role="dialog" aria-labelledby="island-title">
      <div className="island-handle" aria-hidden />
      <div className="island-head">
        <div>
          <div className="kicker" style={{ color: cat.color }}>
            {cat.label} · {formatChipDate(selected.startsAt)}
          </div>
          <h2 id="island-title">{selected.title}</h2>
        </div>
        <button className="icon-btn" type="button" onClick={() => selectActivity(null)} aria-label="Cerrar">
          <X size={18} />
        </button>
      </div>
      <p>{selected.description}</p>
      <div className="island-meta">
        <span>
          <Users size={14} />
          {selected.attendees} {selected.attendees === 1 ? "persona registrada" : "personas registradas"}
        </span>
        <span>{selected.venue}</span>
      </div>
      <div className="actions">
        <button
          className="btn btn-primary grow"
          type="button"
          onClick={() => joinActivity(selected.id)}
          disabled={joined}
        >
          {joined ? "Ya estás dentro" : user ? "Apuntarme" : "Regístrate para ir"}
        </button>
        <a className="btn btn-ghost" href={mapsLink(selected.lat, selected.lng, selected.venue)} target="_blank" rel="noreferrer">
          Cómo llegar
        </a>
        {selected.source === "user" ? (
          <button className="btn btn-danger" type="button" onClick={() => removeActivity(selected.id)} aria-label="Borrar">
            Quitar
          </button>
        ) : null}
      </div>
    </aside>
  );
}
