import Link from 'next/link';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  secondaryLabel,
  secondaryHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      {icon && (
        <div className="w-12 h-12 rounded-xl bg-zinc-800/80 flex items-center justify-center text-zinc-500 mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-sm font-semibold text-zinc-300 mb-1">{title}</h3>
      <p className="text-xs text-zinc-500 max-w-xs mb-4">{description}</p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors"
        >
          {actionLabel}
        </Link>
      )}
      {secondaryLabel && secondaryHref && (
        <Link
          href={secondaryHref}
          className="mt-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          {secondaryLabel}
        </Link>
      )}
    </div>
  );
}
