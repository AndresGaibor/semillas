import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useMemo } from "react";
import type { GrupoEdad } from "../shared/api/api";
import { obtenerGruposEdad } from "../features/catalog/catalog.api";
import { OnboardingTopbar } from "../features/onboarding/componentes/OnboardingTopbar";
import { GrupoEdadGrid } from "../features/onboarding/componentes/GrupoEdadGrid";
import { OnboardingFooter } from "../features/onboarding/componentes/OnboardingFooter";

export const Route = createFileRoute("/onboarding/")({
  component: OnboardingPage,
});

const fallbacksGrupoEdad: GrupoEdad[] = [
  { id: "semillas", codigo: "semillas", nombre: "Semillas", edad_minima: 5, edad_maxima: 8, descripcion: "Descubre a Dios a través de historias y actividades sencillas.", imagen_url: "https://dmddyzftrkktzctrurmo.supabase.co/storage/v1/object/public/imagenes/onboarding/semillas.png", orden: 1 },
  { id: "exploradores", codigo: "exploradores", nombre: "Exploradores", edad_minima: 9, edad_maxima: 12, descripcion: "Aprende más de Dios y entiende su Palabra.", imagen_url: "https://dmddyzftrkktzctrurmo.supabase.co/storage/v1/object/public/imagenes/onboarding/exploradores.png", orden: 2 },
  { id: "embajadores", codigo: "embajadores", nombre: "Embajadores", edad_minima: 13, edad_maxima: 17, descripcion: "Profundiza en tu fe y vive con más propósito.", imagen_url: "https://dmddyzftrkktzctrurmo.supabase.co/storage/v1/object/public/imagenes/onboarding/embajadores.png", orden: 3 },
];

function OnboardingPage() {
  const navigate = useNavigate();
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const ageGroupsQuery = useQuery({
    queryKey: ["catalog", "age-groups"],
    queryFn: obtenerGruposEdad,
  });

  const data = useMemo(() => {
    if (ageGroupsQuery.data && ageGroupsQuery.data.length > 0) {
      return ageGroupsQuery.data;
    }
    return fallbacksGrupoEdad;
  }, [ageGroupsQuery.data]);

  useEffect(() => {
    if (data && data.length > 0) {
      const semillas = data.find((g) => g.codigo.toLowerCase() === "semillas");
      setSelectedGroupId(semillas ? semillas.id : (data[0]?.id ?? ""));
    }
  }, [data]);

  const handleContinue = () => {
    if (selectedGroupId) {
      localStorage.setItem("onboarding_grupo_edad_id", selectedGroupId);
      navigate({ to: "/onboarding/customize" as never });
    }
  };

  return (
    <div
      style={{
        fontFamily: "'Nunito', sans-serif",
        background: "#ffffff",
        color: "#15124b",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        margin: 0,
        padding: 0,
        boxSizing: "border-box",
      }}
    >
      <OnboardingTopbar onHelpClick={() => setIsHelpOpen(true)} />

      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "24px 20px",
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: 800, color: "#311B92", lineHeight: 1.2, margin: "0 0 12px 0" }}>
            Elige tu franja de edad
          </h1>
          <p style={{ fontSize: "16px", color: "#5C5C5C", margin: 0 }}>
            Selecciona la opción que mejor te representa. Podrás cambiarla después.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            background: "#F4F5F7",
            borderRadius: "12px",
            padding: "4px",
            marginBottom: "32px",
            width: "100%",
            maxWidth: "600px",
          }}
        >
          <div
            style={{
              flex: 1,
              textAlign: "center",
              padding: "12px",
              borderRadius: "8px",
              fontWeight: 700,
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              background: "#ffffff",
              color: "#7E57C2",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                fontSize: "12px",
                color: "#fff",
                background: "#7E57C2",
                fontWeight: 700,
              }}
            >
              1
            </span>
            Tu edad
          </div>
          <div
            style={{
              flex: 1,
              textAlign: "center",
              padding: "12px",
              borderRadius: "8px",
              fontWeight: 700,
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              color: "#9E9E9E",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                fontSize: "12px",
                color: "#fff",
                background: "#BDBDBD",
                fontWeight: 700,
              }}
            >
              2
            </span>
            Tu información
          </div>
        </div>

        <GrupoEdadGrid
          grupos={data}
          seleccionadoId={selectedGroupId}
          onSelect={setSelectedGroupId}
          cargando={ageGroupsQuery.isLoading}
        />

        <OnboardingFooter deshabilitado={!selectedGroupId} onContinuar={handleContinue} />
      </main>

      {isHelpOpen && (
        <div
          onClick={() => setIsHelpOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            backdropFilter: "blur(2px)",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              width: "90%",
              maxWidth: "450px",
              padding: "32px",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#512DA8", margin: 0, lineHeight: 1.3 }}>
                ¿Por qué elegir tu edad?
              </h3>
              <button
                onClick={() => setIsHelpOpen(false)}
                style={{
                  background: "#F5F5F5",
                  border: "none",
                  fontSize: "24px",
                  lineHeight: 1,
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#5C5C5C",
                  cursor: "pointer",
                }}
                aria-label="Cerrar modal"
              >
                &times;
              </button>
            </div>
            <div>
              <p style={{ fontSize: "15px", color: "#2E2E2E", lineHeight: 1.65, marginBottom: "16px" }}>
                Queremos que tu experiencia en{" "}
                <strong style={{ fontWeight: 700, color: "#512DA8" }}>Semillas</strong>{" "}
                sea la mejor posible. Al elegir tu franja de edad, adaptaremos
                el contenido, las historias y las actividades para que sean más
                afines a tus intereses y nivel de comprensión.
              </p>
              <p style={{ fontSize: "15px", color: "#2E2E2E", lineHeight: 1.65, margin: 0 }}>
                ¡No te preocupes! Siempre podrás cambiar esta configuración más
                adelante desde tu perfil.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
