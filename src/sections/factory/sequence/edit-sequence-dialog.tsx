import { m } from 'framer-motion';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import { tint } from '../styles';
import { BlurDialog } from '../components';
import { SEQUENCE_JOBS, SEQUENCE_META } from '../_mock';

// ----------------------------------------------------------------------

const ROW_HEIGHT = 44;

const AGENT_ORDER = SEQUENCE_JOBS.map((job) => job.id);

type Props = {
  open: boolean;
  /** ลำดับปัจจุบัน (id ของงาน) */
  order: string[];
  onClose: () => void;
  onSave: (order: string[]) => void;
};

/**
 * แก้ลำดับงานด้วยการลากแถว — ปล่อยแล้วแถวอื่นเลื่อนเข้าที่ด้วย layout animation
 * (ไม่ใช้ `Reorder` ของ framer-motion เพราะใช้ `motion` ภายใน ซึ่งชนกับ LazyMotion strict ของ starter)
 */
export function EditSequenceDialog({ open, order, onClose, onSave }: Props) {
  const { t } = useTranslate('factory');

  const [draft, setDraft] = useState(order);

  const [dragging, setDragging] = useState<string | null>(null);

  useEffect(() => {
    if (open) setDraft(order);
  }, [open, order]);

  const changed = draft.some((id, index) => id !== AGENT_ORDER[index]);

  const handleDrop = (id: string, offsetY: number) => {
    setDragging(null);

    setDraft((prev) => {
      const from = prev.indexOf(id);
      const to = Math.max(0, Math.min(prev.length - 1, from + Math.round(offsetY / ROW_HEIGHT)));

      if (from === to) return prev;

      const next = [...prev];
      next.splice(to, 0, next.splice(from, 1)[0]);

      return next;
    });
  };

  return (
    <BlurDialog
      open={open}
      onClose={onClose}
      agent="Planning Agent"
      title={t('edit.title', { id: SEQUENCE_META.id })}
      description={t('edit.description')}
      footNote={t('edit.footNote', { name: SEQUENCE_META.operator.split(' ')[0] })}
      actions={
        <>
          <Button variant="outlined" color="inherit" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button variant="contained" color="primary" onClick={() => onSave(draft)}>
            {t('edit.save')}
          </Button>
        </>
      }
    >
      {changed && (
        <Stack
          component={m.div}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{
            mb: 1.5,
            overflow: 'hidden',
            borderRadius: 1.5,
            color: 'warning.dark',
            bgcolor: tint('warning', 0.12),
          }}
        >
          <Iconify icon="solar:danger-triangle-bold" width={16} sx={{ ml: 1.5, my: 1 }} />
          <Typography variant="caption" sx={{ pr: 1.5 }}>
            {t('edit.warning')}
          </Typography>
        </Stack>
      )}

      <Box sx={{ borderRadius: 2, border: (theme) => `1px solid ${theme.vars.palette.divider}` }}>
        {draft.map((id, index) => {
          const job = SEQUENCE_JOBS.find((item) => item.id === id)!;
          const active = dragging === id;
          const moved = AGENT_ORDER[index] !== id;

          return (
            <Stack
              key={id}
              layout
              component={m.div}
              drag="y"
              dragSnapToOrigin
              dragElastic={0.1}
              dragMomentum={false}
              onDragStart={() => setDragging(id)}
              onDragEnd={(_event, info) => handleDrop(id, info.offset.y)}
              whileDrag={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 520, damping: 40 }}
              direction="row"
              alignItems="center"
              spacing={1.5}
              sx={{
                px: 1.5,
                height: ROW_HEIGHT,
                cursor: 'grab',
                position: 'relative',
                bgcolor: 'background.paper',
                zIndex: active ? 2 : 1,
                borderBottom: (theme) => `1px solid ${theme.vars.palette.divider}`,
                ...(active && {
                  cursor: 'grabbing',
                  borderRadius: 1.5,
                  boxShadow: (theme) =>
                    `0 0 0 1.5px ${theme.vars.palette.primary.main}, ${theme.customShadows.z12}`,
                }),
              }}
            >
              <Iconify
                icon="solar:sort-vertical-bold"
                width={16}
                sx={{ color: active ? 'primary.main' : 'text.disabled' }}
              />

              <Box
                sx={{
                  width: 22,
                  height: 22,
                  flexShrink: 0,
                  display: 'grid',
                  borderRadius: '50%',
                  placeItems: 'center',
                  typography: 'caption',
                  bgcolor: 'background.neutral',
                  ...(active && { bgcolor: 'primary.main', color: 'primary.contrastText' }),
                }}
              >
                {index + 1}
              </Box>

              <Typography variant="subtitle2" noWrap sx={{ flexGrow: 1 }}>
                {job.name}
              </Typography>

              {moved && (
                <Label color="warning" startIcon={<Iconify icon="solar:danger-triangle-bold" />}>
                  {t('edit.moved')}
                </Label>
              )}

              <Typography variant="caption" noWrap sx={{ color: 'text.secondary' }}>
                {job.window}
              </Typography>

              <Typography variant="caption" sx={{ width: 40, fontWeight: 600, textAlign: 'right' }}>
                {SEQUENCE_JOBS[index].eta}
              </Typography>
            </Stack>
          );
        })}

        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          sx={{ px: 1.5, height: ROW_HEIGHT, color: 'text.secondary' }}
        >
          <Iconify icon="solar:garage-bold" width={16} />
          <Typography variant="body2" sx={{ flexGrow: 1 }}>
            {SEQUENCE_META.end}
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            {SEQUENCE_META.endTime}
          </Typography>
        </Stack>
      </Box>

      <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
        <Button size="small" color="primary" startIcon={<Iconify icon="mingcute:add-line" />}>
          {t('edit.addJob')}
        </Button>
        <Button
          size="small"
          color="primary"
          disabled={!changed}
          onClick={() => setDraft(AGENT_ORDER)}
          startIcon={<Iconify icon="solar:magic-stick-3-bold" />}
        >
          {t('edit.useAgent', { total: SEQUENCE_META.optimizedTotal })}
        </Button>
      </Stack>
    </BlurDialog>
  );
}
