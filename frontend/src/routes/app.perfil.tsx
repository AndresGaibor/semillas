import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../features/profile/profile.api";
import { User, Mail, Loader } from "lucide-react";

export const Route = createFileRoute("/app/perfil")({
  component: ProfilePage
});

function ProfilePage() {
  const meQuery = useQuery({ queryKey: ["me"], queryFn: getMe });

  const profile = meQuery.data?.profile;
  const user = meQuery.data?.user;

  if (meQuery.isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader className="animate-spin text-[#2e9e5b]" size={24} />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#123b2c] mb-6">Mi perfil</h1>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-[#2e9e5b]/10 rounded-full flex items-center justify-center">
            <User className="text-[#2e9e5b]" size={32} />
          </div>
          <div>
            <h2 className="font-bold text-lg text-[#123b2c]">{profile?.nickname ?? "Semillero"}</h2>
            <p className="text-sm text-[#123b2c]/40">{user?.role ?? "usuario"}</p>
          </div>
        </div>

        <div className="grid gap-4">
          <div>
            <label className="text-xs text-[#123b2c]/40 uppercase tracking-wide font-medium">Apodo</label>
            <p className="text-[#123b2c] font-medium">{profile?.nickname ?? "—"}</p>
          </div>
          <div>
            <label className="text-xs text-[#123b2c]/40 uppercase tracking-wide font-medium">Franja de edad</label>
            <p className="text-[#123b2c] font-medium">{profile?.age_group_id ?? "Sin franja"}</p>
          </div>
          <div>
            <label className="text-xs text-[#123b2c]/40 uppercase tracking-wide font-medium">Audio preferido</label>
            <p className="text-[#123b2c] font-medium">{profile?.preferred_audio ? "Sí" : "No"}</p>
          </div>
          <div>
            <label className="text-xs text-[#123b2c]/40 uppercase tracking-wide font-medium">Tamaño de texto</label>
            <p className="text-[#123b2c] font-medium">{profile?.preferred_text_size ?? "medium"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
