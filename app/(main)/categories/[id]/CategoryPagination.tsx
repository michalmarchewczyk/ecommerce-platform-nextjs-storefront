'use client';

import { Flex, Pagination } from '@mantine/core';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PrefetchKind } from 'next/dist/client/components/router-reducer/router-reducer-types';

const PAGE_SIZE = 12;

export default function CategoryPagination({
  countProducts,
}: {
  countProducts: number;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();
  const totalPages = Math.ceil(countProducts / PAGE_SIZE);
  const [page, setPage] = useState(0);

  const updatePage = (newPage: number) => {
    const newParams = new URLSearchParams(params);
    newParams.set('page', newPage.toString());
    router.push(`${pathname}?${newParams.toString()}`);
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    new Array(totalPages).fill(0).forEach((_, i) => {
      const newParams = new URLSearchParams(params);
      newParams.set('page', (i + 1).toString());
      router.prefetch(`${pathname}?${newParams.toString()}`, {
        kind: PrefetchKind.FULL,
      });
    });
    if (params.has('page')) {
      const newPage = parseInt(params.get('page') ?? '1', 10);
      if (newPage !== page) {
        setPage(newPage);
      }
    } else {
      setPage(1);
    }
  }, [params]);

  return (
    <Flex w="100%" py="sm" sx={{ overflow: 'hidden' }} justify="center">
      <Pagination
        total={totalPages}
        page={page}
        onChange={updatePage}
        size="lg"
        radius="md"
      />
    </Flex>
  );
}
