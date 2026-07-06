import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: LandingPage
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f7f4ec] flex flex-col">
      <header className="px-6 py-4 flex items-center justify-between max-w-5xl mx-auto w-full">
        <span className="text-[#2e9e5b] font-bold text-xl">Semillas</span>
        <Link to="/login" className="bg-[#2e9e5b] text-white px-5 py-2 rounded-full text-sm font-semibold">
          Comenzar
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-20 h-20 bg-[#2e9e5b] rounded-full flex items-center justify-center mb-6 shadow-lg">
          <span className="text-3xl">🌱</span>
        </div>
        <h1 className="text-4xl font-bold text-[#123b2c] mb-3">Semillas</h1>
        <p className="text-lg text-[#123b2c]/70 max-w-md mb-8">
          Aprende de Dios de forma divertida. Descubre las sendas del Padre, del Hijo y del Espíritu Santo.
        </p>
        <Link
          to="/login"
          className="bg-[#2e9e5b] text-white px-8 py-3 rounded-full text-base font-semibold hover:bg-[#267d4c] transition-colors"
        >
          Comenzar ahora
        </Link>
      </main>
    </div>
  );
}
