import { cn } from "@/lib/utils";

interface ToggleSwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function ToggleSwitch({ 
  checked, 
  onCheckedChange, 
  disabled = false, 
  className 
}: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        // Compact iPhone-style track dimensions
        "relative inline-flex h-[31px] w-[51px] shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
        // iPhone color scheme: vibrant green for on, light gray for off
        checked 
          ? "bg-green-500" 
          : "bg-gray-300",
        className
      )}
    >
      <span className="sr-only">Toggle setting</span>
      <span
        aria-hidden="true"
        className={cn(
          // iPhone-style handle with exact 27px diameter and subtle shadow
          "pointer-events-none absolute h-[27px] w-[27px] rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out",
          // Precise positioning with 2px margin from track edges
          checked ? "translate-x-[22px]" : "translate-x-0"
        )}
        style={{
          top: "2px",
          left: "2px"
        }}
      />
    </button>
  );
}