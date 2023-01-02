'use client';

import { Pagination, Flex } from '@mantine/core';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

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
  const [page, setPage] = useState(1);

  const updatePage = (newPage: number) => {
    const newParams = new URLSearchParams(params);
    newParams.set('page', newPage.toString());
    router.push(`${pathname}?${newParams.toString()}`);
    setPage(newPage);
  };

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
