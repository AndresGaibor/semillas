import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function BotonTemaToggle({ className }: { className?: string }) {
  const [esOscuro, setEsOscuro] = useState(() => {
    if (typeof document !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  useEffect(() => {
    if (typeof document === "undefined") return;

    // Escuchar si cambia por otras pantallas
    const observer = new MutationObserver(() => {
      setEsOscuro(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const toggleTema = () => {
    const nuevoEsOscuro = !esOscuro;
    if (nuevoEsOscuro) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("semillas-pref-tema", "oscuro");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("semillas-pref-tema", "claro");
    }
    setEsOscuro(nuevoEsOscuro);
  };

  return (
    <button
      type="button"
      onClick={toggleTema}
      className={`theme-toggle-btn ${className || ""}`}
      aria-label={esOscuro ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      {esOscuro ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-slate-600" />}
    </button>
  );
}
