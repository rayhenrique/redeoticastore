import type { ComponentProps } from "react";
import type { LucideIcon } from "lucide-react";
import { Baby, Briefcase, Glasses, Sparkles, Sun } from "lucide-react";

export interface CategoryIconOption {
  value: string;
  label: string;
  icon: LucideIcon;
}

export const categoryIconOptions: CategoryIconOption[] = [
  { value: "sun", label: "Sol", icon: Sun },
  { value: "glasses", label: "Óculos", icon: Glasses },
  { value: "baby", label: "Infantil", icon: Baby },
  { value: "briefcase", label: "Acessórios", icon: Briefcase },
  { value: "sparkles", label: "Destaque", icon: Sparkles },
];

export function getCategoryIcon(iconName: string | null | undefined): LucideIcon {
  const found = categoryIconOptions.find((item) => item.value === iconName);
  return found?.icon ?? Sparkles;
}

export function CategoryIcon({
  iconName,
  ...props
}: { iconName: string | null | undefined } & ComponentProps<"svg">) {
  switch (iconName) {
    case "sun":
      return <Sun {...props} />;
    case "glasses":
      return <Glasses {...props} />;
    case "baby":
      return <Baby {...props} />;
    case "briefcase":
      return <Briefcase {...props} />;
    case "sparkles":
    default:
      return <Sparkles {...props} />;
  }
}
