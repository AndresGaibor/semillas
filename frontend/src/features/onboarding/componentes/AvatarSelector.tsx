import { MAPA_AVATARES } from "@/shared/constants/avatares";

interface AvatarSelectorProps {
  selectedAvatar: number;
  onSelect: (n: number) => void;
}

export function AvatarSelector({ selectedAvatar, onSelect }: AvatarSelectorProps) {
  return (
    <div className="onboarding-avatar-section mb-8">
      <div className="onboarding-section-title flex items-center gap-3 text-lg font-bold text-[#1A1A1A] mb-3">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#7E57C2] text-white text-sm font-bold flex-shrink-0">
          2
        </span>
        Elige un avatar que te represente
      </div>
      <div className="onboarding-avatar-grid grid grid-cols-5 gap-4 mt-4">
        {Array.from({ length: 10 }).map((_, index) => {
          const avatarNum = index + 1;
          const isSelected = selectedAvatar === avatarNum;
          return (
            <label key={avatarNum} className="onboarding-avatar-card relative block min-h-11 cursor-pointer touch-manipulation">
              <input
                type="radio"
                name="avatar"
                value={avatarNum}
                checked={isSelected}
                onChange={() => onSelect(avatarNum)}
                className="absolute opacity-0 w-0 h-0"
              />
              <div
                className="transition-all duration-200 relative"
                style={{
                  border: `2px solid ${isSelected ? "#7E57C2" : "transparent"}`,
                  borderRadius: "16px",
                  padding: "4px",
                  background: isSelected ? "#EDE7F6" : "transparent",
                }}
              >
                <img
                  src={MAPA_AVATARES[String(avatarNum)]}
                  alt={`Avatar ${avatarNum}`}
                  className="w-full h-auto block rounded-xl"
                />
                {isSelected && (
                  <div
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm text-white shadow-[0_2px_4px_rgba(0,0,0,0.2)] z-10"
                    style={{ background: "#7E57C2" }}
                  >
                    ✓
                  </div>
                )}
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
