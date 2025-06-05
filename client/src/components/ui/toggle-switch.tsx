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
    <div className="relative">
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        disabled={disabled}
        className="sr-only"
      />
      <div
        onClick={() => !disabled && onCheckedChange(!checked)}
        className={cn(
          "relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 cursor-pointer",
          checked ? "bg-green-500" : "bg-red-500",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        <div
          className={cn(
            "inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300",
            checked ? "translate-x-7" : "translate-x-1"
          )}
        />
      </div>
    </div>
  );
}