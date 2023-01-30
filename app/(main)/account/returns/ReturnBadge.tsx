import { ReturnStatusEnum } from '@lib/api';
import { Badge } from '@lib/components/wrappers';

export default function ReturnBadge({ status }: { status: ReturnStatusEnum }) {
  const color = {
    [ReturnStatusEnum.Open]: 'blue',
    [ReturnStatusEnum.Accepted]: 'green',
    [ReturnStatusEnum.Rejected]: 'red',
    [ReturnStatusEnum.Cancelled]: 'orange',
    [ReturnStatusEnum.Completed]: 'teal',
  };
  return (
    <Badge variant="filled" color={color[status]} size="lg">
      {status}
    </Badge>
  );
}
