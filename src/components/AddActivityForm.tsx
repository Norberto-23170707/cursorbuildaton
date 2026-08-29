import { useState, type FormEvent } from "react";
import { CATEGORIES } from "../data/categories";
import { defaultStartValue } from "../lib/format";
import type { CategoryId } from "../types";

type Props = {
  lat: number;
  lng: number;
  onCancel: () => void;
  onSave: (input: {
    title: string;
    category: CategoryId;
    description: string;
    venue: string;
    organizer: string;
    startsAt: string;
    durationMin: number;
    lat: number;
    lng: number;
  }) => void;
};

export function AddActivityForm({ lat, lng, onCancel, onSave }: Props) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<CategoryId>("musica");
  const [description, setDescription] = useState("");
  const [venue, setVenue] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [startsAt, setStartsAt] = useState(defaultStartValue);
  const [durationMin, setDurationMin] = useState(90);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!title.trim() || !venue.trim()) return;
    onSave({
      title: title.trim(),
      category,
      description: description.trim() || "Actividad publicada por alguien de la ciudad.",
      venue: venue.trim(),
      organizer: organizer.trim() || "Vecindario",
      startsAt: new Date(startsAt).toISOString(),
      durationMin,
      lat,
      lng,
    });
  }

  return (
    <aside className="sheet sheet-form" role="dialog" aria-labelledby="add-title">
      <div className="sheet-handle" />
      <div className="kicker">Nueva actividad</div>
      <h2 id="add-title">Cuéntanos qué se arma</h2>
      <form className="form-grid" onSubmit={submit}>
        <label className="field">
          Título
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej. Concierto en la plaza" required />
        </label>
        <div className="cat-grid">
          {CATEGORIES.map((item) => (
            <button
              type="button"
              key={item.id}
              className={`cat-pick ${category === item.id ? "is-on" : ""}`}
              style={category === item.id ? { background: item.color } : undefined}
              onClick={() => setCategory(item.id)}
            >
              {item.emoji} {item.short}
            </button>
          ))}
        </div>
        <label className="field">
          Lugar
          <input value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Parque, foro, café…" required />
        </label>
        <div className="field-row">
          <label className="field">
            Cuándo
            <input type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} required />
          </label>
          <label className="field">
            Duración
            <select value={durationMin} onChange={(e) => setDurationMin(Number(e.target.value))}>
              <option value={45}>45 min</option>
              <option value={60}>1 h</option>
              <option value={90}>1 h 30</option>
              <option value={120}>2 h</option>
              <option value={180}>3 h</option>
            </select>
          </label>
        </div>
        <label className="field">
          Quién organiza
          <input value={organizer} onChange={(e) => setOrganizer(e.target.value)} placeholder="Colectivo, banda, vecinos…" />
        </label>
        <label className="field">
          Qué va a pasar
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Cuéntale a la ciudad por qué vale la pena ir." />
        </label>
        <div className="actions sheet-actions">
          <button className="btn btn-ghost" type="button" onClick={onCancel}>
            Cancelar
          </button>
          <button className="btn btn-primary grow" type="submit">
            Publicar
          </button>
        </div>
      </form>
    </aside>
  );
}
