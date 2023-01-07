'use client';

import { useRef } from 'react';
import { useHash, useWindowEvent } from '@mantine/hooks';
import { Box } from '@mantine/core';

export default function ProductNavigationAnchor({ label }: { label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [, setHash] = useHash();

  useWindowEvent('scroll', () => {
    if (
      ref.current &&
      ref.current?.getBoundingClientRect().top > -100 &&
      ref.current?.getBoundingClientRect().top < 20
    ) {
      if (!label && window.location.hash !== '') {
        setHash('empty');
        window.history.pushState(null, '', window.location.pathname);
      } else if (label && window.location.hash !== `#${label}`) {
        setHash(label);
      }
    }
  });

  return (
    <Box
      id={`nav-${label}`}
      sx={{
        position: 'absolute',
        marginTop: '-140px',
        '@media (max-width: 750px)': {
          marginTop: '-220px',
        },
      }}
      ref={ref}
    />
  );
}
