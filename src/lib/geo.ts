import type { City } from "../types";

const NOMINATIM = "https://nominatim.openstreetmap.org";

const headers = {
  Accept: "application/json",
};

export type PlaceHit = {
  displayName: string;
  name: string;
  lat: number;
  lng: number;
  country: string;
};

type NominatimHit = {
  display_name: string;
  lat: string;
  lon: string;
  name?: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    state?: string;
    country?: string;
  };
};

function toPlace(hit: NominatimHit): PlaceHit {
  const address = hit.address ?? {};
  const name =
    hit.name ||
    address.city ||
    address.town ||
    address.village ||
    address.municipality ||
    hit.display_name.split(",")[0];
  return {
    displayName: hit.display_name,
    name,
    lat: Number(hit.lat),
    lng: Number(hit.lon),
    country: address.country ?? "",
  };
}

export async function searchCities(query: string): Promise<PlaceHit[]> {
  const q = query.trim();
  if (q.length < 2) return [];
  const url = new URL(`${NOMINATIM}/search`);
  url.searchParams.set("q", q);
  url.searchParams.set("format", "json");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", "6");
  url.searchParams.set("accept-language", "es");
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error("No se pudo buscar la ciudad");
  const data = (await res.json()) as NominatimHit[];
  return data.map(toPlace);
}

export async function reverseGeocode(lat: number, lng: number): Promise<PlaceHit> {
  const url = new URL(`${NOMINATIM}/reverse`);
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lng));
  url.searchParams.set("format", "json");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("zoom", "12");
  url.searchParams.set("accept-language", "es");
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error("No se pudo ubicar tu zona");
  const data = (await res.json()) as NominatimHit;
  return toPlace(data);
}

export function placeToCity(place: PlaceHit): City {
  return {
    name: place.name,
    displayName: place.displayName,
    lat: place.lat,
    lng: place.lng,
    country: place.country,
  };
}

export function cityKey(city: City): string {
  return `${city.name}|${city.lat.toFixed(3)}|${city.lng.toFixed(3)}`;
}

export function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Tu navegador no permite geolocalización"));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 12000,
      maximumAge: 60_000,
    });
  });
}

export function mapsLink(lat: number, lng: number, label: string): string {
  const q = encodeURIComponent(`${label} @${lat},${lng}`);
  return `https://www.openstreetmap.org/search?query=${q}#map=17/${lat}/${lng}`;
}

export function offsetPoint(
  lat: number,
  lng: number,
  northMeters: number,
  eastMeters: number,
): { lat: number; lng: number } {
  const dLat = northMeters / 111_320;
  const dLng = eastMeters / (111_320 * Math.cos((lat * Math.PI) / 180));
  return { lat: lat + dLat, lng: lng + dLng };
}
