import { useState } from "react";
import { useApp } from "../context/AppContext";
import { ActivityMap } from "./ActivityMap";
import { ActivitySheet } from "./ActivitySheet";
import { AddActivityForm } from "./AddActivityForm";
import { AgendaScreen } from "./AgendaScreen";
import { BottomDock } from "./BottomDock";
import { CityPicker } from "./CityPicker";
import { MapHud } from "./MapHud";
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
    removeActivity,
    toggleFavorite,
    favorites,
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

  const sheetOpen = Boolean((selected && !adding) || (adding && draftLocation));
  const placing = adding && !draftLocation;
  const rootClass = [
    "app-root",
    sheetOpen ? "is-sheet" : "",
    placing ? "is-placing" : "",
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
      </div>

      <div className="hud">
        {screen === "map" && !sheetOpen ? <MapHud onChangeCity={() => setCityOpen(true)} /> : null}
        {placing ? (
          <div className="placing-banner">
            <div>
              <strong>Toca el mapa</strong>
              <span>Marca el punto de la actividad en {city.name}.</span>
            </div>
            <button className="btn btn-ghost" type="button" onClick={cancelAdd}>
              Salir
            </button>
          </div>
        ) : null}
        <BottomDock />
      </div>

      {screen === "agenda" ? <AgendaScreen /> : null}

      {selected && !adding ? (
        <ActivitySheet
          activity={selected}
          favorited={favorites.includes(selected.id)}
          onClose={() => selectActivity(null)}
          onFavorite={() => toggleFavorite(selected.id)}
          onDelete={selected.source === "user" ? () => removeActivity(selected.id) : undefined}
        />
      ) : null}

      {adding && draftLocation ? (
        <AddActivityForm
          lat={draftLocation.lat}
          lng={draftLocation.lng}
          onCancel={cancelAdd}
          onSave={(input) => addActivity(input)}
        />
      ) : null}

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
    </div>
  );
}
