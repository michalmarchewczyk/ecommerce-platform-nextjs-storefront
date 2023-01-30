'use client';

import { Group, Input, RangeSlider, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function CategoryPriceFilter({
  priceMin,
  priceMax,
}: {
  priceMin: number;
  priceMax: number;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Math.floor(priceMin),
    Math.ceil(priceMax),
  ]);
  const [debounced] = useDebouncedValue(priceRange, 200);

  useEffect(() => {
    if (
      !params.has('priceMin') &&
      debounced[0] === Math.floor(priceMin) &&
      debounced[1] === Math.ceil(priceMax)
    ) {
      return;
    }
    if (
      params.get('priceMin') !== debounced[0].toString() ||
      params.get('priceMax') !== debounced[1].toString()
    ) {
      const newParams = new URLSearchParams(params);
      if (newParams.has('page')) {
        newParams.delete('page');
      }
      newParams.set('priceMin', debounced[0].toString());
      newParams.set('priceMax', debounced[1].toString());
      router.push(`${pathname}?${newParams.toString()}`);
    }
  }, [debounced]);

  const updatePriceRange = (newPriceRange: [number, number]) => {
    const newRange: [number, number] = [
      Math.max(Math.floor(priceMin), newPriceRange[0]),
      Math.min(Math.ceil(priceMax), newPriceRange[1]),
    ];
    setPriceRange(newRange);
  };

  return (
    <>
      <RangeSlider
        mt="sm"
        mb="sm"
        min={Math.floor(priceMin)}
        max={Math.ceil(priceMax)}
        value={priceRange}
        onChange={updatePriceRange}
        step={1}
      />
      <Group position="apart" spacing={0}>
        <Input
          value={priceRange[0]}
          w={90}
          onChange={({ currentTarget }: { currentTarget: { value: string } }) =>
            updatePriceRange([parseInt(currentTarget.value, 10), priceRange[1]])
          }
        />
        <Text> - </Text>
        <Input
          value={priceRange[1]}
          w={90}
          onChange={({ currentTarget }: { currentTarget: { value: string } }) =>
            updatePriceRange([priceRange[0], parseInt(currentTarget.value, 10)])
          }
        />
      </Group>
    </>
  );
}
