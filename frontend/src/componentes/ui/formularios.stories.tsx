import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  AlignLeft,
  Fingerprint,
  Lock,
  Mail,
  Palette,
  Search,
  User,
} from "lucide-react";

import { Checkbox } from "./checkbox";
import { Input, InputBusqueda, InputContraseña } from "./input";
import { Radio } from "./radio";
import { Select } from "./select";
import { Switch } from "./switch";
import { Textarea } from "./textarea";

const meta = {
  title: "Componentes/Inputs",
  component: Input,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

// ── Historias individuales ───────────────────────────────────────────────────

export const PorDefecto: Story = {
  args: { placeholder: "Escribe algo..." },
};

export const ConError: Story = {
  args: {
    placeholder: "juan@email",
    estado: "error",
    mensajeError: "Correo inválido",
    defaultValue: "juan@email",
  },
};

export const ConExito: Story = {
  args: {
    placeholder: "juan@email.com",
    estado: "exito",
    mensajeExito: "Correo válido",
    defaultValue: "juan@email.com",
  },
};

// ── Página de documentación completa ────────────────────────────────────────

export const DocumentacionCompleta: Story = {
  name: "📄 Documentación Completa",
  parameters: {
    layout: "fullscreen",
  },
  render: () => (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#FFFFFF",
        fontFamily: "Nunito, Inter, system-ui, sans-serif",
      }}
    >
      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <aside
        style={{
          width: "224px",
          minWidth: "224px",
          borderRight: "1px solid #F1F5F9",
          padding: "24px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          backgroundColor: "#FFFFFF",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              background: "linear-gradient(135deg, #16A34A, #2E9E5B)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
            }}
          >
            🌱
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "16px", color: "#16A34A", lineHeight: 1 }}>
              Semillas
            </div>
            <div style={{ fontSize: "10px", color: "#94A3B8", lineHeight: 1.3 }}>
              Crece en la fe cada día
            </div>
          </div>
        </div>

        {/* Title */}
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#0F172A", margin: "0 0 8px", lineHeight: 1.2 }}>
            Inputs
          </h1>
          <p style={{ fontSize: "12px", color: "#64748B", lineHeight: 1.6, margin: 0 }}>
            Nuestros campos de entrada son claros, amigables y accesibles. Tienen bordes
            redondeados y feedback visual según su estado.
          </p>
        </div>

        {/* Principios */}
        <div>
          <h2 style={{ fontSize: "13px", fontWeight: 700, color: "#6C3AED", margin: "0 0 12px" }}>
            Principios
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              { Icon: AlignLeft, color: "#6C3AED", bg: "#EDE9FE", title: "Legibles", desc: "Texto claro y tamaño mínimo de 16px en móvil." },
              { Icon: Palette, color: "#0EA5E9", bg: "#E0F2FE", title: "Consistentes", desc: "Colores y radios uniformes en todos los campos." },
              { Icon: Fingerprint, color: "#16A34A", bg: "#DCFCE7", title: "Feedback claro", desc: "Cada estado tiene un color y un mensaje visible." },
              { Icon: Lock, color: "#7C3AED", bg: "#EDE9FE", title: "Accesibles", desc: "Contraste adecuado y áreas táctiles mínimas de 44px." },
            ].map(({ Icon, color, bg, title, desc }) => (
              <div key={title} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                <div
                  style={{
                    width: "28px", height: "28px", minWidth: "28px",
                    borderRadius: "50%", background: bg,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <Icon size={14} color={color} />
                </div>
                <div>
                  <p style={{ fontSize: "11px", fontWeight: 700, color: "#374151", margin: "0 0 1px" }}>{title}</p>
                  <p style={{ fontSize: "11px", color: "#6B7280", lineHeight: 1.4, margin: 0 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Especificaciones */}
        <div>
          <h2 style={{ fontSize: "13px", fontWeight: 700, color: "#6C3AED", margin: "0 0 10px" }}>
            Especificaciones
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            {[
              "Radio de borde: 12px",
              "Altura mínima: 44px (móvil) / 40px (web)",
              "Padding horizontal: 16px",
              "Ícono a la izquierda: 20px de espacio",
              "Mensaje de ayuda: 12–14px",
              "Transiciones: 150ms ease",
              "Estados con ícono + color + texto",
            ].map((spec) => (
              <div key={spec} style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                <span style={{ color: "#16A34A", fontSize: "12px", lineHeight: 1.4 }}>●</span>
                <p style={{ fontSize: "11px", color: "#475569", lineHeight: 1.4, margin: 0 }}>{spec}</p>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* ── Contenido principal ──────────────────────────────────────── */}
      <main style={{ flex: 1, padding: "24px 28px", overflowX: "auto" }}>

        {/* 01. Input de texto */}
        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#6C3AED", margin: "0 0 14px" }}>
            01. Input de texto
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "16px", marginBottom: "16px" }}>
            {[
              { label: "Default" },
              { label: "Focus" },
              { label: "Lleno" },
              { label: "Error" },
              { label: "Éxito" },
              { label: "Deshabilitado" },
            ].map(({ label }) => (
              <div key={label} style={{ fontSize: "11px", color: "#94A3B8", fontWeight: 600, textAlign: "center" }}>{label}</div>
            ))}

            <Input placeholder="Escribe algo..." />
            <Input placeholder="Escribe algo..." className="border-[#6C3AED] ring-2 ring-[#6C3AED]/15" />
            <Input defaultValue="Juan Pérez" placeholder="Escribe algo..." />
            <Input defaultValue="juan@email" estado="error" mensajeError="Correo inválido" />
            <Input defaultValue="juan@email.com" estado="exito" mensajeExito="Correo válido" />
            <Input disabled placeholder="No disponible" />
          </div>

          {/* Con icono */}
          <div style={{ marginTop: "12px" }}>
            <p style={{ fontSize: "11px", color: "#94A3B8", fontWeight: 600, marginBottom: "10px" }}>
              Con icono
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
              <Input placeholder="Nombre completo" iconoIzquierdo={<User className="size-4 text-gray-400" />} />
              <Input placeholder="Correo electrónico" iconoIzquierdo={<Mail className="size-4 text-gray-400" />} />
              <InputContraseña placeholder="Contraseña" iconoIzquierdo={<Lock className="size-4 text-gray-400" />} />
              <InputBusqueda placeholder="Buscar..." iconoBusqueda={<Search className="size-4 text-gray-400" />} />
            </div>
          </div>
        </section>

        {/* 02 + 03 fila */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 32px", marginBottom: "32px" }}>

          {/* 02. Select / Dropdown */}
          <section>
            <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#6C3AED", margin: "0 0 14px" }}>
              02. Select / Dropdown
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
              {["Default", "Seleccionado", "Deshabilitado"].map((l) => (
                <div key={l} style={{ fontSize: "11px", color: "#94A3B8", fontWeight: 600, textAlign: "center" }}>{l}</div>
              ))}
              <Select placeholder="Selecciona una opción">
                <option value="1">Opción 1</option>
                <option value="2">Opción 2</option>
                <option value="3">Opción 3</option>
                <option value="4">Opción 4</option>
              </Select>
              <Select defaultValue="2">
                <option value="1">Opción 1</option>
                <option value="2">Opción 2</option>
                <option value="3">Opción 3</option>
              </Select>
              <Select disabled placeholder="No disponible" />
            </div>
            <div style={{ marginTop: "10px" }}>
              <Select estado="error" mensajeError="Este campo es obligatorio" placeholder="Selecciona una opción" />
            </div>
          </section>

          {/* 03. Textarea */}
          <section>
            <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#6C3AED", margin: "0 0 14px" }}>
              03. Textarea
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
              {["Default", "Lleno", "Error"].map((l) => (
                <div key={l} style={{ fontSize: "11px", color: "#94A3B8", fontWeight: 600, textAlign: "center" }}>{l}</div>
              ))}
              <Textarea placeholder="Escribe tu respuesta..." mostrarContador maxCaracteres={200} />
              <Textarea
                defaultValue="Me gusta aprender sobre la Biblia porque me acerca más a Dios."
                mostrarContador
                maxCaracteres={200}
              />
              <Textarea
                placeholder="Escribe tu respuesta..."
                estado="error"
                mensajeError="Este campo es obligatorio"
                mostrarContador
                maxCaracteres={200}
              />
            </div>
          </section>
        </div>

        {/* Fila: 04–06 lado derecho + 07 */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "0 32px", marginBottom: "32px" }}>

          {/* 07. Input de contraseña */}
          <section>
            <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#6C3AED", margin: "0 0 14px" }}>
              07. Input de contraseña
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
              {["Default", "Con contenido", "Error", "Éxito"].map((l) => (
                <div key={l} style={{ fontSize: "11px", color: "#94A3B8", fontWeight: 600, textAlign: "center" }}>{l}</div>
              ))}
              <InputContraseña placeholder="Contraseña" iconoIzquierdo={<Lock className="size-4 text-gray-400" />} />
              <InputContraseña defaultValue="contraseña123" iconoIzquierdo={<Lock className="size-4 text-gray-400" />} />
              <InputContraseña
                defaultValue="abc"
                estado="error"
                mensajeError="Contraseña muy corta"
                iconoIzquierdo={<Lock className="size-4 text-gray-400" />}
              />
              <InputContraseña
                defaultValue="contraseña$3gura!"
                estado="exito"
                mensajeExito="Contraseña segura"
                iconoIzquierdo={<Lock className="size-4 text-gray-400" />}
              />
            </div>
          </section>

          {/* 04 / 05 / 06 */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* 04. Checkbox */}
            <section>
              <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#6C3AED", margin: "0 0 10px" }}>
                04. Checkbox
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <Checkbox etiqueta="No seleccionado" />
                <Checkbox etiqueta="Seleccionado" defaultChecked />
                <Checkbox etiqueta="Indeterminado" indeterminate />
                <Checkbox etiqueta="Deshabilitado" disabled />
              </div>
            </section>

            {/* 05. Radio */}
            <section>
              <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#6C3AED", margin: "0 0 10px" }}>
                05. Radio
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <Radio name="demo-radio" value="1" etiqueta="Opción uno" />
                <Radio name="demo-radio" value="2" etiqueta="Opción dos (seleccionado)" defaultChecked />
                <Radio name="demo-radio" value="3" etiqueta="Opción tres (deshabilitado)" disabled />
              </div>
            </section>

            {/* 06. Switch */}
            <section>
              <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#6C3AED", margin: "0 0 10px" }}>
                06. Switch / Toggle
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <Switch etiqueta="Inactivo" />
                <Switch etiqueta="Activo" defaultChecked />
                <Switch etiqueta="Deshabilitado" disabled />
              </div>
            </section>
          </div>
        </div>

        {/* Fila inferior: 08, 09, 10, 11 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.5fr 1fr", gap: "0 24px" }}>

          {/* 08. Input con ayuda */}
          <section>
            <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#6C3AED", margin: "0 0 10px" }}>
              08. Input con ayuda
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151" }}>
                Correo electrónico
              </label>
              <Input
                type="email"
                placeholder="tucorreo@email.com"
                defaultValue="tucorreo@email.com"
                iconoIzquierdo={<Mail className="size-4 text-gray-400" />}
              />
              <p style={{ fontSize: "11px", color: "#6B7280", margin: 0 }}>
                Te enviaremos tu progreso y novedades.
              </p>
            </div>
          </section>

          {/* 09. Input con contador */}
          <section>
            <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#6C3AED", margin: "0 0 10px" }}>
              09. Input con contador
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151" }}>
                Título de tu reflexión
              </label>
              <Input
                defaultValue="La fe mueve montañas"
                placeholder="Escribe el título..."
              />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ height: "3px", flex: 1, background: "#E2E8F0", borderRadius: "99px", marginRight: "8px" }}>
                  <div style={{ width: "36%", height: "100%", background: "#6C3AED", borderRadius: "99px" }} />
                </div>
                <span style={{ fontSize: "11px", color: "#94A3B8", fontFamily: "monospace" }}>18 / 50</span>
              </div>
            </div>
          </section>

          {/* 10. File Upload */}
          <section>
            <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#6C3AED", margin: "0 0 10px" }}>
              10. File Upload
            </h2>
            <div
              style={{
                border: "2px dashed #CBD5E1",
                borderRadius: "12px",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
                transition: "border-color 150ms",
              }}
            >
              <div style={{ color: "#6C3AED", fontSize: "28px" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6C3AED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                  <path d="M12 12v9" />
                  <path d="m16 16-4-4-4 4" />
                </svg>
              </div>
              <p style={{ fontSize: "12px", color: "#374151", fontWeight: 600, margin: 0, textAlign: "center" }}>
                Arrastra tu archivo aquí<br />
                <span style={{ color: "#6C3AED" }}>o haz clic para seleccionar</span>
              </p>
              <p style={{ fontSize: "10px", color: "#94A3B8", margin: 0, textAlign: "center" }}>
                Formatos permitidos: PDF, JPG, PNG (Max. 5MB)
              </p>
            </div>
          </section>

          {/* 11. Input de búsqueda */}
          <section>
            <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#6C3AED", margin: "0 0 10px" }}>
              11. Input de búsqueda
            </h2>
            <InputBusqueda placeholder="Buscar lecciones, versículos, temas..." />
          </section>
        </div>

        {/* Tip */}
        <div
          style={{
            marginTop: "32px",
            background: "#F0FDF4",
            border: "1px solid #BBF7D0",
            borderRadius: "10px",
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span style={{ fontSize: "16px" }}>💡</span>
          <p style={{ fontSize: "12px", color: "#166534", margin: 0 }}>
            <strong>Tip:</strong> Siempre muestra retroalimentación visual clara al usuario al
            interactuar con un campo de formulario.
          </p>
        </div>
      </main>
    </div>
  ),
};
