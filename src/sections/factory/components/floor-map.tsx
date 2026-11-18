import type { Theme, SxProps } from '@mui/material/styles';

import { useId } from 'react';
import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { keyframes } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';

import { greyTint } from '../styles';
import { drawPath } from '../motion';

import type { Tone } from '../_mock';

// ----------------------------------------------------------------------

/** พิกัดทั้งหมดอยู่บน viewBox 640 x 400 — marker แปลงเป็น % เพื่อวางเป็น HTML ทับ SVG */
const VIEW = { w: 640, h: 400 };

export const MAP_NODES = {
  warehouse: { x: 70, y: 320 },
  dryer: { x: 170, y: 320 },
  m07: { x: 205, y: 115 },
  m09: { x: 100, y: 150 },
  m12: { x: 325, y: 225 },
  trim: { x: 455, y: 300 },
  qc: { x: 565, y: 110 },
  fg: { x: 565, y: 320 },
};

const AISLES = [
  'M30 380 L70 320',
  'M215 250 L100 150 L60 60',
  'M335 70 L400 20',
  'M440 180 L455 300 L455 380',
  'M455 300 L565 320 L620 372',
  'M565 110 L620 60',
];

const ROUTE_IN = 'M70 320 L170 320 L215 250';
const ROUTE_SLOW = 'M215 250 L205 115 L335 70';
const ROUTE_SLOW_OUT = 'M335 70 L440 180';
const ROUTE_ALT = 'M215 250 L325 225 L440 180';
const ROUTE_OUT = 'M440 180 L565 110 L565 320';

const ZONES = [
  { key: 'warehouse', x: 44, y: 362 },
  { key: 'dryer', x: 150, y: 352 },
  { key: 'moldA', x: 238, y: 58 },
  { key: 'moldB', x: 300, y: 262 },
  { key: 'trim', x: 478, y: 290 },
  { key: 'qc', x: 508, y: 84 },
  { key: 'fg', x: 508, y: 352 },
];

const BLOCKS = [
  { x: 20, y: 250, w: 110, h: 130 },
  { x: 232, y: 20, w: 180, h: 120 },
  { x: 250, y: 240, w: 170, h: 130 },
  { x: 480, y: 140, w: 60, h: 130 },
  { x: 584, y: 150, w: 44, h: 150 },
];

const march = keyframes`
  to { stroke-dashoffset: -24; }
`;

// ----------------------------------------------------------------------

export type MapMarker = {
  id: string;
  x: number;
  y: number;
  icon: string;
  tone?: Tone | 'dark';
  pulse?: boolean;
  title?: string;
  sub?: string;
  subTone?: Tone;
  selected?: boolean;
  onClick?: () => void;
};

type Props = {
  /** flagged = เส้นทางเดิมมีช่วงช้า + ทางเลือกเป็นเส้นประ · approved = ทางเลือกกลายเป็นเส้นหลัก */
  state: 'flagged' | 'approved';
  markers: MapMarker[];
  legend?: boolean;
  toolbar?: boolean;
  sx?: SxProps<Theme>;
  children?: React.ReactNode;
};

/**
 * ผังโรงงานแบบ schematic — เส้นทางการไหลของงาน, ช่วงคอขวด และทางเลี่ยงที่ agent เสนอ
 * ไม่ใช้ mapbox (starter ไม่ได้ติดตั้ง) จึงวาดด้วย SVG ทั้งหมด
 */
