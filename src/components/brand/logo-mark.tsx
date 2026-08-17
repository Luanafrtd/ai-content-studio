import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-6", className)}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="9" className="fill-primary" />
      <path
        d="M23 6.5L9.5 20C8.5 21 8 22.8 8.3 24.4C10 24.8 11.8 24.2 12.7 23.2L26.2 9.7C27.2 8.6 27.1 6.9 26 5.9C24.9 4.9 23.9 5.5 23 6.5Z"
        className="fill-primary-foreground"
      />
      <path
        d="M10.5 18.8L13.5 21.8"
        className="stroke-primary"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M8.3 24.4C6.8 26 5.2 26.6 4 26.2"
        className="stroke-primary-foreground"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
