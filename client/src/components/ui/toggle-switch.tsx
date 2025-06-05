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
        // Track styling exactly matching the provided design
        "relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        // Colors: bright green for on, bright red for off
        checked 
          ? "bg-green-500 focus:ring-green-300" 
          : "bg-red-500 focus:ring-red-300",
        className
      )}
    >
      <span className="sr-only">Toggle setting</span>
      <span
        aria-hidden="true"
        className={cn(
          // Handle styling with clean white circle
          "pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ease-in-out",
          // Positioning based on the design image
          checked ? "translate-x-5" : "translate-x-0"
        )}
        style={{
          margin: "2px"
        }}
      />
    </button>
  );
}