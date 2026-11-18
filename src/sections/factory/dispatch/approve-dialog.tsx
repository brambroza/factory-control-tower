import { m } from 'framer-motion';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import { tint, greyTint } from '../styles';
import { riseIn, stagger } from '../motion';
import { FOCUS_ORDER, APPROVE_IMPACT } from '../_mock';
import { BlurDialog, ApprovedStamp } from '../components';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  /** เรียกหลังตราประทับแสดงครบแล้ว — ให้หน้า parent ปิด dialog / เปลี่ยนหน้า */
  onApproved: () => void;
};

/** ยืนยันย้ายใบสั่งผลิตไปเครื่องที่ agent เสนอ — เทียบเวลาเดิมกับเวลาใหม่ + ผลกระทบ */
export function ApproveDialog({ open, onClose, onApproved }: Props) {
  const { t } = useTranslate('factory');

  const [approved, setApproved] = useState(false);

  const order = FOCUS_ORDER;

  useEffect(() => {
    if (open) setApproved(false);
  }, [open]);

  useEffect(() => {
    if (!approved) return undefined;

    const timer = setTimeout(onApproved, 1200);

    return () => clearTimeout(timer);
  }, [approved, onApproved]);

  return (
    <BlurDialog
      open={open}
      onClose={onClose}
      agent="Planning Agent"
      title={t('approve.title')}
      description={t('approve.description', {
        id: order.id,
        from: order.machine,
        to: order.altMachine,
        count: order.delayMin,
      })}
      actions={
        <>
          <Button
            variant="outlined"
            color="error"
            disabled={approved}
            onClick={onClose}
            startIcon={<Iconify icon="mingcute:close-line" />}
            sx={{ mr: 'auto' }}
          >
            {t('approve.reject')}
          </Button>
          <Button variant="outlined" color="inherit" disabled={approved}>
            {t('approve.details')}
          </Button>
          <Button
            variant="contained"
            color="inherit"
            disabled={approved}
            onClick={() => setApproved(true)}
            startIcon={<Iconify icon="eva:checkmark-fill" />}
          >
            {t('approve.confirm')}
          </Button>
        </>
      }
    >
      <Box sx={{ position: 'relative' }}>
        <Box sx={{ gap: 1.5, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
          <Box sx={{ p: 2, borderRadius: 2, bgcolor: greyTint(0.1) }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {t('approve.current', { machine: order.machine })}
            </Typography>
            <Typography variant="h4" sx={{ my: 0.5 }}>
              {order.etaNow}
            </Typography>
            <Label color="error">{t('approve.misses')}</Label>
          </Box>

          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: tint('primary', 0.08),
              border: (theme) => `1.5px solid ${theme.vars.palette.primary.main}`,
            }}
          >
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {t('approve.proposed', { machine: order.altMachine })}
            </Typography>
            <Typography variant="h4" sx={{ my: 0.5 }}>
              {order.etaAlt}
            </Typography>
            <Label color="success">{t('hero.inWindow')}</Label>
          </Box>
        </Box>

        {approved && <ApprovedStamp label={t('approve.stamp')} />}
      </Box>

      <Stack
        component={m.div}
        variants={stagger(0.35, 0.09)}
        initial="hidden"
        animate="show"
        sx={{ mt: 1.5 }}
      >
        {APPROVE_IMPACT.map((row) => (
          <Stack
            key={row.key}
            component={m.div}
            variants={riseIn}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
            sx={{ py: 1.25, borderBottom: (theme) => `1px solid ${theme.vars.palette.divider}` }}
          >
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t(`approve.impact.${row.key}`)}
            </Typography>
            <Typography variant="subtitle2" sx={{ textAlign: 'right' }}>
              {row.value}
            </Typography>
          </Stack>
        ))}

        <Stack
          component={m.div}
          variants={riseIn}
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{
            mt: 1.5,
            py: 1,
            px: 1.5,
            borderRadius: 1.5,
            color: 'text.secondary',
            bgcolor: greyTint(0.08),
          }}
        >
          <Iconify icon="solar:shield-check-bold" width={16} />
          <Typography variant="caption">{t('approve.audit')}</Typography>
        </Stack>
      </Stack>
    </BlurDialog>
  );
}
