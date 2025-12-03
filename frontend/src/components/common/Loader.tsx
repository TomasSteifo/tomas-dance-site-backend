interface LoaderProps {
  label?: string;
}

export function Loader({ label }: LoaderProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-300">
      <span className="inline-block h-4 w-4 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
      <span>{label ?? "Loading..."}</span>
    </div>
  );
}
