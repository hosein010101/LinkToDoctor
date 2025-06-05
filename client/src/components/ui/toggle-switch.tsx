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
        // Base track styling matching the provided design
        "relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        // Color states: green for on, red for off
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
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-all duration-300 ease-in-out",
          // Positioning: right side when on, left side when off
          checked ? "translate-x-6" : "translate-x-0.5"
        )}
        style={{
          top: "2px",
          marginTop: "0px"
        }}
      />
    </button>
  );
}