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
        // Base track styling with improved dimensions
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        // Enhanced off state - light gray background for better visibility
        checked ? "bg-green-500" : "bg-gray-300",
        className
      )}
    >
      <span className="sr-only">Toggle setting</span>
      <span
        aria-hidden="true"
        className={cn(
          // Handle styling - white background with proper sizing
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
          // Positioning for on/off states
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}