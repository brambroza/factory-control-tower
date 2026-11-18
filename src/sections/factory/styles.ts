import type { Theme } from '@mui/material/styles';

import { varAlpha } from 'src/theme/styles';

import type { Tone } from './_mock';

// ----------------------------------------------------------------------

/** พื้นสีจาง ๆ ของ semantic color — ใช้ใน `sx` ได้ตรง ๆ: `bgcolor: tint('primary', 0.08)` */
export const tint =
  (tone: Tone, opacity = 0.08) =>
  (theme: Theme) =>
    varAlpha(theme.vars.palette[tone].mainChannel, opacity);

export const greyTint =
  (opacity = 0.08) =>
  (theme: Theme) =>
    varAlpha(theme.vars.palette.grey['500Channel'], opacity);

/** ปุ่ม/ชิปทรง pill ของ module นี้ — ใส่ที่ root ของ layout และ dialog */
export const pillControls = {
  '& .MuiButton-root': { borderRadius: 999, whiteSpace: 'nowrap' },
  '& .MuiToggleButtonGroup-root': { borderRadius: 999 },
} as const;
