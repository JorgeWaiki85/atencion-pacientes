/* ============================================================
   CONFIGURACION  -  ATENCION DE PACIENTES
   ------------------------------------------------------------
   Esta app comparte la MISMA base de datos que SCEM
   (Sistema de Comando de Eventos Masivos), de modo que los
   pacientes atendidos aqui aparecen en el informe del evento
   correspondiente en SCEM.

   Supabase -> Project Settings -> API
     - Project URL            -> SUPABASE_URL
     - anon public (API key)  -> SUPABASE_ANON_KEY

   La "anon key" es PUBLICA y segura para el navegador:
   la seguridad real la dan las politicas RLS del archivo
   supabase/schema.sql
   ============================================================ */

window.CONFIG = {
  SUPABASE_URL: "https://btrcuaeimngkdojptilj.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0cmN1YWVpbW5na2RvanB0aWxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxMTI2MTIsImV4cCI6MjEwNzY4ODYxMn0.zIgHvZgoxoPkLB4KN4FIhHzAu4K0B1--pHzTwsUoTQg",

  // Nombre que identifica a este dispositivo en los registros
  DISPOSITIVO: "dispositivo-01",
};
