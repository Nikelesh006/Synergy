import { useState, ReactNode } from "react";
import { Check, ChevronDown, Filter, RotateCcw, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Modern, curved-bordered, glassy filter sidebar used on category and shop pages.
 * Designed to sit on the left side of the page.
 */

export type FilterOption = {
  value: string;
  label: string;
  count?: number;
};

export type FilterGroup = {
  id: string;
  title: string;
  defaultOpen?: boolean;
  options: FilterOption[];
};

type FilterSidebarProps = {
  groups: FilterGroup[];
  selected: string[];
  onToggle: (value: string) => void;
  onReset?: () => void;
  className?: string;
  /** Optional extra content rendered after the filter groups (e.g. price sliders). */
  footer?: ReactNode;
};

export default function FilterSidebar({
  groups,
  selected,
  onToggle,
  onReset,
  className,
  footer,
}: FilterSidebarProps) {
  return (
    <aside className={cn("w-full lg:w-72 flex-shrink-0", className)}>
      <div
        className={cn(
          // Outer glassy card with generous rounded corners
          "sticky top-24 overflow-hidden rounded-2xl",
          "border border-slate-200/80 bg-white/80 backdrop-blur-md",
          "shadow-[0_1px_0_0_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.12)]"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-2 px-5 pt-5 pb-4">
          <div className="flex items-center gap-2.5">
            <span
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-xl",
                "bg-gradient-to-br from-blue-600 to-indigo-600 text-white",
                "shadow-sm shadow-blue-600/25"
              )}
            >
              <SlidersHorizontal className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-slate-900 leading-none">Filters</h2>
              <p className="mt-1 text-[11px] font-medium text-slate-500">
                {selected.length > 0
                  ? `${selected.length} selected`
                  : "Refine your results"}
              </p>
            </div>
          </div>
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              disabled={selected.length === 0}
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                "ring-1 ring-slate-200 transition-colors",
                selected.length === 0
                  ? "cursor-not-allowed text-slate-300"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
              aria-label="Reset filters"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
          )}
        </div>

        {/* Soft divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

        {/* Groups */}
        <div className="px-2 py-2">
          {groups.map((group) => (
            <FilterGroupSection
              key={group.id}
              group={group}
              selected={selected}
              onToggle={onToggle}
            />
          ))}
        </div>

        {footer && (
          <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-4">{footer}</div>
        )}
      </div>
    </aside>
  );
}

function FilterGroupSection({
  group,
  selected,
  onToggle,
}: {
  group: FilterGroup;
  selected: string[];
  onToggle: (value: string) => void;
}) {
  const [open, setOpen] = useState(group.defaultOpen ?? true);

  return (
    <div className="px-3 py-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-xl px-2 py-2 text-left transition-colors hover:bg-slate-50"
        aria-expanded={open}
      >
        <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
          {group.title}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-slate-400 transition-transform duration-200",
            !open && "-rotate-90"
          )}
        />
      </button>

      {open && (
        <ul className="mt-1 space-y-1 pb-2">
          {group.options.map((option) => {
            const isChecked = selected.includes(option.value);
            return (
              <li key={option.value}>
                <label
                  className={cn(
                    "group flex cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2",
                    "transition-colors hover:bg-slate-50",
                    isChecked && "bg-blue-50/60"
                  )}
                >
                  <ModernCheckbox checked={isChecked} />
                  <span
                    className={cn(
                      "flex-1 text-sm transition-colors",
                      isChecked
                        ? "font-semibold text-slate-900"
                        : "text-slate-600 group-hover:text-slate-900"
                    )}
                  >
                    {option.label}
                  </span>
                  {typeof option.count === "number" && (
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums",
                        isChecked
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                      )}
                    >
                      {option.count}
                    </span>
                  )}
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={isChecked}
                    onChange={() => onToggle(option.value)}
                  />
                </label>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/**
 * A modern, custom-styled checkbox with a soft gradient + checkmark animation.
 * Used inside filter rows; the real <input> is a hidden sr-only element so the
 * label is clickable and accessible.
 */
function ModernCheckbox({ checked }: { checked: boolean }) {
  return (
    <span
      className={cn(
        "relative inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md",
        "border transition-all duration-150",
        checked
          ? "border-blue-600 bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm shadow-blue-600/30"
          : "border-slate-300 bg-white group-hover:border-slate-400"
      )}
      aria-hidden
    >
      <Check
        className={cn(
          "h-3.5 w-3.5 text-white transition-all duration-150",
          checked ? "scale-100 opacity-100" : "scale-50 opacity-0"
        )}
        strokeWidth={3}
      />
    </span>
  );
}
