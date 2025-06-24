# BeesinessHive

BeesinessHive es una plataforma web diseñada para mejorar la gestión de apicultores, permitiendo el registro de actividades, manejo de apiarios y colmenas, así como la compra y venta de productos apícolas a través de un marketplace. El sistema conecta apicultores y compradores, facilitando la administración y el crecimiento de la comunidad apícola.

## Tabla de Contenidos

- [Características](#características)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Scripts Disponibles](#scripts-disponibles)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Componentes Principales](#componentes-principales)
- [Rutas Principales](#rutas-principales)
- [Créditos](#créditos)

---

## Características

- **Gestión de Apiarios y Colmenas:** Registro, edición y visualización de apiarios y colmenas.
- **Bitácoras:** Registro de actividades y notas por apiario y colmena.
- **Marketplace:** Compra y venta de productos apícolas.
- **Notificaciones:** Sistema de notificaciones para usuarios.
- **Autenticación y Roles:** Registro, login y gestión de roles (apicultor/productor, comprador).
- **Panel de Usuario:** Visualización y edición de perfil.
- **Responsive Design:** Interfaz adaptable a dispositivos móviles y escritorio.

---

## Estructura del Proyecto

```
beesinesshive/
│
├── public/                  # Archivos públicos (favicon, imágenes)
├── src/
│   ├── assets/              # Imágenes y recursos gráficos
│   ├── components/
│   │   ├── enrutador/       # Enrutador principal (Enrutador.jsx)
│   │   ├── general/         # Navbar, Footer, Body, Notificaciones, etc.
│   │   ├── productor/       # Funcionalidades para apicultores/productores
│   │   ├── comprador/       # Funcionalidades para compradores
│   │   └── ...              # Otros componentes
│   ├── index.css            # Estilos globales
│   └── main.jsx             # Punto de entrada de React
├── server_TG/               # Modelos y lógica de backend (Node.js/Express)
├── package.json             # Dependencias y scripts
├── vite.config.js           # Configuración de Vite
└── index.html               # HTML principal
```

---

## Instalación

1. **Clona el repositorio:**
   ```sh
   git clone <URL-del-repositorio>
   cd beesinesshive
   ```

2. **Instala las dependencias:**
   ```sh
   npm install
   ```

3. **Inicia el servidor de desarrollo:**
   ```sh
   npm run dev
   ```

---

## Scripts Disponibles

- `npm run dev` — Inicia el servidor de desarrollo en modo local.
- `npm run build` — Genera la build de producción.
- `npm run preview` — Previsualiza la build de producción.
- `npm run lint` — Ejecuta ESLint para analizar el código.

---

## Tecnologías Utilizadas

- **Frontend:** React, Vite, CSS Modules, SweetAlert2, Material UI Icons
- **Routing:** React Router DOM
- **Backend:** Node.js, Express (en `server_TG/`)
- **Autenticación:** JWT
- **Otros:** date-fns, jwt-decode, browser-image-compression

---

## Componentes Principales

- [`src/components/enrutador/Enrutador.jsx`](src/components/enrutador/Enrutador.jsx): Enrutador principal de la aplicación.
- [`src/components/general/navbar/Navbar.jsx`](src/components/general/navbar/Navbar.jsx): Barra de navegación superior.
- [`src/components/general/body/Body.jsx`](src/components/general/body/Body.jsx): Página de inicio y presentación.
- [`src/components/productor/crearProducto/CrearProducto.jsx`](src/components/productor/crearProducto/CrearProducto.jsx): Formulario para crear productos.
- [`src/components/general/notificaciones/NotificacionesMarketplace.jsx`](src/components/general/notificaciones/NotificacionesMarketplace.jsx): Notificaciones del marketplace.
- [`src/components/productor/gestiones/apiario/CardApiario.jsx`](src/components/productor/gestiones/apiario/CardApiario.jsx): Tarjeta de apiario.
- [`src/components/productor/gestiones/colmena/CardColmena.jsx`](src/components/productor/gestiones/colmena/CardColmena.jsx): Tarjeta de colmena.

---

## Rutas Principales

Las rutas están definidas en [`src/components/enrutador/Enrutador.jsx`](src/components/enrutador/Enrutador.jsx):

- `/` — Página de inicio
- `/login` — Inicio de sesión
- `/signUpProductor` — Registro de apicultor/productor
- `/signUpComprador` — Registro de comprador
- `/principalCards` — Panel principal del usuario
- `/MarketplaceProd` — Marketplace para productos
- `/gestionApiarios` — Gestión de apiarios
- `/EditarApicultor` — Edición de perfil de apicultor
- `/notificaciones` — Notificaciones del marketplace

---

## Créditos

**Equipo de desarrollo:**
- Andres
- Emily
- Jordy
- David
- Valentina
- Fabio

Imágenes y recursos en [`src/assets/`](src/assets/).

---

**¡Gracias por usar