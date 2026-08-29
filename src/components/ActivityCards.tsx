import { formatChipDate } from "../lib/format";
import { categoryOf } from "../data/categories";
import { useApp } from "../context/AppContext";

type Props = {
  variant: "row" | "stack";
};

export function ActivityCards({ variant }: Props) {
  const { visibleActivities, selectActivity, selectedId } = useApp();

  if (visibleActivities.length === 0) {
    return <p className="empty">No hay planes con esos filtros.</p>;
  }

  return (
    <div className={variant === "stack" ? "feed-stack" : "preview-row"}>
      {visibleActivities.map((activity) => {
        const cat = categoryOf(activity.category);
        return (
          <button
            key={activity.id}
            type="button"
            className={`preview-card ${selectedId === activity.id ? "is-selected" : ""}`}
            onClick={() => selectActivity(activity.id)}
          >
            <small style={{ color: cat.color }}>
              {cat.emoji} {formatChipDate(activity.startsAt)}
            </small>
            <strong>{activity.title}</strong>
            <span>{activity.venue}</span>
          </button>
        );
      })}
    </div>
  );
}
