import { MapPin, Search } from "lucide-react";
import { CATEGORIES } from "../data/categories";
import { useApp } from "../context/AppContext";
import type { WhenFilter } from "../types";

const WHEN: { id: WhenFilter; label: string }[] = [
  { id: "hoy", label: "Hoy" },
  { id: "semana", label: "Semana" },
  { id: "todas", label: "Todas" },
  { id: "dia", label: "Día" },
];

type Props = {
  onChangeCity: () => void;
};

export function MapHud({ onChangeCity }: Props) {
  const {
    city,
    query,
    setQuery,
    categories,
    toggleCategory,
    when,
    setWhen,
    day,
    setDay,
    visibleActivities,
    user,
    logout,
    openAuth,
  } = useApp();
  if (!city) return null;

  return (
    <div className="top-stack">
      <div className="rail-brand">
        <span className="brand">Cerca</span>
        {user ? (
          <button className="text-btn" type="button" onClick={logout}>
            {user.name} · Salir
          </button>
        ) : (
          <button className="text-btn" type="button" onClick={openAuth}>
            Entrar
          </button>
        )}
      </div>
      <div className="search-hero">
        <button className="city-mini" type="button" onClick={onChangeCity}>
          <span className="city-mark" aria-hidden>
            <MapPin size={16} />
          </span>
          <span className="city-mini-text">
            <strong>{city.name}</strong>
            <em>
              {visibleActivities.length} {visibleActivities.length === 1 ? "plan" : "planes"}
            </em>
          </span>
        </button>
        <label className="search-inline">
          <Search size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jazz, feria, caminata…"
            enterKeyHint="search"
            autoComplete="off"
            autoCorrect="off"
          />
        </label>
      </div>
      <div className="chip-row">
        {WHEN.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`chip when-chip ${when === item.id ? "is-on" : ""}`}
            onClick={() => setWhen(item.id)}
          >
            {item.label}
          </button>
        ))}
        {when === "dia" ? (
          <label className="day-field">
            <input type="date" value={day} onChange={(e) => setDay(e.target.value)} aria-label="Elegir día" />
          </label>
        ) : null}
        <span className="chip-sep" aria-hidden />
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
              {item.short}
            </button>
          );
        })}
      </div>
    </div>
  );
}