export function FloorMap({ state, markers, legend, toolbar, sx, children }: Props) {
  const { t } = useTranslate('factory');

  const maskId = useId();

  const approved = state === 'approved';

  return (
    <Box
      sx={[
        {
          width: 1,
          overflow: 'hidden',
          borderRadius: 2.5,
          position: 'relative',
          bgcolor: greyTint(0.16),
          aspectRatio: `${VIEW.w} / ${VIEW.h}`,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box
        component={m.svg}
        initial="hidden"
        animate="show"
        viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
        sx={{ width: 1, height: 1, display: 'block', position: 'absolute', inset: 0 }}
      >
        <defs>
          <mask id={maskId}>
            <m.path
              d={ROUTE_ALT}
              fill="none"
              stroke="white"
              strokeWidth={10}
              variants={drawPath(1.3, 0.9)}
            />
          </mask>
        </defs>

        {BLOCKS.map((block) => (
          <Box
            key={`${block.x}-${block.y}`}
            component="rect"
            x={block.x}
            y={block.y}
            rx={14}
            width={block.w}
            height={block.h}
            sx={{ fill: greyTint(0.12) }}
          />
        ))}

        {ZONES.map((zone) => (
          <Box
            key={zone.key}
            component="text"
            x={zone.x}
            y={zone.y}
            sx={{ fontSize: 10, fill: (theme) => theme.vars.palette.text.disabled }}
          >
            {t(`map.zone.${zone.key}`)}
          </Box>
        ))}

        <Box
          component="g"
          sx={{
            fill: 'none',
            strokeWidth: 3,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            stroke: (theme) => theme.vars.palette.text.disabled,
          }}
        >
          {AISLES.map((d) => (
            <m.path key={d} d={d} variants={drawPath(0.2, 0.8)} />
          ))}
        </Box>

        <Box
          component="g"
          sx={{
            fill: 'none',
            strokeWidth: 3.5,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            stroke: (theme) => theme.vars.palette.text.primary,
          }}
        >
          <m.path d={ROUTE_IN} variants={drawPath(0.3, 0.6)} />
          <m.path d={ROUTE_SLOW_OUT} variants={drawPath(0.9, 0.4)} style={{ opacity: 0.9 }} />
          <m.path d={ROUTE_OUT} variants={drawPath(1.1, 0.7)} />
        </Box>

        <Box
          component={m.path}
          d={ROUTE_SLOW}
          variants={drawPath(0.6, 0.6)}
          sx={{
            fill: 'none',
            strokeWidth: 4.5,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            stroke: (theme) => theme.vars.palette.error.main,
          }}
        />

        {/* ทางเลือกของ agent: ก่อนอนุมัติเป็นเส้นประไหล · หลังอนุมัติเป็นเส้นทึบ */}
        <Box
          component="path"
          d={ROUTE_ALT}
          mask={`url(#${maskId})`}
          sx={{
            fill: 'none',
            strokeWidth: approved ? 5 : 3.5,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            transition: 'stroke-width 400ms',
            stroke: (theme) => theme.vars.palette.primary.main,
            ...(!approved && {
              strokeDasharray: '2 10',
              animation: `${march} 1.2s linear infinite`,
            }),
          }}
        />
      </Box>

      {markers.map((marker, index) => (
        <MapPin key={marker.id} marker={marker} index={index} />
      ))}

      {toolbar && (
        <Stack spacing={0.75} sx={{ top: 12, right: 12, position: 'absolute' }}>
          {[
            'solar:add-circle-linear',
            'solar:minus-circle-linear',
            'solar:gps-linear',
            'solar:layers-minimalistic-linear',
            'solar:full-screen-linear',
          ].map((icon) => (
            <IconButton
              key={icon}
              size="small"
              sx={{
                bgcolor: 'background.paper',
                boxShadow: (theme) => theme.customShadows.z1,
                '&:hover': { bgcolor: 'background.paper' },
              }}
            >
              <Iconify icon={icon} width={16} />
            </IconButton>
          ))}
        </Stack>
      )}

      {legend && (
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          sx={{
            left: 12,
            bottom: 12,
            py: 0.75,
            px: 1.5,
            borderRadius: 999,
            position: 'absolute',
            bgcolor: 'background.paper',
            boxShadow: (theme) => theme.customShadows.z1,
          }}
        >
          <LegendDot color="text.primary" label={t('map.legend.onPlan')} />
          <LegendDot color="error.main" label={t('map.legend.slow')} />
          <LegendDot color="primary.main" dashed label={t('map.legend.proposed')} />
        </Stack>
      )}

      {children}
    </Box>
  );
}

// ----------------------------------------------------------------------

function LegendDot({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
  return (
    <Stack direction="row" alignItems="center" spacing={0.75}>
      <Box
        sx={{
          width: dashed ? 14 : 7,
          height: dashed ? 0 : 7,
          borderRadius: '50%',
          bgcolor: dashed ? 'transparent' : color,
          ...(dashed && { borderRadius: 0, borderTop: '2px dotted', borderColor: color }),
        }}
      />
      <Typography variant="caption" sx={{ whiteSpace: 'nowrap' }}>
        {label}
      </Typography>
    </Stack>
  );
}

// ----------------------------------------------------------------------

function MapPin({ marker, index }: { marker: MapMarker; index: number }) {
  const tone = marker.tone ?? 'dark';

  const color = tone === 'dark' ? 'text.primary' : `${tone}.main`;

  return (
    <Box
      component={m.div}
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.9 + index * 0.08, type: 'spring', stiffness: 420, damping: 24 }}
      sx={{
        zIndex: marker.title ? 2 : 1,
        position: 'absolute',
        top: `${(marker.y / VIEW.h) * 100}%`,
        left: `${(marker.x / VIEW.w) * 100}%`,
      }}
    >
      <Box
        onClick={marker.onClick}
        sx={{
          width: 26,
          height: 26,
          display: 'grid',
          bgcolor: color,
          borderRadius: '50%',
          placeItems: 'center',
          position: 'absolute',
          color: 'background.paper',
          transform: 'translate(-50%, -50%)',
          cursor: marker.onClick ? 'pointer' : 'default',
          border: (theme) => `2px solid ${theme.vars.palette.background.paper}`,
          transition: (theme) => theme.transitions.create(['box-shadow', 'width', 'height']),
          ...(marker.selected && {
            width: 34,
            height: 34,
            boxShadow: (theme) => theme.customShadows.z12,
          }),
        }}
      >
        {marker.pulse && (
          <Box
            component={m.span}
            animate={{ scale: [1, 2.2], opacity: [0.7, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
            sx={{
              inset: -2,
              borderRadius: '50%',
              position: 'absolute',
              border: '2px solid',
              borderColor: color,
            }}
          />
        )}
        <Iconify icon={marker.icon} width={14} />
      </Box>

      {marker.title && (
        <Box
          sx={{
            top: -18,
            left: 20,
            py: 0.5,
            px: 1,
            borderRadius: 1.5,
            position: 'absolute',
            whiteSpace: 'nowrap',
            bgcolor: 'background.paper',
            boxShadow: (theme) => theme.customShadows.z8,
          }}
        >
          <Typography variant="caption" sx={{ display: 'block', fontWeight: 600, lineHeight: 1.4 }}>
            {marker.title}
          </Typography>
          {marker.sub && (
            <Typography
              variant="caption"
              sx={{ display: 'block', lineHeight: 1.4, color: `${marker.subTone ?? 'error'}.main` }}
            >
              {marker.sub}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
}
