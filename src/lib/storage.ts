import type { Activity, City } from "../types";

const CITY_KEY = "cerca.city";
const ACTIVITIES_KEY = "cerca.activities";
const FAVORITES_KEY = "cerca.favorites";
const ONBOARDED_KEY = "cerca.onboarded";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  getCity: () => read<City | null>(CITY_KEY, null),
  setCity: (city: City | null) => write(CITY_KEY, city),
  getActivities: () => read<Activity[]>(ACTIVITIES_KEY, []),
  setActivities: (activities: Activity[]) => write(ACTIVITIES_KEY, activities),
  getFavorites: () => read<string[]>(FAVORITES_KEY, []),
  setFavorites: (ids: string[]) => write(FAVORITES_KEY, ids),
  getOnboarded: () => read<boolean>(ONBOARDED_KEY, false),
  setOnboarded: (value: boolean) => write(ONBOARDED_KEY, value),
};
