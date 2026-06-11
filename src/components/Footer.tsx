import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background/60 backdrop-blur">
      <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} opoFITor. Todos los derechos reservados.</p>
        <Link to="/privacidad" className="hover:text-primary transition-colors">
          Política de Privacidad
        </Link>
      </div>
    </footer>
  );
}