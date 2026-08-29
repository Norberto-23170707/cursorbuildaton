import { CalendarDays, Map as MapIcon, Plus } from "lucide-react";
import { useApp } from "../context/AppContext";
import { formatChipDate } from "../lib/format";
import { categoryOf } from "../data/categories";

export function BottomDock() {
  const { screen, setScreen, startAdd, visibleActivities, selectActivity, adding } = useApp();
  const preview = visibleActivities.slice(0, 6);

  return (
    <div className="bottom-dock">
      {screen === "map" && !adding && preview.length > 0 ? (
        <div className="preview-row">
          {preview.map((activity) => {
            const cat = categoryOf(activity.category);
            return (
              <button
                key={activity.id}
                type="button"
                className="preview-card"
                onClick={() => selectActivity(activity.id)}
              >
                <small style={{ color: cat.color }}>
                  {cat.emoji} {formatChipDate(activity.startsAt)}
                </small>
                <strong>{activity.title}</strong>
                <span>{activity.venue}</span>
              </button>
            );
          })}
        </div>
      ) : null}
      <nav className="tabbar">
        <button
          type="button"
          className={`nav-btn ${screen === "map" ? "is-on" : ""}`}
          onClick={() => setScreen("map")}
        >
          <MapIcon size={18} />
          Mapa
        </button>
        <button type="button" className="fab" onClick={startAdd} aria-label="Publicar actividad">
          <Plus size={26} />
        </button>
        <button
          type="button"
          className={`nav-btn ${screen === "agenda" ? "is-on" : ""}`}
          onClick={() => setScreen("agenda")}
        >
          <CalendarDays size={18} />
          Agenda
        </button>
      </nav>
    </div>
  );
}
