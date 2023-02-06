import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  IconHeart,
  IconReceipt,
  IconReceiptRefund,
  IconUser,
} from '@tabler/icons';
import { usersApi } from '@lib/api';
import PageNavigation from '@lib/components/ui/PageNavigation';
import { Box, Flex } from '@lib/components/wrappers';

export const revalidate = 0;

async function getAccount() {
  const cookie = headers().get('cookie') ?? '';
  const req = usersApi.getCurrentUser({
    cache: 'no-store',
    headers: { cookie },
  });
  try {
    return await req;
  } catch (e) {
    return null;
  }
}

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await getAccount();
  if (!data) {
    redirect('/login');
  }

  return (
    <>
      <Flex direction="row" gap={40} wrap="wrap" w="100%" mih={100}>
        <Box
          w={180}
          miw={180}
          pt={20}
          sx={{
            '@media (max-width: 750px)': {
              minWidth: '100%',
              position: 'sticky',
              top: '64px',
              marginBottom: '-64px',
              zIndex: 100,
            },
          }}
        >
          <PageNavigation
            type="url"
            items={[
              {
                icon: <IconUser size="26" />,
                label: 'Account',
                value: '/account',
              },
              {
                icon: <IconReceipt size="26" />,
                label: 'Orders',
                value: '/account/orders',
              },
              {
                icon: <IconReceiptRefund size="26" />,
                label: 'Returns',
                value: '/account/returns',
              },
              {
                icon: <IconHeart size="26" />,
                label: 'Wishlists',
                value: '/account/wishlists',
              },
            ]}
          />
        </Box>
        <Box
          pt={20}
          sx={{
            flex: 1,
            '@media (max-width: 750px)': {
              paddingLeft: '16px',
              paddingRight: '16px',
              paddingTop: '64px',
            },
          }}
        >
          {children}
        </Box>
      </Flex>
    </>
  );
}
