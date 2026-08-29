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
  onSelect: (id: string) => void;
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

function ClickCatcher({
  enabled,
  onPick,
}: {
  enabled: boolean;
  onPick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(event) {
      if (enabled) onPick(event.latlng.lat, event.latlng.lng);
    },
  });
  return null;
}

function pinIcon(activity: Activity, active: boolean) {
  const cat = categoryOf(activity.category);
  return L.divIcon({
    className: "cerca-pin",
    iconSize: [34, 42],
    iconAnchor: [17, 40],
    html: `<div class="pin ${active ? "is-active" : ""}"><div class="pin-bubble" style="background:${cat.color}"><span>${cat.emoji}</span></div></div>`,
  });
}

function draftIcon() {
  return L.divIcon({
    className: "cerca-pin",
    iconSize: [34, 42],
    iconAnchor: [17, 40],
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
    <MapContainer center={[lat, lng]} zoom={14} zoomControl={false} attributionControl>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · CARTO'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      <Recenter lat={lat} lng={lng} />
      <ClickCatcher enabled={adding} onPick={onPickLocation} />
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
