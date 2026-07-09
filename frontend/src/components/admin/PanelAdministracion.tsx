import {
  Archive,
  BarChart3,
  Bell,
  CheckCircle2,
  ChevronDown,
  Clock3,
  CloudUpload,
  FileText,
  Home,
  Keyboard,
  Leaf,
  Pencil,
  PlaySquare,
  Plus,
  Route,
  Search,
  Settings,
  ShieldCheck,
  Sprout,
  UsersRound,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";

type Icono = ComponentType<SVGProps<SVGSVGElement>>;

type EstadoTema = "Publicado" | "En revisión" | "Borrador";

interface MenuItem {
  texto: string;
  icono: Icono;
  activo?: boolean;
  color: string;
}

interface TarjetaMetricaProps {
  titulo: string;
  valor: string;
  cambio: string;
  icono: Icono;
  colorIcono: string;
  fondoIcono: string;
  colorValor: string;
}

interface EstadoContenidoProps {
  titulo: string;
  valor: number;
  porcentaje: string;
  icono: Icono;
  fondo: string;
  colorIcono: string;
  colorPunto: string;
}

interface AccionRapidaProps {
  titulo: string;
  descripcion: string;
  icono: Icono;
  fondo: string;
  colorIcono: string;
  colorTitulo: string;
}

interface TemaReciente {
  titulo: string;
  senda: string;
  estado: EstadoTema;
  autor: string;
  avatar: string;
  ultimaEdicion: string;
}

interface Actividad {
  icono: Icono;
  fondo: string;
  colorIcono: string;
  texto: string;
  tiempo: string;
}

interface Revision {
  dia: string;
  mes: string;
  titulo: string;
  senda: string;
  estado: "En revisión" | "Borrador";
  responsable: string;
  avatar: string;
  colorFecha: string;
}

interface ProgresoDia {
  dia: string;
  valor: number;
}

const menuItems: MenuItem[] = [
  { texto: "Dashboard", icono: Home, activo: true, color: "text-emerald-600" },
  { texto: "Temas", icono: Leaf, color: "text-emerald-600" },
  { texto: "Sendas", icono: Route, color: "text-purple-600" },
  { texto: "Actividades", icono: Pencil, color: "text-orange-500" },
  { texto: "Usuarios", icono: UsersRound, color: "text-blue-600" },
  { texto: "Clubes", icono: UsersRound, color: "text-emerald-600" },
  { texto: "Medios", icono: PlaySquare, color: "text-purple-600" },
  { texto: "Revisión", icono: ShieldCheck, color: "text-amber-500" },
  { texto: "Reportes", icono: BarChart3, color: "text-blue-500" },
  { texto: "Ajustes", icono: Settings, color: "text-slate-500" },
];

const metricas: TarjetaMetricaProps[] = [
  {
    titulo: "Temas publicados",
    valor: "128",
    cambio: "12% vs. la semana pasada",
    icono: Leaf,
    colorIcono: "text-emerald-600",
    fondoIcono: "bg-emerald-100",
    colorValor: "text-emerald-600",
  },
  {
    titulo: "Usuarios activos",
    valor: "2,845",
    cambio: "8% vs. la semana pasada",
    icono: UsersRound,
    colorIcono: "text-blue-600",
    fondoIcono: "bg-blue-100",
    colorValor: "text-blue-600",
  },
  {
    titulo: "Actividades creadas",
    valor: "362",
    cambio: "15% vs. la semana pasada",
    icono: Pencil,
    colorIcono: "text-orange-500",
    fondoIcono: "bg-orange-100",
    colorValor: "text-orange-500",
  },
  {
    titulo: "Clubes activos",
    valor: "156",
    cambio: "9% vs. la semana pasada",
    icono: UsersRound,
    colorIcono: "text-purple-600",
    fondoIcono: "bg-purple-100",
    colorValor: "text-purple-600",
  },
];

const estadosContenido: EstadoContenidoProps[] = [
  { titulo: "Borradores", valor: 42, porcentaje: "12% del total", icono: FileText, fondo: "bg-amber-50", colorIcono: "text-amber-500", colorPunto: "bg-amber-400" },
  { titulo: "En revisión", valor: 18, porcentaje: "5% del total", icono: Clock3, fondo: "bg-indigo-50", colorIcono: "text-indigo-600", colorPunto: "bg-indigo-500" },
  { titulo: "Publicados", valor: 128, porcentaje: "78% del total", icono: CheckCircle2, fondo: "bg-emerald-50", colorIcono: "text-emerald-600", colorPunto: "bg-emerald-600" },
  { titulo: "Archivados", valor: 14, porcentaje: "5% del total", icono: Archive, fondo: "bg-slate-100", colorIcono: "text-slate-500", colorPunto: "bg-slate-400" },
];

const accionesRapidas: AccionRapidaProps[] = [
  { titulo: "Crear tema", descripcion: "Desarrolla un nuevo tema para tus sendas.", icono: Plus, fondo: "bg-emerald-50", colorIcono: "text-emerald-600", colorTitulo: "text-emerald-700" },
  { titulo: "Agregar actividad", descripcion: "Crea actividades interactivas.", icono: Pencil, fondo: "bg-orange-50", colorIcono: "text-orange-500", colorTitulo: "text-orange-600" },
  { titulo: "Subir recurso", descripcion: "Añade videos, audios o documentos.", icono: CloudUpload, fondo: "bg-blue-50", colorIcono: "text-blue-500", colorTitulo: "text-blue-600" },
  { titulo: "Revisar contenido", descripcion: "Revisa y aprueba contenido pendiente.", icono: ShieldCheck, fondo: "bg-purple-50", colorIcono: "text-purple-600", colorTitulo: "text-purple-600" },
];

const temasRecientes: TemaReciente[] = [
  { titulo: "La creación de Dios", senda: "Dios y su amor", estado: "Publicado", autor: "María López", avatar: "👩", ultimaEdicion: "15 may. 2024, 10:30" },
  { titulo: "La oración", senda: "Vida con Jesús", estado: "En revisión", autor: "Juan Pérez", avatar: "👨", ultimaEdicion: "14 may. 2024, 16:45" },
  { titulo: "El perdón", senda: "Relaciones sanas", estado: "Borrador", autor: "Ana Torres", avatar: "👩", ultimaEdicion: "13 may. 2024, 09:20" },
  { titulo: "El Buen Samaritano", senda: "Amor al prójimo", estado: "Publicado", autor: "Luis García", avatar: "👨", ultimaEdicion: "12 may. 2024, 11:05" },
  { titulo: "Daniel en el foso de los leones", senda: "Fe y valentía", estado: "Publicado", autor: "María López", avatar: "👩", ultimaEdicion: "11 may. 2024, 08:50" },
];

const actividadReciente: Actividad[] = [
  { icono: Leaf, fondo: "bg-emerald-100", colorIcono: "text-emerald-600", texto: 'Se publicó el tema "La creación de Dios" en la senda "Dios y su amor".', tiempo: "Hace 15 min" },
  { icono: Pencil, fondo: "bg-orange-100", colorIcono: "text-orange-500", texto: 'María López creó una nueva actividad "Construyendo la confianza".', tiempo: "Hace 1 h" },
  { icono: UsersRound, fondo: "bg-purple-100", colorIcono: "text-purple-600", texto: 'El Club "Semillitas de Luz" agregó 8 nuevos miembros.', tiempo: "Hace 3 h" },
  { icono: CloudUpload, fondo: "bg-blue-100", colorIcono: "text-blue-500", texto: 'Se subió un nuevo recurso multimedia "Video: El Buen Samaritano".', tiempo: "Hace 5 h" },
  { icono: ShieldCheck, fondo: "bg-amber-100", colorIcono: "text-amber-500", texto: 'Juan Pérez aprobó el tema "La oración" para publicación.', tiempo: "Hace 1 día" },
];

const revisiones: Revision[] = [
  { dia: "16", mes: "MAY", titulo: "La fe de Abraham", senda: "Héroes de la fe", estado: "En revisión", responsable: "Ana Torres", avatar: "👩", colorFecha: "bg-orange-100 text-orange-700" },
  { dia: "17", mes: "MAY", titulo: "Aprendiendo a perdonar", senda: "Relaciones sanas", estado: "En revisión", responsable: "Juan Pérez", avatar: "👨", colorFecha: "bg-amber-100 text-amber-700" },
  { dia: "18", mes: "MAY", titulo: "Dios cuida de mí", senda: "Confío en Dios", estado: "Borrador", responsable: "María López", avatar: "👩", colorFecha: "bg-emerald-100 text-emerald-700" },
];

const progresoSemanal: ProgresoDia[] = [
  { dia: "Lun", valor: 12 },
  { dia: "Mar", valor: 18 },
  { dia: "Mié", valor: 24 },
  { dia: "Jue", valor: 20 },
  { dia: "Vie", valor: 16 },
  { dia: "Sáb", valor: 14 },
  { dia: "Dom", valor: 10 },
];

function cn(...clases: Array<string | false | undefined | null>) {
  return clases.filter(Boolean).join(" ");
}

export function PanelAdministracion() {
  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metricas.map((metrica) => (
          <TarjetaMetrica key={metrica.titulo} {...metrica} />
        ))}
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(330px,0.95fr)]">
        <div className="min-w-0 space-y-4">
          <EstadoContenido />
          <AccionesRapidas />
          <TablaTemasRecientes />
        </div>

        <div className="min-w-0 space-y-4">
          <ActividadReciente />
          <ProximasRevisiones />
          <ProgresoSemanal />
        </div>
      </div>
    </div>
  );
}

