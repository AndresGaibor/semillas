import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function BotonTemaToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof document === "undefined") return "light";
    const attr = document.documentElement.getAttribute("data-theme");
    if (attr === "app-dark" || attr === "admin-dark") return "dark";
    return "light";
  });

  useEffect(() => {
    if (typeof document === "undefined") return;

    const observer = new MutationObserver(() => {
      const attr = document.documentElement.getAttribute("data-theme");
      if (attr === "app-dark" || attr === "admin-dark") {
        setTheme("dark");
      } else {
        setTheme("light");
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  const toggleTema = () => {
    const isAdmin = window.location.pathname.startsWith("/admin");
    const html = document.documentElement;

    if (theme === "dark") {
      const next = isAdmin ? "admin-light" : "app-light";
      html.setAttribute("data-theme", next);
      localStorage.setItem(isAdmin ? "admin-theme" : "app-theme", next);
      setTheme("light");
    } else {
      const next = isAdmin ? "admin-dark" : "app-dark";
      html.setAttribute("data-theme", next);
      localStorage.setItem(isAdmin ? "admin-theme" : "app-theme", next);
      setTheme("dark");
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTema}
      className={`theme-toggle-btn ${className || ""}`}
      aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      {theme === "dark" ? (
        <Sun size={20} className="text-amber-400" />
      ) : (
        <Moon size={20} className="text-slate-600" />
      )}
    </button>
  );
}
