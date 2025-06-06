import { cn } from "@/lib/utils";

interface ToggleSwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function ToggleIOSSwitch({ 
  checked, 
  onCheckedChange, 
  disabled = false, 
  className 
}: ToggleSwitchProps) {
  return (
    <label 
      className={cn(
        "relative inline-block w-[60px] h-[34px] cursor-pointer",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {/* مخفی کردن چک‌باکس اصلی */}
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => !disabled && onCheckedChange(e.target.checked)}
        disabled={disabled}
        className="opacity-0 w-0 h-0"
      />
      
      {/* مسیر (Track) */}
      <span 
        className={cn(
          "absolute inset-0 rounded-full transition-colors duration-300 ease-in-out",
          checked ? "bg-[#4CD964]" : "bg-[#ccc]"
        )}
      >
        {/* دستگیره (Knob) */}
        <span 
          className={cn(
            "absolute top-[2px] left-[2px] w-[30px] h-[30px] bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out",
            checked && "transform translate-x-[26px]"
          )}
        />
      </span>
    </label>
  );
}