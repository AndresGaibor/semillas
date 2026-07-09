import { createFileRoute } from "@tanstack/react-router"
import { Smartphone, Monitor } from "lucide-react"

export const Route = createFileRoute("/admin-required")({
  component: AdminRequiredPage,
})

function AdminRequiredPage() {
  return (
    <div className="min-h-screen bg-[#F7F4EC] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-lg p-8 md:p-10 text-center flex flex-col items-center gap-6">
        <div className="flex items-center gap-3">
          <Smartphone className="size-12 text-red-400" />
          <span className="text-2xl text-slate-300 font-black">→</span>
          <Monitor className="size-12 text-[#2E9E5B]" />
        </div>
        <h1 className="text-2xl font-black text-[#123B2C]">
          Solo disponible en computadora
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
          El panel de administración de Semillas está diseñado para usarse en una
          computadora. Abre esta página desde un navegador de escritorio.
        </p>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#166534] text-white rounded-full text-sm font-bold shadow-md hover:bg-[#14532D] transition-all"
        >
          Volver al inicio
        </a>
      </div>
    </div>
  )
}
