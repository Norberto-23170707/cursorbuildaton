import { CalendarDays, Clock, Heart, MapPinned, Trash2, UserRound } from "lucide-react";
import { categoryOf } from "../data/categories";
import { formatDayLabel, formatDuration, formatTime } from "../lib/format";
import { mapsLink } from "../lib/geo";
import type { Activity } from "../types";

type Props = {
  activity: Activity;
  favorited: boolean;
  onClose: () => void;
  onFavorite: () => void;
  onDelete?: () => void;
};

export function ActivitySheet({ activity, favorited, onClose, onFavorite, onDelete }: Props) {
  const cat = categoryOf(activity.category);
  return (
    <>
      <button className="sheet-backdrop" aria-label="Cerrar" onClick={onClose} />
      <aside className="sheet" role="dialog" aria-labelledby="activity-title">
        <div className="sheet-handle" />
        <div className="sheet-head">
          <div>
            <div className="kicker" style={{ color: cat.color }}>
              {cat.emoji} {cat.label}
              {activity.source === "user" ? " · Publicada por ti" : ""}
            </div>
            <h2 id="activity-title">{activity.title}</h2>
          </div>
          <button className="icon-btn" onClick={onFavorite} aria-label="Guardar" type="button">
            <Heart size={18} fill={favorited ? "#c45c26" : "none"} color={favorited ? "#c45c26" : "currentColor"} />
          </button>
        </div>
        <div className="meta-row">
          <span className="meta">
            <CalendarDays size={14} /> {formatDayLabel(activity.startsAt)}
          </span>
          <span className="meta">
            <Clock size={14} /> {formatTime(activity.startsAt)} · {formatDuration(activity.durationMin)}
          </span>
          <span className="meta">
            <MapPinned size={14} /> {activity.venue}
          </span>
          <span className="meta">
            <UserRound size={14} /> {activity.organizer}
          </span>
        </div>
        <p>{activity.description}</p>
        <div className="actions">
          <a className="btn btn-primary grow" href={mapsLink(activity.lat, activity.lng, activity.venue)} target="_blank" rel="noreferrer">
            Cómo llegar
          </a>
          {onDelete ? (
            <button className="btn btn-danger" type="button" onClick={onDelete}>
              <Trash2 size={16} />
            </button>
          ) : null}
        </div>
      </aside>
    </>
  );
}
