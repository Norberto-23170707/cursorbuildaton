import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Activity, CategoryId, City, Screen, WhenFilter } from "../types";
import { cityKey } from "../lib/geo";
import { generateSampleActivities } from "../lib/sampleEvents";
import { inWhenRange, isUpcoming, matchesQuery, uid } from "../lib/format";
import { storage } from "../lib/storage";

type DraftLocation = { lat: number; lng: number } | null;

type AppState = {
  city: City | null;
  onboarded: boolean;
  activities: Activity[];
  favorites: string[];
  screen: Screen;
  selectedId: string | null;
  adding: boolean;
  draftLocation: DraftLocation;
  categories: CategoryId[];
  when: WhenFilter;
  query: string;
  locating: boolean;
};

type NewActivityInput = {
  title: string;
  category: CategoryId;
  description: string;
  venue: string;
  organizer: string;
  startsAt: string;
  durationMin: number;
  lat: number;
  lng: number;
};

type AppContextValue = AppState & {
  visibleActivities: Activity[];
  selected: Activity | null;
  setScreen: (screen: Screen) => void;
  selectActivity: (id: string | null) => void;
  completeOnboarding: (city: City) => void;
  changeCity: (city: City) => void;
  resetOnboarding: () => void;
  startAdd: () => void;
  cancelAdd: () => void;
  setDraftLocation: (point: DraftLocation) => void;
  addActivity: (input: NewActivityInput) => Activity;
  removeActivity: (id: string) => void;
  toggleFavorite: (id: string) => void;
  setCategories: (ids: CategoryId[]) => void;
  toggleCategory: (id: CategoryId) => void;
  setWhen: (when: WhenFilter) => void;
  setQuery: (query: string) => void;
  setLocating: (value: boolean) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

function seedForCity(city: City, existing: Activity[]): Activity[] {
  const key = cityKey(city);
  const userKept = existing.filter((activity) => activity.source === "user");
  const alreadySeeded = existing.some((activity) => activity.source === "seed" && activity.cityKey === key);
  const seeds = alreadySeeded
    ? existing.filter((activity) => activity.source === "seed" && activity.cityKey === key)
    : generateSampleActivities(city.name, key, city.lat, city.lng);
  return [...userKept, ...seeds];
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [city, setCity] = useState<City | null>(() => storage.getCity());
  const [onboarded, setOnboarded] = useState(() => storage.getOnboarded() && Boolean(storage.getCity()));
  const [activities, setActivities] = useState<Activity[]>(() => {
    const savedCity = storage.getCity();
    const saved = storage.getActivities();
    if (!savedCity) return saved;
    const next = seedForCity(savedCity, saved);
    storage.setActivities(next);
    return next;
  });
  const [favorites, setFavorites] = useState<string[]>(() => storage.getFavorites());
  const [screen, setScreen] = useState<Screen>("map");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [draftLocation, setDraftLocation] = useState<DraftLocation>(null);
  const [categories, setCategories] = useState<CategoryId[]>([]);
  const [when, setWhen] = useState<WhenFilter>("semana");
  const [query, setQuery] = useState("");
  const [locating, setLocating] = useState(false);

  const persistActivities = useCallback((next: Activity[]) => {
    setActivities(next);
    storage.setActivities(next);
  }, []);

  const applyCity = useCallback(
    (nextCity: City, markOnboarded: boolean) => {
      setCity(nextCity);
      storage.setCity(nextCity);
      persistActivities(seedForCity(nextCity, storage.getActivities()));
      if (markOnboarded) {
        setOnboarded(true);
        storage.setOnboarded(true);
      }
      setSelectedId(null);
      setAdding(false);
      setDraftLocation(null);
      setScreen("map");
    },
    [persistActivities],
  );

  const completeOnboarding = useCallback(
    (nextCity: City) => {
      applyCity(nextCity, true);
    },
    [applyCity],
  );

  const changeCity = useCallback(
    (nextCity: City) => {
      applyCity(nextCity, true);
    },
    [applyCity],
  );

  const resetOnboarding = useCallback(() => {
    setOnboarded(false);
    storage.setOnboarded(false);
    setAdding(false);
    setDraftLocation(null);
    setSelectedId(null);
  }, []);

  const startAdd = useCallback(() => {
    setAdding(true);
    setSelectedId(null);
    setDraftLocation(null);
    setScreen("map");
  }, []);

  const cancelAdd = useCallback(() => {
    setAdding(false);
    setDraftLocation(null);
  }, []);

  const addActivity = useCallback(
    (input: NewActivityInput) => {
      if (!city) throw new Error("Elige una ciudad primero");
      const activity: Activity = {
        id: uid("user"),
        ...input,
        source: "user",
        cityKey: cityKey(city),
      };
      persistActivities([activity, ...storage.getActivities().filter((item) => item.id !== activity.id)]);
      setAdding(false);
      setDraftLocation(null);
      setSelectedId(activity.id);
      return activity;
    },
    [city, persistActivities],
  );

  const removeActivity = useCallback(
    (id: string) => {
      persistActivities(storage.getActivities().filter((activity) => activity.id !== id));
      setSelectedId((current) => (current === id ? null : current));
      const nextFav = storage.getFavorites().filter((fav) => fav !== id);
      setFavorites(nextFav);
      storage.setFavorites(nextFav);
    },
    [persistActivities],
  );

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      storage.setFavorites(next);
      return next;
    });
  }, []);

  const toggleCategory = useCallback((id: CategoryId) => {
    setCategories((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }, []);

  const visibleActivities = useMemo(() => {
    const key = city ? cityKey(city) : "";
    return activities
      .filter((activity) => activity.cityKey === key)
      .filter((activity) => isUpcoming(activity))
      .filter((activity) => inWhenRange(activity.startsAt, when))
      .filter((activity) => (categories.length === 0 ? true : categories.includes(activity.category)))
      .filter((activity) => matchesQuery(activity, query))
      .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  }, [activities, city, when, categories, query]);

  const selected = useMemo(
    () => activities.find((activity) => activity.id === selectedId) ?? null,
    [activities, selectedId],
  );

  const value: AppContextValue = {
    city,
    onboarded,
    activities,
    favorites,
    screen,
    selectedId,
    adding,
    draftLocation,
    categories,
    when,
    query,
    locating,
    visibleActivities,
    selected,
    setScreen,
    selectActivity: setSelectedId,
    completeOnboarding,
    changeCity,
    resetOnboarding,
    startAdd,
    cancelAdd,
    setDraftLocation,
    addActivity,
    removeActivity,
    toggleFavorite,
    setCategories,
    toggleCategory,
    setWhen,
    setQuery,
    setLocating,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp debe usarse dentro de AppProvider");
  return ctx;
}