function BarraLateral() {
  return (
    <aside className="hidden w-[335px] shrink-0 border-r border-emerald-950/5 bg-white/85 p-3 shadow-[0_18px_45px_rgba(15,23,42,0.08)] lg:block">
      <div className="flex h-full flex-col rounded-3xl bg-white px-4 py-5">
        <LogoSemillas />

        <nav className="mt-7 space-y-2">
          {menuItems.map((item) => (
            <ItemMenu key={item.texto} {...item} />
          ))}
        </nav>

        <div className="mt-auto">
          <TarjetaPromocional />
        </div>
      </div>
    </aside>
  );
}

function LogoSemillas() {
  return (
    <div className="flex items-center gap-3 px-2">
      <div className="grid size-11 place-items-center rounded-full bg-emerald-600 text-white shadow-md shadow-emerald-200">
        <Leaf className="size-6" />
      </div>

      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-violet-700">
          Semillas
        </h1>
        <p className="text-sm font-medium text-emerald-600">
          Crecer en la Palabra, vivir Su verdad
        </p>
      </div>
    </div>
  );
}

function ItemMenu({ texto, icono: Icono, activo, color }: MenuItem) {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-left text-lg font-semibold transition",
        activo ? "bg-emerald-50 text-emerald-700 shadow-sm" : "text-slate-700 hover:bg-slate-50",
      )}
    >
      <Icono className={cn("size-6", activo ? "text-emerald-600" : color)} />
      <span>{texto}</span>
    </button>
  );
}

