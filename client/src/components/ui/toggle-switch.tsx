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
        // Base track styling with refined dimensions and modern design
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-slate-200 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
        // Enhanced states with better colors and shadows
        checked 
          ? "bg-gradient-to-r from-emerald-400 to-emerald-500 border-emerald-400 shadow-sm" 
          : "bg-slate-100 border-slate-200 hover:bg-slate-150",
        className
      )}
    >
      <span className="sr-only">Toggle setting</span>
      <span
        aria-hidden="true"
        className={cn(
          // Handle styling with refined proportions and enhanced shadows
          "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-1 ring-slate-200 transition-all duration-300 ease-in-out",
          // Improved positioning with proper spacing
          checked ? "translate-x-4" : "translate-x-0.5",
          // Additional styling for active state
          checked ? "shadow-lg" : "shadow-sm"
        )}
        style={{
          top: "1px",
          marginTop: "1px"
        }}
      />
    </button>
  );
}