import { Gamepad2 } from "lucide-react";
import { Loader } from "lucide-react";

interface ActivityHeaderProps {
  selectedAgeGroupId: string;
  ageGroupsData?: Array<{ id: string; nombre?: string | null }> | null;
  isEditMode: boolean;
  isLoading: boolean;
  onAgeGroupChange: (id: string) => void;
  onNew: () => void;
}

export function ActivityHeader({
  selectedAgeGroupId,
  ageGroupsData,
  isEditMode,
  isLoading,
  onAgeGroupChange,
  onNew,
}: ActivityHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-[#123b2c]">Franja:</label>
        <select
          value={selectedAgeGroupId}
          onChange={(e) => onAgeGroupChange(e.target.value)}
          disabled={!!isEditMode}
          className="px-3 py-2 rounded-xl border border-[#e5e7eb] text-sm bg-white disabled:bg-slate-50"
        >
          <option value="">Todas</option>
          {ageGroupsData?.map((ag) => (
            <option key={ag.id} value={ag.id}>{ag.nombre}</option>
          ))}
        </select>
      </div>
      {!isEditMode && (
        <button
          type="button"
          onClick={onNew}
          className="flex items-center gap-1.5 bg-[#2e9e5b] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#267d4c] transition-colors"
        >
          <Gamepad2 size={16} /> Nueva
        </button>
      )}
    </div>
  );
}

export function ActivityEmptyState() {
  return (
    <div className="text-center py-12 bg-white rounded-2xl">
      <Gamepad2 className="mx-auto text-[#123b2c]/20 mb-3" size={48} />
      <p className="text-[#123b2c]/40">No hay actividades aún</p>
    </div>
  );
}

export function ActivityLoadingState() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader className="animate-spin text-primario" size={24} />
    </div>
  );
}
