import { m, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';
import { PageHeader } from 'src/layouts/factory';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

import { tint, greyTint } from '../styles';
import { useFactoryDemo } from '../context';
import { focusMarkers } from '../map-markers';
import { ApproveDialog } from './approve-dialog';
import { EASE, riseIn, stagger } from '../motion';
import { AutoAssignDialog } from './auto-assign-dialog';
import {
  Panel,
  AgentOrb,
  AgentTag,
  FloorMap,
  OrderCard,
  FilterPills,
  GanttTimeline,
} from '../components';
import {
  FOCUS_ORDER,
  WORK_ORDERS,
  AUTO_HANDLED,
  TIMELINE_NOW,
  AGENT_ACTIONS,
  TIMELINE_ROWS,
  TIMELINE_HOURS,
} from '../_mock';

// ----------------------------------------------------------------------

/**
 * หน้าจ่ายงานผลิต: คิวใบสั่งผลิต | ผังโรงงาน + ตารางเครื่อง | ข้อเสนอของ agent ที่รออนุมัติ
 * เปิดด้วย query `?assign=1` เพื่อให้ dialog จ่ายงานอัตโนมัติเปิดทันที
 */
export function FactoryDispatchView() {
  const { t } = useTranslate('factory');

  const router = useRouter();

  const searchParams = useSearchParams();

  const { rerouted, setRerouted } = useFactoryDemo();

  const approve = useBoolean();

  const assign = useBoolean();

  const [queueFilter, setQueueFilter] = useState('all');

  const [mapFilter, setMapFilter] = useState('machines');

  const [selected, setSelected] = useState(FOCUS_ORDER.id);

  const [dismissed, setDismissed] = useState<string[]>([]);

  const autoAssign = searchParams.get('assign') === '1';

  useEffect(() => {
    if (!autoAssign) return undefined;

    const timer = setTimeout(assign.onTrue, 900);

    return () => clearTimeout(timer);
  }, [autoAssign, assign.onTrue]);

  const handleApproved = useCallback(() => {
    approve.onFalse();
    setRerouted(true);
    toast.success(t('approve.toast', { id: FOCUS_ORDER.id, machine: FOCUS_ORDER.altMachine }));
    router.push(paths.factory.order(FOCUS_ORDER.id));
  }, [approve, router, setRerouted, t]);

  const handleAssign = useCallback(() => {
    assign.onFalse();
    toast.success(t('assign.toast', { count: 11 }));
    router.push(paths.factory.sequence);
  }, [assign, router, t]);

  const handleQuickAction = useCallback(
    (no: string, approved: boolean) => {
      setDismissed((prev) => [...prev, no]);
      toast.info(
        approved ? t('dispatch.actionApproved', { no }) : t('dispatch.actionDismissed', { no })
      );
    },
    [t]
  );

  const orders = WORK_ORDERS.filter(
    (order) => queueFilter === 'all' || order.status === queueFilter
  );

  const actions = AGENT_ACTIONS.filter(
    (action) => !dismissed.includes(action.no) && !(action.primary && rerouted)
  );

  return (
    <Box component={m.div} variants={stagger()} initial="hidden" animate="show">
      <PageHeader
        search
        monitor
        crumbs={[t('crumb.operations'), t('nav.dispatch')]}
        title={t('nav.dispatch')}
        actions={
          <>
            <Button variant="outlined" color="inherit" onClick={assign.onTrue}>
              {t('dispatch.autoAssign', { count: 12 })}
            </Button>
            <Button
              component={RouterLink}
              href={paths.factory.newOrder}
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              {t('common.newOrder')}
            </Button>
          </>
        }
      />

      <Box
        sx={{
          gap: 2,
          display: 'grid',
          alignItems: 'start',
          gridTemplateColumns: {
            xs: '1fr',
            md: '280px minmax(0, 1fr)',
            lg: '288px minmax(0, 1fr) 336px',
          },
        }}
      >
        {/* queue */}
        <Box>
          <Stack direction="row" alignItems="center" sx={{ mb: 1.5 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1">{t('dispatch.queue')}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {t('dispatch.queueMeta', { total: 46, decide: 12 })}
              </Typography>
            </Box>
            <IconButton size="small" sx={{ bgcolor: greyTint(0.12) }}>
              <Iconify icon="solar:tuning-2-bold" width={16} />
            </IconButton>
          </Stack>

          <FilterPills
            value={queueFilter}
            onChange={setQueueFilter}
            items={[
              { key: 'all', label: t('filter.all'), count: 46 },
              { key: 'risk', label: t('status.risk'), count: 18 },
              { key: 'delayed', label: t('status.delayed'), count: 9 },
            ]}
            sx={{ mb: 1.5 }}
          />

          <Stack component={m.div} variants={stagger(0.15, 0.08)} spacing={1.25}>
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                selected={order.id === selected}
                onClick={() => setSelected(order.id)}
                resolved={
                  rerouted && order.id === FOCUS_ORDER.id
                    ? { toTime: FOCUS_ORDER.etaAlt }
                    : undefined
                }
              />
            ))}
          </Stack>
        </Box>

        {/* map + timeline */}
        <Stack spacing={2} sx={{ minWidth: 0 }}>
          <Panel sx={{ p: 1.5 }}>
            <FloorMap
              legend
              toolbar
              state={rerouted ? 'approved' : 'flagged'}
              markers={focusMarkers(rerouted, t)}
            >
              <FilterPills
                elevated
                value={mapFilter}
                onChange={setMapFilter}
                items={[
                  { key: 'machines', label: t('filter.machines'), count: 214 },
                  { key: 'delayed', label: t('status.delayed'), count: 37 },
                  { key: 'risk', label: t('status.risk'), count: 18 },
                  { key: 'stores', label: t('filter.stores'), count: 3 },
                ]}
                sx={{ top: 12, left: 12, right: 56, position: 'absolute' }}
              />

              <Box
                component={m.div}
                initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ delay: 1.6, duration: 0.5, ease: EASE }}
                sx={{
                  p: 1.5,
                  zIndex: 3,
                  right: 12,
                  bottom: 12,
                  width: 248,
                  borderRadius: 2,
                  position: 'absolute',
                  bgcolor: 'background.paper',
                  boxShadow: (theme) => theme.customShadows.z16,
                }}
              >
                <AgentTag label="Planning Agent" note={FOCUS_ORDER.id} size={18} sx={{ mb: 1 }} />

                <CompareRow
                  title={t('dispatch.currentAt', { machine: FOCUS_ORDER.machine })}
                  note={t('hero.latePlan', { count: FOCUS_ORDER.delayMin })}
                  time={FOCUS_ORDER.etaNow}
                  muted={rerouted}
                />
                <CompareRow
                  highlight
                  title={t('dispatch.proposedAt', { machine: FOCUS_ORDER.altMachine })}
                  note={t('hero.detourSave', { count: FOCUS_ORDER.savedMin })}
                  time={FOCUS_ORDER.etaAlt}
                />

                {rerouted ? (
                  <Label
                    color="success"
                    startIcon={<Iconify icon="solar:check-circle-bold" />}
                    sx={{ mt: 1 }}
                  >
                    {t('dispatch.moved')}
                  </Label>
                ) : (
                  <Stack direction="row" spacing={0.75} sx={{ mt: 1 }}>
                    <Button
                      size="small"
                      variant="contained"
                      color="inherit"
                      onClick={approve.onTrue}
                      startIcon={<Iconify icon="eva:checkmark-fill" />}
                    >
                      {t('dispatch.approveMove')}
                    </Button>
                    <Button size="small" variant="outlined" color="inherit">
                      {t('dispatch.compare')}
                    </Button>
                  </Stack>
                )}
              </Box>
            </FloorMap>
          </Panel>

          <Panel>
            <Typography variant="subtitle1">{t('timeline.title')}</Typography>
            <Typography variant="caption" sx={{ mb: 2, display: 'block', color: 'text.secondary' }}>
              {t('timeline.dispatchNote')}
            </Typography>

            <GanttTimeline
              rows={TIMELINE_ROWS}
              hours={TIMELINE_HOURS}
              now={TIMELINE_NOW}
              nowLabel="11:58"
              headLabel={t('timeline.head')}
            />
          </Panel>
        </Stack>

        {/* agent */}
        <Panel tone="agent" sx={{ p: 2, gridColumn: { md: '1 / -1', lg: 'auto' } }}>
          <Stack direction="row" alignItems="center" spacing={1.25} sx={{ mb: 2 }}>
            <AgentOrb size={32} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle2">Dispatch Agent</Typography>
              <Typography variant="overline" sx={{ fontSize: 10, color: 'primary.main' }}>
                {t('dispatch.needYou', { count: actions.length })}
              </Typography>
            </Box>
            <Button
              size="small"
              color="inherit"
              startIcon={<Iconify icon="solar:lock-keyhole-bold" width={14} />}
              sx={{ bgcolor: 'background.paper' }}
            >
              {t('dispatch.approveFirst')}
            </Button>
          </Stack>

          <Stack spacing={1.25}>
            <AnimatePresence initial={false}>
              {actions.map((action) => (
                <Box
                  key={action.no}
                  layout
                  component={m.div}
                  variants={riseIn}
                  exit={{ opacity: 0, height: 0, scale: 0.96, marginTop: -10 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  sx={{ overflow: 'hidden', borderRadius: 2.5, bgcolor: 'background.paper' }}
                >
                  <Box sx={{ p: 1.75 }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.75 }}>
                      <Box
                        sx={{
                          px: 0.75,
                          borderRadius: 0.75,
                          typography: 'caption',
                          fontWeight: 600,
                          bgcolor: 'primary.main',
                          color: 'primary.contrastText',
                        }}
                      >
                        {action.no}
                      </Box>
                      <Typography variant="subtitle2">{action.title}</Typography>
                    </Stack>

                    <Typography
                      variant="caption"
                      sx={{ display: 'block', color: 'text.secondary' }}
                    >
                      {action.detail}
                    </Typography>

                    <Label color="success" sx={{ my: 1.25 }}>
                      {action.chip}
                    </Label>

                    <Stack direction="row" spacing={0.75}>
                      <Button
                        size="small"
                        variant="contained"
                        color="inherit"
                        onClick={
                          action.primary ? approve.onTrue : () => handleQuickAction(action.no, true)
                        }
                      >
                        {t('common.approve')}
                      </Button>
                      <Button size="small" variant="outlined" color="inherit">
                        {t('common.review')}
                      </Button>
                      <Button
                        size="small"
                        color="inherit"
                        onClick={() => handleQuickAction(action.no, false)}
                      >
                        {t('common.dismiss')}
                      </Button>
                    </Stack>
                  </Box>
                </Box>
              ))}
            </AnimatePresence>

            <Box
              layout
              component={m.div}
              variants={riseIn}
              sx={{ p: 1.75, borderRadius: 2.5, bgcolor: tint('primary', 0.06) }}
            >
              <Typography variant="overline" sx={{ fontSize: 10, color: 'text.disabled' }}>
                {t('dispatch.autoHandled')}
              </Typography>

              <Stack spacing={0.75} sx={{ mt: 0.75 }}>
                {AUTO_HANDLED.map((item) => (
                  <Stack key={item.label} direction="row" alignItems="flex-start" spacing={1}>
                    <Iconify
                      icon="solar:check-circle-bold"
                      width={16}
                      sx={{ mt: 0.25, color: 'success.main' }}
                    />
                    <Typography variant="caption" sx={{ flexGrow: 1 }}>
                      {item.label}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                      {item.time}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>
          </Stack>
        </Panel>
      </Box>

      <ApproveDialog open={approve.value} onClose={approve.onFalse} onApproved={handleApproved} />

      <AutoAssignDialog open={assign.value} onClose={assign.onFalse} onAssign={handleAssign} />
    </Box>
  );
}

// ----------------------------------------------------------------------

type CompareRowProps = {
  title: string;
  note: string;
  time: string;
  highlight?: boolean;
  muted?: boolean;
};

function CompareRow({ title, note, time, highlight, muted }: CompareRowProps) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        mb: 0.75,
        py: 0.75,
        px: 1.25,
        borderRadius: 1.5,
        bgcolor: highlight ? tint('primary', 0.1) : greyTint(0.1),
        transition: (theme) => theme.transitions.create('opacity'),
        ...(muted && { opacity: 0.48 }),
      }}
    >
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Typography variant="caption" noWrap sx={{ display: 'block', fontWeight: 600 }}>
          {title}
        </Typography>
        <Typography
          variant="caption"
          sx={{ display: 'block', color: highlight ? 'primary.main' : 'error.main' }}
        >
          {note}
        </Typography>
      </Box>
      <Typography
        variant="h6"
        sx={{ fontWeight: 600, ...(highlight && { color: 'primary.main' }) }}
      >
        {time}
      </Typography>
    </Stack>
  );
}
