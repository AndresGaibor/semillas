# Refactor de Composición de Componentes — Frontend Semillas

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminar TODO estilo inline/hardcodeado del frontend, abstraer patrones repetidos a primitivas UI reutilizables, y garantizar que TODOS los componentes sean composiciones de primitivas con estilo centralizado.

**Architecture:** Crear primitivas UI faltantes (SelectFiltro, MenuDesplegable, AlertaCompletado, AvatarCircular, EtiquetaPildora), luego migrar progresivamente cada componente problemático para que use solo esas primitivas + Card + Boton + Badge/Chip. Cada componente será puro layout/composición, sin estilos propios.

**Tech Stack:** React, TypeScript, Tailwind CSS, CVA (class-variance-authority), Lucide React, `unirClases` (utility de `@/lib/utilidades`)

---

## Archivos a crear

| Archivo | Responsabilidad |
|---------|----------------|
| `componentes/ui/select-filtro.tsx` | Select con estilo pill (reemplaza selects hardcodeados en admin) |
| `componentes/ui/menu-desplegable.tsx` | Dropdown menu reutilizable (reemplaza menús inline en tablas admin) |
| `componentes/ui/alerta-completado.tsx` | Card de "¡Excelente Trabajo!" (reemplaza bloque duplicado en 4 actividades) |
| `componentes/ui/avatar-circular.tsx` | Avatar circular con borde (reemplaza img inline en insignias) |
| `componentes/ui/etiqueta-pildora.tsx` | Pill/badge de estado (reemplaza spans inline en insignias) |
| `componentes/ui/index.ts` | Barrel export de todas las primitivas |

## Archivos a modificar

| Archivo | Cambio |
|---------|--------|
| `features/home/componentes/racha-widget.tsx` | `style={{}}` → Tailwind + `Card` |
| `features/home/componentes/versiculo-del-dia.tsx` | `style={{}}` → Tailwind + `Card` |
| `features/home/componentes/insignias-widget.tsx` | `style={{}}` → Tailwind + `Card` + `AvatarCircular` |
| `features/gamification/componentes/logros-racha-widget.tsx` | Hardcoded → `Card` + `Badge` |
| `features/gamification/componentes/compartir-insignia-widget.tsx` | Hardcoded → `Card` + `Boton` |
| `features/gamification/componentes/insignia-card-item.tsx` | Hex hardcodeados → `EtiquetaPildora` + `AvatarCircular` |
| `features/admin/componentes/admin-themes-filters.tsx` | Selects inline → `SelectFiltro` |
| `features/admin/componentes/admin-activities-filters.tsx` | Selects inline → `SelectFiltro` + `CampoBusqueda` |
| `features/admin/componentes/admin-media-filters.tsx` | Selects inline → `SelectFiltro` |
| `features/admin/componentes/admin-users-filters.tsx` | Selects inline → `SelectFiltro` |
| `features/admin/componentes/admin-themes-table.tsx` | Dropdown inline → `MenuDesplegable` |
| `features/admin/componentes/admin-activities-table.tsx` | Dropdown inline → `MenuDesplegable` |
| `componentes/actividades/QuizActividad.tsx` | String concat → CVA/`unirClases` + `AlertaCompletado` + `Boton` |
| `componentes/actividades/Flashcards.tsx` | Hardcoded → Tailwind + `AlertaCompletado` |
| `componentes/actividades/Rompecabezas.tsx` | Hardcoded → Tailwind + `AlertaCompletado` |
| `componentes/ui/cabecera-seccion.tsx` | Raw button → `Boton` |
| `componentes/ui/card-insignia.tsx` | Color configs hardcodeados → `Chip` + colores centralizados |
| `componentes/ui/card-metrica.tsx` | `style={{ background }}` → Tailwind gradients |
| `componentes/ui/stepper-crecer.tsx` | Duplicar Tailwind+style → solo Tailwind |
| `shared/layout/app-sidebar.tsx` | Raw button → `Boton` |

---

## Fase 0: Crear primitivas UI faltantes

### Task 0.1: SelectFiltro

**Files:**
- Create: `frontend/src/componentes/ui/select-filtro.tsx`

**Interfaces:**
- Consumes: `unirClases` from `@/lib/utilidades`
- Produces: `<SelectFiltro>`, `SelectFiltroProps`

**Steps:**

- [ ] **Step 1: Crear SelectFiltro**

```tsx
// frontend/src/componentes/ui/select-filtro.tsx
import * as React from "react";
import { unirClases } from "@/lib/utilidades";

export interface OpcionFiltro {
  id: string;
  nombre: string;
}

export interface PropiedadesSelectFiltro extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  opciones: OpcionFiltro[];
  placeholder?: string;
  etiquetaAria: string;
  variante?: "pildora" | "cuadrado";
  clase?: string;
}

export const SelectFiltro = React.forwardRef<HTMLSelectElement, PropiedadesSelectFiltro>(
  ({ opciones, placeholder, etiquetaAria, variante = "pildora", clase, className, disabled, ...propiedades }, referencia) => {
    const clasesBase = variante === "pildora"
      ? "w-full px-4 pr-10 py-2.5 rounded-full border border-slate-200 bg-white text-[13px] font-semibold text-slate-700 appearance-none cursor-pointer transition-all"
      : "w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-semibold text-slate-700 appearance-none cursor-pointer transition-all";

    const clasesFocus = variante === "pildora"
      ? "focus:outline-none focus:ring-2 focus:ring-[#2E9E5B]/30 focus:border-[#2E9E5B]"
      : "focus:outline-none focus:ring-2 focus:ring-[#2E9E5B]/10 focus:border-[#2E9E5B]";

    const clasesDisabled = disabled ? "opacity-50 cursor-not-allowed" : "";

    return (
      <div className="relative">
        <select
          ref={referencia}
          disabled={disabled}
          aria-label={etiquetaAria}
          className={unirClases(clasesBase, clasesFocus, clasesDisabled, className, clase)}
          {...propiedades}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {opciones.map((opcion) => (
            <option key={opcion.id} value={opcion.id}>{opcion.nombre}</option>
          ))}
        </select>
        <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none" />
      </div>
    );
  }
);

SelectFiltro.displayName = "SelectFiltro";
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/componentes/ui/select-filtro.tsx
git commit -m "feat(ui): add SelectFiltro primitive"
```

