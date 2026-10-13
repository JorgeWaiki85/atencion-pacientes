# Atención de Pacientes

Aplicación **offline-first** (funciona sin internet) para Android, iPhone y Web.
Los datos se guardan en el dispositivo y, al recuperar la conexión, se envían
automáticamente a **Supabase** (base de datos Postgres en la nube en tiempo real).
Permite **generar PDF** y **enviar por WhatsApp** solo los datos ingresados.

---

## 1. Crear el proyecto en Supabase

1. Entra a https://supabase.com y crea una cuenta gratuita.
2. Crea un **New project** (elige nombre, contraseña y región).
3. Ve a **SQL Editor → New query**, pega TODO el contenido de `supabase/schema.sql`
   y presiona **Run**. Esto crea tablas, roles, seguridad y tiempo real.
4. Ve a **Authentication → Providers → Email** y asegúrate de que esté habilitado.
   - Para pruebas rápidas puedes desactivar "Confirm email" en
     **Authentication → Sign In / Providers → Email**, así el usuario entra de inmediato.
5. Ve a **Project Settings → API** y copia:
   - **Project URL**
   - **anon public** (API key)

## 2. Configurar la aplicación

Abre el archivo `js/config.js` y reemplaza:

```js
window.CONFIG = {
  SUPABASE_URL: "https://TU-PROYECTO.supabase.co",
  SUPABASE_ANON_KEY: "TU-ANON-KEY",
  DISPOSITIVO: "dispositivo-01"   // nombre de este equipo/celular
};
```

## 3. Probar en el computador

Haz doble clic en **`iniciar.bat`** (requiere Node.js instalado) o ejecuta:

```
node server.js
```

Luego abre http://localhost:3020

El **primer usuario** que cree con **CREAR CUENTA** será **ADMINISTRADOR**.

## 4. Instalar en el celular (Android / iPhone)

La app es una **PWA**, por lo que debe estar publicada en internet con HTTPS.
Opciones gratuitas: **Netlify**, **Vercel**, **GitHub Pages** o **Cloudflare Pages**.

- Sube toda esta carpeta `AtencionPacientes` como sitio estático.
- **Android (Chrome):** abre la URL → menú **⋮** → *Instalar aplicación*.
- **iPhone (Safari):** abre la URL → **Compartir** → *Añadir a pantalla de inicio*.
- **Web:** se usa directamente en cualquier navegador.

> Nota: el Service Worker (offline) solo funciona en `localhost` o con **HTTPS**.

## 5. Roles y permisos

El **primer usuario** registrado queda como **ADMINISTRADOR**. Los demás se crean
desde el panel **Usuarios** (visible solo para el ADMINISTRADOR), donde también se
puede **cambiar el rol** y **ELIMINAR** un usuario.

| Rol | Ver todo | Ingresar | Editar informes | Crear usuarios / reportes |
|-----|:--------:|:--------:|:---------------:|:-------------------------:|
| ADMINISTRADOR | Sí | Sí | Sí | Sí |
| MEDICO        | Sí | Sí | No | No |
| ENFERMERA(O)  | Sí | Sí | No | No |
| TENS          | Sí | Sí | No | No |
| RESCATISTA    | Solo lo propio | Sí | No | No |

Los permisos se aplican en dos niveles: en pantalla (se ocultan opciones) y en la
base de datos (RLS de Supabase), así nadie puede saltarse las reglas manipulando el navegador.

## 6. Uso

- **ID / Folio**: se asigna automáticamente (auto-incremental) al guardar en línea.
  Aparece al inicio del formulario y en PDF/WhatsApp.
- **FECHA / HORA**: se llenan automáticamente.
- **Signos vitales**: elija SI / NO. Con SI aparece **+** para agregar tomas
  (Hora automática + PA, FC, FR, SAT, EGT, T°, EVA, CINCINNATI), las veces necesarias.
- **Enfermedades de base**, **Medicamentos**, **Medicamentos administrados** y
  **Tratamiento**: cuadros de texto.
- **ENVIAR POR WHATSAPP**: abre WhatsApp con el resumen (solo campos con datos).
- **GENERAR PDF**: crea el PDF ordenado (títulos y etiquetas en negrita).
- **GUARDAR Y SINCRONIZAR**: guarda local y sube a Supabase cuando hay internet.
- **Registros en línea**: lista en tiempo real. El ADMINISTRADOR puede **Editar** o
  **Eliminar** cada informe desde ahí.

## Unidades por defecto

Al exportar, los valores llevan automáticamente:

| Campo | Sufijo |
|-------|--------|
| FC    | (LTM) |
| FR    | (RPM) |
| SAT   | (% AMBIENTE) |
| EGT   | (MG/DL) |

---

## 7. Eliminar usuarios definitivamente (Edge Function) — opcional pero recomendado

El panel **Usuarios** permite crear y eliminar usuarios. Para **borrar de verdad la
cuenta de acceso** (y no solo su perfil) se usa una pequeña función segura en Supabase,
`admin-usuarios` (código en `supabase/functions/admin-usuarios/index.ts`). Usa la clave
de servicio **en el servidor**, nunca en el navegador, y verifica que quien llama sea
ADMINISTRADOR.

**Si NO se instala la función:** los botones siguen funcionando; al eliminar se borra el
perfil y el usuario **deja de poder entrar** (queda deshabilitado), pero su cuenta de
correo sigue existiendo.

**Instalación (una sola vez):**

1. Supabase → **Edge Functions** → **Create a new function**.
2. Nombre exacto: `admin-usuarios`.
3. Borre el código de ejemplo y pegue el contenido de
   `supabase/functions/admin-usuarios/index.ts`.
4. **Deploy**. No hay que configurar claves: Supabase entrega
   `SUPABASE_URL`, `SUPABASE_ANON_KEY` y `SUPABASE_SERVICE_ROLE_KEY` automáticamente.
5. Desactive **Verify JWT** si la consola lo pide (la función valida el token por su cuenta),
   o déjelo activado — funciona de ambas formas.

---

## Estructura

```
AtencionPacientes/
  index.html            Formulario + login + panel Usuarios
  manifest.webmanifest  Configuración PWA
  sw.js                 Service Worker (offline)
  server.js             Servidor local (sin dependencias)
  iniciar.bat           Lanzador en Windows
  css/styles.css        Estilos
  js/config.js          <- CONFIGURAR AQUÍ
  js/app.js             Lógica (offline, sync, roles, PDF, WhatsApp)
  lib/                  Librerías (Supabase, jsPDF)
  icons/                Iconos de la app
  supabase/schema.sql   Esquema (tablas, roles, RLS, tiempo real)
  supabase/functions/admin-usuarios/index.ts   Función segura (crear/eliminar usuarios)
```
