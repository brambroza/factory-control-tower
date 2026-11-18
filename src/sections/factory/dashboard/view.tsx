import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useTranslate } from 'src/locales';
import { PageHeader } from 'src/layouts/factory';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import { greyTint } from '../styles';
import { useFactoryDemo } from '../context';
import { focusMarkers } from '../map-markers';
import { EASE, riseIn, stagger } from '../motion';
import { Panel, CountUp, AgentOrb, FloorMap, OrderHero, GanttTimeline } from '../components';
import {
  KPIS,
  CURRENT_USER,
  BRIEF_CAUSES,
  TIMELINE_NOW,
  TIMELINE_ROWS,
  TIMELINE_HOURS,
  BRIEF_PROPOSALS,
} from '../_mock';

// ----------------------------------------------------------------------

/** หน้าแรกของ module: ภาพรวมการผลิตวันนี้ + งานที่ agent ปักธง + สรุปข้อเสนอ */
export function FactoryDashboardView() {
  const { t } = useTranslate('factory');

  const { rerouted } = useFactoryDemo();

  return (
    <Box component={m.div} variants={stagger()} initial="hidden" animate="show">
      <PageHeader
        search
        monitor
        crumbs={[t('dash.date')]}
        title={t('dash.greeting', { name: CURRENT_USER.name })}
        subtitle={t('dash.subtitle')}
        actions={
          <Button
            component={RouterLink}
            href={paths.factory.newOrder}
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            {t('common.newOrder')}
          </Button>
        }
      />

      <Box
        component={m.div}
        variants={stagger(0.1, 0.07)}
        sx={{
          mb: 3,
          rowGap: 2.5,
          columnGap: 3,
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(6, 1fr)' },
        }}
      >
        {KPIS.map((kpi, index) => (
          <Box key={kpi.key} component={m.div} variants={riseIn}>
            <Typography variant="overline" sx={{ fontSize: 10, color: 'text.disabled' }}>
              {t(`dash.kpi.${kpi.key}`)}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="h3" sx={{ lineHeight: 1.3 }}>
                <CountUp to={kpi.value} delay={0.2 + index * 0.07} />
              </Typography>
              <Label color={kpi.tone ?? 'default'}>
                {kpi.chip === 'ai'
                  ? t('dash.kpi.aiWatching')
                  : kpi.chip === 'critical'
                    ? t('dash.kpi.critical', { count: 4 })
                    : kpi.chip}
              </Label>
            </Stack>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {kpi.note}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          gap: 2,
          display: 'grid',
          alignItems: 'start',
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.9fr) minmax(0, 1fr)' },
        }}
      >
        <OrderHero rerouted={rerouted} />

        <Panel tone="agent">
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
            <AgentOrb size={32} />
            <Box>
              <Typography variant="subtitle2">{t('dash.brief.title')}</Typography>
              <Typography variant="overline" sx={{ fontSize: 10, color: 'primary.main' }}>
                {t('dash.brief.meta')}
              </Typography>
            </Box>
          </Stack>

          <Typography variant="h5" sx={{ mb: 2, fontWeight: 400 }}>
            {t('dash.brief.headline', { count: 18 })}
          </Typography>

          <Typography variant="overline" sx={{ fontSize: 10, color: 'text.disabled' }}>
            {t('dash.brief.causes')}
          </Typography>

          <Stack spacing={0.75} sx={{ mt: 0.5, mb: 2 }}>
            {BRIEF_CAUSES.map((cause, index) => (
              <Stack key={cause.label} direction="row" alignItems="center" spacing={1.5}>
                <Typography
                  variant="caption"
                  sx={{ width: 16, color: 'primary.main', fontWeight: 600 }}
                >
                  {cause.count}
                </Typography>
                <Typography variant="body2" noWrap sx={{ flexGrow: 1 }}>
                  {cause.label}
                </Typography>
                <Box
                  sx={{
                    width: 56,
                    height: 4,
                    borderRadius: 2,
                    flexShrink: 0,
                    bgcolor: greyTint(0.2),
                  }}
                >
                  <Box
                    component={m.div}
                    initial={{ width: 0 }}
                    animate={{ width: `${cause.weight}%` }}
                    transition={{ delay: 0.8 + index * 0.12, duration: 0.8, ease: EASE }}
                    sx={{ height: 1, borderRadius: 2, bgcolor: 'primary.main' }}
                  />
                </Box>
              </Stack>
            ))}
          </Stack>

          <Typography variant="overline" sx={{ fontSize: 10, color: 'text.disabled' }}>
            {t('dash.brief.proposes')}
          </Typography>

          <Stack
            component={m.div}
            variants={stagger(1, 0.1)}
            spacing={0.75}
            sx={{ mt: 0.5, mb: 2 }}
          >
            {BRIEF_PROPOSALS.map((proposal) => (
              <Stack
                key={proposal.label}
                component={m.div}
                variants={riseIn}
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ py: 1, px: 1.5, borderRadius: 999, bgcolor: 'background.paper' }}
              >
                <Iconify icon={proposal.icon} width={16} sx={{ color: 'primary.main' }} />
                <Typography variant="subtitle2" noWrap>
                  {proposal.label}
                </Typography>
                <Typography variant="caption" noWrap sx={{ flexGrow: 1, color: 'text.secondary' }}>
                  {proposal.note}
                </Typography>
                <Iconify
                  icon="eva:arrow-ios-forward-fill"
                  width={16}
                  sx={{ color: 'text.disabled' }}
                />
              </Stack>
            ))}
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
            <Button
              component={RouterLink}
              href={paths.factory.dispatch}
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="eva:checkmark-fill" />}
            >
              {t('dash.brief.review')}
            </Button>
            <Button color="inherit">{t('dash.brief.activity')}</Button>
          </Stack>
        </Panel>
      </Box>

      <Box
        sx={{
          mt: 2,
          gap: 2,
          display: 'grid',
          alignItems: 'start',
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) minmax(0, 1.9fr)' },
        }}
      >
        <Panel sx={{ p: 1.5 }}>
          <FloorMap state={rerouted ? 'approved' : 'flagged'} markers={focusMarkers(rerouted, t)}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{
                top: 12,
                left: 12,
                py: 0.5,
                px: 1.25,
                borderRadius: 999,
                position: 'absolute',
                bgcolor: 'background.paper',
                boxShadow: (theme) => theme.customShadows.z1,
              }}
            >
              <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: 'success.main' }} />
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {t('dash.liveFloor')}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {t('dash.machinesRunning', { count: 214 })}
              </Typography>
            </Stack>
          </FloorMap>
        </Panel>

        <Panel>
          <Stack direction="row" alignItems="baseline" sx={{ mb: 2 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1">{t('timeline.title')}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {t('timeline.subtitle', { count: 214 })}
              </Typography>
            </Box>
            <Button
              component={RouterLink}
              href={paths.factory.dispatch}
              size="small"
              color="primary"
            >
              {t('timeline.open')}
            </Button>
          </Stack>

          <GanttTimeline
            rows={TIMELINE_ROWS}
            hours={TIMELINE_HOURS}
            now={TIMELINE_NOW}
            nowLabel="11:58"
            headLabel={t('timeline.head')}
          />
        </Panel>
      </Box>
    </Box>
  );
}