---

### Task 0.2: MenuDesplegable

**Files:**
- Create: `frontend/src/componentes/ui/menu-desplegable.tsx`

**Interfaces:**
- Consumes: `unirClases` from `@/lib/utilidades`
- Produces: `<MenuDesplegable>`, `MenuDesplegableProps`

**Steps:**

- [ ] **Step 1: Crear MenuDesplegable**

```tsx
// frontend/src/componentes/ui/menu-desplegable.tsx
import * as React from "react";
import { unirClases } from "@/lib/utilidades";

export type ItemMenu = {
  label: string;
  icono?: string;
  iconoColor?: string;
  textoColor?: string;
  onClick: () => void;
};

export interface PropiedadesMenuDesplegable {
  items: ItemMenu[];
  estaAbierto: boolean;
  onAlternar: () => void;
  onCerrar: () => void;
  clase?: string;
}

export function MenuDesplegable({
  items,
  estaAbierto,
  onAlternar,
  onCerrar,
  clase,
}: PropiedadesMenuDesplegable) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onAlternar}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
        aria-label="Más opciones"
      >
        <i className="fa-solid fa-ellipsis-vertical text-xs" />
      </button>

      {estaAbierto && (
        <>
          <div className="fixed inset-0 z-10" onClick={onCerrar} />
          <div className={unirClases(
            "absolute right-0 z-20 mt-1.5 w-40 rounded-xl border border-slate-100 bg-white py-1.5 text-left shadow-lg",
            clase,
          )}>
            {items.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  item.onClick();
                  onCerrar();
                }}
                className={unirClases(
                  "flex w-full items-center gap-2 px-4 py-2 text-xs font-semibold transition-colors hover:bg-slate-50",
                  item.textoColor ?? "text-neutro-oscuro-max",
                )}
              >
                {item.icono && (
                  <i className={unirClases("fa-solid w-4 text-center", item.icono, item.iconoColor ?? "text-slate-400")} />
                )}
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/componentes/ui/menu-desplegable.tsx
git commit -m "feat(ui): add MenuDesplegable primitive"
```

---

### Task 0.3: AlertaCompletado

**Files:**
- Create: `frontend/src/componentes/ui/alerta-completado.tsx`

**Interfaces:**
- Consumes: `unirClases` from `@/lib/utilidades`, `Check` from `lucide-react`
- Produces: `<AlertaCompletado>`, `AlertaCompletadoProps`

**Steps:**

- [ ] **Step 1: Crear AlertaCompletado**

```tsx
// frontend/src/componentes/ui/alerta-completado.tsx
import * as React from "react";
import { Check } from "lucide-react";
import { unirClases } from "@/lib/utilidades";

export interface PropiedadesAlertaCompletado {
  titulo?: string;
  mensaje: string;
  clase?: string;
}

export function AlertaCompletado({
  titulo = "¡Excelente Trabajo!",
  mensaje,
  clase,
}: PropiedadesAlertaCompletado) {
  return (
    <div className={unirClases(
      "w-full p-8 bg-green-50 rounded-3xl border-2 border-green-200 text-center animate-in zoom-in-95 mt-4 shadow-sm",
      clase,
    )}>
      <div className="flex justify-center mb-6 text-green-500">
        <div className="bg-white p-4 rounded-full shadow-md">
          <Check size={64} strokeWidth={3} />
        </div>
      </div>
      <h4 className="text-3xl font-bold text-green-800 mb-4">{titulo}</h4>
      <p className="text-green-700 text-xl font-medium max-w-lg mx-auto">{mensaje}</p>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/componentes/ui/alerta-completado.tsx
git commit -m "feat(ui): add AlertaCompletado primitive"
```

---

### Task 0.4: AvatarCircular

**Files:**
- Create: `frontend/src/componentes/ui/avatar-circular.tsx`

**Interfaces:**
- Consumes: `unirClases` from `@/lib/utilidades`
- Produces: `<AvatarCircular>`, `AvatarCircularProps`

**Steps:**

- [ ] **Step 1: Crear AvatarCircular**

```tsx
// frontend/src/componentes/ui/avatar-circular.tsx
import * as React from "react";
import { unirClases } from "@/lib/utilidades";

export interface PropiedadesAvatarCircular {
  src: string;
  alt: string;
  tamano?: "xs" | "sm" | "md" | "lg";
  clase?: string;
}

const TAMANOS = {
  xs: "h-8 w-8",
  sm: "h-10 w-10",
  md: "h-12 w-12",
  lg: "h-16 w-16",
};

export function AvatarCircular({ src, alt, tamano = "md", clase }: PropiedadesAvatarCircular) {
  return (
    <div className={unirClases(
      "flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-slate-100 shadow-sm",
      TAMANOS[tamano],
      clase,
    )}>
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/componentes/ui/avatar-circular.tsx
git commit -m "feat(ui): add AvatarCircular primitive"
```

