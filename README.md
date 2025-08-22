# PlannIt - Una Aplicación de Planning Poker en Tiempo Real

PlannIt es una aplicación web que facilita las sesiones de planning poker para equipos ágiles. Permite a los equipos estimar los puntos de historia de sus tareas en un entorno colaborativo y en tiempo real.

## Características

- **Crear y Unirse a Salas:** Crea fácilmente una nueva sala de estimación o únete a una existente con un código de sala.
- **Colaboración en Tiempo Real:** Todos los participantes en la sala ven las actualizaciones en tiempo real, incluyendo quién ha votado y cuándo se revelan los votos.
- **Estimación de Puntos de Historia:** Los jugadores pueden seleccionar una de las cartas para emitir su voto sobre la complejidad de una tarea.
- **Controles de Administrador:** El creador de la sala (administrador) puede controlar el flujo de la sesión de estimación revelando las cartas y comenzando una nueva ronda.
- **Modo Espectador:** Los usuarios pueden unirse a una sala como espectadores para observar la sesión sin participar en la votación.
- **Diseño Responsivo:** La aplicación está diseñada para funcionar en varios tamaños de pantalla, desde dispositivos móviles hasta computadoras de escritorio.

## Tecnologías Utilizadas

- **Framework:** [Next.js](https://nextjs.org/) (usando el App Router)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Backend y Base de Datos en Tiempo Real:** [Firebase](https://firebase.google.com/) (Realtime Database y Authentication)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
- **Componentes de UI:** [shadcn/ui](https://ui.shadcn.com/)

## Cómo Empezar

Sigue estas instrucciones para obtener una copia del proyecto y ejecutarlo en tu máquina local para fines de desarrollo y prueba.

### Prerrequisitos

- [Node.js](https://nodejs.org/) (se recomienda la versión 18 o superior)
- Un gestor de paquetes como [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/), o [pnpm](https://pnpm.io/)

### Instalación

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/plannit.git
    cd plannit
    ```

2.  **Instala las dependencias:**
    ```bash
    npm install
    # o
    yarn install
    # o
    pnpm install
    ```

3.  **Configura las variables de entorno:**

    Crea un archivo llamado `.env.local` en la raíz del proyecto y agrega las siguientes claves de configuración de Firebase. Puedes obtenerlas de la configuración de tu proyecto de Firebase.

    ```
    NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
    NEXT_PUBLIC_FIREBASE_DATABASE_URL=tu_database_url
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=tu_measurement_id
    ```

4.  **Ejecuta el servidor de desarrollo:**
    ```bash
    npm run dev
    # o
    yarn dev
    # o
    pnpm dev
    ```

5.  Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver el resultado.

## Estructura del Proyecto

El proyecto sigue la estructura estándar del App Router de Next.js:

```
.
├── app/                  # Carpeta principal de la aplicación
│   ├── create/           # Página para crear una nueva sala
│   ├── join/             # Página para unirse a una sala existente
│   ├── room/[roomId]/    # Ruta dinámica para la sala de estimación
│   ├── layout.tsx        # Layout raíz
│   └── page.tsx          # Página de inicio
├── components/           # Componentes de UI reutilizables
│   └── ui/               # Componentes de shadcn/ui
├── lib/                  # Librerías y funciones de ayuda
│   ├── api.ts            # Cliente de API para interactuar con el backend
│   ├── firebase.ts       # Configuración y servicios de Firebase
│   └── utils.ts          # Funciones de utilidad
├── public/               # Archivos estáticos
└── styles/               # Estilos globales
```

## Cómo Funciona

1.  **Crear una Sala:** Un usuario navega a la página "Crear Sala", introduce su nombre y se crea una nueva sala en Firebase. A continuación, se le proporciona un código de sala único para que lo comparta con su equipo.

2.  **Unirse a una Sala:** Otros miembros del equipo pueden ir a la página "Unirse a Sala" e introducir el código de la sala y su nombre para unirse a la sesión.

3.  **Proceso de Estimación:**
    - Una vez en la sala, todos los participantes pueden ver la lista de jugadores.
    - Los jugadores pueden seleccionar una carta con un valor de punto de historia para emitir su voto. Su estado se actualizará a "Ha votado".
    - El administrador de la sala puede ver quién ha votado.

4.  **Revelar las Cartas:**
    - Cuando el administrador decide revelar las cartas, todos los votos se muestran a cada participante.
    - Se calcula y se muestra el promedio de todos los votos numéricos.

5.  **Comenzar una Nueva Ronda:** El administrador puede comenzar una nueva ronda, lo que borrará todos los votos actuales y reiniciará las cartas, permitiendo al equipo estimar una nueva tarea.

6.  **Modo Espectador:** Cualquier usuario en la sala puede cambiar entre ser un "Votante" y un "Espectador". Los espectadores no pueden votar, pero pueden ver el resultado de la estimación.
