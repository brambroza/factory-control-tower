import { Suspense } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { useOutlet, useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import ButtonBase from '@mui/material/ButtonBase';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useTranslate } from 'src/locales';

import { Logo } from 'src/components/logo';
import { Iconify } from 'src/components/iconify';
import { SettingsButton } from 'src/components/settings';
import { LoadingScreen } from 'src/components/loading-screen';

import { EASE } from 'src/sections/factory/motion';
import { CURRENT_USER } from 'src/sections/factory/_mock';
import { FactoryDemoProvider } from 'src/sections/factory/context';
import { greyTint, pillControls } from 'src/sections/factory/styles';

import { NAV_ITEMS } from './nav-config';

// ----------------------------------------------------------------------

/**
 * Shell ของ module factory: กรอบแอปลอยบนพื้นเทา + แถบเมนูไอคอนด้านซ้าย
 * - กรอบเอียงเข้ามาตั้งตรงตอนเปิดครั้งแรก (perspective)
 * - เปลี่ยนหน้าแล้วเนื้อหาเบลอออก/เบลอเข้า (`AnimatePresence` คีย์ด้วย pathname)
 */
export function FactoryLayout() {
  const outlet = useOutlet();

  const { pathname } = useLocation();

  return (
    <FactoryDemoProvider>
      <Box
        sx={{
          height: '100vh',
          overflow: 'hidden',
          perspective: 2000,
          p: { xs: 0, md: 3 },
          bgcolor: greyTint(0.28),
          ...pillControls,
        }}
      >
        <Box
          component={m.div}
          initial={{ opacity: 0, scale: 0.8, rotateX: 12, rotateY: -16 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0, rotateY: 0 }}
          transition={{ duration: 1.1, ease: EASE }}
          sx={{
            height: 1,
            mx: 'auto',
            display: 'flex',
            maxWidth: 1680,
            overflow: 'hidden',
            bgcolor: 'background.paper',
            borderRadius: { xs: 0, md: 4 },
            boxShadow: (theme) => theme.customShadows.z24,
          }}
        >
          <NavRail pathname={pathname} />

          <Box sx={{ flexGrow: 1, minWidth: 0, height: 1 }}>
            <AnimatePresence mode="wait" initial={false}>
              <Box
                key={pathname}
                component={m.div}
                initial={{ opacity: 0, scale: 0.985, filter: 'blur(14px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.01, filter: 'blur(14px)' }}
                transition={{ duration: 0.32, ease: EASE }}
                sx={{ height: 1, overflowY: 'auto', p: { xs: 2, md: 3 }, pl: { md: 1 } }}
              >
                <Suspense fallback={<LoadingScreen />}>{outlet}</Suspense>
              </Box>
            </AnimatePresence>
          </Box>
        </Box>
      </Box>
    </FactoryDemoProvider>
  );
}

// ----------------------------------------------------------------------

function NavRail({ pathname }: { pathname: string }) {
  const { t } = useTranslate('factory');

  const activeKey =
    [...NAV_ITEMS]
      .sort((a, b) => b.path.length - a.path.length)
      .find((item) =>
        item.path === paths.factory.root ? pathname === item.path : pathname.startsWith(item.path)
      )?.key ?? (pathname.startsWith(paths.factory.orders) ? 'dispatch' : undefined);

  return (
    <Stack
      component="nav"
      alignItems="center"
      spacing={0.75}
      sx={{ py: 2.5, width: 72, flexShrink: 0, overflowY: 'auto' }}
    >
      <Logo width={36} height={36} href={paths.factory.root} sx={{ mb: 2 }} />

      {NAV_ITEMS.map((item) => {
        const active = item.key === activeKey;

        return (
          <Tooltip key={item.key} title={t(`nav.${item.key}`)} placement="right" arrow>
            <ButtonBase
              component={RouterLink}
              href={item.path}
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1.5,
                position: 'relative',
                color: active ? 'primary.main' : 'text.secondary',
                transition: (theme) => theme.transitions.create('color'),
                '&:hover': { color: active ? 'primary.main' : 'text.primary' },
              }}
            >
              {active && (
                <Box
                  component={m.span}
                  layoutId="factory-nav-active"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  sx={{
                    inset: 0,
                    borderRadius: 1.5,
                    position: 'absolute',
                    bgcolor: 'background.paper',
                    boxShadow: (theme) => theme.customShadows.z8,
                  }}
                />
              )}
              <Badge
                color={item.badgeColor ?? 'default'}
                badgeContent={item.badge}
                sx={{
                  zIndex: 1,
                  '& .MuiBadge-badge': {
                    top: -2,
                    right: -4,
                    height: 16,
                    minWidth: 16,
                    fontSize: 10,
                    ...(!item.badgeColor && { color: 'background.paper', bgcolor: 'text.primary' }),
                  },
                }}
              >
                <Iconify icon={item.icon} width={20} />
              </Badge>
            </ButtonBase>
          </Tooltip>
        );
      })}

      <Box sx={{ flexGrow: 1 }} />

      <SettingsButton />

      <Tooltip title={`${CURRENT_USER.fullName} · ${CURRENT_USER.role}`} placement="right" arrow>
        <Avatar sx={{ width: 34, height: 34, fontSize: 14 }}>
          {CURRENT_USER.name.slice(0, 1)}
        </Avatar>
      </Tooltip>
    </Stack>
  );
}