---

### Task 0.5: EtiquetaPildora

**Files:**
- Create: `frontend/src/componentes/ui/etiqueta-pildora.tsx`

**Interfaces:**
- Consumes: `unirClases` from `@/lib/utilidades`
- Produces: `<EtiquetaPildora>`, `EtiquetaPildoraProps`

**Steps:**

- [ ] **Step 1: Crear EtiquetaPildora**

```tsx
// frontend/src/componentes/ui/etiqueta-pildora.tsx
import * as React from "react";
import { unirClases } from "@/lib/utilidades";

export interface PropiedadesEtiquetaPildora {
  variante: "exito" | "pendiente" | "bloqueado";
  children: React.ReactNode;
  clase?: string;
}

const ESTILOS = {
  exito: "bg-green-50 text-green-700 border border-green-100",
  pendiente: "bg-slate-100 text-slate-500 border border-slate-200",
  bloqueado: "bg-slate-100 text-slate-500 border border-slate-200",
};

export function EtiquetaPildora({ variante, children, clase }: PropiedadesEtiquetaPildora) {
  return (
    <span className={unirClases(
      "inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider",
      ESTILOS[variante],
      clase,
    )}>
      {children}
    </span>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/componentes/ui/etiqueta-pildora.tsx
git commit -m "feat(ui): add EtiquetaPildora primitive"
```

---

### Task 0.6: Barrel export

**Files:**
- Create: `frontend/src/componentes/ui/index.ts`

**Steps:**

- [ ] **Step 1: Crear barrel export**

```ts
// frontend/src/componentes/ui/index.ts
export { Boton } from "./boton";
export type { VarianteBoton, TamanoBoton, FormaBoton } from "./boton";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./card-base";

export { Badge } from "./badge";
export { Chip } from "./chip-base";
export type { ColorDisenoKey } from "./chip-base";

export { BarraProgreso } from "./barra-progreso";
export { ProgresoCircular } from "./progreso-circular";
export { BottomNav } from "./bottom-nav";
export { StepperCRECER } from "./stepper-crecer";

export { SelectFiltro } from "./select-filtro";
export { MenuDesplegable } from "./menu-desplegable";
export { AlertaCompletado } from "./alerta-completado";
export { AvatarCircular } from "./avatar-circular";
export { EtiquetaPildora } from "./etiqueta-pildora";

export { EmptyState } from "./empty-state";
export { LoaderEstado } from "./loader-estado";
export { CampoFormulario } from "./campo-formulario";
export { Input } from "./input-base";
export { Select } from "./select";
export { Paginacion } from "./paginacion";
export { TablaBase, FilaTabla } from "./tabla-base";
export { CabeceraSeccion } from "./cabecera-seccion";
export { CardMetrica, TarjetaMetricaCompacta } from "./card-metrica";
export { CardInsignia } from "./card-insignia";
export { BadgeEstado } from "./badge-estado";
export { AvatarTexto } from "./avatar-texto";
export { CampoBusqueda } from "./navegacion-tabs";
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/componentes/ui/index.ts
git commit -m "feat(ui): add barrel export for all UI primitives"
```

---

## Fase 1: Home widgets — eliminar style={{}} y envolver con Card

### Task 1.1: Refactor RachaWidget

**Files:**
- Modify: `frontend/src/features/home/componentes/racha-widget.tsx`

**Steps:**

- [ ] **Step 1: Reescribir RachaWidget con Tailwind + Card**

```tsx
// frontend/src/features/home/componentes/racha-widget.tsx
import * as React from "react";
import { Flame } from "lucide-react";
import { Card } from "@/componentes/ui/card-base";
import { unirClases } from "@/lib/utilidades";

export interface RachaWidgetProps {
  diasRacha: number;
}

export const RachaWidget: React.FC<RachaWidgetProps> = ({ diasRacha }) => {
  const tieneRacha = diasRacha > 0;

  return (
    <Card sombra="sm" hoverEffect="none" className="p-5 flex flex-col justify-between gap-4">
      <div className="flex-1 text-left">
        <h2 className="text-base font-bold text-slate-800 mb-2">Racha actual</h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          {tieneRacha
            ? `¡Increíble! Has estudiado ${diasRacha} días seguidos.`
            : "Completa una lección para iniciar tu racha."}
        </p>
      </div>
      <div className={unirClases(
        "mx-auto w-16 h-16 rounded-full flex items-center justify-center",
        tieneRacha ? "bg-amber-100 text-amber-500" : "bg-slate-100 text-slate-300",
      )}>
        <div className="flex items-center gap-1">
          <Flame size={28} />
          {tieneRacha && (
            <span className="text-lg font-bold">{diasRacha}</span>
          )}
        </div>
      </div>
    </Card>
  );
};
```

- [ ] **Step 2: Verificar que compila**

Run: `bun run check`
Expected: Sin errores

- [ ] **Step 3: Commit**

```bash
git add frontend/src/features/home/componentes/racha-widget.tsx
git commit -m "refactor(home): RachaWidget uses Card + Tailwind, removes inline styles"
```

---

### Task 1.2: Refactor VersiculoDelDia

**Files:**
- Modify: `frontend/src/features/home/componentes/versiculo-del-dia.tsx`

**Steps:**

- [ ] **Step 1: Reescribir VersiculoDelDia con Tailwind + Card**

