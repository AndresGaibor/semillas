interface AdminMediaUploadProgressProps {
  isUploading: boolean;
}

export function AdminMediaUploadProgress({ isUploading }: AdminMediaUploadProgressProps) {
  if (!isUploading) return null;

  return (
    <div className="fixed bottom-4 right-4 rounded-2xl bg-[#123b2c] px-4 py-3 text-sm font-semibold text-white shadow-lg">
      Subiendo recurso...
    </div>
  );
}
