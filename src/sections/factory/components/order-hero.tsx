import { m, AnimatePresence } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import { Panel } from './panel';
import { popIn } from '../motion';
import { AgentTag } from './agent';
import { StageTrack } from './stage-track';
import { MachineArt } from './machine-art';
import { STAGES, FOCUS_ORDER } from '../_mock';

// ----------------------------------------------------------------------

type Props = {
  /** อนุมัติย้ายเครื่องแล้ว → หัวการ์ดเปลี่ยนเป็น "ประหยัดเวลา" และ ETA เดิมถูกเบลอออก */
  rerouted?: boolean;
};

/**
 * การ์ดหลักของใบสั่งผลิตที่ agent ปักธง: ภาพเครื่อง + ค่าที่อ่านจาก sensor + เส้นทางตามสถานี
 * ใช้ทั้งหน้า dashboard และหน้ารายละเอียดใบสั่งผลิต
 */
export function OrderHero({ rerouted }: Props) {
  const { t } = useTranslate('factory');

  const order = FOCUS_ORDER;

  return (
    <Panel sx={{ pb: 2 }}>
      <Stack direction="row" alignItems="flex-start" spacing={2}>
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <AgentTag
            label={rerouted ? t('hero.approved') : t('hero.flagged')}
            note={rerouted ? t('hero.justNow') : t('hero.minutesAgo', { count: 26 })}
            sx={{ mb: 1 }}
          />

          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h5" noWrap>
              {t('hero.route', { machine: order.machine })}
            </Typography>
            <AnimatePresence mode="wait" initial={false}>
              <Box
                key={rerouted ? 'ok' : 'risk'}
                component={m.span}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                sx={{ display: 'inline-flex' }}
              >
                <Label
                  color={rerouted ? 'success' : 'warning'}
                  startIcon={
                    <Iconify
                      icon={rerouted ? 'solar:check-circle-bold' : 'solar:danger-triangle-bold'}
                    />
                  }
                >
                  {rerouted ? t('status.onPlan') : t('status.risk')}
                </Label>
              </Box>
            </AnimatePresence>
          </Stack>

          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {order.id} · {order.customer} · {t('common.lots', { count: order.lots })}
          </Typography>
        </Box>

        <TimeStat label={t('hero.window')} value={order.window} />

        <TimeStat
          label={t('hero.etaNow')}
          value={order.etaNow}
          tone="error"
          note={t('hero.latePlan', { count: order.delayMin })}
          muted={rerouted}
        />

        {rerouted ? (
          <TimeStat
            key="saved"
            label={t('hero.saved')}
            value={t('common.minutes', { count: order.savedMin })}
            tone="primary"
            note={t('hero.via', { machine: order.altMachine })}
          />
        ) : (
          <TimeStat
            key="alt"
            label={t('hero.withMove')}
            value={order.etaAlt}
            tone="primary"
            note={t('hero.inWindow')}
          />
        )}
      </Stack>

      <Box
        sx={{
          my: 1,
          gap: 2,
          display: 'grid',
          alignItems: 'center',
          gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) minmax(0, 1.5fr) minmax(0, 1fr)' },
        }}
      >
        <Stack spacing={1} alignItems="flex-start">
          <Callout delay={0.5}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Avatar sx={{ width: 26, height: 26, fontSize: 12 }}>
                {order.operator.slice(0, 1)}
              </Avatar>
              <Box>
                <Typography variant="caption" sx={{ display: 'block', fontWeight: 600 }}>
                  {order.operator}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                  {order.operatorMeta}
                </Typography>
              </Box>
            </Stack>
          </Callout>

          <Callout delay={0.6} label={t('hero.cycle')}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main' }}>
              {order.cycle} · {order.cycleNote}
            </Typography>
          </Callout>

          <Callout delay={0.7} label={t('hero.oee')}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {order.oee} · {order.oeeNote}
            </Typography>
          </Callout>
        </Stack>

        <Box
          component={m.div}
          initial={{ opacity: 0, x: -40, filter: 'blur(10px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <MachineArt />
        </Box>

        <Stack spacing={1} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
          <Callout delay={0.8} label={t('hero.moldTemp')}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {order.moldTemp} · {order.moldTempNote}
            </Typography>
          </Callout>

          <Callout delay={0.9} label={t('hero.output')}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {order.output} · {order.outputNote}
            </Typography>
          </Callout>
        </Stack>
      </Box>

      <StageTrack
        stages={STAGES}
        rerouted={rerouted}
        reroutedEta={`ETA ${order.etaAlt}`}
        detourLabel={t('hero.detour', { machine: order.altMachine })}
        detourNote={t('hero.detourSave', { count: order.savedMin })}
      />
    </Panel>
  );
}

// ----------------------------------------------------------------------

type TimeStatProps = {
  label: string;
  value: string;
  note?: string;
  tone?: 'error' | 'primary';
  muted?: boolean;
};

function TimeStat({ label, value, note, tone, muted }: TimeStatProps) {
  return (
    <Box
      component={m.div}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: muted ? 0.35 : 1, y: 0, filter: muted ? 'blur(3px)' : 'blur(0px)' }}
      transition={{ duration: 0.5 }}
      sx={{ flexShrink: 0, textAlign: 'right' }}
    >
      <Typography
        variant="overline"
        sx={{ display: 'block', color: 'text.disabled', fontSize: 10 }}
      >
        {label}
      </Typography>
      <Typography variant="h4" sx={{ lineHeight: 1.2, ...(tone && { color: `${tone}.main` }) }}>
        {value}
      </Typography>
      {note && (
        <Typography variant="caption" sx={{ color: tone ? `${tone}.main` : 'text.secondary' }}>
          {note}
        </Typography>
      )}
    </Box>
  );
}

// ----------------------------------------------------------------------

type CalloutProps = { label?: string; delay: number; children: React.ReactNode };

function Callout({ label, delay, children }: CalloutProps) {
  return (
    <Box
      component={m.div}
      variants={popIn}
      initial="hidden"
      animate="show"
      transition={{ delay }}
      sx={{
        py: 0.75,
        px: 1.25,
        borderRadius: 1.5,
        bgcolor: 'background.paper',
        boxShadow: (theme) => theme.customShadows.z1,
      }}
    >
      {label && (
        <Typography
          variant="overline"
          sx={{ display: 'block', color: 'text.disabled', fontSize: 10 }}
        >
          {label}
        </Typography>
      )}
      {children}
    </Box>
  );
}
