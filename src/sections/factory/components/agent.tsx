import type { Theme, SxProps } from '@mui/material/styles';

import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { stylesMode } from 'src/theme/styles';

// ----------------------------------------------------------------------

type AgentOrbProps = { size?: number; sx?: SxProps<Theme> };

/** สัญลักษณ์ AI agent — วงแหวนเต้นช้า ๆ เพื่อบอกว่า "กำลังเฝ้าดู" */
export function AgentOrb({ size = 24, sx }: AgentOrbProps) {
  return (
    <Box
      sx={[
        {
          width: size,
          height: size,
          flexShrink: 0,
          display: 'grid',
          borderRadius: '50%',
          placeItems: 'center',
          bgcolor: 'grey.800',
          [stylesMode.dark]: { bgcolor: 'grey.700' },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box
        component={m.span}
        animate={{ scale: [1, 1.25, 1], opacity: [1, 0.55, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        sx={{
          width: '46%',
          height: '46%',
          borderRadius: '50%',
          border: (theme) => `2px solid ${theme.vars.palette.primary.light}`,
        }}
      />
    </Box>
  );
}

// ----------------------------------------------------------------------

type AgentTagProps = { label: string; note?: string; size?: number; sx?: SxProps<Theme> };

/** หัวข้อของ block ที่มาจาก agent: orb + ชื่อ agent + หมายเหตุ (เช่น ความมั่นใจ) */
export function AgentTag({ label, note, size = 22, sx }: AgentTagProps) {
  return (
    <Stack direction="row" alignItems="center" spacing={1} sx={sx}>
      <AgentOrb size={size} />
      <Typography variant="overline" sx={{ color: 'primary.main', lineHeight: 1.2 }}>
        {label}
      </Typography>
      {note && (
        <Typography variant="caption" sx={{ color: 'text.disabled', lineHeight: 1.2 }}>
          · {note}
        </Typography>
      )}
    </Stack>
  );
}