function TarjetaPromocional() {
  return (
    <article className="relative overflow-hidden rounded-3xl border border-amber-100 bg-gradient-to-br from-white to-amber-50 p-5">
      <div className="relative z-10 max-w-[170px]">
        <h3 className="text-xl font-extrabold leading-tight text-violet-700">
          Semillas crece contigo
        </h3>
        <p className="mt-4 text-sm font-medium leading-relaxed text-slate-700">
          Cada contenido que gestionas inspira corazones y transforma vidas.
        </p>
      </div>

      <div className="absolute bottom-3 right-3">
        <div className="relative grid size-28 place-items-center rounded-full bg-lime-100">
          <Sprout className="absolute -top-6 size-16 text-lime-600" />
          <div className="grid size-20 place-items-center rounded-full bg-lime-400 text-4xl shadow-lg shadow-lime-200">
            😊
          </div>
        </div>
      </div>
    </article>
  );
}

function EncabezadoAdmin() {
  return (
    <header className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex items-center gap-4">
        <div className="text-5xl">🌱</div>
        <h2 className="text-4xl font-extrabold tracking-tight text-slate-950">
          Panel de administración
        </h2>
      </div>

      <div className="flex flex-1 items-center justify-end gap-5">
        <div className="hidden w-full max-w-[510px] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm lg:flex">
          <Search className="size-6 text-slate-500" />
          <input
            className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-slate-400"
            placeholder="Buscar temas, sendas, actividades, usuarios..."
          />
          <div className="flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold text-slate-400">
            <Keyboard className="size-4" />K
          </div>
        </div>

        <button
          type="button"
          className="relative grid size-12 place-items-center rounded-full bg-white shadow-sm"
        >
          <Bell className="size-6 text-slate-500" />
          <span className="absolute right-1 top-1 grid size-5 place-items-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            5
          </span>
        </button>

        <div className="h-10 w-px bg-slate-200" />

        <button type="button" className="flex items-center gap-4">
          <Avatar emoji="👨" className="size-14 text-3xl" />
          <div className="hidden text-left sm:block">
            <p className="font-extrabold text-slate-900">Administrador</p>
            <p className="text-sm font-medium text-slate-500">
              admin@semillas.org
            </p>
          </div>
          <ChevronDown className="size-5 text-slate-500" />
        </button>
      </div>
    </header>
  );
}

