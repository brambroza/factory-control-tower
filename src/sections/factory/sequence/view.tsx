import { m } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';
import { PageHeader } from 'src/layouts/factory';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

import { EASE, stagger } from '../motion';
import { tint, greyTint } from '../styles';
import { EditSequenceDialog } from './edit-sequence-dialog';
import { Panel, AgentOrb, FilterPills } from '../components';
import {
  SEQUENCE_JOBS,
  SEQUENCE_HOME,
  SEQUENCE_META,
  SEQUENCE_METRICS,
  SEQUENCE_ORIGINAL,
} from '../_mock';

// ----------------------------------------------------------------------

const AGENT_ORDER = SEQUENCE_JOBS.map((job) => job.id);

const ORIGINAL_ORDER = SEQUENCE_ORIGINAL.map((index) => SEQUENCE_JOBS[index].id);

const jobById = (id: string) => SEQUENCE_JOBS.find((job) => job.id === id)!;

/** viewBox ของแผนที่ = 160 x 100 (อัตราส่วนเดียวกับกรอบ 16:10) — พิกัดใน mock เป็น 0-100 ทั้งสองแกน */
const MAP_W = 160;

/** บีบแกน x ไว้ครึ่งซ้าย เพื่อเว้นที่ให้การ์ดผลลัพธ์ด้านขวา */
const toX = (x: number) => x * 1.25;

const leftPercent = (x: number) => `${(toX(x) / MAP_W) * 100}%`;

/** เส้นทางบนแผนที่ changeover: จุดเริ่ม → งานตามลำดับ → กลับจุดเริ่ม */
const toPath = (order: string[]) =>
  [SEQUENCE_HOME, ...order.map(jobById), SEQUENCE_HOME]
    .map((point, index) => `${index === 0 ? 'M' : 'L'}${toX(point.x)} ${point.y}`)
    .join(' ');

// ----------------------------------------------------------------------

/**
 * จัดลำดับการผลิตของเครื่องหนึ่งรอบ — เทียบแผนเดิม (เส้นประ) กับลำดับที่ agent จัดใหม่ (เส้นทึบ)
 * ระยะบนแผนที่ = เวลา changeover ระหว่างงาน (สี/แม่พิมพ์ใกล้กันอยู่ใกล้กัน)
 */
