"use client";

interface OptionCardProps {
  icon?: string;
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

export default function OptionCard({
  icon,
  label,
  description,
  selected,
  onClick,
}: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left p-4 rounded-lg border transition-all duration-150 cursor-pointer
        ${
          selected
            ? "border-primary-500 bg-primary-500/10 ring-1 ring-primary-500/30"
            : "border-gray-800 bg-gray-900 hover:border-gray-700 hover:bg-gray-900/80"
        }`}
    >
      <div className="flex items-start gap-3">
        {icon && <span className="text-xl mt-0.5 shrink-0">{icon}</span>}
        <div className="min-w-0">
          <p
            className={`font-medium ${
              selected ? "text-primary-400" : "text-gray-100"
            }`}
          >
            {label}
          </p>
          <p className="text-sm text-gray-400 mt-0.5">{description}</p>
        </div>
      </div>
    </button>
  );
}
