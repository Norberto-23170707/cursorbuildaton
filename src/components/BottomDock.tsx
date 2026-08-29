import { CalendarDays, Map as MapIcon, Plus } from "lucide-react";
import { useApp } from "../context/AppContext";
import { ActivityCards } from "./ActivityCards";

export function BottomDock() {
  const { screen, setScreen, startAdd, adding } = useApp();

  return (
    <div className="bottom-dock">
      {screen === "map" && !adding ? <ActivityCards variant="row" /> : null}
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
