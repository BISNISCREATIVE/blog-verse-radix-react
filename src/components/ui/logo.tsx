import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const Logo = ({ className, size = "md" }: LogoProps) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("relative", sizeClasses[size])}>
        {/* Main blue square */}
        <div className="absolute inset-0 bg-[#2B7CE9] rounded-sm" />
        
        {/* Small blue square overlay */}
        <div className="absolute top-1 right-1 w-3 h-3 bg-[#1E5BB8] rounded-sm" />
        
        {/* Light blue accent */}
        <div className="absolute bottom-1 left-1 w-2 h-2 bg-[#4A90E2] rounded-sm" />
      </div>
      
      {size !== "sm" && (
        <span className={cn(
          "font-bold text-foreground",
          size === "lg" ? "text-2xl" : "text-xl"
        )}>
          Your Logo
        </span>
      )}
    </div>
  );
};