import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/privacidad")({
  head: () => ({
    meta: [
      { title: "Política de Privacidad — opoFITor" },
      { name: "description", content: "Cómo tratamos tus datos personales y de rendimiento deportivo en opoFITor conforme al RGPD." },
    ],
  }),
  component: PrivacidadPage,
});

function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="px-4 py-6 max-w-3xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-[image:var(--gradient-primary)] grid place-items-center">
            <Shield className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold tracking-tight text-lg">
            opo<span className="text-primary">FIT</span>or
          </span>
        </Link>
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Volver
        </Link>
      </header>

      <main className="px-4 pb-24 max-w-3xl mx-auto prose prose-invert">
        <h1 className="text-3xl font-display font-bold">Política de Privacidad</h1>
        <p className="text-sm text-muted-foreground">Última actualización: {new Date().toLocaleDateString("es-ES")}</p>

        <section className="mt-8 space-y-4 text-sm leading-relaxed text-muted-foreground">
          <h2 className="text-lg font-semibold text-foreground">1. Responsable del tratamiento</h2>
          <p>
            opoFITor es el responsable del tratamiento de los datos personales que el usuario facilita al
            registrarse y utilizar la aplicación. Para ejercer cualquier derecho puede contactar a través
            del buzón de soporte interno de la app.
          </p>

          <h2 className="text-lg font-semibold text-foreground">2. Datos que tratamos</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Datos identificativos: correo electrónico utilizado para el registro.</li>
            <li>Datos físicos y de salud aportados voluntariamente: género, peso, altura, fecha del examen.</li>
            <li>Datos de rendimiento deportivo: tiempos de carrera, repeticiones, RPE y métricas de evaluación.</li>
            <li>Datos técnicos básicos derivados del uso de la aplicación.</li>
          </ul>

          <h2 className="text-lg font-semibold text-foreground">3. Finalidad</h2>
          <p>
            Los datos de salud y rendimiento se utilizan exclusivamente para generar y ajustar de forma
            individualizada los planes de entrenamiento del usuario (periodización, intensidades, volumen y
            descargas). En ningún caso se utilizan para fines publicitarios.
          </p>

          <h2 className="text-lg font-semibold text-foreground">4. Base legal</h2>
          <p>
            El tratamiento se basa en el consentimiento explícito del usuario al registrarse y aportar sus
            datos físicos en el test inicial (art. 6.1.a y 9.2.a RGPD).
          </p>

          <h2 className="text-lg font-semibold text-foreground">5. Cesión a terceros</h2>
          <p>
            No cedemos ni vendemos datos personales a terceros. Los datos se almacenan en infraestructura
            cloud segura (proveedor encargado del tratamiento) ubicada en la Unión Europea.
          </p>

          <h2 className="text-lg font-semibold text-foreground">6. Conservación</h2>
          <p>
            Los datos se conservan mientras la cuenta esté activa. El usuario puede solicitar la supresión
            inmediata desde la sección «Mi Perfil» mediante el botón «Eliminar mi cuenta y mis datos».
          </p>

          <h2 className="text-lg font-semibold text-foreground">7. Derechos del usuario</h2>
          <p>
            Acceso, rectificación, supresión, limitación, oposición y portabilidad. Estos derechos pueden
            ejercerse desde la propia aplicación o contactando con el responsable.
          </p>

          <h2 className="text-lg font-semibold text-foreground">8. Cambios en la política</h2>
          <p>
            Esta política puede actualizarse para reflejar mejoras en el servicio o cambios normativos. La
            versión vigente será siempre la publicada en esta página.
          </p>
        </section>
      </main>
    </div>
  );
}