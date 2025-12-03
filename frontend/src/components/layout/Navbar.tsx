import { useLocation } from "react-router-dom";
import logo from "../../assets/react.svg";
import { PillNav } from "./PillNav";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Book Lesson", href: "/book-lesson" },
  { label: "Organizers", href: "/organizers" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Admin", href: "/admin" },
];

export function Navbar() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40">
      <PillNav
        logo={logo}
        logoAlt="Tomas Dance"
        items={NAV_ITEMS}
        activeHref={location.pathname}
        className="border-b border-white/10 backdrop-blur"
        ease="power2.easeOut"
        baseColor="rgba(0,0,0,0.75)"
        pillColor="#ffffff"
        hoveredPillTextColor="#ffffff"
        pillTextColor="#000000"
      />
    </header>
  );
}
