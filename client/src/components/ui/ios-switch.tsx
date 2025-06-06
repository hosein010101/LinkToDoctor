import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface IOSSwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  id?: string;
}

const IOSSwitch = forwardRef<HTMLInputElement, IOSSwitchProps>(
  ({ checked, onCheckedChange, disabled, size = "md", className, id, ...props }, ref) => {
    const sizeClasses = {
      sm: "w-10 h-6",
      md: "w-12 h-7", 
      lg: "w-14 h-8"
    };

    const knobSizeClasses = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6"
    };

    return (
      <label 
        className={cn(
          "relative inline-flex cursor-pointer items-center",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
      >
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          disabled={disabled}
          className="sr-only"
          id={id}
          {...props}
        />
        
        {/* Track */}
        <div className={cn(
          "relative rounded-full transition-all duration-200 ease-in-out",
          sizeClasses[size],
          checked 
            ? "bg-green-500 shadow-inner" 
            : "bg-gray-300 shadow-inner",
          disabled && "opacity-50"
        )}>
          
          {/* Knob */}
          <div className={cn(
            "absolute top-1 left-1 rounded-full bg-white shadow-md transition-all duration-200 ease-in-out",
            knobSizeClasses[size],
            checked && (
              size === "sm" ? "translate-x-4" :
              size === "md" ? "translate-x-5" :
              "translate-x-6"
            )
          )} />
        </div>
      </label>
    );
  }
);

IOSSwitch.displayName = "IOSSwitch";

export { IOSSwitch };