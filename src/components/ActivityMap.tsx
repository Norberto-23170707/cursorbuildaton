import { useEffect } from "react";
import { CircleMarker, MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { categoryOf } from "../data/categories";
import type { Activity } from "../types";

type Props = {
  lat: number;
  lng: number;
  activities: Activity[];
  selectedId: string | null;
  adding: boolean;
  draftLocation: { lat: number; lng: number } | null;
  onSelect: (id: string | null) => void;
  onPickLocation: (lat: number, lng: number) => void;
};

function Recenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom() < 13 ? 14 : map.getZoom());
    map.invalidateSize();
  }, [lat, lng, map]);
  return null;
}

function FocusSelected({
  lat,
  lng,
  active,
}: {
  lat: number;
  lng: number;
  active: boolean;
}) {
  const map = useMap();
  useEffect(() => {
    if (!active) return;
    const point = map.latLngToContainerPoint([lat, lng]);
    map.panTo(map.containerPointToLatLng([point.x, point.y + 80]), { animate: true });
  }, [active, lat, lng, map]);
  return null;
}

function InvalidateOnResize() {
  const map = useMap();
  useEffect(() => {
    const resize = () => map.invalidateSize();
    const timer = window.setTimeout(resize, 80);
    window.addEventListener("resize", resize);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", resize);
    };
  }, [map]);
  return null;
}

function ClickCatcher({
  enabled,
  onPick,
  onBackgroundClick,
}: {
  enabled: boolean;
  onPick: (lat: number, lng: number) => void;
  onBackgroundClick: () => void;
}) {
  useMapEvents({
    click(event) {
      if (enabled) onPick(event.latlng.lat, event.latlng.lng);
      else onBackgroundClick();
    },
  });
  return null;
}

function pinIcon(activity: Activity, active: boolean) {
  const cat = categoryOf(activity.category);
  return L.divIcon({
    className: "cerca-pin",
    iconSize: [40, 48],
    iconAnchor: [20, 44],
    html: `<div class="pin ${active ? "is-active" : ""}"><div class="pin-bubble" style="background:${cat.color}"><span class="pin-mark">${cat.mark}</span></div></div>`,
  });
}

function draftIcon() {
  return L.divIcon({
    className: "cerca-pin",
    iconSize: [40, 48],
    iconAnchor: [20, 44],
    html: `<div class="pin is-draft"><div class="pin-bubble"><span>+</span></div></div>`,
  });
}

export function ActivityMap({
  lat,
  lng,
  activities,
  selectedId,
  adding,
  draftLocation,
  onSelect,
  onPickLocation,
}: Props) {
  return (
    <MapContainer center={[lat, lng]} zoom={14} zoomControl attributionControl>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Recenter lat={lat} lng={lng} />
      <InvalidateOnResize />
      {selectedId
        ? activities
            .filter((activity) => activity.id === selectedId)
            .map((activity) => (
              <FocusSelected key={activity.id} lat={activity.lat} lng={activity.lng} active />
            ))
        : null}
      <ClickCatcher
        enabled={adding}
        onPick={onPickLocation}
        onBackgroundClick={() => onSelect(null)}
      />
      <CircleMarker
        center={[lat, lng]}
        radius={10}
        pathOptions={{ color: "#1a2e24", fillColor: "#e8a87c", fillOpacity: 0.9, weight: 2 }}
      />
      {activities.map((activity) => (
        <Marker
          key={activity.id}
          position={[activity.lat, activity.lng]}
          icon={pinIcon(activity, activity.id === selectedId)}
          eventHandlers={{
            click: (event) => {
              L.DomEvent.stopPropagation(event.originalEvent);
              if (!adding) onSelect(activity.id);
            },
          }}
        />
      ))}
      {draftLocation ? <Marker position={[draftLocation.lat, draftLocation.lng]} icon={draftIcon()} /> : null}
    </MapContainer>
  );
}
