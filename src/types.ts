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
  attendees: number;
};

export type City = {
  name: string;
  displayName: string;
  lat: number;
  lng: number;
  country: string;
};

export type User = {
  name: string;
  email: string;
};

export type Screen = "map" | "agenda";

export type WhenFilter = "hoy" | "semana" | "todas" | "dia";

export type AuthIntent = "publish" | "join" | null;
