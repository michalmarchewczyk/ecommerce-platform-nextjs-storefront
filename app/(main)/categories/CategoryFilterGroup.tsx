'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Checkbox } from '@mantine/core';
import { AttributeType } from '../../../lib/api';

type AttributeTypeWithValues = AttributeType & { values: string[] };

export default function CategoryFilterGroup({
  categoryId,
  attributeType,
}: {
  categoryId: number;
  attributeType: AttributeTypeWithValues;
}) {
  const params = useSearchParams();

  const values = Array.from(attributeType.values).sort();
  if (attributeType.valueType === 'number') {
    values.sort((a, b) => parseFloat(a) - parseFloat(b));
  }

  const getHref = (value: string) => {
    const key = attributeType.id.toString();
    const newParams = new URLSearchParams(params);
    if (newParams.has(key)) {
      if (newParams.getAll(key).includes(value)) {
        const newValues = newParams.getAll(key).filter((v) => v !== value);
        newParams.delete(key);
        newValues.forEach((v) => newParams.append(key, v));
      } else {
        newParams.append(key, value);
      }
    } else {
      newParams.set(key, value);
    }
    return `/categories/${categoryId}?${newParams.toString()}`;
  };

  const selected = params.getAll(attributeType.id.toString());

  return (
    <Checkbox.Group orientation="vertical" spacing="xs" value={selected}>
      {values.map((value) => (
        <Link key={value} href={getHref(value)} style={{ cursor: 'inherit' }}>
          <Checkbox value={value} label={value} />
        </Link>
      ))}
    </Checkbox.Group>
  );
}
