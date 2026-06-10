# Emprax

## 1. Visión General del Proyecto
**Emprax** es una aplicación móvil desarrollada con React Native, Expo y Supabase. Su principal objetivo es conectar a estudiantes con empresas (o universidades) para gestionar ofertas de prácticas profesionales, postulaciones, y procesos de entrevista. Cuenta con perfiles diferenciados: **Estudiante** y **Universidad/Empresa**, cada uno con flujos y vistas personalizadas.

---

## 2. UI/UX Design System y Paleta de Colores

El sistema de diseño de Emprax está enfocado en una apariencia limpia, profesional e intuitiva, combinando elementos que inspiran confianza (azules) con llamados a la acción dinámicos y atractivos (naranjas/amarillos).

### 2.1 Paleta de Colores Principal

**Colores de Marca e Interacción:**
- **Azul Profesional (Splash):** `#0A66C2` - Usado para el fondo de la pantalla de carga (Splash) que transmite seriedad y enfoque profesional.
- **Azul Interactivo:** `#2563EB` - Usado para enlaces, textos resaltados y llamados a la acción secundarios (ej. "¿No tienes cuenta? Regístrate").
- **Naranja / Amarillo (Call to Action):** `#F5B75A` - Usado en botones de acción principal (ej. Botón de "Acceder").
- **Naranja Resalte:** `#F4A52A` - Usado para palabras clave dentro del texto para enfocar la atención del usuario.

**Colores Neutros y Fondos:**
- **Fondo Principal App:** `#F8F9FA` - Un tono gris muy claro que permite que las tarjetas destaquen sin cansar la vista.
- **Fondo de Tarjetas (Cards):** `#FFFFFF` - Blanco puro, usando sombras suaves (`elevation: 6`) para crear sensación de profundidad.
- **Fondo de Inputs:** `#F6F1F2` - Gris suave con matiz cálido para distinguir claramente los campos de texto.

**Colores de Tipografía:**
- **Títulos (Oscuros):** `#1A1A1A` / `#1F1F1F` - Para encabezados principales y subtítulos.
- **Textos Secundarios y Etiquetas:** `#8B8B8B` - Para los "labels" de los inputs y descripciones secundarias.
- **Placeholders:** `#AAAAAA` - Texto sugerido en formularios.
- **Textos en Botones Primarios:** `#FFFFFF` - Asegura alto contraste sobre los botones naranjas o azules.

### 2.2 Tema Base del Sistema (Light/Dark Mode)
A nivel estructural, la aplicación cuenta con una definición de colores nativa que soporta modos claro y oscuro:
- **Light Mode:** Textos en `#11181C`, Fondos `#fff`, Iconos `#687076`, Tinte principal `#0a7ea4`.
- **Dark Mode:** Textos en `#ECEDEE`, Fondos `#151718`, Iconos `#9BA1A6`, Tinte principal `#fff`.

### 2.3 Tipografía
El proyecto utiliza tipografías nativas del sistema, lo cual optimiza el rendimiento y mantiene un "look & feel" natural según el dispositivo:
- **iOS:** `system-ui`, `ui-rounded`, etc.
- **Web / Android:** `Roboto`, `Helvetica`, `-apple-system`.

### 2.4 Componentes UI (Design System)
- **Tarjetas (Cards):** Utilizan bordes redondeados pronunciados (`borderRadius: 32`), fondos blancos y sombras caídas (`shadowColor: '#000', shadowOpacity: 0.15`).
- **Inputs:** Cajas con altura generosa (`52px`), esquinas suavemente redondeadas (`borderRadius: 8`) y etiquetas claras por encima del campo.
- **Botones:** Botones robustos, con el texto en minúsculas estilizadas (ej. "acceder") o mayúsculas iniciales, elevación táctil y "ActivityIndicator" nativos durante tiempos de carga.
- **Navegación:** Tab Bar inferior limpia e iconografía de `@expo/vector-icons` (Ionicons).

---

## 3. Guía de Uso del Software

### 3.1 Inicio y Autenticación
1. **Splash Screen:** Al abrir la app, verás una animación del logo (Birrete) y un mensaje de bienvenida.
2. **Login / Registro:** 
   - Si no tienes cuenta activa, la app te dirigirá a la pantalla de **Acceso (Login)**.
   - Puedes alternar entre **Iniciar Sesión** y **Registrarse** usando el enlace al final del formulario.
   - El acceso requiere un **Correo Electrónico** y **Contraseña**. Al autenticarse correctamente, el sistema detecta automáticamente tu rol (Estudiante o Universidad).

### 3.2 Experiencia del Estudiante
Si el sistema detecta que eres estudiante, tendrás acceso a un menú inferior (Bottom Menu) con 4 vistas principales:
- **Inicio (Dashboard):** Muestra un resumen de tu actividad. Aquí verás contadores de tus prácticas aplicadas y entrevistas programadas. Puedes ver las postulaciones que has hecho y, si es necesario, retirar tu postulación a alguna de ellas.
- **Ofertas (Catálogo):** Muestra todas las vacantes de prácticas disponibles. En cada oferta podrás leer los detalles, marcarla como **Favorita** para verla después, o **Postularte** directamente desde ahí.
- **Favoritos:** Un acceso rápido para visualizar únicamente aquellas ofertas de prácticas que marcaste con el icono de "Favorito" o corazón.
- **Perfil:** Espacio donde el estudiante puede actualizar o ver su información personal (nombre, habilidades, etc.) y gestionar su cuenta.

### 3.3 Experiencia de Universidad / Empresa
Si el sistema te reconoce como un perfil institucional o administrador:
- **Admin Dashboard:** Accederás a un panel de control distinto donde podrás gestionar ofertas creadas, revisar listas de postulantes, ver qué estudiantes se han aplicado a las vacantes, y eventualmente aprobar o continuar el proceso de entrevistas.

### 3.4 Acciones Transversales
- **Cerrar Sesión:** Accesible desde el menú inferior o desde el perfil. Se requiere confirmar mediante una ventana emergente para evitar cierres accidentales.
- **Alertas y Notificaciones:** Durante el uso, la aplicación utiliza notificaciones flotantes (Toast) para avisar sobre procesos exitosos ("Te has postulado") o errores ("Revisa tus credenciales").

---

## 4. Desarrollo y Despliegue (Expo)

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

### Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a
- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

### Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.
