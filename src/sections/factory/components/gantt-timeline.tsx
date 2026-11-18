import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { EASE } from '../motion';
import { greyTint } from '../styles';

import type { TimelineBlock } from '../_mock';

// ----------------------------------------------------------------------

type Row = { name: string; sub: string; blocks: TimelineBlock[] };

type Props = {
  rows: Row[];
  hours: number[];
  /** เวลาปัจจุบันเป็นชั่วโมงทศนิยม เช่น 11.97 */
  now: number;
  nowLabel: string;
  headLabel: string;
};

const NAME_WIDTH = 132;

const pad = (value: number) => String(value).padStart(2, '0');

/**
 * ตารางเวลาเครื่อง/คน แบบ gantt แถวสั้น — block เส้นประคือสิ่งที่ agent เสนอ (ยังไม่มีผล)
 */
export function GanttTimeline({ rows, hours, now, nowLabel, headLabel }: Props) {
  const start = hours[0];
  const span = hours[hours.length - 1] - start;

  const toPercent = (hour: number) => ((hour - start) / span) * 100;

  return (
    <Box sx={{ position: 'relative' }}>
      <Stack direction="row" alignItems="center" sx={{ mb: 1.5 }}>
        <Typography variant="overline" sx={{ width: NAME_WIDTH, color: 'text.disabled' }}>
          {headLabel}
        </Typography>

        <Box sx={{ height: 20, flexGrow: 1, position: 'relative' }}>
          {hours.map((hour) => (
            <Typography
              key={hour}
              variant="caption"
              sx={{
                top: 0,
                position: 'absolute',
                color: 'text.disabled',
                left: `${toPercent(hour)}%`,
                transform: 'translateX(-50%)',
              }}
            >
              {pad(hour)}:00
            </Typography>
          ))}

          <Box
            component={m.div}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, type: 'spring', stiffness: 400, damping: 24 }}
            sx={{
              top: -2,
              zIndex: 2,
              position: 'absolute',
              left: `${toPercent(now)}%`,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                px: 1,
                py: 0.25,
                display: 'block',
                fontWeight: 600,
                borderRadius: 999,
                bgcolor: 'primary.main',
                transform: 'translateX(-50%)',
                color: 'primary.contrastText',
              }}
            >
              {nowLabel}
            </Typography>
          </Box>
        </Box>
      </Stack>

      <Stack spacing={1.25}>
        {rows.map((row, rowIndex) => (
          <Stack key={row.name} direction="row" alignItems="center">
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ width: NAME_WIDTH, flexShrink: 0 }}
            >
              <Avatar sx={{ width: 28, height: 28, fontSize: 12 }}>{row.name.slice(0, 1)}</Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="caption" noWrap sx={{ display: 'block', fontWeight: 600 }}>
                  {row.name}
                </Typography>
                <Typography
                  variant="caption"
                  noWrap
                  sx={{ display: 'block', color: 'text.disabled' }}
                >
                  {row.sub}
                </Typography>
              </Box>
            </Stack>

            <Box sx={{ height: 28, flexGrow: 1, position: 'relative' }}>
              {row.blocks.map((block, blockIndex) => (
                <Box
                  key={block.label}
                  component={m.div}
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{
                    duration: 0.6,
                    ease: EASE,
                    delay: 0.4 + rowIndex * 0.12 + blockIndex * 0.1,
                  }}
                  sx={{
                    top: 0,
                    px: 1.25,
                    height: 28,
                    display: 'flex',
                    borderRadius: 999,
                    overflow: 'hidden',
                    position: 'absolute',
                    alignItems: 'center',
                    transformOrigin: 'left center',
                    left: `${toPercent(block.start)}%`,
                    width: `${toPercent(block.end) - toPercent(block.start)}%`,
                    ...(block.tone === 'done' && {
                      color: 'text.secondary',
                      bgcolor: greyTint(0.2),
                    }),
                    ...(block.tone === 'primary' && {
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                    }),
                    ...(block.tone === 'error' && {
                      bgcolor: 'error.main',
                      color: 'error.contrastText',
                    }),
                    ...(block.tone === 'ghost' && {
                      color: 'primary.main',
                      border: (theme) => `1.5px dashed ${theme.vars.palette.primary.main}`,
                    }),
                  }}
                >
                  <Typography variant="caption" noWrap sx={{ fontWeight: 600 }}>
                    {block.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Stack>
        ))}
      </Stack>

      {/* now line */}
      <Box
        component={m.div}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 1, duration: 0.5, ease: EASE }}
        sx={{
          top: 20,
          bottom: 0,
          width: 2,
          zIndex: 1,
          position: 'absolute',
          bgcolor: 'primary.main',
          transformOrigin: 'top center',
          left: `calc(${NAME_WIDTH}px + (100% - ${NAME_WIDTH}px) * ${toPercent(now) / 100})`,
        }}
      />
    </Box>
  );
}
