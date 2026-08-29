import type { CategoryId } from "../types";

export type Category = {
  id: CategoryId;
  label: string;
  short: string;
  color: string;
  ink: string;
  mark: string;
};

export const CATEGORIES: Category[] = [
  { id: "musica", label: "Música", short: "Música", color: "#7B4B94", ink: "#F6ECF8", mark: "M" },
  { id: "caminata", label: "Caminatas", short: "Caminata", color: "#2F6F5E", ink: "#E7F4EE", mark: "C" },
  { id: "show", label: "Shows", short: "Shows", color: "#C44536", ink: "#FDECEA", mark: "S" },
  { id: "cultura", label: "Cultura", short: "Cultura", color: "#B26A2A", ink: "#F8EEDC", mark: "U" },
  { id: "deporte", label: "Deporte", short: "Deporte", color: "#2B5C8A", ink: "#E6F0FA", mark: "D" },
  { id: "gastro", label: "Gastronomía", short: "Gastro", color: "#C47A1A", ink: "#FFF4DC", mark: "G" },
  { id: "comunidad", label: "Comunidad", short: "Barrio", color: "#A4456A", ink: "#FCEAF1", mark: "B" },
];

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((category) => [category.id, category]),
) as Record<CategoryId, Category>;

export function categoryOf(id: CategoryId): Category {
  return CATEGORY_MAP[id];
}