```tsx
// frontend/src/features/home/componentes/versiculo-del-dia.tsx
import * as React from "react";
import { BookOpen } from "lucide-react";
import { Card } from "@/componentes/ui/card-base";
import versiculoImg from "@/assets/images/Ilustraciones/Versiculo del dia.png";

export interface VersiculoDelDiaProps {
  texto: string;
  referencia: string;
}

export const VersiculoDelDia: React.FC<VersiculoDelDiaProps> = ({ texto, referencia }) => {
  return (
    <Card sombra="sm" hoverEffect="none" className="relative overflow-hidden p-6 flex items-center gap-6 border-2 border-amber-100">
      <div className="flex-1 z-10">
        <h2 className="mb-3 text-lg font-bold text-amber-900 flex items-center gap-2">
          <BookOpen size={20} className="text-amber-500" /> Versículo del día
        </h2>
        <p className="text-lg italic leading-relaxed text-slate-800 mb-2">
          "{texto}"
        </p>
        <p className="text-right text-sm font-medium text-amber-800">
          - {referencia}
        </p>
      </div>
      <div className="flex-shrink-0 w-[140px] z-10">
        <img
          src={versiculoImg}
          alt="Versículo del día"
          className="w-full rounded-xl shadow-md"
        />
      </div>
    </Card>
  );
};
```

- [ ] **Step 2: Verificar que compila**

Run: `bun run check`

- [ ] **Step 3: Commit**

```bash
git add frontend/src/features/home/componentes/versiculo-del-dia.tsx
git commit -m "refactor(home): VersiculoDelDia uses Card + Tailwind, removes inline styles"
```

---

### Task 1.3: Refactor InsigniasWidget

**Files:**
- Modify: `frontend/src/features/home/componentes/insignias-widget.tsx`

**Steps:**

- [ ] **Step 1: Reescribir InsigniasWidget con Tailwind + Card + AvatarCircular**

```tsx
// frontend/src/features/home/componentes/insignias-widget.tsx
import * as React from "react";
import { Card, CardHeader, CardTitle } from "@/componentes/ui/card-base";
import { AvatarCircular } from "@/componentes/ui/avatar-circular";

export interface Insignia {
  id: string;
  nombre: string;
  imagenUrl: string;
}

export interface InsigniasWidgetProps {
  insignias: Insignia[];
}

export const InsigniasWidget: React.FC<InsigniasWidgetProps> = ({ insignias }) => {
  const tieneInsignias = insignias && insignias.length > 0;

  return (
    <Card sombra="sm" hoverEffect="none" className="p-5">
      {tieneInsignias && (
        <CardHeader className="p-0 mb-4">
          <CardTitle>Insignias</CardTitle>
        </CardHeader>
      )}

      {tieneInsignias ? (
        <div className="flex gap-3 flex-wrap">
          {insignias.map((insignia) => (
            <div key={insignia.id} className="flex flex-col items-center w-[60px]">
              <AvatarCircular src={insignia.imagenUrl} alt={insignia.nombre} tamano="xs" />
              <span className="text-[0.65rem] text-center mt-1 text-slate-400 truncate w-full">
                {insignia.nombre}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-slate-400 text-sm">
          <p>Aún no tienes insignias.</p>
        </div>
      )}
    </Card>
  );
};
```

- [ ] **Step 2: Verificar que compila**

Run: `bun run check`

- [ ] **Step 3: Commit**

```bash
git add frontend/src/features/home/componentes/insignias-widget.tsx
git commit -m "refactor(home): InsigniasWidget uses Card + AvatarCircular, removes inline styles"
```

---

## Fase 2: Gamification widgets — reemplazar hardcoded con primitivas

### Task 2.1: Refactor LogrosRachaWidget

**Files:**
- Modify: `frontend/src/features/gamification/componentes/logros-racha-widget.tsx`

**Steps:**

- [ ] **Step 1: Reescribir usando Card**

```tsx
// frontend/src/features/gamification/componentes/logros-racha-widget.tsx
import * as React from "react";
import { Flame } from "lucide-react";
import { Card } from "@/componentes/ui/card-base";

export interface LogrosRachaWidgetProps {
  dias: number;
  mensaje: string;
}

export const LogrosRachaWidget: React.FC<LogrosRachaWidgetProps> = ({ dias, mensaje }) => {
  return (
    <Card sombra="sm" hoverEffect="none" className="p-6 flex flex-col">
      <div className="flex items-center justify-between gap-4">
        <div className="text-left flex-1">
          <h2 className="text-base font-black text-slate-800 mb-1">Racha actual</h2>
          <p className="text-xs text-slate-400 leading-normal">{mensaje}</p>
        </div>
        <div className="flex flex-col items-center justify-center bg-orange-50 border border-orange-200 rounded-full w-16 h-16 flex-shrink-0 shadow-sm">
          <Flame className="text-orange-500 fill-orange-500 animate-pulse" size={24} />
          <span className="text-sm font-black text-orange-700 leading-none mt-0.5">{dias}</span>
        </div>
      </div>
    </Card>
  );
};
```

- [ ] **Step 2: Verificar que compila**

Run: `bun run check`

- [ ] **Step 3: Commit**

```bash
git add frontend/src/features/gamification/componentes/logros-racha-widget.tsx
git commit -m "refactor(gamification): LogrosRachaWidget uses Card"
```

---

### Task 2.2: Refactor CompartirInsigniaWidget

**Files:**
- Modify: `frontend/src/features/gamification/componentes/compartir-insignia-widget.tsx`

**Steps:**

- [ ] **Step 1: Reescribir usando Card + Boton**

