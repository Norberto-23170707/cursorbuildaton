import { useState } from "react";
import { categoryOf } from "../data/categories";
import { formatTime, groupByDay } from "../lib/format";
import { useApp } from "../context/AppContext";

export function AgendaScreen() {
  const { visibleActivities, favorites, selectActivity, setScreen, city, query, setQuery } = useApp();
  const [onlySaved, setOnlySaved] = useState(false);
  const items = onlySaved ? visibleActivities.filter((activity) => favorites.includes(activity.id)) : visibleActivities;
  const groups = groupByDay(items);

  return (
    <section className="agenda">
      <header className="agenda-head">
        <h1>Agenda</h1>
        <p>Lo que se arma en {city?.name ?? "tu ciudad"}.</p>
        <label className="search-card">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filtrar agenda" />
        </label>
        <div className="segment">
          <button type="button" className={`segment-btn ${!onlySaved ? "is-on" : ""}`} onClick={() => setOnlySaved(false)}>
            Próximas
          </button>
          <button type="button" className={`segment-btn ${onlySaved ? "is-on" : ""}`} onClick={() => setOnlySaved(true)}>
            Guardadas
          </button>
        </div>
      </header>
      {groups.length === 0 ? (
        <div className="empty">
          <p>{onlySaved ? "Aún no guardas actividades." : "No hay actividades con esos filtros."}</p>
        </div>
      ) : (
        groups.map((group) => (
          <div className="day-block" key={group.key}>
            <h3>{group.label}</h3>
            {group.items.map((activity) => {
              const cat = categoryOf(activity.category);
              return (
                <button
                  key={activity.id}
                  type="button"
                  className="event-card"
                  onClick={() => {
                    selectActivity(activity.id);
                    setScreen("map");
                  }}
                >
                  <div className="event-time">
                    <strong>{formatTime(activity.startsAt)}</strong>
                    <span style={{ color: cat.color }}>{cat.emoji}</span>
                  </div>
                  <div className="event-body">
                    <strong>{activity.title}</strong>
                    <span>{activity.venue}</span>
                  </div>
                </button>
              );
            })}
          </div>
        ))
      )}
    </section>
  );
}
