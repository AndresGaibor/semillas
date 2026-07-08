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
    <div className="flex gap-4 border-b border-slate-100 pb-px mb-2 text-left select-none overflow-x-auto whitespace-nowrap scrollbar-none">
      <button
        onClick={() => onTabChange("todos")}
        className={`flex items-center gap-2 pb-3 font-bold text-[13px] border-b-2 transition-colors cursor-pointer outline-none ${
          activeTab === "todos" ? "border-[#2e9e5b] text-[#2e9e5b]" : "border-transparent text-slate-500 hover:text-slate-700"
        }`}
      >
        <i className="fa-solid fa-square-check text-[#2e9e5b]" />
        Todas
      </button>
      <button
        onClick={() => onTabChange("quiz")}
        className={`flex items-center gap-2 pb-3 font-bold text-[13px] border-b-2 transition-colors cursor-pointer outline-none ${
          activeTab === "quiz" ? "border-[#2e9e5b] text-[#2e9e5b]" : "border-transparent text-slate-500 hover:text-slate-700"
        }`}
      >
        <i className="fa-solid fa-circle-question text-purple-600" />
        Quiz
        {tabCounts.quiz > 0 && <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-purple-100 text-purple-700 font-bold">{tabCounts.quiz}</span>}
      </button>
      <button
        onClick={() => onTabChange("flashcard")}
        className={`flex items-center gap-2 pb-3 font-bold text-[13px] border-b-2 transition-colors cursor-pointer outline-none ${
          activeTab === "flashcard" ? "border-[#2e9e5b] text-[#2e9e5b]" : "border-transparent text-slate-500 hover:text-slate-700"
        }`}
      >
        <i className="fa-solid fa-book-open text-amber-500" />
        Flashcards
        {tabCounts.flashcards > 0 && <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-700 font-bold">{tabCounts.flashcards}</span>}
      </button>
      <button
        onClick={() => onTabChange("completar")}
        className={`flex items-center gap-2 pb-3 font-bold text-[13px] border-b-2 transition-colors cursor-pointer outline-none ${
          activeTab === "completar" ? "border-[#2e9e5b] text-[#2e9e5b]" : "border-transparent text-slate-500 hover:text-slate-700"
        }`}
      >
        <i className="fa-solid fa-pen-clip text-blue-500" />
        Completar versículo
      </button>
      <button
        onClick={() => onTabChange("verdadero-falso")}
        className={`flex items-center gap-2 pb-3 font-bold text-[13px] border-b-2 transition-colors cursor-pointer outline-none ${
          activeTab === "verdadero-falso" ? "border-[#2e9e5b] text-[#2e9e5b]" : "border-transparent text-slate-500 hover:text-slate-700"
        }`}
      >
        <i className="fa-solid fa-circle-check text-emerald-500" />
        Verdadero/Falso
      </button>
      <button
        onClick={() => onTabChange("sopa")}
        className={`flex items-center gap-2 pb-3 font-bold text-[13px] border-b-2 transition-colors cursor-pointer outline-none ${
          activeTab === "sopa" ? "border-[#2e9e5b] text-[#2e9e5b]" : "border-transparent text-slate-500 hover:text-slate-700"
        }`}
      >
        <i className="fa-solid fa-border-all text-violet-600" />
        Sopa de letras
      </button>
      <button className="flex items-center gap-2 pb-3 font-bold text-[13px] border-b-2 border-transparent text-slate-500 hover:text-slate-700 cursor-pointer outline-none">
        Más
        <i className="fa-solid fa-chevron-down text-[10px] text-slate-400" />
      </button>
    </div>
  );
}
