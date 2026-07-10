import * as React from "react";
import {
  Flame,
  Book,
  Shield,
  Sprout,
} from "lucide-react";
import { Card } from "../componentes/ui/card-base";
import { CardLeccion } from "../componentes/ui/card-leccion";
import { CardMetrica } from "../componentes/ui/card-metrica";
import { CardInsignia } from "../componentes/ui/card-insignia";
import { CardPerfil } from "../componentes/ui/card-perfil";
import { Chip } from "../componentes/ui/chip";
import { BarraProgreso } from "../componentes/ui/barra-progreso";
import { CardsShowroomSidebar } from "./cards-showroom-sidebar";

export const PaginaCards: React.FC = () => {
  return (
    <div
      className="flex min-h-screen bg-[#F7F4EC]"
      style={{ fontFamily: "Nunito, Inter, system-ui, sans-serif" }}
    >
      <CardsShowroomSidebar />

      <main className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto max-w-[1040px]">
        <section className="flex flex-col gap-4 text-left">
          <h2 className="text-sm font-extrabold text-[#6C3AED] uppercase tracking-wider">
            01. Card de lección (ejemplo principal)
          </h2>
          <div className="grid grid-cols-6 gap-4">
            <CardLeccion
              estado="porDefecto"
              senda="Senda del Padre"
              titulo="La creación"
              descripcion="Dios creó el cielo y la tierra en seis días."
              duracion="8 min"
              xp={20}
              favorito={false}
            />
            <CardLeccion
              estado="enProgreso"
              senda="Senda del Hijo"
              titulo="Jesús y los niños"
              descripcion="Jesús ama a los niños y los bendice siempre."
              duracion="10 min"
              xp={20}
              progreso={60}
              favorito={false}
            />
            <CardLeccion
              estado="completada"
              senda="Senda del Espíritu"
              titulo="El Espíritu Santo"
              descripcion="Él nos guía, nos consuela y nos da fuerza."
              duracion="12 min"
              xp={30}
              progreso={100}
              favorito={true}
            />
            <CardLeccion
              estado="descargada"
              senda="Senda del Padre"
              titulo="El arca de Noé"
              descripcion="Dios protegió a Noé, su familia y a los animales."
              duracion="9 min"
              xp={20}
              favorito={false}
            />
            <CardLeccion
              estado="bloqueada"
              senda="Senda del Hijo"
              titulo="La torre de Babel"
              descripcion="Completa la lección anterior para desbloquear."
              duracion="12 min"
              xp={30}
              favorito={false}
            />
            <CardLeccion
              estado="error"
              senda="Error"
              titulo="No disponible"
              descripcion="No se pudo cargar la lección. Intenta más tarde."
              duracion=""
              xp={0}
              favorito={false}
            />
          </div>
        </section>

        <section className="flex flex-col gap-4 text-left">
          <h2 className="text-sm font-extrabold text-[#6C3AED] uppercase tracking-wider">
            02. Card de progreso / métrica
          </h2>
          <div className="grid grid-cols-4 gap-4">
            <CardMetrica
              tipo="xp"
              titulo="XP total"
              valor="2,450"
              subtexto="+320 esta semana"
            />
            <CardMetrica
              tipo="racha"
              titulo="Racha actual"
              valor="5 días"
              subtexto="¡Sigue así!"
            />
            <CardMetrica
              tipo="lecciones"
              titulo="Lecciones completadas"
              valor="18 / 30"
              subtexto="60% completado"
            />
            <CardMetrica
              tipo="offline"
              titulo="Descargadas offline"
              valor="12"
              subtexto="Disponibles sin internet"
            />
          </div>
        </section>

        <div className="grid grid-cols-8 gap-6 text-left items-start">
          <section className="col-span-4 flex flex-col gap-4">
            <h2 className="text-sm font-extrabold text-[#6C3AED] uppercase tracking-wider">
              03. Card de logro / insignia
            </h2>
            <div className="grid grid-cols-4 gap-4">
              <CardInsignia
                color="verde"
                titulo="Nueva Creación"
                descripcion="Completa tu primera lección"
                obtenida={true}
                icono={<Sprout />}
              />
              <CardInsignia
                color="morado"
                titulo="Explorador Bíblico"
                descripcion="Completa 10 lecciones"
                obtenida={false}
                icono={<Book />}
                progresoActual={7}
                progresoMaximo={10}
              />
              <CardInsignia
                color="amarillo"
                titulo="Fiel Aprendiz"
                descripcion="Mantén una racha de 7 días"
                obtenida={false}
                icono={<Flame />}
                progresoActual={5}
                progresoMaximo={7}
              />
              <CardInsignia
                color="gris"
                titulo="Guardián de la Fe"
                descripcion="Completa 100 lecciones"
                obtenida={false}
                icono={<Shield />}
              />
            </div>
          </section>

          <section className="col-span-2 flex flex-col gap-4">
            <h2 className="text-sm font-extrabold text-[#6C3AED] uppercase tracking-wider">
              04. Card de usuario / perfil pequeño
            </h2>
            <CardPerfil
              nombre="Samuel"
              nivel={7}
              racha={5}
              lecciones={18}
              logros={3}
              xpActual={2450}
              xpMaximo={3000}
            />
          </section>

          <section className="col-span-2 flex flex-col gap-4">
            <h2 className="text-sm font-extrabold text-[#6C3AED] uppercase tracking-wider">
              05. Variantes de tamaño
            </h2>
            <div className="flex flex-col gap-4">
              <Card sombra="sm" clase="p-4 bg-white flex flex-col gap-1.5 text-left relative overflow-hidden">
                <span className="text-[9px] text-[#6C3AED] font-extrabold block">Pequeña (sm)</span>
                <h4 className="text-xs font-black text-slate-800 leading-none">Actividad de Quiz</h4>
                <p className="text-[10px] text-slate-400 font-semibold leading-normal">
                  Responde correctamente las preguntas de la lección.
                </p>
                <div className="w-full h-1 bg-violet-100 rounded-full mt-2">
                  <div className="h-full bg-violet-500 rounded-full" style={{ width: "40%" }} />
                </div>
              </Card>

              <Card sombra="sm" clase="p-4.5 bg-white flex flex-col gap-2 text-left">
                <span className="text-[9px] text-emerald-500 font-extrabold block">Mediana (md)</span>
                <h4 className="text-xs font-black text-slate-800 leading-none">Club "Sembradores"</h4>
                <p className="text-[10px] text-slate-400 font-semibold leading-normal">
                  Únete a otros niños para aprender juntos y cumplir retos colectivos semanales.
                </p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-[9px] text-slate-500 font-extrabold">12 miembros</span>
                  <Chip color="verde" forma="badgePildora">Activo</Chip>
                </div>
              </Card>

              <Card sombra="sm" clase="p-5 bg-white flex flex-col gap-3.5 text-left">
                <span className="text-[9px] text-amber-500 font-extrabold block">Grande (lg)</span>
                <h4 className="text-sm font-black text-slate-800 leading-none">Senda: El Espíritu Santo</h4>
                <p className="text-[11px] text-slate-400 font-semibold leading-normal">
                  Descubre cómo el Espíritu Santo nos ayuda, nos guía y nos llena de gozo y paz en nuestro diario vivir con lecciones y dinámicas.
                </p>
                <div className="flex flex-col gap-2 mt-1">
                  <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                    <span>Avance de la ruta</span>
                    <span>3 / 8 Lecciones</span>
                  </div>
                  <BarraProgreso valor={3} maximo={8} mostrarEtiquetas={false} color="naranja" />
                </div>
              </Card>
            </div>
          </section>
        </div>

        <div
          className="mt-6 bg-[#FAF5FF] border border-[#E9D5FF] rounded-2xl p-4 flex items-center gap-3"
        >
          <span className="text-xl">💡</span>
          <p className="text-xs text-[#6C3AED] margin-0 text-left">
            <strong>Tip:</strong> Usa las cards para destacar contenido importante, permitir acciones rápidas y mostrar progreso de manera visual.
          </p>
        </div>
      </main>
    </div>
  );
};