function TarjetaMetrica({
  titulo,
  valor,
  cambio,
  icono: Icono,
  colorIcono,
  fondoIcono,
  colorValor,
}: TarjetaMetricaProps) {
  return (
    <article className="min-w-0 rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
      <div className="grid min-w-0 grid-cols-[74px_minmax(0,1fr)] items-center gap-4">
        <div className={cn("grid size-[74px] shrink-0 place-items-center rounded-full", fondoIcono)}>
          <Icono className={cn("size-9", colorIcono)} />
        </div>

        <div className="min-w-0">
          <p className="whitespace-nowrap text-xs font-extrabold leading-none tracking-tight text-slate-800 2xl:text-sm">
            {titulo}
          </p>
          <p className={cn("mt-1.5 text-[32px] font-black leading-none", colorValor)}>
            {valor}
          </p>
          <p className="mt-2 text-[12px] font-semibold leading-snug text-slate-500">
            <span className="font-extrabold text-emerald-600">↑</span> {cambio}
          </p>
        </div>
      </div>
    </article>
  );
}

function EstadoContenido() {
  return (
    <section className="min-w-0 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
      <CabeceraSeccion
        titulo="Estado del contenido"
        descripcion="Resumen general del estado de todo el contenido."
        textoBoton="Ver todo"
      />

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-4">
        {estadosContenido.map((estado) => (
          <TarjetaEstadoContenido key={estado.titulo} {...estado} />
        ))}
      </div>
    </section>
  );
}

function TarjetaEstadoContenido({
  titulo,
  valor,
  porcentaje,
  icono: Icono,
  fondo,
  colorIcono,
  colorPunto,
}: EstadoContenidoProps) {
  return (
    <article className={cn("rounded-2xl p-4", fondo)}>
      <div className="flex items-center gap-3">
        <div className="grid size-12 shrink-0 place-items-center rounded-full bg-white/70">
          <Icono className={cn("size-6", colorIcono)} />
        </div>

        <div>
          <p className="text-2xl font-extrabold leading-none text-slate-900">{valor}</p>
          <p className="mt-1 text-[13px] font-semibold text-slate-700">{titulo}</p>
        </div>
      </div>

      <p className="mt-4 flex items-center justify-center gap-2 text-[13px] font-bold text-slate-700">
        <span className={cn("size-3 rounded-full", colorPunto)} />
        {porcentaje}
      </p>
    </article>
  );
}

