import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getSendas } from "../features/sendas/sendas.api";
import { Crown, Heart, Flame, Loader } from "lucide-react";

const sendaIcons: Record<string, React.ReactNode> = {
  padre: <Crown size={28} />,
  hijo: <Heart size={28} />,
  espiritu: <Flame size={28} />
};

export const Route = createFileRoute("/app/sendas")({
  component: SendasPage
});

function SendasPage() {
  const sendasQuery = useQuery({ queryKey: ["sendas"], queryFn: getSendas });

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#123b2c] mb-2">Explora las sendas</h1>
      <p className="text-sm text-[#123b2c]/50 mb-6">Elige una senda para comenzar</p>

      {sendasQuery.isLoading && (
        <div className="flex justify-center py-12">
          <Loader className="animate-spin text-[#2e9e5b]" size={24} />
        </div>
      )}

      <div className="grid gap-4">
        {sendasQuery.data?.map((senda) => (
          <Link
            key={senda.id}
            to="/app/sendas/$sendaId"
            params={{ sendaId: senda.id }}
            className="block bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border-l-4"
            style={{ borderLeftColor: senda.color_hex }}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{ background: `${senda.color_hex}15` }}
              >
                <span style={{ color: senda.color_hex }}>
                  {sendaIcons[senda.codigo.toLowerCase()] ?? <Crown size={28} />}
                </span>
              </div>
              <div>
                <h2 className="font-bold text-lg text-[#123b2c]">{senda.nombre}</h2>
                <p className="text-sm text-[#123b2c]/50">{senda.descripcion}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