```tsx
// frontend/src/features/gamification/componentes/compartir-insignia-widget.tsx
import * as React from "react";
import { Share2 } from "lucide-react";
import { Card, CardTitle } from "@/componentes/ui/card-base";
import { Boton } from "@/componentes/ui/boton";

export interface CompartirInsigniaWidgetProps {
  nombreInsignia: string;
  imagenInsignia: string;
  onCompartir: () => void;
  compartido: boolean;
}

export const CompartirInsigniaWidget: React.FC<CompartirInsigniaWidgetProps> = ({
  imagenInsignia,
  onCompartir,
  compartido,
}) => {
  return (
    <Card sombra="sm" hoverEffect="none" className="p-6 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <CardTitle>Compartir en Clubes</CardTitle>
        <Share2 size={16} className="text-[#7E57C2]" />
      </div>

      <div className="bg-slate-50 border border-dashed border-[#EDE7F6] p-4 rounded-2xl flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 shadow-sm mb-3">
          <img src={imagenInsignia} alt="Insignia a compartir" className="w-full h-full object-cover" />
        </div>
        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          ¡Muestra tus logros con tus amigos de los clubes!
        </p>
        <Boton
          variante={compartido ? "exito" : "secundario"}
          tamano="pequeno"
          anchoCompleto
          iconoIzquierdo={<Share2 size={14} />}
          onClick={onCompartir}
          deshabilitado={compartido}
        >
          {compartido ? "Compartido" : "Compartir insignia"}
        </Boton>
      </div>
    </Card>
  );
};
```

- [ ] **Step 2: Verificar que compila**

Run: `bun run check`

- [ ] **Step 3: Commit**

```bash
git add frontend/src/features/gamification/componentes/compartir-insignia-widget.tsx
git commit -m "refactor(gamification): CompartirInsigniaWidget uses Card + Boton"
```

---

### Task 2.3: Refactor InsigniaCardItem

**Files:**
- Modify: `frontend/src/features/gamification/componentes/insignia-card-item.tsx`

**Steps:**

- [ ] **Step 1: Reescribir usando EtiquetaPildora + AvatarCircular**

```tsx
// frontend/src/features/gamification/componentes/insignia-card-item.tsx
import * as React from "react";
import { Lock, CheckCircle } from "lucide-react";
import { Card } from "@/componentes/ui/card-base";
import { EtiquetaPildora } from "@/componentes/ui/etiqueta-pildora";
import { AvatarCircular } from "@/componentes/ui/avatar-circular";

export interface InsigniaCardItemProps {
  codigo: string;
  nombre: string;
  descripcion: string;
  criterio: string;
  bono_xp: number;
  imagen: string;
  obtenido: boolean;
}

export const InsigniaCardItem: React.FC<InsigniaCardItemProps> = ({
  nombre,
  descripcion,
  criterio,
  bono_xp,
  imagen,
  obtenido,
}) => {
  return (
    <Card
      className={`p-0 overflow-hidden flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
        !obtenido ? "opacity-75 bg-slate-50/50" : "bg-white"
      }`}
    >
      <div className="relative mt-6">
        <AvatarCircular
          src={imagen}
          alt={nombre}
          tamano="lg"
          clase={obtenido ? "" : "opacity-50"}
        />
        {!obtenido && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Lock className="text-slate-400" size={36} />
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col items-center">
        <h3 className="mb-1 text-base font-extrabold leading-tight text-slate-800 sm:text-lg">
          {nombre}
        </h3>
        <p className="text-xs font-semibold text-[#7E57C2] mb-3">
          +{bono_xp} XP • {criterio}
        </p>
        <p className="text-xs text-slate-500 leading-relaxed mb-4 flex-1">
          {descripcion}
        </p>

        {obtenido ? (
          <EtiquetaPildora variante="exito">
            <CheckCircle size={10} /> Obtenida
          </EtiquetaPildora>
        ) : (
          <EtiquetaPildora variante="pendiente">En progreso</EtiquetaPildora>
        )}
      </div>
    </Card>
  );
};
```

- [ ] **Step 2: Verificar que compila**

Run: `bun run check`

- [ ] **Step 3: Commit**

```bash
git add frontend/src/features/gamification/componentes/insignia-card-item.tsx
git commit -m "refactor(gamification): InsigniaCardItem uses EtiquetaPildora + AvatarCircular"
```

---

## Fase 3: Admin filters — reemplazar selects hardcodeados

### Task 3.1: Refactor AdminThemesFilters

**Files:**
- Modify: `frontend/src/features/admin/componentes/admin-themes-filters.tsx`

**Steps:**

- [ ] **Step 1: Reescribir usando SelectFiltro**

Reemplazar los 2 `<select>` inline con `<SelectFiltro>` y el botón "Más filtros" con `<Boton>`:

