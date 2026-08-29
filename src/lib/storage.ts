import type { Activity, City, User } from "../types";

const CITY_KEY = "cerca.city";
const ACTIVITIES_KEY = "cerca.activities";
const FAVORITES_KEY = "cerca.favorites";
const ONBOARDED_KEY = "cerca.onboarded";
const USER_KEY = "cerca.user";
const JOINED_KEY = "cerca.joined";

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
  getUser: () => read<User | null>(USER_KEY, null),
  setUser: (user: User | null) => write(USER_KEY, user),
  getJoined: () => read<string[]>(JOINED_KEY, []),
  setJoined: (ids: string[]) => write(JOINED_KEY, ids),
};
