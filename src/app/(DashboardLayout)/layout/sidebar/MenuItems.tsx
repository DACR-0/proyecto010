import {
  IconAperture,
  IconCopy,
  IconLayoutDashboard,
  IconLogin,
  IconMoodHappy,
  IconTypography,
  IconUserPlus,
  IconArrowBadgeRightFilled,
  IconArrowBadgeRight,
  IconAB2,
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const Menuitems = [
  {
    navlabel: true,
    subheader: "Home",
  },

  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconLayoutDashboard,
    href: "/",
  },
  {
    navlabel: true,
    subheader: "PROFESORES",
  },
  {
    id: uniqueId(),
    title: "Profesores Planta",
    icon: IconArrowBadgeRight,
    href: "/principal/profesores",
  },
  {
    id: uniqueId(),
    title: "Profesores Catedra",
    icon: IconArrowBadgeRight,
    href: "/principal/profesores_catedra",
  },
  {
    navlabel: true,
    subheader: "DESCARGAS ACADEMICAS",
  },
  {
    id: uniqueId(),
    title: "FUNCIÓN ADMINISTRATIVA",
    icon: IconArrowBadgeRight,
    href: "/principal/descargas_admin",
  },
  {
    id: uniqueId(),
    title: "INVESTIGACION",
    icon: IconArrowBadgeRight,
    href: "/principal/descargas_inves",
  },
  {
    id: uniqueId(),
    title: "EXTENSION",
    icon: IconArrowBadgeRight,
    href: "/principal/descargas_exten",
  },
  {
    id: uniqueId(),
    title: "TOTAL DESCARGAS",
    icon: IconArrowBadgeRight,
    href: "/principal/descargas_tabla",
  },
  {
    navlabel: true,
    subheader: "SITUACIONES ADMINISTRATIVAS",
  },
  {
    id: uniqueId(),
    title: "Situaciones administrativas",
    icon: IconArrowBadgeRight,
    href: "/principal/s_administrativa",
  },
  {
    navlabel: true,
    subheader: "HISTORICO",
  },
  {
    id: uniqueId(),
    title: "Historico Programacion",
    icon: IconArrowBadgeRight,
    href: "/principal/p_a_h",
  },
  {
    id: uniqueId(),
    title: "Modificaciones",
    icon: IconArrowBadgeRight,
    href: "/principal/modificaciones",
  },
  {
    id: uniqueId(),
    title: "Asignaturas",
    icon: IconArrowBadgeRight,
    href: "/principal/programacion",
  },
  {
    navlabel: true,
    subheader: "CARGUES",
  },
  {
    id: uniqueId(),
    title: "Cargue de Plantillas",
    icon: IconArrowBadgeRight,
    href: "/principal/Cargues",
  },
  {
    id: uniqueId(),
    title: "Plantillas",
    icon: IconArrowBadgeRight,
    href: "/principal/plantillas",
  },
  /* 
  {
    navlabel: true,
    subheader: "Utilities",
  },
  {
    id: uniqueId(),
    title: "Typography",
    icon: IconTypography,
    href: "/utilities/typography",
  },
  {
    id: uniqueId(),
    title: "Shadow",
    icon: IconCopy,
    href: "/utilities/shadow",
  },
  {
    navlabel: true,
    subheader: "Extra",
  },
  {
    id: uniqueId(),
    title: "Icons",
    icon: IconMoodHappy,
    href: "/icons",
  },
  {
    id: uniqueId(),
    title: "Sample Page",
    icon: IconAperture,
    href: "/sample-page",
  },
  */
];

export default Menuitems;
