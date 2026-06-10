import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/careers", label: "Open Positions" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const solid = scrolled || !isHome;
  const textColor = solid ? "text-[#1A1A4E]" : "text-white";
  const bg = solid ? "bg-white shadow-md" : "bg-transparent";

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${bg}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold">
          <span className={`text-xl ${solid ? "text-[#003087]" : "text-white"}`}>Kotak</span>
          <span className="text-xl text-[#E8192C]">Insurance Careers</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => {
            const active = pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`relative text-sm font-medium transition-colors hover:opacity-80 ${textColor} ${
                  active ? "after:content-[''] after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-0.5 after:bg-[#E8192C]" : ""
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block">
          <Link to="/careers" hash="apply" className="btn-primary text-sm">
            Apply Now
          </Link>
        </div>

        <button
          aria-label="Toggle menu"
          className={`md:hidden p-2 ${textColor}`}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white shadow-lg border-t border-border animate-fade-in">
          <div className="px-4 py-3 flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="px-3 py-2.5 rounded-md text-[#1A1A4E] font-medium hover:bg-[#EBF4FF]"
              >
                {l.label}
              </Link>
            ))}
            <Link to="/careers" hash="apply" className="btn-primary mt-2">
              Apply Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
