interface BadgeProps {
  children: React.ReactNode;
  variant: "shiny" | "event" | "alpha" | "ha" | "default";
}

const variantClasses: Record<BadgeProps["variant"], string> = {
  shiny: "bg-yellow-100 text-yellow-800",
  event: "bg-purple-100 text-purple-800",
  alpha: "bg-red-100 text-red-800",
  ha: "bg-teal-100 text-teal-800",
  default: "bg-gray-100 text-gray-800",
};

export function Badge({ children, variant }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
}
