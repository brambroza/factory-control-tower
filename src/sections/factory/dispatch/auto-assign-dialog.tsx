import { m } from 'framer-motion';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import { greyTint } from '../styles';
import { ASSIGN_MATCHES } from '../_mock';
import { BlurDialog } from '../components';
import { riseIn, stagger } from '../motion';

// ----------------------------------------------------------------------

const STATS = [
  { key: 'orders', value: '12' },
  { key: 'people', value: '9' },
  { key: 'walk', value: '−86 ม.' },
];

const COLUMNS = '32px minmax(0, 1.1fr) minmax(0, 1.2fr) minmax(0, 1.6fr) 88px';

type Props = {
  open: boolean;
  onClose: () => void;
  onAssign: () => void;
};

/** agent จับคู่ใบสั่งผลิตกับพนักงาน/เครื่อง — ผู้ใช้ติ๊กเลือกแล้วยืนยันครั้งเดียว */
export function AutoAssignDialog({ open, onClose, onAssign }: Props) {
  const { t } = useTranslate('factory');

  const [checked, setChecked] = useState<string[]>([]);

  // ติ๊กทีละแถวหลังเปิด เพื่อให้เห็นว่า agent "กำลังจับคู่"
  useEffect(() => {
    if (!open) {
      setChecked([]);
      return undefined;
    }

    const ready = ASSIGN_MATCHES.filter((match) => match.ok).map((match) => match.id);

    const timers = ready.map((id, index) =>
      setTimeout(() => setChecked((prev) => [...prev, id]), 700 + index * 160)
    );

    return () => timers.forEach(clearTimeout);
  }, [open]);

  const toggle = (id: string) =>
    setChecked((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));

  const total = checked.length + 7;

  return (
    <BlurDialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      agent="Dispatch Agent"
      title={t('assign.title', { count: 12 })}
      description={t('assign.description')}
      footNote={t('assign.audit')}
      actions={
        <>
          <Button variant="outlined" color="inherit" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button variant="contained" color="primary" onClick={onAssign} disabled={!checked.length}>
            {t('assign.confirm', { count: total })}
          </Button>
        </>
      }
    >
      <Box
        component={m.div}
        variants={stagger(0.2, 0.08)}
        initial="hidden"
        animate="show"
        sx={{ mb: 2, gap: 1.5, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}
      >
        {STATS.map((stat) => (
          <Box
            key={stat.key}
            component={m.div}
            variants={riseIn}
            sx={{ p: 1.5, borderRadius: 2, bgcolor: greyTint(0.1) }}
          >
            <Typography variant="overline" sx={{ fontSize: 10, color: 'text.disabled' }}>
              {t(`assign.stat.${stat.key}`)}
            </Typography>
            <Typography variant="h4">{stat.value}</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {t(`assign.stat.${stat.key}Note`)}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          px: 1,
          pb: 1,
          gap: 1.5,
          display: 'grid',
          color: 'text.disabled',
          gridTemplateColumns: COLUMNS,
          borderBottom: (theme) => `1px solid ${theme.vars.palette.divider}`,
        }}
      >
        <span />
        {['order', 'who', 'why', 'fit'].map((column) => (
          <Typography key={column} variant="overline" sx={{ fontSize: 10 }}>
            {t(`assign.col.${column}`)}
          </Typography>
        ))}
      </Box>

      <Box component={m.div} variants={stagger(0.45, 0.07)} initial="hidden" animate="show">
        {ASSIGN_MATCHES.map((match) => (
          <Box
            key={match.id}
            component={m.div}
            variants={riseIn}
            sx={{
              px: 1,
              py: 1,
              gap: 1.5,
              display: 'grid',
              alignItems: 'center',
              gridTemplateColumns: COLUMNS,
              borderBottom: (theme) => `1px solid ${theme.vars.palette.divider}`,
            }}
          >
            <Checkbox
              size="small"
              disabled={!match.ok}
              checked={checked.includes(match.id)}
              onChange={() => toggle(match.id)}
              sx={{ p: 0.5 }}
            />

            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle2" noWrap>
                {match.id}
              </Typography>
              <Typography
                variant="caption"
                noWrap
                sx={{ display: 'block', color: 'text.secondary' }}
              >
                {match.route}
              </Typography>
            </Box>

            <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0 }}>
              <Avatar sx={{ width: 26, height: 26, fontSize: 12 }}>{match.who.slice(0, 1)}</Avatar>
              <Typography variant="subtitle2" noWrap>
                {match.who}
              </Typography>
            </Stack>

            <Stack
              direction="row"
              alignItems="center"
              spacing={0.75}
              sx={{ minWidth: 0, color: match.ok ? 'text.secondary' : 'warning.dark' }}
            >
              {!match.ok && <Iconify icon="solar:danger-triangle-bold" width={16} />}
              <Typography variant="caption" noWrap>
                {match.why}
              </Typography>
            </Stack>

            {match.ok ? (
              <Label color="success">{match.fit}%</Label>
            ) : (
              <Button size="small" color="primary" sx={{ minWidth: 0 }}>
                {t('assign.book')}
              </Button>
            )}
          </Box>
        ))}
      </Box>

      <Button
        size="small"
        color="primary"
        endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
        sx={{ mt: 1 }}
      >
        {t('assign.more', { count: 7 })}
      </Button>
    </BlurDialog>
  );
}
