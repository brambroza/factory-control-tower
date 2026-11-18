import type { Theme, SxProps } from '@mui/material/styles';

import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

// ----------------------------------------------------------------------

type Props = { sx?: SxProps<Theme> };

const HOT_SPOTS = [
  { cx: 96, cy: 96 },
  { cx: 252, cy: 110 },
  { cx: 322, cy: 86 },
];

/**
 * ภาพประกอบเครื่องฉีดพลาสติก (วาดเองด้วย SVG — สีอ่านจาก theme จึงตาม dark mode / preset)
 * จุดสีดำ = sensor ที่ agent อ่านค่า · จุด primary ที่เต้น = ตำแหน่งที่ผิดปกติ (แม่พิมพ์)
 */
export function MachineArt({ sx }: Props) {
  const theme = useTheme();

  const { grey } = theme.vars.palette;
  const { paper } = theme.vars.palette.background;
  const primary = theme.vars.palette.primary.main;
  const ink = theme.vars.palette.text.primary;

  return (
    <Box component="svg" viewBox="0 0 420 210" sx={{ width: 1, display: 'block', ...sx }}>
      {/* floor shadow */}
      <ellipse cx="210" cy="192" rx="190" ry="10" fill={grey[500]} opacity="0.18" />

      {/* feet */}
      <rect x="44" y="176" width="26" height="12" rx="3" fill={grey[600]} />
      <rect x="196" y="176" width="26" height="12" rx="3" fill={grey[600]} />
      <rect x="350" y="176" width="26" height="12" rx="3" fill={grey[600]} />

      {/* base */}
      <rect x="24" y="132" width="372" height="48" rx="10" fill={grey[300]} />
      <rect x="24" y="132" width="372" height="14" rx="7" fill={grey[400]} opacity="0.6" />
      <rect x="44" y="154" width="64" height="14" rx="4" fill={grey[400]} />
      <rect x="290" y="154" width="86" height="14" rx="4" fill={grey[400]} />

      {/* clamping unit */}
      <rect
        x="32"
        y="52"
        width="158"
        height="84"
        rx="12"
        fill={paper}
        stroke={grey[300]}
        strokeWidth="2"
      />
      <rect x="48" y="68" width="92" height="52" rx="8" fill={grey[800]} opacity="0.88" />
      <rect x="56" y="76" width="34" height="36" rx="4" fill={grey[600]} />
      <rect x="96" y="76" width="34" height="36" rx="4" fill={grey[500]} />
      <rect x="150" y="80" width="6" height="30" rx="3" fill={grey[400]} />

      {/* control panel */}
      <rect x="148" y="20" width="60" height="40" rx="8" fill={grey[800]} />
      <rect x="156" y="28" width="30" height="18" rx="3" fill={primary} opacity="0.9" />
      <circle cx="197" cy="32" r="3" fill={grey[500]} />
      <circle cx="197" cy="43" r="3" fill={grey[500]} />
      <rect x="172" y="58" width="8" height="12" fill={grey[600]} />

      {/* platen */}
      <rect x="186" y="62" width="18" height="74" rx="4" fill={grey[600]} />

      {/* barrel + nozzle */}
      <rect x="204" y="90" width="20" height="18" rx="3" fill={grey[500]} />
      <rect x="222" y="84" width="124" height="30" rx="8" fill={grey[400]} />
      {[240, 262, 284, 306].map((x) => (
        <rect key={x} x={x} y="84" width="10" height="30" fill={grey[500]} opacity="0.7" />
      ))}

      {/* hopper */}
      <path d="M268 84 L254 44 L304 44 L290 84 Z" fill={paper} stroke={grey[300]} strokeWidth="2" />
      <rect x="250" y="36" width="58" height="10" rx="4" fill={grey[400]} />

      {/* motor */}
      <rect
        x="344"
        y="66"
        width="52"
        height="66"
        rx="10"
        fill={paper}
        stroke={grey[300]}
        strokeWidth="2"
      />
      <rect x="356" y="80" width="28" height="6" rx="3" fill={grey[400]} />
      <rect x="356" y="92" width="28" height="6" rx="3" fill={grey[400]} />
      <rect x="356" y="104" width="28" height="6" rx="3" fill={grey[400]} />

      {/* sensors */}
      {HOT_SPOTS.map((spot) => (
        <g key={spot.cx}>
          <circle cx={spot.cx} cy={spot.cy} r="6" fill={paper} opacity="0.7" />
          <circle cx={spot.cx} cy={spot.cy} r="3.5" fill={ink} />
        </g>
      ))}

      {/* anomaly at mold */}
      <m.circle
        cx="195"
        cy="100"
        r="7"
        fill="none"
        stroke={primary}
        strokeWidth="2"
        animate={{ scale: [1, 2.4], opacity: [0.9, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
      />
      <circle cx="195" cy="100" r="6" fill={paper} />
      <circle cx="195" cy="100" r="4" fill={primary} />
    </Box>
  );
}
