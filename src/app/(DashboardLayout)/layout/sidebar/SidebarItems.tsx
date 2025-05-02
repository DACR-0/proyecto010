import React from "react";
import Menuitems from "./MenuItems";
import { usePathname } from "next/navigation";
import { Box, List } from "@mui/material";
import NavItem from "./NavItem";
import NavGroup from "./NavGroup/NavGroup";

const SidebarItems = ({ toggleMobileSidebar }: any) => {
  const pathname = usePathname(); // Obtiene la ruta actual
  const pathDirect = pathname; // Guarda la ruta actual en una variable

  return (
    <Box sx={{ px: 3 }}>
      <List sx={{ pt: 0 }} className="sidebarNav" component="div">
        {Menuitems.map((item) => {
          // Si el ítem tiene un 'subheader', se renderiza un grupo de navegación
          if (item.subheader) {
            return <NavGroup item={item} key={item.subheader} />;

          // Si no tiene 'subheader', renderizamos un ítem de navegación individual
          } else {
            return (
              <NavItem
                item={item}
                key={item.id} // Asegúrate de que 'id' sea único
                pathDirect={pathDirect} // Pasa la ruta actual
                onClick={toggleMobileSidebar} // Cierra el sidebar en dispositivos móviles
              />
            );
          }
        })}
      </List>
    </Box>
  );
};

export default SidebarItems;

