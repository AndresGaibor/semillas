import {
  ArrowLeftRight,
  CalendarDays,
  Check,
  ChevronRight,
  Clipboard,
  Copy,
  Crown,
  DoorOpen,
  Edit3,
  Link2,
  LockKeyhole,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Settings,
  Share2,
  ShieldCheck,
  Sparkles,
  Target,
  Trash2,
  Trophy,
  UserMinus,
  Users,
  Zap,
} from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import { Card } from "@/componentes/ui/card-base";
import { Boton } from "@/componentes/ui/boton";
import { ProgresoXpWidget } from "@/features/gamification/componentes/progreso-xp-widget";
import { resolverAvatar } from "@/shared/constants/avatares";
import { UnirseClubForm } from "@/features/clubes/componentes/unirse-club-form";
import {
  useClubesPage,
  type CrearClubInput,
  type CrearRetoInput,
  type VistaClub,
} from "@/features/clubes/hooks/use-clubes-page";
import type {
  Club,
  MiembroClub,
  MiembroRankingClub,
  RetoCooperativo,
} from "@/features/clubs/clubs.api";
import "./clubes-page.css";

const VISTAS: Array<{ id: VistaClub; label: string; icon: typeof Trophy; soloLider?: boolean }> = [
  { id: "resumen", label: "Resumen", icon: Sparkles },
  { id: "ranking", label: "Ranking", icon: Trophy },
  { id: "retos", label: "Retos", icon: Target },
  { id: "miembros", label: "Miembros", icon: Users },
  { id: "ajustes", label: "Ajustes", icon: Settings, soloLider: true },
];