function AccionesRapidas() {
  return (
    <section className="min-w-0 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
      <CabeceraSeccion
        titulo="Acciones rápidas"
        descripcion="Crea, administra y revisa contenido fácilmente."
      />

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-4">
        {accionesRapidas.map((accion) => (
          <TarjetaAccionRapida key={accion.titulo} {...accion} />
        ))}
      </div>
    </section>
  );
}

function TarjetaAccionRapida({
  titulo,
  descripcion,
  icono: Icono,
  fondo,
  colorIcono,
  colorTitulo,
}: AccionRapidaProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex items-center gap-3 rounded-2xl border border-slate-100 p-3 text-left transition hover:-translate-y-0.5 hover:shadow-md",
        fondo,
      )}
    >
      <div className="grid size-11 shrink-0 place-items-center rounded-full bg-white">
        <Icono className={cn("size-6", colorIcono)} />
      </div>

      <div>
        <h4 className={cn("text-[13px] font-extrabold", colorTitulo)}>{titulo}</h4>
        <p className="mt-1 text-[12px] font-medium leading-snug text-slate-700">
          {descripcion}
        </p>
      </div>
    </button>
  );
}

function TablaTemasRecientes() {
  return (
    <section className="min-w-0 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
      <CabeceraSeccion titulo="Temas recientes" textoBoton="Ver todos" />

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs text-slate-600">
              <th className="w-8 py-3"></th>
              <th className="py-3 font-extrabold">Título</th>
              <th className="py-3 font-extrabold">Senda</th>
              <th className="py-3 font-extrabold">Estado</th>
              <th className="py-3 font-extrabold"></th>
              <th className="py-3 font-extrabold">Última edición</th>
            </tr>
          </thead>

          <tbody>
            {temasRecientes.map((tema) => (
              <tr
                key={tema.titulo}
                className="border-b border-slate-100 text-xs font-semibold text-slate-700 last:border-0"
              >
                <td className="py-3">
                  <Leaf className="size-5 text-lime-500" />
                </td>
                <td className="py-3 text-slate-800">{tema.titulo}</td>
                <td className="py-3">{tema.senda}</td>
                <td className="py-3">
                  <InsigniaEstado estado={tema.estado} />
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <Avatar emoji={tema.avatar} className="size-8 text-lg" />
                    <span>{tema.autor}</span>
                  </div>
                </td>
                <td className="py-3">{tema.ultimaEdicion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        className="mx-auto mt-5 block font-extrabold text-emerald-600 hover:text-emerald-700"
      >
        Ver todos los temas
      </button>
    </section>
  );
}

function ActividadReciente() {
  return (
    <section className="min-w-0 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
      <h3 className="text-lg font-extrabold text-slate-950">
        Actividad reciente
      </h3>

      <div className="mt-4 space-y-3">
        {actividadReciente.map((actividad, index) => (
          <ItemActividad key={index} {...actividad} />
        ))}
      </div>

      <button
        type="button"
        className="mx-auto mt-5 block font-extrabold text-emerald-600 hover:text-emerald-700"
      >
        Ver toda la actividad
      </button>
    </section>
  );
}

function ItemActividad({
  icono: Icono,
  fondo,
  colorIcono,
  texto,
  tiempo,
}: Actividad) {
  return (
    <article className="flex min-w-0 items-start gap-4">
      <div className={cn("grid size-9 shrink-0 place-items-center rounded-full", fondo)}>
        <Icono className={cn("size-5", colorIcono)} />
      </div>

      <p className="min-w-0 flex-1 text-[13px] font-semibold leading-snug text-slate-700">
        {texto}
      </p>

      <span className="whitespace-nowrap text-xs font-medium text-slate-500">
        {tiempo}
      </span>
    </article>
  );
}

function ProximasRevisiones() {
  return (
    <section className="min-w-0 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-extrabold text-slate-950">
          Próximas revisiones
        </h3>

        <button
          type="button"
          className="text-sm font-extrabold text-emerald-600 hover:text-emerald-700"
        >
          Ver todas
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {revisiones.map((revision) => (
          <ItemRevision key={revision.titulo} {...revision} />
        ))}
      </div>
    </section>
  );
}

function ItemRevision({
  dia,
  mes,
  titulo,
  senda,
  estado,
  responsable,
  avatar,
  colorFecha,
}: Revision) {
  return (
    <article className="flex min-w-0 flex-wrap items-center gap-3">
      <div
        className={cn(
          "grid size-10 shrink-0 place-items-center rounded-xl text-center leading-none",
          colorFecha,
        )}
      >
        <span className="text-base font-extrabold">{dia}</span>
        <span className="text-[10px] font-black">{mes}</span>
      </div>

      <div className="min-w-0 flex-1">
        <h4 className="truncate text-sm font-extrabold text-slate-800">{titulo}</h4>
        <p className="truncate text-xs font-medium text-slate-500">
          Senda: {senda}
        </p>
      </div>

      <InsigniaEstado estado={estado} />

      <div className="flex min-w-0 flex-1 items-center gap-2 2xl:flex-none">
        <Avatar emoji={avatar} className="size-7 text-base" />
        <span className="truncate text-xs font-medium text-slate-600">
          {responsable}
        </span>
      </div>
    </article>
  );
}

function ProgresoSemanal() {
  const max = Math.max(...progresoSemanal.map((item) => item.valor));

  return (
    <section className="min-w-0 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-extrabold text-slate-950">
            Progreso semanal
          </h3>
          <p className="mt-1 text-xs font-medium text-slate-500">
            Contenido publicado por semana
          </p>
        </div>

        <button
          type="button"
          className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-500"
        >
          Esta semana
          <ChevronDown className="size-4" />
        </button>
      </div>

      <div className="mt-5 flex h-32 items-end justify-between gap-4 border-b border-slate-200 px-4">
        {progresoSemanal.map((item) => {
          const alto = (item.valor / max) * 100;

          return (
            <div key={item.dia} className="flex flex-1 flex-col items-center">
              <span className="mb-2 text-xs font-extrabold text-slate-700">
                {item.valor}
              </span>

              <div
                className="w-4 rounded-t-md bg-emerald-400"
                style={{ height: `${alto}%` }}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-2 flex justify-between px-4 text-xs font-semibold text-slate-500">
        {progresoSemanal.map((item) => (
          <span key={item.dia}>{item.dia}</span>
        ))}
      </div>
    </section>
  );
}

function CabeceraSeccion({
  titulo,
  descripcion,
  textoBoton,
}: {
  titulo: string;
  descripcion?: string;
  textoBoton?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h3 className="text-lg font-extrabold text-slate-950">{titulo}</h3>
        {descripcion && (
          <p className="mt-1 text-xs font-medium text-slate-500">
            {descripcion}
          </p>
        )}
      </div>

      {textoBoton && (
        <button
          type="button"
          className="rounded-xl border border-emerald-200 px-3 py-2 text-xs font-extrabold text-emerald-600 hover:bg-emerald-50"
        >
          {textoBoton}
        </button>
      )}
    </div>
  );
}

function InsigniaEstado({ estado }: { estado: EstadoTema | "En revisión" }) {
  const clases: Record<string, string> = {
    Publicado: "bg-emerald-100 text-emerald-700",
    "En revisión": "bg-blue-100 text-blue-700",
    Borrador: "bg-orange-100 text-orange-600",
  };

  return (
    <span
      className={cn(
        "inline-flex rounded-lg px-3 py-1 text-xs font-extrabold",
        clases[estado],
      )}
    >
      {estado}
    </span>
  );
}

function Avatar({
  emoji,
  className,
}: {
  emoji: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-amber-100 to-emerald-100 ring-2 ring-white",
        className,
      )}
    >
      <span>{emoji}</span>
    </div>
  );
}
