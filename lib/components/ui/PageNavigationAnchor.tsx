'use client';

import { useRef } from 'react';
import { useHash, useViewportSize, useWindowEvent } from '@mantine/hooks';
import { Box } from '@mantine/core';

export default function PageNavigationAnchor({ label }: { label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { height } = useViewportSize();
  const [, setHash] = useHash();

  useWindowEvent('scroll', () => {
    if (
      ref.current &&
      ref.current.getBoundingClientRect().top < height / 2 &&
      ref.current.getBoundingClientRect().top >
        height / 2 - ref.current.getBoundingClientRect().height
    ) {
      if (!label && window.location.hash !== '') {
        setHash('_');
        window.history.pushState(null, '', window.location.pathname);
      } else if (label && window.location.hash !== `#${label}`) {
        setHash(label);
      }
    }
  });

  return (
    <Box
      sx={{
        position: 'absolute',
        marginTop: '-100px',
        height: 'calc(100% + 78px)',
      }}
      ref={ref}
    >
      <Box
        id={`nav-${label}`}
        sx={{
          position: 'absolute',
          height: '200px',
          maxHeight: '100%',
        }}
      />
    </Box>
  );
}
