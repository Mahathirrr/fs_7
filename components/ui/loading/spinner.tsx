export function Spinner({ className = "", size = "medium" }: {
  className?: string;
  size?: "small" | "medium" | "large";
}) {
  const sizeClasses = {
    small: "h-4 w-4",
    medium: "h-8 w-8",
    large: "h-12 w-12",
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`animate-spin rounded-full border-b-2 border-primary ${sizeClasses[size]}`}
      />
    </div>
  );
}