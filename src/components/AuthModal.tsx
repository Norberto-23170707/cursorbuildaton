import { useState, type FormEvent } from "react";
import { useApp } from "../context/AppContext";

export function AuthModal() {
  const { authOpen, authIntent, closeAuth, register } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  if (!authOpen) return null;

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim() || !email.trim()) return;
    register({ name: name.trim(), email: email.trim().toLowerCase() });
    setName("");
    setEmail("");
  }

  const lead =
    authIntent === "join"
      ? "Regístrate para apuntarte a esta actividad."
      : authIntent === "publish"
        ? "Necesitas una cuenta para publicar un evento en el mapa."
        : "Crea una cuenta para publicar actividades y apuntarte a las que te gusten.";

  return (
    <div className="modal-layer">
      <form className="panel onboard-card auth-card" onSubmit={submit}>
        <div className="brand">Cerca</div>
        <h1>Crea tu cuenta</h1>
        <p className="lead">{lead}</p>
        <label className="field">
          Nombre
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" required />
        </label>
        <label className="field">
          Correo
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.com"
            required
          />
        </label>
        <div className="actions" style={{ marginTop: 12 }}>
          <button className="btn btn-ghost" type="button" onClick={closeAuth}>
            Cancelar
          </button>
          <button className="btn btn-primary grow" type="submit">
            Registrarme
          </button>
        </div>
      </form>
    </div>
  );
}
