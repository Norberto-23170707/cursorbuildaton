import { useEffect, useState } from "react";
import { LocateFixed, MapPin, Search } from "lucide-react";
import { useApp } from "../context/AppContext";
import { getCurrentPosition, placeToCity, reverseGeocode, searchCities, type PlaceHit } from "../lib/geo";
import type { City } from "../types";

const SUGGESTED: City[] = [
  { name: "Ciudad de México", displayName: "Ciudad de México, México", lat: 19.4326, lng: -99.1332, country: "México" },
  { name: "Guadalajara", displayName: "Guadalajara, Jalisco, México", lat: 20.6597, lng: -103.3496, country: "México" },
  { name: "Buenos Aires", displayName: "Buenos Aires, Argentina", lat: -34.6037, lng: -58.3816, country: "Argentina" },
  { name: "Bogotá", displayName: "Bogotá, Colombia", lat: 4.711, lng: -74.0721, country: "Colombia" },
  { name: "Madrid", displayName: "Madrid, España", lat: 40.4168, lng: -3.7038, country: "España" },
  { name: "Lima", displayName: "Lima, Perú", lat: -12.0464, lng: -77.0428, country: "Perú" },
];

type Props = {
  title?: string;
  lead?: string;
  onPick: (city: City) => void;
  onCancel?: () => void;
};

export function CityPicker({
  title = "¿Dónde quieres mirar el mapa?",
  lead = "Usa tu ubicación o busca tu ciudad. Ahí vamos a plantar las actividades.",
  onPick,
  onCancel,
}: Props) {
  const { locating, setLocating } = useApp();
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<PlaceHit[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setHits([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    const timer = window.setTimeout(() => {
      void (async () => {
        try {
          setHits(await searchCities(q));
          setError(null);
        } catch {
          setError("La búsqueda de ciudades no respondió. Prueba una de las sugeridas.");
        } finally {
          setSearching(false);
        }
      })();
    }, 350);
    return () => window.clearTimeout(timer);
  }, [query]);

  async function useLocation() {
    setError(null);
    setLocating(true);
    try {
      const pos = await getCurrentPosition();
      const place = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
      onPick(placeToCity(place));
    } catch {
      setError("No pudimos leer tu ubicación. Busca tu ciudad o elige una de la lista.");
    } finally {
      setLocating(false);
    }
  }

  return (
    <div className="panel onboard-card" style={{ boxShadow: "none" }}>
      <div className="brand">Cerca</div>
      <h1>{title}</h1>
      <p className="lead">{lead}</p>
      <button className="btn btn-primary grow" style={{ width: "100%" }} onClick={useLocation} disabled={locating} type="button">
        <LocateFixed size={18} />
        {locating ? "Buscando tu zona…" : "Usar mi ubicación"}
      </button>
      <div className="search-card" style={{ marginTop: 12, boxShadow: "none" }}>
        <Search size={16} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar ciudad, barrio o pueblo"
          aria-label="Buscar ciudad"
        />
      </div>
      {error ? <p className="error">{error}</p> : null}
      {hits.length > 0 ? (
        <div className="city-list">
          {hits.map((hit) => (
            <button
              type="button"
              className="city-hit"
              key={`${hit.lat}-${hit.lng}`}
              onClick={() => onPick(placeToCity(hit))}
            >
              <strong>{hit.name}</strong>
              <span>{hit.displayName}</span>
            </button>
          ))}
        </div>
      ) : (
        <>
          <p className="hint">{searching ? "Buscando…" : "Sugerencias rápidas"}</p>
          <div className="quick-cities">
            {SUGGESTED.map((city) => (
              <button key={city.name} type="button" className="chip is-on" onClick={() => onPick(city)}>
                <MapPin size={12} />
                {city.name}
              </button>
            ))}
          </div>
        </>
      )}
      {onCancel ? (
        <button className="btn btn-ghost grow" type="button" onClick={onCancel}>
          Seguir en el mapa actual
        </button>
      ) : null}
    </div>
  );
}
