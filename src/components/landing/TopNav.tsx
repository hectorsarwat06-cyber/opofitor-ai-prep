import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, CalendarDays, User } from "lucide-react";

const ITEMS = [
  { to: "/dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
  { to: "/plan-semanal" as const, label: "Plan Semanal", icon: CalendarDays },
  { to: "/perfil" as const, label: "Mi Perfil", icon: User },
];

export function TopNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex items-center gap-1 glass rounded-full p-1">
      {ITEMS.map((it) => {
        const Icon = it.icon;
        const active = path === it.to;
        return (
          <Link
            key={it.to}
            to={it.to}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              active
                ? "bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{it.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}