```tsx
// frontend/src/features/admin/componentes/admin-themes-filters.tsx
import { CampoBusqueda } from "@/componentes/ui/navegacion-tabs";
import { SelectFiltro } from "@/componentes/ui/select-filtro";
import { Boton } from "@/componentes/ui/boton";

type FilterItem = { id: string; nombre: string };

type AdminThemesFiltersProps = {
  searchValue: string;
  onSearchChange: (val: string) => void;
  selectedSendaId: string;
  onSendaChange: (val: string) => void;
  selectedAgeGroupId: string;
  onAgeGroupChange: (val: string) => void;
  sendas: FilterItem[];
  ageGroups: FilterItem[];
  onMasFiltros?: () => void;
};

export function AdminThemesFilters({
  searchValue, onSearchChange,
  selectedSendaId, onSendaChange,
  selectedAgeGroupId, onAgeGroupChange,
  sendas, ageGroups, onMasFiltros,
}: AdminThemesFiltersProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-3 w-full bg-white rounded-3xl border border-slate-100 p-5 shadow-sm select-none">
      <CampoBusqueda
        valor={searchValue}
        onChange={onSearchChange}
        placeholder="Buscar por título o palabra clave..."
        contenedorClassName="flex-1"
        inputClassName="rounded-full pl-10 py-2.5 text-[13px] focus:ring-2 focus:ring-[#2E9E5B]/30 focus:border-[#2E9E5B] placeholder:text-slate-400 placeholder:font-normal"
      />

      <div className="w-full lg:w-48">
        <SelectFiltro
          opciones={sendas}
          placeholder="Todas las sendas"
          etiquetaAria="Filtrar por senda"
          value={selectedSendaId}
          onChange={(e) => onSendaChange(e.target.value)}
        />
      </div>

      <div className="w-full lg:w-48">
        <SelectFiltro
          opciones={ageGroups}
          placeholder="Todas las franjas"
          etiquetaAria="Filtrar por franja de edad"
          value={selectedAgeGroupId}
          onChange={(e) => onAgeGroupChange(e.target.value)}
        />
      </div>

      <Boton
        variante="contorno"
        tamano="pequeno"
        iconoIzquierdo={<i className="fa-solid fa-filter text-xs" />}
        onClick={onMasFiltros}
        deshabilitado={!onMasFiltros}
      >
        Más filtros
      </Boton>
    </div>
  );
}
```

- [ ] **Step 2: Verificar que compila**

Run: `bun run check`

- [ ] **Step 3: Commit**

```bash
git add frontend/src/features/admin/componentes/admin-themes-filters.tsx
git commit -m "refactor(admin): AdminThemesFilters uses SelectFiltro + Boton"
```

---

### Task 3.2: Refactor AdminActivitiesFilters

**Files:**
- Modify: `frontend/src/features/admin/componentes/admin-activities-filters.tsx`

**Steps:**

- [ ] **Step 1: Reescribir usando SelectFiltro**

Reemplazar los 3 `<select>` inline con `<SelectFiltro>` y el botón "Limpiar filtros" con `<Boton>`.

- [ ] **Step 2: Verificar que compila**

Run: `bun run check`

- [ ] **Step 3: Commit**

```bash
git add frontend/src/features/admin/componentes/admin-activities-filters.tsx
git commit -m "refactor(admin): AdminActivitiesFilters uses SelectFiltro + Boton"
```

---

### Task 3.3: Refactor AdminMediaFilters

**Files:**
- Modify: `frontend/src/features/admin/componentes/admin-media-filters.tsx`

**Steps:**

- [ ] **Step 1: Reemplazar selects inline con SelectFiltro**

Mismo patrón que los otros filters.

- [ ] **Step 2: Verificar que compila**

Run: `bun run check`

- [ ] **Step 3: Commit**

```bash
git add frontend/src/features/admin/componentes/admin-media-filters.tsx
git commit -m "refactor(admin): AdminMediaFilters uses SelectFiltro"
```

---

### Task 3.4: Refactor AdminUsersFilters

**Files:**
- Modify: `frontend/src/features/admin/componentes/admin-users-filters.tsx`

**Steps:**

- [ ] **Step 1: Reemplazar selects inline con SelectFiltro**

- [ ] **Step 2: Verificar que compila**

Run: `bun run check`

- [ ] **Step 3: Commit**

```bash
git add frontend/src/features/admin/componentes/admin-users-filters.tsx
git commit -m "refactor(admin): AdminUsersFilters uses SelectFiltro"
```

---

## Fase 4: Admin tables — reemplazar dropdowns inline

### Task 4.1: Refactor AdminThemesTable dropdown

**Files:**
- Modify: `frontend/src/features/admin/componentes/admin-themes-table.tsx`

**Steps:**

- [ ] **Step 1: Reemplazar dropdown inline con MenuDesplegable**

En la sección del menú contextual (líneas 140-193), reemplazar con `<MenuDesplegable>`:

```tsx
import { MenuDesplegable, type ItemMenu } from "@/componentes/ui/menu-desplegable";

// Dentro del map de temas:
const itemsMenu: ItemMenu[] = [
  { label: "Editor CRECER", icono: "fa-bookmark", onClick: () => onCRECER(tema.id) },
  { label: "Actividades", icono: "fa-gamepad", onClick: () => onActivities(tema.id) },
  ...(estadoNormalizado !== "publicado"
    ? [{ label: "Publicar", icono: "fa-cloud-arrow-up", iconoColor: "text-[#2e9e5b]", textoColor: "text-[#2e9e5b]", onClick: () => onPublicar?.(tema.id) }]
    : [{ label: "Despublicar", icono: "fa-cloud-arrow-down", iconoColor: "text-[#EE6C4D]", textoColor: "text-[#EE6C4D]", onClick: () => onDespublicar?.(tema.id) }]
  ),
];

// Reemplazar el bloque condicional con:
<MenuDesplegable
  items={itemsMenu}
  estaAbierto={activeMenuId === tema.id}
  onAlternar={() => setActiveMenuId(activeMenuId === tema.id ? null : tema.id)}
  onCerrar={() => setActiveMenuId(null)}
/>
```

- [ ] **Step 2: Verificar que compila**

Run: `bun run check`

- [ ] **Step 3: Commit**

```bash
git add frontend/src/features/admin/componentes/admin-themes-table.tsx
git commit -m "refactor(admin): AdminThemesTable uses MenuDesplegable"
```

---

### Task 4.2: Refactor AdminActivitiesTable dropdown

**Files:**
- Modify: `frontend/src/features/admin/componentes/admin-activities-table.tsx`

