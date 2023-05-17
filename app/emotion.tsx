'use client';

import { CacheProvider } from '@emotion/react';
import { useEmotionCache, MantineProvider } from '@mantine/core';
import { useServerInsertedHTML } from 'next/navigation';
import { NotificationsProvider } from '@mantine/notifications';

export default function RootStyleRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const cache = useEmotionCache();
  cache.compat = true;

  useServerInsertedHTML(() => {
    const cacheKeys = Object.keys(cache.inserted);
    const cacheValues = Object.values(cache.inserted);
    cache.inserted = {};
    return (
      <style
        data-emotion={`${cache.key} ${cacheKeys.join(' ')}`}
        dangerouslySetInnerHTML={{
          __html: cacheValues.join(' '),
        }}
      />
    );
  });

  return (
    <CacheProvider value={cache}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        withCSSVariables
        theme={{
          fontFamily: 'var(--font-roboto), sans-serif',
          headings: {
            fontFamily: 'var(--font-poppins), sans-serif',
          },
          defaultRadius: 'md',
          primaryColor: 'indigo',
          components: {
            NavLink: {
              styles: {
                root: {
                  borderRadius: 'var(--mantine-radius-md)',
                },
              },
            },
          },
        }}
      >
        <NotificationsProvider>{children}</NotificationsProvider>
      </MantineProvider>
    </CacheProvider>
  );
}
