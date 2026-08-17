import { Badge } from "@/components/ui/badge";
import { getContentTypeMeta } from "@/lib/content-types";

export function ContentTypeBadge({ type }: { type: string }) {
  const meta = getContentTypeMeta(type);
  const Icon = meta.icon;
  return (
    <Badge variant="secondary" className="border-transparent font-medium">
      <Icon className="size-3" aria-hidden="true" />
      {meta.label}
    </Badge>
  );
}
