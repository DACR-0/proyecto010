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
    subheader: "PROFESORES A PROGRAMAR",
  },
  {
    id: uniqueId(),
    title: "Profesores",
    icon: IconArrowBadgeRight,
    href: "/principal/profesores",
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
    title: "EXTENCION",
    icon: IconArrowBadgeRight,
    href: "/principal/descargas_exten",
  },
  
  {
    id: uniqueId(),
    title: "Crear-Editar Descarga",
    icon: IconArrowBadgeRight,
    href: "/principal/ec_descarga",
  },
  {
    id: uniqueId(),
    title: "Asignaturas",
    icon: IconArrowBadgeRight,
    href: "/principal/programacion",
  },
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
];

export default Menuitems;
