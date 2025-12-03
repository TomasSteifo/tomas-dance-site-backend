type StatusBadgeProps = {
  status: unknown;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const displayValue = status ?? "N/A";
  const normalized = String(status ?? "").toLowerCase();

  let classes =
    "inline-flex px-2 py-1 text-xs font-medium rounded-full transition-colors ";

  switch (normalized) {
    case "pending":
    case "0":
      classes += "bg-yellow-100 text-yellow-800";
      break;
    case "confirmed":
    case "1":
      classes += "bg-green-100 text-green-800";
      break;
    case "cancelled":
    case "canceled":
    case "2":
      classes += "bg-red-100 text-red-800";
      break;
    case "completed":
    case "3":
      classes += "bg-blue-100 text-blue-800";
      break;
    default:
      classes += "bg-gray-100 text-gray-800";
      break;
  }

  return <span className={classes}>{displayValue as string}</span>;
}

export default StatusBadge;
