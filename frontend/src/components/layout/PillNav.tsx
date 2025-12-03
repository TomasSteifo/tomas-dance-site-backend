import { Link } from "react-router-dom";

interface PillNavItem {
  label: string;
  href: string;
}

interface PillNavProps {
  logo: string;
  logoAlt?: string;
  items: PillNavItem[];
  activeHref: string;
  className?: string;
  ease?: string;
  baseColor?: string;
  pillColor?: string;
  hoveredPillTextColor?: string;
  pillTextColor?: string;
}

export function PillNav({
  logo,
  logoAlt = "Logo",
  items,
  activeHref,
  className = "",
  ease = "ease-out",
  baseColor = "#000000",
  pillColor = "#ffffff",
  hoveredPillTextColor = "#ffffff",
  pillTextColor = "#000000",
}: PillNavProps) {
  const transitionClass = ease.includes("power")
    ? "transition-all duration-300 ease-out"
    : "transition-all duration-300";

  return (
    <nav
      className={`w-full ${className}`}
      style={{
        backgroundColor: baseColor,
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 text-white sm:flex-row sm:items-center sm:justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt={logoAlt} className="h-8 w-8 object-contain" />
          <span className="text-lg font-semibold tracking-wide">
            Tomas Dance
          </span>
        </Link>

        <div className="flex flex-wrap gap-2 rounded-full border border-white/10 bg-white/10 p-1">
          {items.map((item) => {
            const isActive =
              activeHref === item.href ||
              (item.href !== "/" && activeHref.startsWith(item.href));
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`rounded-full px-4 py-2 text-sm font-medium ${transitionClass}`}
                style={{
                  backgroundColor: isActive ? pillColor : "transparent",
                  color: isActive ? pillTextColor : hoveredPillTextColor,
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