**Steps:**

- [ ] **Step 1: Reemplazar dropdown inline con MenuDesplegable**

En `MenuAccionesActividad`, reemplazar el bloque condicional con `<MenuDesplegable>`:

```tsx
import { MenuDesplegable, type ItemMenu } from "@/componentes/ui/menu-desplegable";

// En MenuAccionesActividad:
const itemsMenu: ItemMenu[] = [
  { label: "Copiar enlace", icono: "fa-link", onClick: () => navigator.clipboard.writeText(...) },
  { label: "Eliminar", icono: "fa-trash", iconoColor: "text-red-500", textoColor: "text-red-500", onClick: onEliminar },
];

<MenuDesplegable
  items={itemsMenu}
  estaAbierto={open}
  onAlternar={() => setOpen(!open)}
  onCerrar={() => setOpen(false)}
/>
```

- [ ] **Step 2: Verificar que compila**

Run: `bun run check`

- [ ] **Step 3: Commit**

```bash
git add frontend/src/features/admin/componentes/admin-activities-table.tsx
git commit -m "refactor(admin): AdminActivitiesTable uses MenuDesplegable"
```

---

## Fase 5: Actividades — extraer componentes y usar AlertaCompletado + Boton

### Task 5.1: Refactor QuizActividad

**Files:**
- Modify: `frontend/src/componentes/actividades/QuizActividad.tsx`

**Steps:**

- [ ] **Step 1: Reemplazar string concat con unirClases, usar AlertaCompletado + Boton**

Cambios principales:
1. Reemplazar `let btnClass = "..." + string concat` con `unirClases()`
2. Reemplazar `<button>` de navegación con `<Boton>`
3. Reemplazar card de completado con `<AlertaCompletado>`
4. Reemplazar banner con `style={{ backgroundImage }}` → Tailwind `bg-[url(...)] bg-cover bg-center`

- [ ] **Step 2: Verificar que compila**

Run: `bun run check`

- [ ] **Step 3: Commit**

```bash
git add frontend/src/componentes/actividades/QuizActividad.tsx
git commit -m "refactor(activities): QuizActividad uses unirClases + Boton + AlertaCompletado"
```

---

### Task 5.2: Refactor Flashcards

**Files:**
- Modify: `frontend/src/componentes/actividades/Flashcards.tsx`

**Steps:**

- [ ] **Step 1: Reemplazar card de completado con AlertaCompletado**

Cambios principales:
1. Reemplazar bloque de completado (líneas 162-174) con `<AlertaCompletado mensaje="Has encontrado todos los pares con éxito." />`
2. Reemplazar `style={{ perspective: '1000px' }}` con clase de Tailwind `[perspective:1000px]`

- [ ] **Step 2: Verificar que compila**

Run: `bun run check`

- [ ] **Step 3: Commit**

```bash
git add frontend/src/componentes/actividades/Flashcards.tsx
git commit -m "refactor(activities): Flashcards uses AlertaCompletado"
```

---

### Task 5.3: Refactor Rompecabezas

**Files:**
- Modify: `frontend/src/componentes/actividades/Rompecabezas.tsx`

**Steps:**

- [ ] **Step 1: Reemplazar card de completado con AlertaCompletado**

Cambios principales:
1. Reemplazar bloque de completado (líneas 199-211) con `<AlertaCompletado mensaje="Armaste la imagen correctamente." />`

- [ ] **Step 2: Verificar que compila**

Run: `bun run check`

- [ ] **Step 3: Commit**

```bash
git add frontend/src/componentes/actividades/Rompecabezas.tsx
git commit -m "refactor(activities): Rompecabezas uses AlertaCompletado"
```

---

### Task 5.4: Verificar RelacionarConceptos

**Files:**
- Modify: `frontend/src/componentes/actividades/RelacionarConceptos.tsx` (si aplica)

**Steps:**

- [ ] **Step 1: Verificar que no hay estilos inline**

Este componente ya usa `<Boton>` y no tiene `style={{}}`. Solo verificar que no hay nada que cambiar.

- [ ] **Step 2: Commit (si hay cambios)**

---

## Fase 6: UI components cleanup

### Task 6.1: Refactor CabeceraSeccion — usar Boton

**Files:**
- Modify: `frontend/src/componentes/ui/cabecera-seccion.tsx`

**Steps:**

- [ ] **Step 1: Reemplazar raw button con Boton**

```tsx
import { Boton } from "./boton";

// Reemplazar:
// <button type="button" onClick={onBotonClick} className="rounded-xl border ...">
//   {textoBoton}
// </button>

// Con:
{textoBoton && (
  <Boton variante="contorno" tamano="pequeno" onClick={onBotonClick}>
    {textoBoton}
  </Boton>
)}
```

- [ ] **Step 2: Verificar que compila**

Run: `bun run check`

- [ ] **Step 3: Commit**

```bash
git add frontend/src/componentes/ui/cabecera-seccion.tsx
git commit -m "refactor(ui): CabeceraSeccion uses Boton"
```

---

### Task 6.2: Refactor CardInsignia — centralizar colores

**Files:**
- Modify: `frontend/src/componentes/ui/card-insignia.tsx`

**Steps:**

- [ ] **Step 1: Mover colorConfigs a archivo de constantes**

Extraer `colorConfigs` a un archivo compartido `@/componentes/ui/temas-color.ts` y reemplazar `style={{ backgroundColor }}` inline con clases de Tailwind o el mapeo de colores de `MAPEO_COLORES_DISENO`.

- [ ] **Step 2: Reemplazar pills inline con EtiquetaPildora**

