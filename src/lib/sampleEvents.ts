import type { Activity, CategoryId } from "../types";
import { offsetPoint } from "./geo";
import { addDays, startOfDay, uid } from "./format";

type Template = {
  title: string;
  category: CategoryId;
  description: string;
  venue: string;
  organizer: string;
  durationMin: number;
  dayOffset: number;
  hour: number;
  minute: number;
  north: number;
  east: number;
};

const TEMPLATES: Template[] = [
  {
    title: "Jazz al atardecer",
    category: "musica",
    description: "Trío en vivo, luces cálidas y ambiente de terraza. Lleva una manta si quieres sentarte en el pasto.",
    venue: "Plaza principal",
    organizer: "Colectivo Sonora",
    durationMin: 120,
    dayOffset: 0,
    hour: 19,
    minute: 0,
    north: 420,
    east: -180,
  },
  {
    title: "Caminata al amanecer",
    category: "caminata",
    description: "Ruta suave de 5 km por el centro y los parques. Ritmo conversado, para todos los niveles.",
    venue: "Parque central",
    organizer: "Caminantes del barrio",
    durationMin: 90,
    dayOffset: 1,
    hour: 7,
    minute: 30,
    north: 980,
    east: 640,
  },
  {
    title: "Stand up bajo las estrellas",
    category: "show",
    description: "Tres comediantes locales y un open mic. Hay barra de café y sillas, pero llega temprano.",
    venue: "Foro al aire libre",
    organizer: "Noche Abierta",
    durationMin: 100,
    dayOffset: 0,
    hour: 21,
    minute: 0,
    north: -520,
    east: 310,
  },
  {
    title: "Cine en la plaza",
    category: "cultura",
    description: "Proyección gratuita de un clásico latinoamericano. Palomitas a precio popular y manta colectiva.",
    venue: "Explanada municipal",
    organizer: "Cine Barrial",
    durationMin: 130,
    dayOffset: 2,
    hour: 20,
    minute: 0,
    north: 160,
    east: 880,
  },
  {
    title: "Feria de antojitos",
    category: "gastro",
    description: "Puestos de cocina de la zona, música de fondo y concurso de salsas. Ideal para ir en familia.",
    venue: "Mercado de la 8",
    organizer: "Asociación de cocineras",
    durationMin: 180,
    dayOffset: 3,
    hour: 13,
    minute: 0,
    north: -900,
    east: -420,
  },
  {
    title: "Fútbol 7 en la unidad",
    category: "deporte",
    description: "Partido abierto. Lleva playera clara u oscura. Hay hidratación y un mix rápido al final.",
    venue: "Cancha de la unidad",
    organizer: "Liga vecinal",
    durationMin: 80,
    dayOffset: 1,
    hour: 18,
    minute: 30,
    north: 1400,
    east: -700,
  },
  {
    title: "Trueque de plantas",
    category: "comunidad",
    description: "Trae un esqueje o una maceta y llévate otra. También hay taller corto de compostaje.",
    venue: "Jardín comunitario",
    organizer: "Manos Verdes",
    durationMin: 120,
    dayOffset: 4,
    hour: 11,
    minute: 0,
    north: -240,
    east: -1100,
  },
  {
    title: "Sesión acústica en el café",
    category: "musica",
    description: "Cantautoras de la ciudad en formato íntimo. Cubierto de consumo mínimo.",
    venue: "Café La Esquina",
    organizer: "Disquera Independiente",
    durationMin: 90,
    dayOffset: 5,
    hour: 20,
    minute: 30,
    north: 700,
    east: 240,
  },
  {
    title: "Tour de murales",
    category: "caminata",
    description: "Recorrido guiado por 9 murales del barrio. Historia, técnicas y foto grupal al cierre.",
    venue: "Andador cultural",
    organizer: "Ruta Mural",
    durationMin: 110,
    dayOffset: 6,
    hour: 17,
    minute: 0,
    north: -1300,
    east: 500,
  },
  {
    title: "Teatro de bolsillo",
    category: "show",
    description: "Obra corta de una compañía local. Cupo limitado, llega 15 minutos antes.",
    venue: "Casa de cultura",
    organizer: "Compañía del Puente",
    durationMin: 75,
    dayOffset: 2,
    hour: 19,
    minute: 30,
    north: 300,
    east: -760,
  },
  {
    title: "Yoga en el parque",
    category: "deporte",
    description: "Clase gratuita de hatha al aire libre. Lleva tapete. Nivel principiante-intermedio.",
    venue: "Prado norte",
    organizer: "Aliento Colectivo",
    durationMin: 60,
    dayOffset: 3,
    hour: 8,
    minute: 0,
    north: 1100,
    east: 1100,
  },
  {
    title: "Mercado de vinilos y fanzines",
    category: "cultura",
    description: "Ediciones independientes, DJs en vivo y taller de encuadernación a las 16 h.",
    venue: "Pasaje de los oficios",
    organizer: "Club de la esquina",
    durationMin: 240,
    dayOffset: 6,
    hour: 12,
    minute: 0,
    north: -640,
    east: 980,
  },
];

export function generateSampleActivities(cityName: string, cityKey: string, lat: number, lng: number): Activity[] {
  const origin = startOfDay(new Date());
  return TEMPLATES.map((template) => {
    const starts = addDays(origin, template.dayOffset);
    starts.setHours(template.hour, template.minute, 0, 0);
    const point = offsetPoint(lat, lng, template.north, template.east);
    return {
      id: uid("seed"),
      title: template.title,
      category: template.category,
      description: template.description,
      venue: `${template.venue} · ${cityName}`,
      lat: point.lat,
      lng: point.lng,
      startsAt: starts.toISOString(),
      durationMin: template.durationMin,
      organizer: template.organizer,
      source: "seed",
      cityKey,
    };
  });
}
