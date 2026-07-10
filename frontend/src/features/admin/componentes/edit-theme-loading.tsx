import { Loader } from "lucide-react";

export function EditThemeLoading() {
  return (
    <div className="flex justify-center py-12">
      <Loader className="animate-spin text-[#2e9e5b]" size={24} />
    </div>
  );
}
