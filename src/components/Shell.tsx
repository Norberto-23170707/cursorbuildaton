import { useState } from "react";
import { useApp } from "../context/AppContext";
import { ActivityCards } from "./ActivityCards";
import { ActivityMap } from "./ActivityMap";
import { AddActivityForm } from "./AddActivityForm";
import { AgendaScreen } from "./AgendaScreen";
import { AuthModal } from "./AuthModal";
import { BottomDock } from "./BottomDock";
import { CityPicker } from "./CityPicker";
import { MapHud } from "./MapHud";
import { MapIsland } from "./MapIsland";
import { Onboarding } from "./Onboarding";

export function Shell() {
  const {
    onboarded,
    city,
    screen,
    visibleActivities,
    selected,
    adding,
    draftLocation,
    setDraftLocation,
    selectActivity,
    addActivity,
    cancelAdd,
    changeCity,
  } = useApp();
  const [cityOpen, setCityOpen] = useState(false);

  if (!onboarded || !city) {
    return (
      <div className="app-root">
        <Onboarding />
      </div>
    );
  }

  const formOpen = Boolean(adding && draftLocation);
  const placing = adding && !draftLocation;
  const showFeed = screen === "map" && !formOpen && !placing;
  const rootClass = [
    "app-root",
    formOpen ? "is-sheet" : "",
    placing ? "is-placing" : "",
    selected && !adding ? "is-island" : "",
    screen === "agenda" ? "is-agenda" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClass}>
      <div className="screen">
        <ActivityMap
          lat={city.lat}
          lng={city.lng}
          activities={visibleActivities}
          selectedId={selected?.id ?? null}
          adding={adding}
          draftLocation={draftLocation}
          onSelect={(id) => selectActivity(id)}
          onPickLocation={(lat, lng) => setDraftLocation({ lat, lng })}
        />
        {placing ? (
          <div className="map-toast">
            <strong>Haz clic en el mapa</strong>
            <span>Marca el punto en {city.name}.</span>
            <button className="btn btn-ghost" type="button" onClick={cancelAdd}>
              Salir
            </button>
          </div>
        ) : null}
        {selected && !adding ? <MapIsland /> : null}
      </div>

      <aside className="rail">
        {screen !== "agenda" ? <MapHud onChangeCity={() => setCityOpen(true)} /> : null}

        <div className="rail-body">
          {screen === "agenda" ? <AgendaScreen /> : null}
          {showFeed ? <ActivityCards variant="stack" /> : null}
          {adding && draftLocation ? (
            <AddActivityForm
              lat={draftLocation.lat}
              lng={draftLocation.lng}
              onCancel={cancelAdd}
              onSave={(input) => addActivity(input)}
            />
          ) : null}
        </div>

        {placing ? (
          <div className="placing-banner">
            <div>
              <strong>Haz clic en el mapa</strong>
              <span>Elige el punto en {city.name}.</span>
            </div>
            <button className="btn btn-ghost" type="button" onClick={cancelAdd}>
              Salir
            </button>
          </div>
        ) : null}

        <BottomDock />
      </aside>

      {cityOpen ? (
        <div className="modal-layer">
          <CityPicker
            title="Cambiar de ciudad"
            lead="El mapa y las actividades se van a recentrar en el lugar que elijas."
            onPick={(next) => {
              changeCity(next);
              setCityOpen(false);
            }}
            onCancel={() => setCityOpen(false)}
          />
        </div>
      ) : null}

      <AuthModal />
    </div>
  );
}