Reemplazar los `<div>` de "¡Logro obtenido!" y "Bloqueado" con `<EtiquetaPildora>`.

- [ ] **Step 3: Verificar que compila**

Run: `bun run check`

- [ ] **Step 4: Commit**

```bash
git add frontend/src/componentes/ui/card-insignia.tsx
git commit -m "refactor(ui): CardInsignia centralizes colors, uses EtiquetaPildora"
```

---

### Task 6.3: Refactor CardMetrica — eliminar style={{ background }}

**Files:**
- Modify: `frontend/src/componentes/ui/card-metrica.tsx`

**Steps:**

- [ ] **Step 1: Reemplazar style={{ background: gradiente }} con Tailwind**

Mover los gradientes a clases de Tailwind o crear una utility `claseGradiente(tipo)` que retorne las clases correspondientes.

- [ ] **Step 2: Verificar que compila**

Run: `bun run check`

- [ ] **Step 3: Commit**

```bash
git add frontend/src/componentes/ui/card-metrica.tsx
git commit -m "refactor(ui): CardMetrica uses Tailwind gradients instead of inline style"
```

---

### Task 6.4: Refactor StepperCRECER — eliminar duplicación style+Tailwind

**Files:**
- Modify: `frontend/src/componentes/ui/stepper-crecer.tsx`

**Steps:**

- [ ] **Step 1: Eliminar todos los style={{}} duplicados**

El stepper tiene `style={{}}` paralelo a Tailwind en los mismos elementos. Eliminar los `style` y dejar solo Tailwind. Para el color dinámico de las burbujas, usar `style` solo para `backgroundColor`/`borderColor` que dependen de `paso.colorHex`.

- [ ] **Step 2: Verificar que compila**

Run: `bun run check`

- [ ] **Step 3: Commit**

```bash
git add frontend/src/componentes/ui/stepper-crecer.tsx
git commit -m "refactor(ui): StepperCRECER removes duplicate style+Tailwind"
```

---

### Task 6.5: Refactor AppSidebar — usar Boton

**Files:**
- Modify: `frontend/src/shared/layout/app-sidebar.tsx`

**Steps:**

- [ ] **Step 1: Reemplazar raw button con Boton**

```tsx
import { Boton } from "@/componentes/ui/boton";

// Reemplazar el botón "Ver estado" raw con:
<Boton variante="exito" tamano="pequeno" anchoCompleto className="shadow-none">
  Ver estado
</Boton>
```

- [ ] **Step 2: Verificar que compila**

Run: `bun run check`

- [ ] **Step 3: Commit**

```bash
git add frontend/src/shared/layout/app-sidebar.tsx
git commit -m "refactor(layout): AppSidebar uses Boton"
```

---

## Fase 7: Verificación final

### Task 7.1: Ejecutar verificación completa

**Steps:**

- [ ] **Step 1: Ejecutar lint y typecheck**

```bash
cd frontend && bun run check
```

- [ ] **Step 2: Ejecutar build**

```bash
cd frontend && bun run build
```

- [ ] **Step 3: Verificar que no hay `style={{` en componentes de feature**

```bash
grep -rn 'style={{' frontend/src/features/ frontend/src/componentes/actividades/
```

Expected: Solo `Rompecabezas` (piezas grid con `gridTemplateColumns/Rows` dinámico) y `QuizActividad` (banner con `backgroundImage` dinámico) — estos son legítimos porque dependen de datos.

- [ ] **Step 4: Verificar que no hay `<select>` sin SelectFiltro en admin**

```bash
grep -rn '<select' frontend/src/features/admin/
```

Expected: Solo en `admin-activities-table.tsx` (ordenar por) — legítimo.

- [ ] **Step 5: Commit final**

```bash
git add -A && git commit -m "refactor(ui): complete component composition audit - all primitives centralized"
```

---

## Resumen de impacto

| Fase | Archivos creados | Archivos modificados | Eliminación de inline styles |
|------|------------------|---------------------|-------------------------------|
| Fase 0 | 6 | 0 | — |
| Fase 1 | 0 | 3 | ~120 líneas `style={{}}` eliminadas |
| Fase 2 | 0 | 3 | ~30 líneas hardcoded eliminadas |
| Fase 3 | 0 | 4 | ~20 selectores duplicados centralizados |
| Fase 4 | 0 | 2 | ~80 líneas de dropdown inline eliminadas |
| Fase 5 | 0 | 4 | ~40 líneas de completado card duplicadas |
| Fase 6 | 0 | 5 | ~50 líneas de style+Tailwind duplicadas |
| **Total** | **6** | **21** | **~340 líneas de estilo inline eliminadas** |

## Patrones de estilo que quedan centralizados

| Primitiva | Reemplaza | Usada en |
|-----------|-----------|----------|
| `SelectFiltro` | `<select className="w-full px-4 pr-10 py-2.5 rounded-full...">` | 4 filters admin |
| `MenuDesplegable` | Bloque condicional con `fixed inset-0` + `absolute right-0` | 2 tables admin |
| `AlertaCompletado` | `<div className="w-full p-8 bg-green-50 rounded-3xl...">` | 4 actividades |
| `AvatarCircular` | `<div className="... rounded-full ..."><img .../>` | 2 insignia widgets |
| `EtiquetaPildora` | `<span className="inline-flex ... rounded-full ...">` | 2 insignia cards |
| `Boton` (ya existía) | `<button className="rounded-xl border...">` | 3 componentes más |
| `Card` (ya existía) | `<div className="widget-card" style={{...}}>` | 3 home widgets |
