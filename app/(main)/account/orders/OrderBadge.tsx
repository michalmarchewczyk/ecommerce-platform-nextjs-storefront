import { OrderStatusEnum } from '@lib/api';
import { Badge } from '@lib/components/wrappers';

export default function OrderBadge({ status }: { status: OrderStatusEnum }) {
  const color = {
    [OrderStatusEnum.Pending]: 'blue',
    [OrderStatusEnum.Failed]: 'red',
    [OrderStatusEnum.Confirmed]: 'lime',
    [OrderStatusEnum.Open]: 'lime',
    [OrderStatusEnum.Cancelled]: 'red',
    [OrderStatusEnum.Delivered]: 'green',
    [OrderStatusEnum.Refunded]: 'teal',
  };
  return (
    <Badge variant="filled" color={color[status]} size="lg">
      {status}
    </Badge>
  );
}
