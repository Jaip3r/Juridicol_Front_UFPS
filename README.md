# Juridicol Frontend UFPS

Este proyecto corresponde al frontend de la aplicación Juridicol UFPS. Está desarrollado sobre React con Vite como empaquetador y utiliza Chakra UI para el diseño de la interfaz, así como otras librerías para la gestión de formularios, gráficos y generación de reportes en PDF.

## 📦 Tecnologías y librerías principales

- **React**: Biblioteca para la construcción de interfaces de usuario.
- **Vite**: Empaquetador y servidor de desarrollo rápido.
- **Chakra UI**: Biblioteca de componentes UI accesibles y personalizables.
- **React Hook Form**: Manejo de formularios reactivos.
- **React Router DOM**: Navegación y enrutamiento dentro de la SPA.
- **Axios**: Cliente HTTP para llamadas a APIs.
- **React Chartjs 2 + Chart.js**: Visualización de datos a través de gráficos.
- **yup & @hookform/resolvers**: Validación de formularios basada en esquemas.
- **React Hot Toast**: Notificaciones estilo toast.
- **@react-pdf/renderer**: Exportación a PDF.

## 🛠️ Requisitos previos

- **Node.js** (Se recomienda versión 18.x o superior)
- **npm** o **yarn** instalado globalmente.

## 🚧 Instalación

Clona el repositorio del frontend:

```bash
git clone https://github.com/Jaip3r/Juridicol_Front_UFPS.git
cd juridicol-front
```

Instala las dependencias:

```bash
npm install
```

ó

```bash
yarn install
```

## 📂 Estructura del proyecto

```bash
juridicol-front/
├── public/                 # Archivos públicos
├── src/
│   ├── components/         # Componentes reutilizables
|   ├── context/            # Contextos globales
│   ├── hooks/              # Custom hooks
│   ├── icons/              # Iconos personalizados
│   ├── pages/              # Vistas principales de la aplicación
│   ├── routes/             # Rutas de la aplicación
│   ├── services/           # Lógica de integración con la API
│   ├── utils/              # Funciones auxiliares y utilidades
│   └── main.jsx            # Punto de entrada de la aplicación
├── .eslint.config.js       # Configuración de ESLint
├── package.json            # Configuración del proyecto y dependencias
└── vite.config.js          # Configuración de Vite
└─ ...
```

## 🖥️ Ejecución del proyecto

### Desarrollo

Inicia el servidor de desarrollo de Vite:

```bash
npm run dev
```

Esto levantará la aplicación en http://localhost:5173 (por defecto) o la dirección que indique Vite en tu terminal.

Mientras el servidor de desarrollo esté activo, cualquier cambio en los archivos recargará automáticamente la página.

### Construcción para producción

Genera una build optimizada para producción en la carpeta dist:

```bash
npm run build
```

Puedes hacer previsualización de la build con:

```bash
npm run preview
```

Esto iniciará un servidor local para ver el resultado final antes de desplegarlo.

### Linter

El proyecto utiliza ESLint para mantener la calidad del código:

```bash
npm run lint
```

Corrige automáticamente los problemas que puedan ser solucionados:

```bash
npm run lint --fix
```

## 🚀 Despliegue

La carpeta dist generada por npm run build contiene los archivos estáticos optimizados. Estos pueden ser desplegados en cualquier servicio de hosting estático, como por ejemplo:

* Netlify
* Vercel
* GitHub Pages
* Servidores web personales (Nginx, Apache, etc.)

Para desplegar, simplemente copia el contenido de dist al servidor o utiliza las integraciones y CLI de las plataformas mencionadas.

