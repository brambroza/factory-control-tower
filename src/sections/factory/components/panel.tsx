import type { Theme, SxProps } from '@mui/material/styles';

import { m } from 'framer-motion';
import { forwardRef } from 'react';

import Box from '@mui/material/Box';

import { tint } from '../styles';
import { riseIn } from '../motion';

// ----------------------------------------------------------------------

type PanelProps = {
  /** neutral = พื้นเทา (card ชั้นนอก) · paper = พื้นขาว (card ชั้นใน) · agent = พื้นสี primary จาง (ข้อเสนอจาก AI) */
  tone?: 'neutral' | 'paper' | 'agent';
  /**
   * false = ไม่ผูก variants — ใช้เมื่อ Panel อยู่ใต้ `AnimatePresence` หรือ wrapper ที่คุม motion เอง
   * (ไม่อย่างนั้นจะค้างที่สถานะ hidden เพราะไม่มี parent ส่งสัญญาณ show ให้)
   */
  animated?: boolean;
  sx?: SxProps<Theme>;
  children?: React.ReactNode;
  onClick?: () => void;
};

/**
 * พื้นผิว card ของ module factory — เข้าจอด้วย `riseIn` เมื่ออยู่ใต้ parent ที่มี variants `stagger()`
 */
export const Panel = forwardRef<HTMLDivElement, PanelProps>(
  ({ tone = 'neutral', animated = true, sx, children, onClick }, ref) => (
    <Box
      ref={ref}
      component={m.div}
      variants={animated ? riseIn : undefined}
      onClick={onClick}
      sx={[
        { p: 2.5, minWidth: 0, borderRadius: 3, bgcolor: 'background.neutral' },
        tone === 'agent' && { bgcolor: tint('primary', 0.1) },
        tone === 'paper' && {
          p: 2,
          borderRadius: 2.5,
          bgcolor: 'background.paper',
          boxShadow: (theme) => theme.customShadows.z1,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Box>
  )
);
