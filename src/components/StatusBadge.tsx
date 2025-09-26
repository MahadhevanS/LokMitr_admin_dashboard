import { cn } from '@/lib/utils';
import { ComplaintStatus } from '@/types/complaint';

interface StatusBadgeProps {
  status: ComplaintStatus;
  className?: string;
}

const statusConfig = {
  'pending': {
    label: 'Pending',
    className: 'bg-status-pending-light text-status-pending border-status-pending',
  },
  'in-progress': {
    label: 'In Progress',
    className: 'bg-status-progress-light text-status-progress border-status-progress',
  },
  'resolved': {
    label: 'Resolved',
    className: 'bg-status-resolved-light text-status-resolved border-status-resolved',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border',
        config.className,
        className
      )}
    >
      <span className="w-2 h-2 rounded-full bg-current mr-2" />
      {config.label}
    </span>
  );
}