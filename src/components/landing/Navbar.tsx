import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Shield } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#problema", label: "Problema" },
    { href: "#solucion", label: "Solución" },
    { href: "#funciona", label: "Cómo funciona" },
    { href: "#features", label: "Features" },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div
        className={`mx-auto max-w-6xl px-4 transition-all duration-500 ${
          scrolled ? "scale-[0.98]" : ""
        }`}
      >
        <nav
          className={`flex items-center justify-between rounded-2xl px-4 md:px-6 py-3 transition-all duration-500 ${
            scrolled ? "glass shadow-[var(--shadow-card)]" : ""
          }`}
        >
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary blur-md opacity-60 group-hover:opacity-100 transition" />
              <div className="relative h-8 w-8 rounded-lg bg-[image:var(--gradient-primary)] grid place-items-center">
                <Shield className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
              </div>
            </div>
            <span className="font-display font-bold tracking-tight text-lg">
              opo<span className="text-primary">FIT</span>or
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="relative text-sm text-muted-foreground hover:text-foreground transition-colors after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-px after:w-full after:scale-x-0 after:origin-left after:bg-primary after:transition-transform after:duration-300 hover:after:scale-x-100"
              >
                {l.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link to="/auth">Iniciar sesión</Link>
            </Button>
            <Button asChild variant="hero" size="sm">
              <Link to="/auth">Empieza Gratis</Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}