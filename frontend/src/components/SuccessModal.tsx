interface SuccessModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  onClose: () => void;
  buttonLabel?: string;
}

export function SuccessModal({
  isOpen,
  title = "Success",
  message,
  onClose,
  buttonLabel = "OK",
}: SuccessModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 text-slate-900 shadow-xl">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">{title}</h3>
          {message && <p className="text-sm text-slate-600">{message}</p>}
        </div>
        <div className="mt-6">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
