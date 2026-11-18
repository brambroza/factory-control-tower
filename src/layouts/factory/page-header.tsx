import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';

import { EASE } from 'src/sections/factory/motion';
import { AgentOrb } from 'src/sections/factory/components';
import { tint, greyTint } from 'src/sections/factory/styles';

// ----------------------------------------------------------------------

type Props = {
  /** เส้นทางเหนือหัวเรื่อง เช่น ['ปฏิบัติการ', 'จ่ายงานผลิต'] */
  crumbs: string[];
  title: string;
  subtitle?: string;
  back?: boolean;
  search?: boolean;
  monitor?: boolean;
  actions?: React.ReactNode;
};

/** หัวหน้าจอของ module factory: breadcrumb + ชื่อหน้า + ช่องค้นหา / สถานะ agent / ปุ่มหลัก */
export function PageHeader({ crumbs, title, subtitle, back, search, monitor, actions }: Props) {
  const { t } = useTranslate('factory');

  const router = useRouter();

  return (
    <Stack
      component={m.div}
      direction="row"
      alignItems="center"
      flexWrap="wrap"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      sx={{ mb: 2.5, rowGap: 1.5, columnGap: 1.5 }}
    >
      {back && (
        <IconButton onClick={router.back} sx={{ bgcolor: greyTint(0.12) }}>
          <Iconify icon="eva:arrow-back-fill" width={18} />
        </IconButton>
      )}

      <Box sx={{ mr: 'auto', minWidth: 0 }}>
        <Typography
          variant="overline"
          sx={{ display: 'block', fontSize: 10, color: 'text.disabled' }}
        >
          {crumbs.join(' / ')}
        </Typography>
        <Typography variant="h3" sx={{ lineHeight: 1.25 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {subtitle}
          </Typography>
        )}
      </Box>

      {search && (
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{
            px: 1.5,
            height: 40,
            width: 260,
            borderRadius: 999,
            bgcolor: greyTint(0.12),
            display: { xs: 'none', lg: 'flex' },
          }}
        >
          <Iconify icon="eva:search-fill" width={18} sx={{ color: 'text.disabled' }} />
          <InputBase placeholder={t('header.search')} sx={{ flexGrow: 1, typography: 'body2' }} />
          <Typography variant="caption" sx={{ color: 'text.disabled' }}>
            ⌘K
          </Typography>
        </Stack>
      )}

      {monitor && (
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{
            pl: 0.75,
            pr: 1.5,
            height: 40,
            borderRadius: 999,
            bgcolor: tint('primary', 0.08),
            display: { xs: 'none', sm: 'flex' },
          }}
        >
          <AgentOrb size={26} />
          <Typography variant="caption" sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
            {t('header.monitoring', { total: '1,284' })}
          </Typography>
          <Typography variant="caption" sx={{ color: 'primary.main', whiteSpace: 'nowrap' }}>
            {t('header.approvals', { count: 3 })}
          </Typography>
        </Stack>
      )}

      {actions}

      <IconButton sx={{ bgcolor: greyTint(0.12) }}>
        <Badge badgeContent={12} color="error">
          <Iconify icon="solar:bell-bold" width={18} />
        </Badge>
      </IconButton>

      <IconButton sx={{ bgcolor: greyTint(0.12) }}>
        <Iconify icon="solar:question-circle-bold" width={18} />
      </IconButton>
    </Stack>
  );
}
