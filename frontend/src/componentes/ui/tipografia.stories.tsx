import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckCircle2, Eye, Globe, Layers, Monitor, Smartphone } from "lucide-react";

const meta = {
  title: "Design Tokens/Tipografía",
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta;

export default meta;

type Story = StoryObj;

// ── Helpers ──────────────────────────────────────────────────────────────────

function FilaEscala({
  estilo,
  ejemplo,
  tamano,
  peso,
  fontFamily = "inherit",
  fontWeight = 400,
  fontSize,
  lineHeight,
}: {
  estilo: string;
  ejemplo: string;
  tamano: string;
  peso: string;
  fontFamily?: string;
  fontWeight?: number;
  fontSize: string;
  lineHeight: string;
}) {
  return (
    <tr>
      <td style={{ padding: "8px 0", fontSize: "12px", color: "#64748B", verticalAlign: "middle", whiteSpace: "nowrap", paddingRight: "12px" }}>
        {estilo}
      </td>
      <td style={{ padding: "8px 12px 8px 0", verticalAlign: "middle" }}>
        <span style={{ fontFamily, fontWeight, fontSize, lineHeight, color: "#0F172A" }}>{ejemplo}</span>
      </td>
      <td style={{ padding: "8px 12px 8px 0", fontSize: "11px", color: "#64748B", verticalAlign: "middle", whiteSpace: "nowrap" }}>
        {tamano}
      </td>
      <td style={{ padding: "8px 0", fontSize: "11px", color: "#64748B", verticalAlign: "middle" }}>
        {peso}
      </td>
    </tr>
  );
}

// ── Documentación completa ───────────────────────────────────────────────────

export const DocumentacionCompleta: Story = {
  name: "📄 Documentación Completa",
  render: () => (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#FFFFFF",
        fontFamily: "Nunito, Inter, system-ui, sans-serif",
      }}
    >
      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside
        style={{
          width: "224px",
          minWidth: "224px",
          borderRight: "1px solid #F1F5F9",
          padding: "24px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "36px", height: "36px", background: "linear-gradient(135deg, #16A34A, #2E9E5B)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>🌱</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "16px", color: "#16A34A", lineHeight: 1 }}>Semillas</div>
            <div style={{ fontSize: "10px", color: "#94A3B8", lineHeight: 1.3 }}>Crece en la fe cada día</div>
          </div>
        </div>

        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#0F172A", margin: "0 0 8px", lineHeight: 1.2 }}>Tipografía</h1>
          <p style={{ fontSize: "12px", color: "#64748B", lineHeight: 1.6, margin: 0 }}>
            Nuestra tipografía comunica calidez, claridad y cercanía. Usamos fuentes redondeadas y amigables para niños, y una tipografía moderna y legible para la administración.
          </p>
        </div>

        {/* Fuentes principales */}
        <div>
          <h2 style={{ fontSize: "13px", fontWeight: 700, color: "#6C3AED", margin: "0 0 12px" }}>Fuentes principales</h2>
          {[
            { nombre: "Nunito Sans", uso: "App general, contenido bíblico y textos largos.", family: "Nunito, sans-serif" },
            { nombre: "Nunito / Baloo 2", uso: "Títulos infantiles y elementos para niños.", family: "Nunito, system-ui, sans-serif" },
            { nombre: "Inter", uso: "Administración web, dashboards y datos.", family: "Inter, system-ui, sans-serif" },
          ].map(({ nombre, uso, family }) => (
            <div key={nombre} style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "36px", fontFamily: family, fontWeight: 700, color: "#6C3AED", lineHeight: 1 }}>Aa</span>
                <div>
                  <p style={{ fontSize: "12px", fontWeight: 700, color: "#0F172A", margin: "0 0 2px" }}>{nombre}</p>
                  <p style={{ fontSize: "10px", color: "#64748B", lineHeight: 1.4, margin: 0 }}>{uso}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Principios tipográficos */}
        <div>
          <h2 style={{ fontSize: "13px", fontWeight: 700, color: "#6C3AED", margin: "0 0 10px" }}>Principios tipográficos</h2>
          {[
            { Icon: CheckCircle2, color: "#16A34A", bg: "#DCFCE7", text: "Clara y legible en todos los dispositivos" },
            { Icon: Globe, color: "#6C3AED", bg: "#EDE9FE", text: "Amigable y cercana para niños" },
            { Icon: Eye, color: "#0EA5E9", bg: "#E0F2FE", text: "Accesible y con buen contraste" },
            { Icon: Layers, color: "#F59E0B", bg: "#FEF3C7", text: "Escalable y consistente" },
          ].map(({ Icon, color, bg, text }) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <div style={{ width: "26px", height: "26px", minWidth: "26px", borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={13} color={color} />
              </div>
              <p style={{ fontSize: "11px", color: "#475569", lineHeight: 1.4, margin: 0 }}>{text}</p>
            </div>
          ))}
        </div>
      </aside>

      {/* ── Contenido principal ───────────────────────────────── */}
      <main style={{ flex: 1, padding: "24px 28px", overflowX: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 40px" }}>

          {/* Col izquierda: escalas tipográficas */}
          <div>
            {/* Escala Móvil */}
            <section style={{ marginBottom: "28px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <Smartphone size={14} color="#6C3AED" />
                <h2 style={{ fontSize: "13px", fontWeight: 700, color: "#6C3AED", margin: 0 }}>
                  Escala tipográfica — Móvil (320px a 480px)
                </h2>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                    {["Estilo", "Ejemplo", "Tamaño / Alto línea", "Peso"].map((h) => (
                      <th key={h} style={{ fontSize: "10px", fontWeight: 600, color: "#94A3B8", textAlign: "left", padding: "6px 12px 6px 0" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody style={{ borderBottom: "1px solid #F8FAFC" }}>
                  <FilaEscala estilo="Display Móvil" ejemplo="¡Dios te ama!" tamano="40–44px / 120%" peso="800 (ExtraBold)" fontWeight={800} fontSize="36px" lineHeight="1.2" />
                  <FilaEscala estilo="H1 Móvil" ejemplo="¡Sigue aprendiendo!" tamano="32–36px / 120%" peso="800 (ExtraBold)" fontWeight={800} fontSize="28px" lineHeight="1.2" />
                  <FilaEscala estilo="H2 Móvil" ejemplo="El arca de Noé" tamano="26–30px / 120%" peso="800 (Bold)" fontWeight={700} fontSize="22px" lineHeight="1.2" />
                  <FilaEscala estilo="H3 Móvil" ejemplo="Versículo del día" tamano="22–24px / 120%" peso="700 (Bold)" fontWeight={700} fontSize="18px" lineHeight="1.2" />
                  <FilaEscala estilo="Body Grande" ejemplo="Aprendemos sobre el amor de Dios y cómo podemos vivir cada día con alegría." tamano="18–20px / 150%" peso="500 (Medium)" fontWeight={500} fontSize="14px" lineHeight="1.5" />
                  <FilaEscala estilo="Body Normal" ejemplo="Dios cuida de ti siempre y te da fuerzas para hacer lo correcto." tamano="16px / 150%" peso="400–500 (Regular/Medium)" fontWeight={400} fontSize="13px" lineHeight="1.5" />
                  <FilaEscala estilo="Caption" ejemplo="Juan 3:16" tamano="13–14px / 140%" peso="400 (Regular)" fontWeight={400} fontSize="12px" lineHeight="1.4" />
                  <FilaEscala estilo="Label" ejemplo="Nivel 7" tamano="12–14px / 140%" peso="600 (SemiBold)" fontWeight={600} fontSize="11px" lineHeight="1.4" />
                </tbody>
              </table>
            </section>

            {/* Escala Web */}
            <section>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <Monitor size={14} color="#6C3AED" />
                <h2 style={{ fontSize: "13px", fontWeight: 700, color: "#6C3AED", margin: 0 }}>
                  Escala tipográfica — Web (1024px en adelante)
                </h2>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                    {["Estilo", "Ejemplo", "Tamaño / Alto línea", "Peso"].map((h) => (
                      <th key={h} style={{ fontSize: "10px", fontWeight: 600, color: "#94A3B8", textAlign: "left", padding: "6px 12px 6px 0" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <FilaEscala estilo="Display Web" ejemplo="¡Dios te ama!" tamano="48–64px / 110%" peso="800 (ExtraBold)" fontWeight={800} fontSize="48px" lineHeight="1.1" />
                  <FilaEscala estilo="H1 Web" ejemplo="Crece en la fe cada día" tamano="36–44px / 120%" peso="800 (ExtraBold)" fontWeight={800} fontSize="32px" lineHeight="1.2" />
                  <FilaEscala estilo="H2 Web" ejemplo="Aprende, juega y comparte" tamano="28–34px / 120%" peso="700 (Bold)" fontWeight={700} fontSize="24px" lineHeight="1.2" />
                  <FilaEscala estilo="H3 Web" ejemplo="Explora las verdades de la Biblia" tamano="22–26px / 120%" peso="700 (Bold)" fontWeight={700} fontSize="18px" lineHeight="1.2" />
                  <FilaEscala estilo="Body Web" ejemplo="Semillas es una plataforma cristiana para niños, adolescentes y familias." tamano="16–18px / 160%" peso="400–500 (Regular/Medium)" fontWeight={400} fontSize="14px" lineHeight="1.6" />
                  <FilaEscala estilo="Small" ejemplo="Última actividad: Hoy, 10:30 a.m." tamano="13–14px / 140%" peso="400 (Regular)" fontWeight={400} fontSize="12px" lineHeight="1.4" />
                  <FilaEscala estilo="Label" ejemplo="Buscar lección" tamano="12–14px / 140%" peso="600 (SemiBold)" fontWeight={600} fontSize="11px" lineHeight="1.4" />
                </tbody>
              </table>
            </section>
          </div>

          {/* Col derecha: pesos + uso por contexto */}
          <div>
            {/* Pesos disponibles */}
            <section style={{ marginBottom: "28px" }}>
              <h2 style={{ fontSize: "13px", fontWeight: 700, color: "#6C3AED", margin: "0 0 14px" }}>Pesos disponibles</h2>

              {[
                { nombre: "Nunito Sans / Nunito", family: "Nunito, sans-serif" },
                { nombre: "Inter (para administración)", family: "Inter, system-ui, sans-serif" },
              ].map(({ nombre, family }) => (
                <div key={nombre} style={{ marginBottom: "16px" }}>
                  <p style={{ fontSize: "11px", fontWeight: 600, color: "#374151", margin: "0 0 8px" }}>{nombre}</p>
                  <div style={{ display: "flex", gap: "12px", alignItems: "flex-end" }}>
                    {[
                      { w: 200, label: "ExtraLight\n200" },
                      { w: 300, label: "Light\n300" },
                      { w: 400, label: "Regular\n400" },
                      { w: 500, label: "Medium\n500" },
                      { w: 600, label: "SemiBold\n600" },
                      { w: 700, label: "Bold\n700" },
                      { w: 800, label: "ExtraBold\n800" },
                      { w: 900, label: "Black\n900" },
                    ].map(({ w, label }) => (
                      <div key={w} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
                        <span style={{ fontFamily: family, fontWeight: w, fontSize: "20px", color: "#0F172A", lineHeight: 1 }}>Aa</span>
                        <span style={{ fontSize: "8px", color: "#94A3B8", textAlign: "center", whiteSpace: "pre-line", lineHeight: 1.3 }}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: "8px", padding: "10px 12px", marginTop: "8px" }}>
                <p style={{ fontSize: "11px", color: "#1D4ED8", margin: 0, lineHeight: 1.5 }}>
                  ℹ️ Usa los pesos de forma coherente para mantener jerarquía visual y accesibilidad.
                </p>
              </div>
            </section>

            {/* Uso por contexto */}
            <section style={{ marginBottom: "24px" }}>
              <h2 style={{ fontSize: "13px", fontWeight: 700, color: "#6C3AED", margin: "0 0 12px" }}>Uso por contexto</h2>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                    {["Contexto", "Tipografía", "Uso"].map((h) => (
                      <th key={h} style={{ fontSize: "10px", fontWeight: 600, color: "#94A3B8", textAlign: "left", padding: "6px 10px 6px 0" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { emoji: "👶", ctx: "Niños (5-8 años)", font: "Nunito / Baloo 2", uso: "Títulos grandes, botones, mensajes, juegos" },
                    { emoji: "🧒", ctx: "Niños (9-12 años)", font: "Nunito Sans", uso: "Todo el contenido, actividades, lecciones" },
                    { emoji: "🧑", ctx: "Adolescentes (13-17)", font: "Nunito Sans", uso: "Contenido, devocionales, retos, reflexiones" },
                    { emoji: "👨‍👩‍👧", ctx: "Padres / Tutores", font: "Nunito Sans", uso: "Reportes, configuración, centro de ayuda" },
                    { emoji: "💻", ctx: "Administración (Web)", font: "Inter", uso: "Dashboards, tablas, formularios, métricas" },
                  ].map(({ emoji, ctx, font, uso }) => (
                    <tr key={ctx} style={{ borderBottom: "1px solid #F8FAFC" }}>
                      <td style={{ padding: "8px 10px 8px 0", fontSize: "11px", color: "#374151", verticalAlign: "top" }}>
                        <span style={{ marginRight: "4px" }}>{emoji}</span>{ctx}
                      </td>
                      <td style={{ padding: "8px 10px 8px 0", fontSize: "11px", color: "#6C3AED", fontWeight: 600, verticalAlign: "top" }}>{font}</td>
                      <td style={{ padding: "8px 0", fontSize: "11px", color: "#64748B", verticalAlign: "top" }}>{uso}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* Buenas prácticas */}
            <section>
              <h2 style={{ fontSize: "13px", fontWeight: 700, color: "#6C3AED", margin: "0 0 10px" }}>Buenas prácticas</h2>
              {[
                "Usa un máximo de 2 familias tipográficas por producto.",
                "Mantén contraste suficiente entre texto y fondo.",
                "Evita usar solo mayúsculas en textos largos.",
                "Usa tamaños mínimos de 16px en móvil para texto legible.",
                "Respeta la jerarquía: Display > H1 > H2 > H3 > Body > Caption.",
              ].map((p) => (
                <div key={p} style={{ display: "flex", alignItems: "flex-start", gap: "6px", marginBottom: "6px" }}>
                  <CheckCircle2 size={12} color="#16A34A" style={{ marginTop: "2px", flexShrink: 0 }} />
                  <p style={{ fontSize: "11px", color: "#475569", lineHeight: 1.5, margin: 0 }}>{p}</p>
                </div>
              ))}
            </section>
          </div>
        </div>
      </main>
    </div>
  ),
};
