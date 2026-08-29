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
        <p>Lo que se arma en {city?.name ?? "tu ciudad"}, en orden de llegada.</p>
        <label className="search-card" style={{ marginBottom: 12 }}>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filtrar agenda" />
        </label>
        <div className="when-row" style={{ marginBottom: 16 }}>
          <button type="button" className={`when-chip ${!onlySaved ? "is-on" : ""}`} onClick={() => setOnlySaved(false)}>
            Próximas
          </button>
          <button type="button" className={`when-chip ${onlySaved ? "is-on" : ""}`} onClick={() => setOnlySaved(true)}>
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
                  <div className="time">
                    {formatTime(activity.startsAt)} · {cat.label}
                  </div>
                  <strong style={{ display: "block", fontFamily: "var(--display)", fontSize: 20, margin: "4px 0" }}>
                    {activity.title}
                  </strong>
                  <span style={{ color: "#3d4a43" }}>{activity.venue}</span>
                </button>
              );
            })}
          </div>
        ))
      )}
    </section>
  );
}
