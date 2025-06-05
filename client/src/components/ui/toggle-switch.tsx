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
        // iOS-style track with exact dimensions and pill shape
        "relative inline-flex h-8 w-[51px] shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        // iOS color scheme: green for on, light gray for off
        checked 
          ? "bg-green-500" 
          : "bg-gray-200 border border-gray-300",
        className
      )}
    >
      <span className="sr-only">Toggle setting</span>
      <span
        aria-hidden="true"
        className={cn(
          // iOS-style handle with precise sizing and shadow
          "pointer-events-none inline-block h-[27px] w-[27px] transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out",
          // Positioning with proper 2px inset from track edges
          checked ? "translate-x-[22px]" : "translate-x-0.5"
        )}
        style={{
          position: "absolute",
          top: "2px",
          left: "2px"
        }}
      />
    </button>
  );
}