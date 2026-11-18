import type { DialogProps } from '@mui/material/Dialog';

import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

import { EASE } from '../motion';
import { AgentOrb } from './agent';
import { tint, greyTint, pillControls } from '../styles';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  /** ชื่อ agent ที่เป็นเจ้าของ dialog — แสดงเป็น chip มุมบนซ้าย */
  agent?: string;
  /** ข้อความเล็กมุมล่างซ้าย เช่น "บันทึกลง audit trail" */
  footNote?: string;
  actions?: React.ReactNode;
  maxWidth?: DialogProps['maxWidth'];
  children?: React.ReactNode;
};

/**
 * Dialog มาตรฐานของ module factory: ฉากหลังเบลอ + กล่องขยายเข้าพร้อมคลาย blur
 * (Paper ของ MUI ถูกทำให้โปร่งใส แล้วให้ `m.div` ด้านในเป็นกล่องจริง เพื่อคุม motion เอง)
 */
export function BlurDialog({
  open,
  onClose,
  title,
  description,
  agent,
  footNote,
  actions,
  maxWidth = 'sm',
  children,
}: Props) {
  return (
    <Dialog
      fullWidth
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      slotProps={{
        backdrop: { sx: { bgcolor: greyTint(0.4), backdropFilter: 'blur(10px)' } },
      }}
      PaperProps={{ sx: { overflow: 'visible', boxShadow: 'none', bgcolor: 'transparent' } }}
    >
      <Box
        component={m.div}
        initial={{ opacity: 0, scale: 0.92, y: 20, filter: 'blur(10px)' }}
        animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.45, ease: EASE }}
        sx={{
          display: 'flex',
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative',
          flexDirection: 'column',
          bgcolor: 'background.paper',
          maxHeight: 'calc(100vh - 64px)',
          boxShadow: (theme) => theme.customShadows.dialog,
          ...pillControls,
        }}
      >
        <Box sx={{ p: 3, pb: 2 }}>
          <Stack direction="row" alignItems="center" sx={{ mb: 1.5, minHeight: 28 }}>
            {agent && (
              <Stack
                direction="row"
                alignItems="center"
                spacing={0.75}
                sx={{
                  py: 0.25,
                  pl: 0.5,
                  pr: 1.25,
                  borderRadius: 999,
                  bgcolor: tint('primary', 0.1),
                }}
              >
                <AgentOrb size={18} />
                <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600 }}>
                  {agent}
                </Typography>
              </Stack>
            )}

            <IconButton size="small" onClick={onClose} sx={{ ml: 'auto' }}>
              <Iconify icon="mingcute:close-line" width={18} />
            </IconButton>
          </Stack>

          <Typography variant="h4">{title}</Typography>

          {description && (
            <Typography variant="body2" sx={{ mt: 0.75, color: 'text.secondary' }}>
              {description}
            </Typography>
          )}
        </Box>

        <Box sx={{ px: 3, pb: 2.5, overflowY: 'auto' }}>{children}</Box>

        {(actions || footNote) && (
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ px: 3, py: 2, borderTop: (theme) => `1px solid ${theme.vars.palette.divider}` }}
          >
            {footNote && (
              <Stack
                direction="row"
                alignItems="center"
                spacing={0.75}
                sx={{ color: 'text.secondary' }}
              >
                <Iconify icon="solar:shield-check-bold" width={16} />
                <Typography variant="caption">{footNote}</Typography>
              </Stack>
            )}
            <Box sx={{ flexGrow: 1 }} />
            {actions}
          </Stack>
        )}
      </Box>
    </Dialog>
  );
}

// ----------------------------------------------------------------------

/** ตราประทับ "อนุมัติแล้ว" ที่กระแทกลงมา — วางใน container ที่ `position: relative` */
export function ApprovedStamp({ label }: { label: string }) {
  return (
    <Box
      sx={{
        inset: 0,
        zIndex: 2,
        display: 'grid',
        placeItems: 'center',
        position: 'absolute',
        pointerEvents: 'none',
      }}
    >
      <Stack
        component={m.div}
        direction="row"
        alignItems="center"
        spacing={1}
        initial={{ scale: 2.6, opacity: 0, rotate: -18 }}
        animate={{ scale: 1, opacity: 1, rotate: -6 }}
        transition={{ type: 'spring', stiffness: 520, damping: 22 }}
        sx={{
          py: 0.5,
          px: 2,
          borderRadius: 1.5,
          color: 'success.dark',
          bgcolor: 'background.paper',
          border: (theme) => `3px solid ${theme.vars.palette.success.main}`,
        }}
      >
        <Iconify icon="eva:checkmark-fill" width={24} />
        <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: 3 }}>
          {label}
        </Typography>
      </Stack>
    </Box>
  );
}
