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

  return (
    <div className="app-root">
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
        {screen === "map" ? <MapHud onChangeCity={() => setCityOpen(true)} /> : null}
        {adding && !draftLocation ? (
          <div className="bottom-dock" style={{ bottom: 86 }}>
            <div className="banner">
              <div>
                <strong>Toca el mapa</strong>
                <span>Elige el punto exacto de la actividad en {city.name}.</span>
              </div>
              <button className="btn btn-ghost" type="button" onClick={cancelAdd}>
                Salir
              </button>
            </div>
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
