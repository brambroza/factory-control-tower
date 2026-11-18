import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

import { EASE } from '../motion';
import { AgentOrb } from './agent';
import { greyTint } from '../styles';

// ----------------------------------------------------------------------

export type Stage = { label: string; time: string; at: number; slow?: boolean };

type Props = {
  stages: Stage[];
  /** ข้อความบน pill เหนือจุดปัจจุบัน เช่น "ย้ายไป M-12" */
  detourLabel: string;
  detourNote: string;
  /** อนุมัติย้ายแล้ว → ปลายทางเปลี่ยนเป็นเวลาใหม่สีเขียว */
  rerouted?: boolean;
  reroutedEta?: string;
};

const LINE_TOP = 52;

/**
 * เส้นความคืบหน้าของงานตามสถานี + ช่วงที่ช้า (แดง) + ทางเลี่ยงที่ agent เสนอ (เส้นประโค้ง)
 */
export function StageTrack({ stages, detourLabel, detourNote, rerouted, reroutedEta }: Props) {
  const currentIndex = stages.findIndex((stage) => stage.slow);
  const current = stages[currentIndex];
  const next = stages[currentIndex + 1];
  const slowEnd = current.at + (next.at - current.at) * 0.55;

  return (
    <Box sx={{ mx: 1, height: 104, position: 'relative' }}>
      {/* base line */}
      <Box
        sx={{
          left: 0,
          right: 0,
          height: 3,
          top: LINE_TOP,
          borderRadius: 2,
          position: 'absolute',
          bgcolor: greyTint(0.24),
        }}
      />

      {/* done */}
      <Box
        component={m.div}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
        sx={{
          left: 0,
          height: 3,
          top: LINE_TOP,
          borderRadius: 2,
          position: 'absolute',
          width: `${current.at}%`,
          bgcolor: 'text.primary',
          transformOrigin: 'left center',
        }}
      />

      {/* slow segment */}
      <Box
        component={m.div}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, delay: 1.1, ease: EASE }}
        sx={{
          height: 3,
          top: LINE_TOP,
          borderRadius: 2,
          position: 'absolute',
          left: `${current.at}%`,
          bgcolor: 'error.main',
          transformOrigin: 'left center',
          width: `${slowEnd - current.at}%`,
        }}
      />

      {/* detour arc — เผยจากซ้ายไปขวาด้วย clip-path (เส้นประใช้ pathLength ไม่ได้) */}
      <Box
        component={m.div}
        initial={{ clipPath: 'inset(0 100% 0 0)' }}
        animate={{ clipPath: 'inset(0 0% 0 0)' }}
        transition={{ duration: 0.9, delay: 1.5, ease: EASE }}
        sx={{
          height: 30,
          top: LINE_TOP - 29,
          position: 'absolute',
          left: `${current.at}%`,
          width: `${next.at - current.at}%`,
        }}
      >
        <Box
          component="svg"
          viewBox="0 0 100 30"
          preserveAspectRatio="none"
          sx={{ width: 1, height: 30, display: 'block', color: 'primary.main' }}
        >
          <path
            d="M0 30 Q 50 -22 100 30"
            fill="none"
            strokeWidth={2}
            stroke="currentColor"
            strokeDasharray="1 5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </Box>
      </Box>

      {/* detour pill */}
      <Stack
        component={m.div}
        direction="row"
        alignItems="center"
        spacing={0.75}
        initial={{ opacity: 0, y: 8, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 1.9, type: 'spring', stiffness: 380, damping: 24 }}
        sx={{
          top: 0,
          py: 0.5,
          pl: 0.5,
          pr: 1.25,
          borderRadius: 999,
          position: 'absolute',
          whiteSpace: 'nowrap',
          bgcolor: 'background.paper',
          left: `${current.at}%`,
          boxShadow: (theme) => theme.customShadows.z4,
        }}
      >
        <AgentOrb size={20} />
        <Typography variant="caption" sx={{ fontWeight: 600 }}>
          {detourLabel}
        </Typography>
        <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600 }}>
          {detourNote}
        </Typography>
      </Stack>

      {/* stops */}
      {stages.map((stage, index) => {
        const isCurrent = index === currentIndex;
        const isLast = index === stages.length - 1;
        const passed = index <= currentIndex;

        return (
          <Box
            key={stage.label}
            component={m.div}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.12, duration: 0.4 }}
            sx={{ top: LINE_TOP, position: 'absolute', left: `${stage.at}%` }}
          >
            <Box
              sx={{
                top: 1.5,
                width: 9,
                height: 9,
                borderRadius: '50%',
                position: 'absolute',
                bgcolor: 'text.primary',
                transform: 'translate(-50%, -50%)',
                border: (theme) => `2px solid ${theme.vars.palette.background.neutral}`,
                ...(!passed && {
                  bgcolor: 'background.paper',
                  border: (theme) => `2px solid ${theme.vars.palette.text.disabled}`,
                }),
                ...(isCurrent && {
                  width: 30,
                  height: 30,
                  display: 'grid',
                  placeItems: 'center',
                  color: 'background.paper',
                  border: (theme) => `3px solid ${theme.vars.palette.background.paper}`,
                  boxShadow: (theme) => theme.customShadows.z8,
                }),
              }}
            >
              {isCurrent && <Iconify icon="solar:settings-minimalistic-bold" width={14} />}
            </Box>

            <Box
              sx={{
                top: 20,
                position: 'absolute',
                whiteSpace: 'nowrap',
                transform: 'translateX(-50%)',
                textAlign: 'center',
                ...(index === 0 && { transform: 'none', textAlign: 'left' }),
                ...(isLast && { transform: 'translateX(-100%)', textAlign: 'right' }),
              }}
            >
              <Typography variant="caption" sx={{ display: 'block', fontWeight: 600 }}>
                {stage.label}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  color: 'text.secondary',
                  ...(stage.slow && { color: 'error.main' }),
                  ...(isLast && {
                    fontWeight: 600,
                    color: rerouted ? 'success.main' : 'warning.dark',
                  }),
                }}
              >
                {isLast && rerouted && reroutedEta ? reroutedEta : stage.time}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