export function ClubesPage() {
  const page = useClubesPage();
  const detalle = page.detalleQuery.data;
  const currentUserId = page.meQuery.data?.usuario.id;
  const club = detalle ?? page.club;
  const tabs = VISTAS.filter((item) => !item.soloLider || page.isLeader);

  if (page.clubesQuery.isLoading || page.meQuery.isLoading) {
    return <ClubesSkeleton />;
  }

  if (page.clubesQuery.isError) {
    return (
      <Card className="clubes-error-state" hoverEffect="none">
        <ShieldCheck size={38} aria-hidden="true" />
        <h2>No pudimos cargar tus clubes</h2>
        <p>Revisa tu conexión y vuelve a intentarlo.</p>
        <Boton onClick={() => page.clubesQuery.refetch()}>Reintentar</Boton>
      </Card>
    );
  }

  if (!club) {
    return (
      <div className="clubes-empty-layout">
        <section className="clubes-empty-hero">
          <span className="clubes-empty-hero__icon" aria-hidden="true"><Users size={34} /></span>
          <p className="clubes-eyebrow">Aprender en comunidad</p>
          <h2>Tu club empieza aquí</h2>
          <p>
            Únete con el código de tu iglesia, curso o familia. Los clubes muestran retos y progreso compartido,
            sin chat privado ni datos sensibles de los menores.
          </p>
          <div className="clubes-empty-hero__features" aria-label="Características de los clubes">
            <span><ShieldCheck size={17} /> Espacio protegido</span>
            <span><Target size={17} /> Retos cooperativos</span>
            <span><Trophy size={17} /> Progreso del grupo</span>
          </div>
        </section>

        <div className="clubes-empty-actions">
          <UnirseClubForm
            joinCode={page.joinCode}
            onCodeChange={page.setJoinCode}
            onSubmit={page.handleJoinClub}
            isSubmitting={page.joining}
          />
          <CrearClubCard
            isGuest={page.isGuest}
            onCreate={() => page.isGuest ? page.navigate({ to: "/app/perfil" }) : page.setShowCreate(true)}
          />
        </div>

        <ProgresoXpWidget
          {...page.xpInfo}
          onVerDetalles={() => page.navigate({ to: "/app/perfil" })}
        />

        {page.showCreate ? (
          <CrearClubModal
            pending={page.creating}
            onClose={() => page.setShowCreate(false)}
            onSubmit={page.createClub}
          />
        ) : null}
      </div>
    );
  }

  return (
    <div className="clubes-page">
      <div className="clubes-page__topline">
        <ClubSwitcher
          clubs={page.clubes}
          activeId={club.id}
          onSelect={page.selectClub}
          onAdd={() => page.setShowCreate(true)}
        />
      </div>

      <ClubHero
        club={club}
        members={detalle?.members.length ?? club.member_count ?? 0}
        role={detalle?.membership.rol_miembro ?? club.rol_miembro ?? "miembro"}
        copied={page.copied}
        onCopy={page.handleCopyCode}
        onShare={page.handleShareCode}
      />

      <nav className="clubes-tabs" aria-label="Secciones del club">
        {tabs.map((item) => {
          const Icon = item.icon;
          const active = page.vista === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className="clubes-tab"
              data-active={active}
              aria-current={active ? "page" : undefined}
              onClick={() => page.setVista(item.id)}
            >
              <Icon size={17} aria-hidden="true" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="clubes-page__body">
        <main className="clubes-page__main">
          {page.detalleQuery.isLoading ? <ClubesContentSkeleton /> : null}
          {page.detalleQuery.isError ? (
            <Card className="clubes-inline-error" hoverEffect="none">
              <p>No pudimos abrir este club.</p>
              <Boton variante="violetaContorno" onClick={() => page.detalleQuery.refetch()}>Reintentar</Boton>
            </Card>
          ) : null}

          {detalle && page.vista === "resumen" ? (
            <ResumenClub
              retos={page.retosQuery.data ?? []}
              ranking={page.rankingQuery.data ?? []}
              onViewChallenges={() => page.setVista("retos")}
              onViewRanking={() => page.setVista("ranking")}
              onShare={page.handleShareCode}
            />
          ) : null}

          {detalle && page.vista === "ranking" ? (
            <RankingClub ranking={page.rankingQuery.data ?? []} loading={page.rankingQuery.isLoading} currentUserId={currentUserId} />
          ) : null}

          {detalle && page.vista === "retos" ? (
            <RetosClub
              retos={page.retosQuery.data ?? []}
              loading={page.retosQuery.isLoading}
              isLeader={page.isLeader}
              onCreate={() => page.setShowChallenge(true)}
              onClaim={page.claimChallenge}
              claiming={page.claimingChallenge}
            />
          ) : null}

          {detalle && page.vista === "miembros" ? (
            <MiembrosClub
              members={detalle.members}
              currentUserId={currentUserId}
              isLeader={page.isLeader}
              pending={page.actionPending}
              onRemove={(member) => {
                if (window.confirm(`¿Retirar a ${member.apodo} del club?`)) page.removeMember(member.usuario_id);
              }}
              onTransfer={(member) => {
                if (window.confirm(`¿Transferir el liderazgo a ${member.apodo}? Tú pasarás a ser miembro.`)) {
                  page.transferLeadership(member.usuario_id);
                }
              }}
            />
          ) : null}

          {detalle && page.vista === "ajustes" && page.isLeader ? (
            <AjustesClub
              club={detalle}
              pending={page.actionPending || page.updating}
              onUpdate={page.updateClub}
              onRegenerate={() => {
                if (window.confirm("El código anterior dejará de funcionar. ¿Generar uno nuevo?")) page.regenerateCode();
              }}
              onArchive={() => {
                if (window.confirm("¿Archivar este club? Esta acción lo ocultará para todos.")) page.archiveClub();
              }}
            />
          ) : null}
        </main>

        <aside className="clubes-page__aside">
          <ProgresoXpWidget
            {...page.xpInfo}
            onVerDetalles={() => page.navigate({ to: "/app/perfil" })}
          />
          <ClubInviteAside club={club} onCopy={page.handleCopyCode} onShare={page.handleShareCode} copied={page.copied} />
          <button
            type="button"
            className="clubes-leave-button"
            disabled={page.actionPending}
            onClick={() => {
              if (window.confirm("¿Salir de este club? Tu progreso personal no se perderá.")) page.leaveClub();
            }}
          >
            <DoorOpen size={17} /> Salir del club
          </button>
        </aside>
      </div>

      {page.showCreate ? (
        <AgregarClubModal
          isGuest={page.isGuest}
          joinCode={page.joinCode}
          joining={page.joining}
          creating={page.creating}
          onCodeChange={page.setJoinCode}
          onJoin={page.handleJoinClub}
          onCreate={page.createClub}
          onLinkAccount={() => page.navigate({ to: "/app/perfil" })}
          onClose={() => page.setShowCreate(false)}
        />
      ) : null}
      {page.showChallenge ? (
        <CrearRetoModal pending={page.challengePending} onClose={() => page.setShowChallenge(false)} onSubmit={page.createChallenge} />
      ) : null}
    </div>
  );
}

function ClubSwitcher({ clubs, activeId, onSelect, onAdd }: {
  clubs: Club[];
  activeId: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
}) {
  return (
    <div className="club-switcher" role="list" aria-label="Tus clubes">
      {clubs.map((club) => (
        <button
          key={club.id}
          type="button"
          role="listitem"
          className="club-switcher__item"
          data-active={club.id === activeId}
          onClick={() => onSelect(club.id)}
        >
          <span aria-hidden="true"><Users size={17} /></span>
          <span>{club.nombre}</span>
          <small>{club.member_count ?? 0}</small>
        </button>
      ))}
      <button type="button" className="club-switcher__add" onClick={onAdd}>
        <Plus size={17} /> <span>Agregar club</span>
      </button>
    </div>
  );
}

export function ClubHero({ club, members, role, copied, onCopy, onShare }: {
  club: Club;
  members: number;
  role: string;
  copied: boolean;
  onCopy: () => void;
  onShare: () => void;
}) {
  const roleLabel = role === "lider" || role === "propietario" ? "Líder" : "Miembro";
  return (
    <section className="club-hero">
      <div className="club-hero__art" aria-hidden="true">
        <span className="club-hero__orb club-hero__orb--one" />
        <span className="club-hero__orb club-hero__orb--two" />
        <Users size={76} />
      </div>
      <div className="club-hero__content">
        <div className="club-hero__badges">
          <span><ShieldCheck size={15} /> Club protegido</span>
          <span><Crown size={15} /> {roleLabel}</span>
        </div>
        <h2>{club.nombre}</h2>
        <p>{club.descripcion || "Un espacio para aprender, avanzar y celebrar juntos."}</p>
        <div className="club-hero__stats">
          <span><Users size={18} /><strong>{members}</strong> miembros</span>
          <span><CalendarDays size={18} /> Desde {formatMonth(club.creado_en)}</span>
        </div>
      </div>
      <div className="club-hero__invite">
        <span className="clubes-eyebrow">Código de invitación</span>
        <strong>{club.codigo_invitacion}</strong>
        <div>
          <button type="button" onClick={onCopy}>{copied ? <Check size={17} /> : <Copy size={17} />} {copied ? "Copiado" : "Copiar"}</button>
          <button type="button" onClick={onShare}><Share2 size={17} /> Compartir</button>
        </div>
      </div>
    </section>
  );
}

function ResumenClub({ retos, ranking, onViewChallenges, onViewRanking, onShare }: {
  retos: RetoCooperativo[];
  ranking: MiembroRankingClub[];
  onViewChallenges: () => void;
  onViewRanking: () => void;
  onShare: () => void;
}) {
  const reto = retos.find((item) => !item.completado && new Date(item.fecha_fin) >= new Date()) ?? retos[0];
  return (
    <div className="club-summary-grid">
      <section className="club-panel club-panel--challenge">
        <div className="club-panel__header">
          <div><span className="clubes-eyebrow">Reto activo</span><h3>{reto?.nombre ?? "Aún no hay un reto activo"}</h3></div>
          <Target size={26} aria-hidden="true" />
        </div>
        {reto ? (
          <>
            <p>{reto.descripcion || metricDescription(reto.codigo_metrica)}</p>
            <div className="challenge-progress-copy"><span>{reto.progreso_actual} de {reto.valor_objetivo}</span><strong>{reto.porcentaje}%</strong></div>
            <div className="challenge-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={reto.porcentaje}>
              <span style={{ width: `${reto.porcentaje}%` }} />
            </div>
            <div className="challenge-meta"><span><Zap size={15} /> {reto.xp_reto} XP de premio</span><span>Tu aporte: {reto.mi_aporte}</span></div>
          </>
        ) : <p>El líder puede crear un reto para que todos avancen hacia una meta común.</p>}
        <button type="button" className="club-link-button" onClick={onViewChallenges}>Ver todos los retos <ChevronRight size={16} /></button>
      </section>

      <section className="club-panel">
        <div className="club-panel__header"><div><span className="clubes-eyebrow">Esta semana</span><h3>Ranking del club</h3></div><Trophy size={25} /></div>
        <div className="club-ranking-preview">
          {ranking.slice(0, 3).map((member) => <RankingRow key={member.usuario_id} member={member} compact />)}
          {ranking.length === 0 ? <p className="club-muted">El ranking aparecerá cuando el grupo empiece a completar actividades.</p> : null}
        </div>
        <button type="button" className="club-link-button" onClick={onViewRanking}>Ver ranking completo <ChevronRight size={16} /></button>
      </section>

      <section className="club-panel club-panel--invite">
        <div className="club-panel__header"><div><span className="clubes-eyebrow">Crezcan juntos</span><h3>Invita a tu grupo</h3></div><Link2 size={25} /></div>
        <p>Comparte el código solo con personas de tu iglesia, curso o familia.</p>
        <Boton variante="violeta" onClick={onShare} iconoIzquierdo={<Share2 size={17} />}>Compartir invitación</Boton>
      </section>
    </div>
  );
}

export function RankingClub({ ranking, loading, currentUserId }: { ranking: MiembroRankingClub[]; loading: boolean; currentUserId?: string }) {
  return (
    <section className="club-section-card">
      <header><div><span className="clubes-eyebrow">XP ganado desde el lunes</span><h2>Ranking semanal</h2><p>El progreso personal suma al club, pero cada miembro aprende a su ritmo.</p></div><Trophy size={31} /></header>
      {loading ? <ClubesContentSkeleton /> : (
        <div className="club-ranking-list">
          {ranking.map((member) => <RankingRow key={member.usuario_id} member={member} isMe={member.usuario_id === currentUserId} />)}
          {ranking.length === 0 ? <EmptyInline icon={Trophy} title="El ranking está esperando" text="Completen una actividad para inaugurar el ranking semanal." /> : null}
        </div>
      )}
    </section>
  );
}

function RankingRow({ member, compact = false, isMe = false }: { member: MiembroRankingClub; compact?: boolean; isMe?: boolean }) {
  const avatar = resolverAvatar(member.clave_avatar || member.url_avatar || "1");
  return (
    <article className="club-ranking-row" data-compact={compact} data-me={isMe}>
      <span className="club-ranking-row__position">{member.numero_ranking}</span>
      <img src={avatar} alt="" aria-hidden="true" />
      <div><strong>{member.apodo}{isMe ? " · Tú" : ""}</strong><span>{roleName(member.rol_miembro)} · {member.actividades_semana} actividades</span></div>
      <div className="club-ranking-row__xp"><Zap size={16} /><strong>{member.xp_semana}</strong><span>XP</span></div>
    </article>
  );
}

export function RetosClub({ retos, loading, isLeader, onCreate, onClaim = () => undefined, claiming = false }: { retos: RetoCooperativo[]; loading: boolean; isLeader: boolean; onCreate: () => void; onClaim?: (retoId: string) => void; claiming?: boolean }) {
  return (
    <section className="club-section-card">
      <header><div><span className="clubes-eyebrow">Metas compartidas</span><h2>Retos cooperativos</h2><p>Cada aporte cuenta. Al completar la meta, cada miembro puede reclamar una vez su recompensa.</p></div>{isLeader ? <Boton variante="violeta" onClick={onCreate} iconoIzquierdo={<Plus size={17} />}>Crear reto</Boton> : <Target size={31} />}</header>
      {loading ? <ClubesContentSkeleton /> : (
        <div className="club-challenges-grid">
          {retos.map((reto) => <ChallengeCard key={reto.id} reto={reto} onClaim={onClaim} claiming={claiming} />)}
          {retos.length === 0 ? <EmptyInline icon={Target} title="Todavía no hay retos" text={isLeader ? "Crea una meta sencilla para comenzar a colaborar." : "El líder del club podrá publicar el primer reto."} action={isLeader ? { label: "Crear reto", onClick: onCreate } : undefined} /> : null}
        </div>
      )}
    </section>
  );
}

export function ChallengeCard({ reto, onClaim = () => undefined, claiming = false }: { reto: RetoCooperativo; onClaim?: (retoId: string) => void; claiming?: boolean }) {
  return (
    <article className="challenge-card" data-complete={reto.completado}>
      <div className="challenge-card__top"><span className="challenge-card__icon"><Target size={20} /></span><span className="challenge-card__status">{reto.completado ? "Completado" : daysRemaining(reto.fecha_fin)}</span></div>
      <h3>{reto.nombre}</h3><p>{reto.descripcion || metricDescription(reto.codigo_metrica)}</p>
      <div className="challenge-progress-copy"><span>{reto.progreso_actual} / {reto.valor_objetivo}</span><strong>{reto.porcentaje}%</strong></div>
      <div className="challenge-progress"><span style={{ width: `${reto.porcentaje}%` }} /></div>
      <footer><span><Zap size={15} /> {reto.xp_reto} XP</span><span>Tu aporte: {reto.mi_aporte}</span></footer>
      {reto.completado ? (
        <Boton
          variante={reto.recompensa_reclamada ? "secundario" : "violeta"}
          disabled={reto.recompensa_reclamada || claiming}
          cargando={claiming && !reto.recompensa_reclamada}
          onClick={() => onClaim(reto.id)}
          className="challenge-card__claim"
        >
          {reto.recompensa_reclamada ? "Recompensa reclamada" : `Reclamar ${reto.xp_reto} XP`}
        </Boton>
      ) : null}
    </article>
  );
}

export function MiembrosClub({ members, currentUserId, isLeader, pending, onRemove, onTransfer }: {
  members: MiembroClub[];
  currentUserId?: string;
  isLeader: boolean;
  pending: boolean;
  onRemove: (member: MiembroClub) => void;
  onTransfer: (member: MiembroClub) => void;
}) {
  return (
    <section className="club-section-card">
      <header><div><span className="clubes-eyebrow">Comunidad protegida</span><h2>{members.length} miembros</h2><p>Solo se muestran apodos, avatares y progreso del club.</p></div><Users size={31} /></header>
      <div className="club-members-list">
        {members.map((member) => {
          const avatar = resolverAvatar(member.clave_avatar || member.url_avatar || "1");
          const isMe = member.usuario_id === currentUserId;
          const isMemberLeader = ["lider", "propietario"].includes(member.rol_miembro);
          return (
            <article key={member.usuario_id} className="club-member-row">
              <img src={avatar} alt="" aria-hidden="true" />
              <div className="club-member-row__identity"><strong>{member.apodo}{isMe ? " · Tú" : ""}</strong><span>{roleName(member.rol_miembro)} · Se unió {formatMonth(member.unido_en)}</span></div>
              <div className="club-member-row__stats"><span><Zap size={15} /> {member.xp_semana} XP esta semana</span><span>{member.actividades_semana} actividades</span></div>
              {isLeader && !isMe && !isMemberLeader ? (
                <details className="club-member-actions">
                  <summary aria-label={`Acciones para ${member.apodo}`}><MoreHorizontal size={20} /></summary>
                  <div>
                    <button type="button" disabled={pending} onClick={() => onTransfer(member)}><ArrowLeftRight size={16} /> Transferir liderazgo</button>
                    <button type="button" disabled={pending} className="danger" onClick={() => onRemove(member)}><UserMinus size={16} /> Retirar del club</button>
                  </div>
                </details>
              ) : <span className="club-role-pill" data-leader={isMemberLeader}>{roleName(member.rol_miembro)}</span>}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function AjustesClub({ club, pending, onUpdate, onRegenerate, onArchive }: {
  club: Club;
  pending: boolean;
  onUpdate: (data: CrearClubInput) => void;
  onRegenerate: () => void;
  onArchive: () => void;
}) {
  const [nombre, setNombre] = useState(club.nombre);
  const [descripcion, setDescripcion] = useState(club.descripcion ?? "");
  return (
    <div className="club-settings-grid">
      <section className="club-section-card">
        <header><div><span className="clubes-eyebrow">Información</span><h2>Editar club</h2><p>Usa un nombre reconocible para tu grupo.</p></div><Edit3 size={30} /></header>
        <form className="club-form" onSubmit={(event) => { event.preventDefault(); onUpdate({ nombre: nombre.trim(), descripcion: descripcion.trim() }); }}>
          <label>Nombre del club<input value={nombre} maxLength={80} required minLength={3} onChange={(event) => setNombre(event.target.value)} /></label>
          <label>Descripción<textarea value={descripcion} maxLength={300} rows={4} onChange={(event) => setDescripcion(event.target.value)} /></label>
          <Boton type="submit" cargando={pending} disabled={nombre.trim().length < 3}>Guardar cambios</Boton>
        </form>
      </section>
      <section className="club-section-card club-danger-zone">
        <header><div><span className="clubes-eyebrow">Administración</span><h2>Acceso y seguridad</h2><p>Las acciones sensibles requieren confirmación.</p></div><LockKeyhole size={30} /></header>
        <div className="club-setting-action"><div><strong>Renovar código</strong><p>El código actual dejará de aceptar nuevos miembros.</p></div><Boton variante="violetaContorno" disabled={pending} onClick={onRegenerate} iconoIzquierdo={<RefreshCw size={16} />}>Renovar</Boton></div>
        <div className="club-setting-action"><div><strong>Archivar club</strong><p>Solo es posible cuando no quedan otros miembros.</p></div><Boton variante="peligro" disabled={pending} onClick={onArchive} iconoIzquierdo={<Trash2 size={16} />}>Archivar</Boton></div>
      </section>
    </div>
  );
}

function ClubInviteAside({ club, onCopy, onShare, copied }: { club: Club; onCopy: () => void; onShare: () => void; copied: boolean }) {
  return (
    <Card className="club-invite-aside" hoverEffect="none">
      <span className="club-invite-aside__icon"><Link2 size={21} /></span>
      <p className="clubes-eyebrow">Invitación</p><h3>{club.codigo_invitacion}</h3><p>Compártelo únicamente con tu grupo.</p>
      <div><button type="button" onClick={onCopy}>{copied ? <Check size={16} /> : <Clipboard size={16} />} {copied ? "Copiado" : "Copiar"}</button><button type="button" onClick={onShare}><Share2 size={16} /> Compartir</button></div>
    </Card>
  );
}

function CrearClubCard({ isGuest, onCreate }: { isGuest: boolean; onCreate: () => void }) {
  return (
    <Card className="club-create-card" hoverEffect="none">
      <span><Plus size={25} /></span><div><p className="clubes-eyebrow">Organiza tu grupo</p><h3>Crear un club</h3><p>{isGuest ? "Vincula tu cuenta para crear y administrar un club." : "Ideal para una iglesia, curso o grupo familiar."}</p></div>
      <Boton variante="violetaContorno" onClick={onCreate}>{isGuest ? "Vincular cuenta" : "Crear club"}</Boton>
    </Card>
  );
}

function AgregarClubModal({
  isGuest,
  joinCode,
  joining,
  creating,
  onCodeChange,
  onJoin,
  onCreate,
  onLinkAccount,
  onClose,
}: {
  isGuest: boolean;
  joinCode: string;
  joining: boolean;
  creating: boolean;
  onCodeChange: (value: string) => void;
  onJoin: (event: FormEvent) => void;
  onCreate: (data: CrearClubInput) => void;
  onLinkAccount: () => void;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<"join" | "create">("join");
  return (
    <Modal title="Agregar un club" subtitle="Únete con un código o crea un espacio para tu grupo." onClose={onClose}>
      <div className="club-modal-tabs" role="tablist" aria-label="Opciones para agregar club">
        <button type="button" role="tab" aria-selected={mode === "join"} data-active={mode === "join"} onClick={() => setMode("join")}>Unirme</button>
        <button type="button" role="tab" aria-selected={mode === "create"} data-active={mode === "create"} onClick={() => setMode("create")}>Crear</button>
      </div>
      {mode === "join" ? (
        <UnirseClubForm joinCode={joinCode} onCodeChange={onCodeChange} onSubmit={onJoin} isSubmitting={joining} />
      ) : isGuest ? (
        <div className="club-link-account-prompt">
          <LockKeyhole size={30} aria-hidden="true" />
          <h3>Vincula tu cuenta para crear</h3>
          <p>Así podrás administrar miembros, retos y el código de invitación sin perder el club.</p>
          <Boton variante="violeta" onClick={onLinkAccount}>Vincular cuenta</Boton>
        </div>
      ) : (
        <CrearClubInline pending={creating} onSubmit={onCreate} onCancel={onClose} />
      )}
    </Modal>
  );
}

function CrearClubInline({ pending, onSubmit, onCancel }: { pending: boolean; onSubmit: (data: CrearClubInput) => void; onCancel: () => void }) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  return (
    <form className="club-form" onSubmit={(event) => { event.preventDefault(); onSubmit({ nombre: nombre.trim(), descripcion: descripcion.trim() }); }}>
      <label>Nombre<input autoFocus value={nombre} minLength={3} maxLength={80} required placeholder="Ej. Semillas Riobamba" onChange={(e) => setNombre(e.target.value)} /></label>
      <label>Descripción<textarea value={descripcion} maxLength={300} rows={4} placeholder="¿Quiénes forman parte de este club?" onChange={(e) => setDescripcion(e.target.value)} /></label>
      <div className="club-modal__actions"><Boton variante="secundario" onClick={onCancel}>Cancelar</Boton><Boton type="submit" cargando={pending} disabled={nombre.trim().length < 3}>Crear club</Boton></div>
    </form>
  );
}

function CrearClubModal({ pending, onClose, onSubmit }: { pending: boolean; onClose: () => void; onSubmit: (data: CrearClubInput) => void }) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  return (
    <Modal title="Crear un club" subtitle="Generaremos un código privado para invitar a tu grupo." onClose={onClose}>
      <form className="club-form" onSubmit={(event) => { event.preventDefault(); onSubmit({ nombre: nombre.trim(), descripcion: descripcion.trim() }); }}>
        <label>Nombre<input autoFocus value={nombre} minLength={3} maxLength={80} required placeholder="Ej. Semillas Riobamba" onChange={(e) => setNombre(e.target.value)} /></label>
        <label>Descripción<textarea value={descripcion} maxLength={300} rows={4} placeholder="¿Quiénes forman parte de este club?" onChange={(e) => setDescripcion(e.target.value)} /></label>
        <div className="club-modal__actions"><Boton variante="secundario" onClick={onClose}>Cancelar</Boton><Boton type="submit" cargando={pending} disabled={nombre.trim().length < 3}>Crear club</Boton></div>
      </form>
    </Modal>
  );
}

function CrearRetoModal({ pending, onClose, onSubmit }: { pending: boolean; onClose: () => void; onSubmit: (data: CrearRetoInput) => void }) {
  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 86400000);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [metric, setMetric] = useState<CrearRetoInput["codigo_metrica"]>("actividades_completadas");
  const [goal, setGoal] = useState(10);
  const [xp, setXp] = useState(100);
  const [start, setStart] = useState(toDateInput(today));
  const [end, setEnd] = useState(toDateInput(nextWeek));
  return (
    <Modal title="Nuevo reto cooperativo" subtitle="El progreso se calcula con eventos reales del servidor." onClose={onClose}>
      <form className="club-form" onSubmit={(event) => { event.preventDefault(); onSubmit({ nombre: nombre.trim(), descripcion: descripcion.trim(), codigo_metrica: metric, valor_objetivo: goal, xp_reto: xp, fecha_inicio: new Date(`${start}T00:00:00`).toISOString(), fecha_fin: new Date(`${end}T23:59:59`).toISOString() }); }}>
        <label>Nombre<input autoFocus value={nombre} minLength={3} maxLength={120} required placeholder="Ej. 20 actividades esta semana" onChange={(e) => setNombre(e.target.value)} /></label>
        <label>Descripción<textarea value={descripcion} maxLength={300} rows={3} onChange={(e) => setDescripcion(e.target.value)} /></label>
        <div className="club-form__grid"><label>Métrica<select value={metric} onChange={(e) => setMetric(e.target.value as CrearRetoInput["codigo_metrica"])}><option value="actividades_completadas">Actividades completadas</option><option value="temas_completados">Temas completados</option><option value="xp_grupal">XP grupal</option></select></label><label>Meta<input type="number" min={1} value={goal} onChange={(e) => setGoal(Number(e.target.value))} /></label></div>
        <div className="club-form__grid"><label>Inicio<input type="date" value={start} onChange={(e) => setStart(e.target.value)} /></label><label>Fin<input type="date" min={start} value={end} onChange={(e) => setEnd(e.target.value)} /></label></div>
        <label>Premio XP<input type="number" min={0} max={10000} value={xp} onChange={(e) => setXp(Number(e.target.value))} /></label>
        <div className="club-modal__actions"><Boton variante="secundario" onClick={onClose}>Cancelar</Boton><Boton type="submit" cargando={pending} disabled={nombre.trim().length < 3 || goal < 1 || !start || !end}>Crear reto</Boton></div>
      </form>
    </Modal>
  );
}

function Modal({ title, subtitle, onClose, children }: { title: string; subtitle: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="club-modal" role="dialog" aria-modal="true" aria-labelledby="club-modal-title" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="club-modal__sheet"><header><div><h2 id="club-modal-title">{title}</h2><p>{subtitle}</p></div><button type="button" onClick={onClose} aria-label="Cerrar">×</button></header>{children}</section>
    </div>
  );
}

function EmptyInline({ icon: Icon, title, text, action }: { icon: typeof Trophy; title: string; text: string; action?: { label: string; onClick: () => void } }) {
  return <div className="club-empty-inline"><Icon size={32} /><h3>{title}</h3><p>{text}</p>{action ? <Boton variante="violetaContorno" onClick={action.onClick}>{action.label}</Boton> : null}</div>;
}

function ClubesSkeleton() { return <div className="clubes-skeleton"><span /><span /><span /><span /></div>; }
function ClubesContentSkeleton() { return <div className="clubes-content-skeleton"><span /><span /><span /></div>; }
function roleName(role: string) { return role === "lider" || role === "propietario" ? "Líder" : "Miembro"; }
function formatMonth(value: string) { return new Intl.DateTimeFormat("es-EC", { month: "short", year: "numeric" }).format(new Date(value)); }
function daysRemaining(value: string) { const days = Math.ceil((new Date(value).getTime() - Date.now()) / 86400000); return days <= 0 ? "Finalizado" : days === 1 ? "1 día" : `${days} días`; }
function metricDescription(metric: string) { if (metric === "xp_grupal") return "Sumen XP entre todos los miembros del club."; if (metric === "temas_completados") return "Completen temas entre todos para alcanzar la meta."; return "Completen actividades y aporten al objetivo común."; }
function toDateInput(date: Date) { return date.toISOString().slice(0, 10); }
