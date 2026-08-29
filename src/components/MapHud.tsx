import { Search, SlidersHorizontal } from "lucide-react";
import { CATEGORIES } from "../data/categories";
import { useApp } from "../context/AppContext";
import type { WhenFilter } from "../types";

const WHEN: { id: WhenFilter; label: string }[] = [
  { id: "hoy", label: "Hoy" },
  { id: "semana", label: "Esta semana" },
  { id: "todas", label: "Todas" },
];

type Props = {
  onChangeCity: () => void;
};

export function MapHud({ onChangeCity }: Props) {
  const { city, query, setQuery, categories, toggleCategory, when, setWhen, visibleActivities } = useApp();
  if (!city) return null;

  return (
    <div className="top-stack">
      <div className="city-bar">
        <button className="city-btn" type="button" onClick={onChangeCity}>
          <span className="city-mark" aria-hidden>
            ⌖
          </span>
          <span style={{ minWidth: 0 }}>
            <strong>{city.name}</strong>
            <span>{city.country || "Tu localidad"}</span>
          </span>
        </button>
        <button className="icon-btn" type="button" onClick={onChangeCity} aria-label="Cambiar ciudad">
          <SlidersHorizontal size={18} />
        </button>
      </div>
      <label className="search-card">
        <Search size={16} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Busca jazz, caminata, feria…"
        />
      </label>
      <div className="when-row">
        {WHEN.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`when-chip ${when === item.id ? "is-on" : ""}`}
            onClick={() => setWhen(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="chip-row">
        {CATEGORIES.map((item) => {
          const on = categories.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              className={`chip ${on ? "is-on" : ""}`}
              onClick={() => toggleCategory(item.id)}
            >
              <span className="dot" style={{ background: item.color }} />
              {item.label}
            </button>
          );
        })}
      </div>
      <div className="hint" style={{ paddingLeft: 6, color: "#1a2e24" }}>
        {visibleActivities.length} {visibleActivities.length === 1 ? "actividad" : "actividades"} en el mapa
      </div>
    </div>
  );
}