export function FactorySequenceView() {
  const { t } = useTranslate('factory');

  const router = useRouter();

  const edit = useBoolean();

  const [day, setDay] = useState('tomorrow');

  const [order, setOrder] = useState(ORIGINAL_ORDER);

  const [optimized, setOptimized] = useState(false);

  // แสดงแผนเดิมก่อน แล้วให้ agent จัดใหม่ต่อหน้า
  useEffect(() => {
    const timer = setTimeout(() => {
      setOrder(AGENT_ORDER);
      setOptimized(true);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  const handleApply = useCallback(() => {
    toast.success(t('seq.toast', { id: SEQUENCE_META.id }));
    router.push(paths.factory.inbox);
  }, [router, t]);

  const handleSave = useCallback(
    (next: string[]) => {
      setOrder(next);
      edit.onFalse();
      toast.success(t('edit.toast'));
    },
    [edit, t]
  );

  return (
    <Box component={m.div} variants={stagger()} initial="hidden" animate="show">
      <PageHeader
        crumbs={[t('crumb.planning'), t('nav.sequence'), SEQUENCE_META.id]}
        title={t('nav.sequence')}
        actions={
          <>
            <FilterPills
              value={day}
              onChange={setDay}
              items={[
                { key: 'today', label: t('seq.today') },
                { key: 'tomorrow', label: t('seq.tomorrow') },
                { key: 'week', label: t('seq.week') },
              ]}
            />
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<Iconify icon="solar:download-minimalistic-bold" />}
            >
              {t('seq.export')}
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={!optimized}
              onClick={handleApply}
              startIcon={<Iconify icon="eva:checkmark-fill" />}
            >
              {t('seq.apply')}
            </Button>
          </>
        }
      />

      <Box
        sx={{
          gap: 2,
          display: 'grid',
          alignItems: 'start',
          gridTemplateColumns: { xs: '1fr', md: '320px minmax(0, 1fr)' },
        }}
      >
        {/* job list */}
        <Panel sx={{ p: 2 }}>
          <Stack direction="row" alignItems="center">
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1">
                {SEQUENCE_META.id} · {SEQUENCE_META.title}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {SEQUENCE_META.meta}
              </Typography>
            </Box>
            <IconButton size="small">
              <Iconify icon="eva:more-horizontal-fill" />
            </IconButton>
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            spacing={1.25}
            sx={{ my: 1.5, p: 1.25, borderRadius: 999, bgcolor: 'background.paper' }}
          >
            <Avatar sx={{ width: 32, height: 32, fontSize: 13 }}>
              {SEQUENCE_META.operator.slice(0, 1)}
            </Avatar>
            <Box>
              <Typography variant="subtitle2">{SEQUENCE_META.operator}</Typography>
              <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                {SEQUENCE_META.operatorMeta}
              </Typography>
            </Box>
          </Stack>

          <Stack spacing={0.25}>
            {order.map((id, index) => {
              const job = jobById(id);
              const moved = optimized && ORIGINAL_ORDER[index] !== id;

              return (
                <Stack
                  key={id}
                  layout
                  component={m.div}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    layout: { type: 'spring', stiffness: 380, damping: 34 },
                    opacity: { delay: 0.2 + index * 0.04 },
                    x: { delay: 0.2 + index * 0.04 },
                  }}
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{
                    py: 0.75,
                    px: 0.5,
                    borderRadius: 1.5,
                    ...(moved && { bgcolor: tint('primary', 0.06) }),
                  }}
                >
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      flexShrink: 0,
                      display: 'grid',
                      borderRadius: '50%',
                      placeItems: 'center',
                      typography: 'caption',
                      bgcolor: 'text.primary',
                      color: 'background.paper',
                      ...(moved && { bgcolor: 'primary.main', color: 'primary.contrastText' }),
                    }}
                  >
                    {index + 1}
                  </Box>

                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      flexShrink: 0,
                      display: 'grid',
                      borderRadius: 0.75,
                      placeItems: 'center',
                      color: `${job.tone}.main`,
                      bgcolor: tint(job.tone, 0.16),
                    }}
                  >
                    <Iconify icon={job.icon} width={14} />
                  </Box>

                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography variant="caption" noWrap sx={{ display: 'block', fontWeight: 600 }}>
                      {job.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      noWrap
                      sx={{ display: 'block', color: moved ? 'primary.main' : 'text.secondary' }}
                    >
                      {job.window}
                      {moved && job.tag ? ` · ${job.tag}` : ''}
                    </Typography>
                  </Box>

                  <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                    <Typography variant="caption" sx={{ display: 'block', fontWeight: 600 }}>
                      {SEQUENCE_JOBS[index].eta}
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'block', color: 'text.disabled' }}>
                      ETA
                    </Typography>
                  </Box>
                </Stack>
              );
            })}
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ mt: 1, px: 0.5, color: 'text.secondary' }}
          >
            <Iconify icon="solar:garage-bold" width={16} />
            <Typography variant="caption" sx={{ flexGrow: 1 }}>
              {SEQUENCE_META.end}
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {SEQUENCE_META.endTime}
            </Typography>
          </Stack>
        </Panel>

        {/* changeover map */}
        <Panel sx={{ p: 1.5 }}>
          <Box
            sx={{
              overflow: 'hidden',
              borderRadius: 2.5,
              position: 'relative',
              aspectRatio: '16 / 10',
              bgcolor: greyTint(0.16),
            }}
          >
            <Box
              component="svg"
              viewBox={`0 0 ${MAP_W} 100`}
              sx={{ inset: 0, width: 1, height: 1, position: 'absolute' }}
            >
              {/* แผนเดิม */}
              <Box
                component={m.path}
                d={toPath(ORIGINAL_ORDER)}
                initial={{ opacity: 0 }}
                animate={{ opacity: optimized ? 0.5 : 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                sx={{
                  fill: 'none',
                  strokeWidth: 0.35,
                  strokeDasharray: '0.4 1.2',
                  strokeLinecap: 'round',
                  stroke: (theme) => theme.vars.palette.text.secondary,
                }}
              />

              {/* ลำดับปัจจุบัน (agent จัด หรือผู้ใช้แก้) — วาดใหม่ทุกครั้งที่ลำดับเปลี่ยน */}
              {optimized && (
                <Box
                  key={order.join()}
                  component={m.path}
                  d={toPath(order)}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.6, ease: EASE }}
                  sx={{
                    fill: 'none',
                    strokeWidth: 0.55,
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round',
                    stroke: (theme) => theme.vars.palette.primary.main,
                  }}
                />
              )}
            </Box>

            {/* nodes */}
            {order.map((id, index) => {
              const job = jobById(id);

              return (
                <Box
                  key={id}
                  component={m.div}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 0.5 + index * 0.06,
                    type: 'spring',
                    stiffness: 420,
                    damping: 22,
                  }}
                  sx={{ position: 'absolute', top: `${job.y}%`, left: leftPercent(job.x) }}
                >
                  <Box
                    sx={{
                      width: 22,
                      height: 22,
                      display: 'grid',
                      borderRadius: '50%',
                      placeItems: 'center',
                      typography: 'caption',
                      fontWeight: 600,
                      bgcolor: 'text.primary',
                      color: 'background.paper',
                      transform: 'translate(-50%, -50%)',
                      border: (theme) => `2px solid ${theme.vars.palette.background.paper}`,
                    }}
                  >
                    {index + 1}
                  </Box>
                </Box>
              );
            })}

            <Box
              sx={{
                position: 'absolute',
                top: `${SEQUENCE_HOME.y}%`,
                left: leftPercent(SEQUENCE_HOME.x),
              }}
            >
              <Box
                sx={{
                  width: 30,
                  height: 30,
                  display: 'grid',
                  borderRadius: 1,
                  placeItems: 'center',
                  bgcolor: 'text.primary',
                  color: 'background.paper',
                  transform: 'translate(-50%, -50%)',
                  boxShadow: (theme) => theme.customShadows.z8,
                }}
              >
                <Iconify icon="solar:garage-bold" width={16} />
              </Box>
            </Box>

            {/* legend */}
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{
                top: 12,
                left: 12,
                py: 0.75,
                px: 1.5,
                borderRadius: 999,
                position: 'absolute',
                bgcolor: 'background.paper',
                boxShadow: (theme) => theme.customShadows.z1,
              }}
            >
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                ┄ {t('seq.currentPlan')} · {SEQUENCE_META.currentTotal}
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main' }}>
                ━ {t('seq.optimized')} · {SEQUENCE_META.optimizedTotal}
              </Typography>
            </Stack>

            {/* result */}
            <Box
              component={m.div}
              initial={false}
              animate={
                optimized
                  ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                  : { opacity: 0, y: 40, filter: 'blur(10px)' }
              }
              transition={{ delay: optimized ? 1.2 : 0, duration: 0.6, ease: EASE }}
              sx={{
                p: 2,
                right: 12,
                bottom: 12,
                borderRadius: 2.5,
                position: 'absolute',
                bgcolor: 'background.paper',
                width: { xs: 'calc(100% - 24px)', sm: 380 },
                boxShadow: (theme) => theme.customShadows.z20,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1.25} sx={{ mb: 1.5 }}>
                <AgentOrb size={30} />
                <Box>
                  <Typography variant="subtitle2">{t('seq.better')}</Typography>
                  <Typography variant="overline" sx={{ fontSize: 10, color: 'primary.main' }}>
                    Planning Agent · {t('live.confidence', { count: 94 })}
                  </Typography>
                </Box>
              </Stack>

              <MetricRow
                head
                cells={[
                  t('seq.col.metric'),
                  t('seq.col.current'),
                  t('seq.col.optimized'),
                  t('seq.col.change'),
                ]}
              />
              {SEQUENCE_METRICS.map((metric) => (
                <MetricRow
                  key={metric.key}
                  cells={[
                    t(`seq.metric.${metric.key}`),
                    metric.current,
                    metric.optimized,
                    metric.change,
                  ]}
                />
              ))}

              <Stack
                direction="row"
                spacing={1}
                sx={{ my: 1.5, p: 1.25, borderRadius: 1.5, bgcolor: tint('primary', 0.08) }}
              >
                <Iconify
                  icon="solar:info-circle-bold"
                  width={16}
                  sx={{ mt: 0.25, color: 'primary.main' }}
                />
                <Typography variant="caption">{SEQUENCE_META.hint}</Typography>
              </Stack>

              <Stack direction="row" spacing={0.75}>
                <Button
                  size="small"
                  variant="contained"
                  color="inherit"
                  onClick={handleApply}
                  startIcon={<Iconify icon="eva:checkmark-fill" />}
                >
                  {t('seq.applyTomorrow')}
                </Button>
                <Button size="small" variant="outlined" color="inherit" onClick={edit.onTrue}>
                  {t('seq.edit')}
                </Button>
                <Button
                  size="small"
                  color="inherit"
                  onClick={() => {
                    setOrder(ORIGINAL_ORDER);
                    setOptimized(false);
                  }}
                >
                  {t('seq.keep')}
                </Button>
              </Stack>
            </Box>
          </Box>
        </Panel>
      </Box>

      <EditSequenceDialog
        open={edit.value}
        order={order}
        onClose={edit.onFalse}
        onSave={handleSave}
      />
    </Box>
  );
}

