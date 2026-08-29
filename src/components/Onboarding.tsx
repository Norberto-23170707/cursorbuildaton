import { CityPicker } from "./CityPicker";
import { useApp } from "../context/AppContext";

export function Onboarding() {
  const { completeOnboarding } = useApp();
  return (
    <section className="onboard">
      <CityPicker
        title="Lo que está pasando, a una cuadra."
        lead="Música, caminatas, shows, ferias y todo lo que se arma en tu ciudad, pinado en el mapa."
        onPick={completeOnboarding}
      />
    </section>
  );
}
