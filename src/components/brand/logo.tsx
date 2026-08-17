import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/brand/logo-mark";

export function Logo({ className, iconClassName }: { className?: string; iconClassName?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-semibold tracking-tight", className)}>
      <LogoMark className={iconClassName} />
      <span>Quill</span>
    </span>
  );
}