// ----------------------------------------------------------------------

function MetricRow({ cells, head }: { cells: string[]; head?: boolean }) {
  return (
    <Box
      sx={{
        py: 0.75,
        gap: 1,
        display: 'grid',
        alignItems: 'center',
        gridTemplateColumns: 'minmax(0, 1.4fr) repeat(3, minmax(0, 1fr))',
        borderBottom: (theme) => `1px solid ${theme.vars.palette.divider}`,
      }}
    >
      {cells.map((cell, index) => {
        if (head) {
          return (
            <Typography
              key={cell}
              variant="overline"
              sx={{
                fontSize: 10,
                color: index === 2 ? 'primary.main' : 'text.disabled',
                textAlign: index === 0 ? 'left' : 'right',
              }}
            >
              {cell}
            </Typography>
          );
        }

        if (index === 3) {
          return (
            <Box key={cell} sx={{ textAlign: 'right' }}>
              <Label color="success">{cell}</Label>
            </Box>
          );
        }

        return (
          <Typography
            key={cell}
            variant="caption"
            noWrap
            sx={{
              textAlign: index === 0 ? 'left' : 'right',
              ...(index === 1 && { color: 'text.secondary' }),
              ...(index === 2 && { fontWeight: 600 }),
            }}
          >
            {cell}
          </Typography>
        );
      })}
    </Box>
  );
}
