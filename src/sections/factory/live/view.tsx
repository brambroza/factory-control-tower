import { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useTranslate } from 'src/locales';
import { PageHeader } from 'src/layouts/factory';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import { greyTint } from '../styles';
import { useFactoryDemo } from '../context';
import { EASE, riseIn, stagger } from '../motion';
import { FOCUS_ORDER, CURRENT_USER, LIVE_FILTERS, MACHINES_LIVE } from '../_mock';
import { Panel, AgentTag, FloorMap, MAP_NODES, MachineArt, FilterPills } from '../components';

import type { MachineLive } from '../_mock';
import type { MapMarker } from '../components';

// ----------------------------------------------------------------------

/** ติดตามเครื่องจักรแบบสด: รายการเครื่อง | ผังโรงงาน | แผงรายละเอียดเครื่องที่เลือก */
export function FactoryLiveView() {
  const { t } = useTranslate('factory');

  const { rerouted } = useFactoryDemo();

  const [filter, setFilter] = useState('all');

  const [listFilter, setListFilter] = useState('all');

  const [selectedId, setSelectedId] = useState<string | null>(FOCUS_ORDER.machine);

  const focusMachine = rerouted ? FOCUS_ORDER.altMachine : FOCUS_ORDER.machine;

  const machines = MACHINES_LIVE.filter(
    (machine) => listFilter === 'all' || machine.tone === 'error' || machine.tone === 'warning'
  );

  const selected = MACHINES_LIVE.find((machine) => machine.id === selectedId);

  const markers: MapMarker[] = [
    { id: 'warehouse', ...MAP_NODES.warehouse, icon: 'solar:garage-bold' },
    { id: 'fg', ...MAP_NODES.fg, icon: 'solar:box-bold' },
    ...MACHINES_LIVE.map((machine) => {
      const isFocus = machine.id === focusMachine;

      return {
        id: machine.id,
        x: machine.x,
        y: machine.y,
        icon: 'solar:settings-minimalistic-bold',
        tone: machine.tone === 'default' || machine.tone === 'success' ? 'dark' : machine.tone,
        pulse: isFocus && !rerouted,
        selected: machine.id === selectedId,
        onClick: () => setSelectedId(machine.id),
        ...(isFocus && {
          tone: rerouted ? 'primary' : 'warning',
          title: FOCUS_ORDER.id,
          sub: rerouted
            ? t('map.onTimeVia', { machine: machine.id })
            : t('map.lateBy', { count: FOCUS_ORDER.delayMin }),
          subTone: rerouted ? 'success' : 'error',
        }),
      } as MapMarker;
    }),
  ];

  return (
    <Box component={m.div} variants={stagger()} initial="hidden" animate="show">
      <PageHeader
        search
        monitor
        crumbs={[t('crumb.operations'), t('nav.live')]}
        title={t('nav.live')}
      />

      <Box
        sx={{
          gap: 2,
          display: 'grid',
          alignItems: 'start',
          gridTemplateColumns: {
            xs: '1fr',
            md: '280px minmax(0, 1fr)',
            lg: '280px minmax(0, 1fr) 352px',
          },
        }}
      >
        {/* machine list */}
        <Box>
          <Typography variant="subtitle1">{t('live.running')}</Typography>
          <Typography variant="caption" sx={{ mb: 1.5, display: 'block', color: 'text.secondary' }}>
            {t('live.runningMeta', { count: 214 })}
          </Typography>

          <FilterPills
            value={listFilter}
            onChange={setListFilter}
            items={[
              { key: 'all', label: t('filter.all'), count: 214 },
              { key: 'alerts', label: t('filter.alerts'), count: 7 },
            ]}
            sx={{ mb: 1.5 }}
          />

          <Stack component={m.div} variants={stagger(0.15, 0.07)} spacing={1.25}>
            {machines.map((machine, index) => (
              <MachineCard
                key={machine.id}
                machine={machine}
                index={index}
                selected={machine.id === selectedId}
                onClick={() => setSelectedId(machine.id)}
              />
            ))}
          </Stack>
        </Box>

        {/* map */}
        <Panel sx={{ p: 1.5 }}>
          <FloorMap legend toolbar state={rerouted ? 'approved' : 'flagged'} markers={markers}>
            <FilterPills
              elevated
              value={filter}
              onChange={setFilter}
              items={LIVE_FILTERS.map((item) => ({
                key: item.key,
                label: t(`live.filter.${item.key}`),
                count: item.count,
              }))}
              sx={{ top: 12, left: 12, right: 56, position: 'absolute' }}
            />
          </FloorMap>
        </Panel>

        {/* detail */}
        <Box sx={{ minWidth: 0, gridColumn: { md: '1 / -1', lg: 'auto' } }}>
          <AnimatePresence mode="wait">
            {selected && (
              <Box
                key={selected.id}
                component={m.div}
                initial={{ opacity: 0, x: 40, filter: 'blur(8px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: 40, filter: 'blur(8px)' }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                <MachineDetail
                  machine={selected}
                  rerouted={rerouted}
                  onClose={() => setSelectedId(null)}
                />
              </Box>
            )}
          </AnimatePresence>
        </Box>
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------

type MachineCardProps = {
  machine: MachineLive;
  index: number;
  selected: boolean;
  onClick: () => void;
};

function MachineCard({ machine, index, selected, onClick }: MachineCardProps) {
  const statusColor = machine.tone === 'default' ? 'text.secondary' : `${machine.tone}.main`;

  return (
    <Box
      component={m.div}
      variants={riseIn}
      onClick={onClick}
      sx={{
        p: 1.5,
        cursor: 'pointer',
        borderRadius: 2.5,
        bgcolor: 'background.neutral',
        border: '1.5px solid transparent',
        transition: (theme) => theme.transitions.create(['border-color', 'background-color']),
        ...(selected && { borderColor: 'primary.main', bgcolor: 'background.paper' }),
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <Avatar sx={{ width: 30, height: 30, fontSize: 13 }}>{machine.name.slice(0, 1)}</Avatar>
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" noWrap>
            {machine.name}
          </Typography>
          <Typography variant="caption" noWrap sx={{ display: 'block', color: 'text.secondary' }}>
            {machine.id} · {machine.order}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
          <Typography variant="subtitle2">{machine.speed}</Typography>
          <Typography variant="caption" sx={{ display: 'block', color: statusColor }}>
            {machine.status}
          </Typography>
        </Box>
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        spacing={0.5}
        sx={{ mt: 1, color: 'text.secondary' }}
      >
        <Iconify icon="solar:map-point-bold" width={14} />
        <Typography variant="caption">{machine.place}</Typography>
      </Stack>

      <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.75 }}>
        <Box sx={{ height: 4, flexGrow: 1, borderRadius: 2, bgcolor: greyTint(0.2) }}>
          <Box
            component={m.div}
            initial={{ width: 0 }}
            animate={{ width: `${machine.progress}%` }}
            transition={{ delay: 0.4 + index * 0.08, duration: 0.9, ease: EASE }}
            sx={{ height: 1, borderRadius: 2, bgcolor: 'primary.main' }}
          />
        </Box>
        <Typography
          variant="caption"
          sx={{ width: 32, textAlign: 'right', color: 'text.secondary' }}
        >
          {machine.progress}%
        </Typography>
      </Stack>
    </Box>
  );
}

// ----------------------------------------------------------------------

type MachineDetailProps = { machine: MachineLive; rerouted: boolean; onClose: () => void };

function MachineDetail({ machine, rerouted, onClose }: MachineDetailProps) {
  const { t } = useTranslate('factory');

  const order = FOCUS_ORDER;

  const isFocus = machine.id === order.machine;

  const tiles = [
    { label: t('hero.cycle'), value: machine.speed, note: machine.status, tone: machine.tone },
    {
      label: t('hero.moldTemp'),
      value: isFocus ? order.moldTemp : '33.8°C',
      note: isFocus ? order.moldTempNote : t('live.inRange'),
      tone: 'success',
    },
    {
      label: t('live.progress'),
      value: `${machine.progress}%`,
      note: isFocus ? order.outputNote : machine.order,
      tone: 'default',
    },
    {
      label: t('wo.shiftLeft'),
      value: isFocus ? order.shiftLeft : '5 ชม. 10 น.',
      note: isFocus ? order.shiftNote : t('live.inRange'),
      tone: 'default',
    },
  ];

  return (
    <Panel
      tone="paper"
      animated={false}
      sx={{ p: 2.5, boxShadow: (theme) => theme.customShadows.z16 }}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: 'success.main' }} />
        <Typography variant="overline" sx={{ flexGrow: 1, fontSize: 10, color: 'text.secondary' }}>
          {t('live.liveMeta', { order: machine.order })}
        </Typography>
        <IconButton size="small" onClick={onClose}>
          <Iconify icon="mingcute:close-line" width={18} />
        </IconButton>
      </Stack>

      <Typography variant="h5" sx={{ mt: 0.5 }}>
        {machine.id} · {isFocus ? order.machineName : machine.place}
      </Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        {machine.place} → {t('live.toQc')}
      </Typography>

      <Box
        sx={{
          mt: 1.5,
          p: 1.5,
          borderRadius: 2,
          position: 'relative',
          bgcolor: 'background.neutral',
        }}
      >
        <Label
          color="primary"
          startIcon={<Iconify icon="solar:play-circle-bold" />}
          sx={{ top: 12, left: 12, position: 'absolute' }}
        >
          {t('live.inProduction')}
        </Label>
        <MachineArt sx={{ mt: 2 }} />
      </Box>

      <Stack direction="row" alignItems="center" spacing={1.25} sx={{ my: 1.5 }}>
        <Avatar sx={{ width: 36, height: 36, fontSize: 14 }}>{machine.name.slice(0, 1)}</Avatar>
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" noWrap>
            {machine.name}
          </Typography>
          <Typography variant="caption" noWrap sx={{ display: 'block', color: 'text.secondary' }}>
            {isFocus ? order.operatorMeta : machine.order}
          </Typography>
        </Box>
        <IconButton size="small" sx={{ bgcolor: greyTint(0.12) }}>
          <Iconify icon="solar:chat-round-dots-bold" width={16} />
        </IconButton>
        <IconButton size="small" sx={{ bgcolor: greyTint(0.12) }}>
          <Iconify icon="solar:phone-bold" width={16} />
        </IconButton>
      </Stack>

      <Box
        component={m.div}
        variants={stagger(0.2, 0.07)}
        initial="hidden"
        animate="show"
        sx={{ gap: 1, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}
      >
        {tiles.map((tile) => (
          <Box
            key={tile.label}
            component={m.div}
            variants={riseIn}
            sx={{ p: 1.5, borderRadius: 2, bgcolor: 'background.neutral' }}
          >
            <Typography variant="overline" sx={{ fontSize: 10, color: 'text.disabled' }}>
              {tile.label}
            </Typography>
            <Typography variant="h5">{tile.value}</Typography>
            <Typography
              variant="caption"
              sx={{ color: tile.tone === 'default' ? 'text.secondary' : `${tile.tone}.main` }}
            >
              {tile.note}
            </Typography>
          </Box>
        ))}
      </Box>

      <Stack direction="row" justifyContent="space-between" sx={{ mt: 2, mb: 0.75 }}>
        <Typography variant="caption" sx={{ fontWeight: 600 }}>
          {t('live.started', { time: '09:48' })}
        </Typography>
        <Typography
          variant="caption"
          sx={{ fontWeight: 600, color: rerouted || !isFocus ? 'success.main' : 'error.main' }}
        >
          ETA {rerouted || !isFocus ? order.etaAlt : order.etaNow}
        </Typography>
      </Stack>
      <Box sx={{ height: 4, borderRadius: 2, bgcolor: greyTint(0.2) }}>
        <Box
          component={m.div}
          initial={{ width: 0 }}
          animate={{ width: `${machine.progress}%` }}
          transition={{ delay: 0.3, duration: 0.9, ease: EASE }}
          sx={{ height: 1, borderRadius: 2, bgcolor: 'primary.main' }}
        />
      </Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{ mt: 0.75, color: 'text.secondary' }}
      >
        <Typography variant="caption">{isFocus ? order.output : machine.order}</Typography>
        <Typography variant="caption">{t('live.window', { window: order.window })}</Typography>
      </Stack>

      {isFocus && (
        <Panel tone="agent" animated={false} sx={{ mt: 2, p: 1.75, borderRadius: 2 }}>
          <AgentTag
            label="Planning Agent"
            note={t('live.confidence', { count: 92 })}
            size={20}
            sx={{ mb: 1 }}
          />
          <Typography variant="subtitle2">
            {rerouted
              ? t('live.agentApproved', { name: CURRENT_USER.fullName })
              : t('live.agentPending')}
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
            {rerouted
              ? t('live.agentApprovedNote', { machine: order.altMachine, eta: order.etaAlt })
              : t('live.agentPendingNote', { machine: order.altMachine, count: order.savedMin })}
          </Typography>

          <Button
            component={RouterLink}
            href={rerouted ? paths.factory.order(order.id) : paths.factory.dispatch}
            size="small"
            variant="outlined"
            color="inherit"
            startIcon={<Iconify icon="solar:eye-bold" />}
            sx={{ mt: 1.25, bgcolor: 'background.paper' }}
          >
            {rerouted ? t('live.viewOrder') : t('dash.brief.review')}
          </Button>
        </Panel>
      )}
    </Panel>
  );
}
