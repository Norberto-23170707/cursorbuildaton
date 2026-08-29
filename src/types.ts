export type CategoryId =
  | "musica"
  | "caminata"
  | "show"
  | "cultura"
  | "deporte"
  | "gastro"
  | "comunidad";

export type ActivitySource = "seed" | "user";

export type Activity = {
  id: string;
  title: string;
  category: CategoryId;
  description: string;
  venue: string;
  lat: number;
  lng: number;
  startsAt: string;
  durationMin: number;
  organizer: string;
  source: ActivitySource;
  cityKey: string;
};

export type City = {
  name: string;
  displayName: string;
  lat: number;
  lng: number;
  country: string;
};

export type Screen = "map" | "agenda";

export type WhenFilter = "hoy" | "semana" | "todas";
