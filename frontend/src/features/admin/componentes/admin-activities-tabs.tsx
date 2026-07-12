import { Boton } from "@/componentes/ui/boton";

export type AdminActivitiesTabCounts = {
  todos: number;
  quiz: number;
  flashcards: number;
  completar: number;
  verdaderoFalso: number;
  sopa: number;
};

export type AdminActivitiesTabsProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabCounts: AdminActivitiesTabCounts;
};

export function AdminActivitiesTabs({ activeTab, onTabChange, tabCounts }: AdminActivitiesTabsProps) {
  return (
    <div className="flex gap-4 border-b border-[#1a3a2a] pb-px mb-2 text-left select-none overflow-x-auto whitespace-nowrap scrollbar-none">
      <Boton
        onClick={() => onTabChange("todos")}
        className={`flex items-center gap-2 pb-3 font-bold text-[13px] border-b-2 transition-colors cursor-pointer outline-none ${
          activeTab === "todos" ? "border-green-600 text-green-600" : "border-transparent text-emerald-300/60 hover:text-emerald-100"
        }`}
        variante="texto"
      >
        <i className="fa-solid fa-square-check text-green-600" />
        Todas
      </Boton>
      <Boton
        onClick={() => onTabChange("quiz")}
        className={`flex items-center gap-2 pb-3 font-bold text-[13px] border-b-2 transition-colors cursor-pointer outline-none ${
          activeTab === "quiz" ? "border-green-600 text-green-600" : "border-transparent text-emerald-300/60 hover:text-emerald-100"
        }`}
        variante="texto"
      >
        <i className="fa-solid fa-circle-question text-purple-600" />
        Quiz
        {tabCounts.quiz > 0 && <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-purple-900/30 text-purple-400 font-bold">{tabCounts.quiz}</span>}
      </Boton>
      <Boton
        onClick={() => onTabChange("flashcard")}
        className={`flex items-center gap-2 pb-3 font-bold text-[13px] border-b-2 transition-colors cursor-pointer outline-none ${
          activeTab === "flashcard" ? "border-green-600 text-green-600" : "border-transparent text-emerald-300/60 hover:text-emerald-100"
        }`}
        variante="texto"
      >
        <i className="fa-solid fa-book-open text-amber-500" />
        Flashcards
        {tabCounts.flashcards > 0 && <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-900/30 text-amber-400 font-bold">{tabCounts.flashcards}</span>}
      </Boton>
      <Boton
        onClick={() => onTabChange("completar")}
        className={`flex items-center gap-2 pb-3 font-bold text-[13px] border-b-2 transition-colors cursor-pointer outline-none ${
          activeTab === "completar" ? "border-green-600 text-green-600" : "border-transparent text-emerald-300/60 hover:text-emerald-100"
        }`}
        variante="texto"
      >
        <i className="fa-solid fa-pen-clip text-blue-500" />
        Completar versículo
      </Boton>
      <Boton
        onClick={() => onTabChange("verdadero-falso")}
        className={`flex items-center gap-2 pb-3 font-bold text-[13px] border-b-2 transition-colors cursor-pointer outline-none ${
          activeTab === "verdadero-falso" ? "border-green-600 text-green-600" : "border-transparent text-emerald-300/60 hover:text-emerald-100"
        }`}
        variante="texto"
      >
        <i className="fa-solid fa-circle-check text-emerald-500" />
        Verdadero/Falso
      </Boton>
      <Boton
        onClick={() => onTabChange("sopa")}
        className={`flex items-center gap-2 pb-3 font-bold text-[13px] border-b-2 transition-colors cursor-pointer outline-none ${
          activeTab === "sopa" ? "border-green-600 text-green-600" : "border-transparent text-emerald-300/60 hover:text-emerald-100"
        }`}
        variante="texto"
      >
        <i className="fa-solid fa-border-all text-violet-600" />
        Sopa de letras
      </Boton>
      <Boton className="flex items-center gap-2 pb-3 font-bold text-[13px] border-b-2 border-transparent text-emerald-300/60 hover:text-emerald-100 cursor-pointer outline-none" variante="texto">
        Más
        <i className="fa-solid fa-chevron-down text-[10px] text-emerald-400/50" />
      </Boton>
    </div>
  );
}
