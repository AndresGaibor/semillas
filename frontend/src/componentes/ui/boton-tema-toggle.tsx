import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/shared/theme";
import { cn } from "@/lib/utils";

export function BotonTemaToggle({ className }: { className?: string }) {
  const { esOscuro, alternarTema } = useTheme();

  return (
    <button
      type="button"
      onClick={alternarTema}
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition duration-200 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-verde-brote focus-visible:ring-offset-2 active:scale-[0.98] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 dark:focus-visible:ring-offset-slate-950",
        className,
      )}
      aria-label={esOscuro ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      aria-pressed={esOscuro}
      title={esOscuro ? "Usar modo claro" : "Usar modo oscuro"}
    >
      {esOscuro ? <Sun className="size-5 text-amber-400" aria-hidden="true" /> : <Moon className="size-5" aria-hidden="true" />}
    </button>
  );
}
