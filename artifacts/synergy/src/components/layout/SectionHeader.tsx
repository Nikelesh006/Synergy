import type { ReactNode } from "react";

interface SectionHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  className?: string;
}

/**
 * Centered section heading flanked by pale grey rules on the left and right.
 * The `action` slot (e.g. "View All") renders above the title on the right,
 * keeping the heading itself perfectly centered with the lines.
 */
export default function SectionHeader({
  title,
  subtitle,
  action,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`relative text-center ${className}`}>
      <div className="flex items-center justify-center gap-4">
        <span
          aria-hidden="true"
          className="h-px flex-1 bg-gray-200"
        />
        <h2 className="text-3xl font-bold text-gray-900 whitespace-nowrap">
          {title}
        </h2>
        <span
          aria-hidden="true"
          className="h-px flex-1 bg-gray-200"
        />
      </div>
      {subtitle && (
        <p className="text-base text-gray-500 mt-2">{subtitle}</p>
      )}
      {action && (
        <div className="flex justify-end mt-3">{action}</div>
      )}
    </div>
  );
}
