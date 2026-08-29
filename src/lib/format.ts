import { categoryOf } from "../data/categories";
import type { Activity } from "../types";

const WEEKDAYS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const MONTHS = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

export function startOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function isSameDay(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}

export function formatTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" });
}

export function formatDayLabel(iso: string, now = new Date()): string {
  const date = new Date(iso);
  if (isSameDay(date, now)) return "Hoy";
  if (isSameDay(date, addDays(now, 1))) return "Mañana";
  const weekday = WEEKDAYS[date.getDay()];
  const day = date.getDate();
  const month = MONTHS[date.getMonth()];
  return `${capitalize(weekday)} ${day} de ${month}`;
}

export function formatChipDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  if (isSameDay(date, now)) return `Hoy · ${formatTime(iso)}`;
  if (isSameDay(date, addDays(now, 1))) return `Mañana · ${formatTime(iso)}`;
  return `${WEEKDAYS[date.getDay()].slice(0, 3)} ${date.getDate()} · ${formatTime(iso)}`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (rest === 0) return hours === 1 ? "1 h" : `${hours} h`;
  return `${hours} h ${rest} min`;
}

export function endsAt(activity: Activity): Date {
  return new Date(new Date(activity.startsAt).getTime() + activity.durationMin * 60_000);
}

export function isUpcoming(activity: Activity, now = new Date()): boolean {
  return endsAt(activity).getTime() >= now.getTime() - 30 * 60_000;
}

export function inWhenRange(iso: string, filter: "hoy" | "semana" | "todas", now = new Date()): boolean {
  if (filter === "todas") return true;
  const date = new Date(iso);
  if (filter === "hoy") return isSameDay(date, now);
  const end = addDays(startOfDay(now), 7);
  return date >= startOfDay(now) && date < end;
}

export function toDatetimeLocalValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function defaultStartValue(): string {
  const date = new Date();
  date.setMinutes(0, 0, 0);
  date.setHours(date.getHours() + 2);
  return toDatetimeLocalValue(date);
}

export function uid(prefix = "act"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;
}

export function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function matchesQuery(activity: Activity, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [activity.title, activity.venue, activity.description, activity.organizer, categoryOf(activity.category).label]
    .join(" ")
    .toLowerCase()
    .includes(q);
}

export function groupByDay(activities: Activity[]): { key: string; label: string; items: Activity[] }[] {
  const groups = new Map<string, Activity[]>();
  for (const activity of activities) {
    const key = startOfDay(new Date(activity.startsAt)).toISOString();
    const list = groups.get(key) ?? [];
    list.push(activity);
    groups.set(key, list);
  }
  return [...groups.entries()].map(([key, items]) => ({
    key,
    label: formatDayLabel(items[0].startsAt),
    items,
  }));
}
