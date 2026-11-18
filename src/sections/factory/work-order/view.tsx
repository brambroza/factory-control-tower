import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';
import { PageHeader } from 'src/layouts/factory';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import { tint, greyTint } from '../styles';
import { useFactoryDemo } from '../context';
import { ShareDialog } from './share-dialog';
import { EASE, popIn, riseIn, stagger } from '../motion';
import { Panel, AgentTag, OrderHero } from '../components';
import { LOT_SLOTS, FOCUS_ORDER, CURRENT_USER, ORDER_EVENTS, ORDER_AGENT_NOTE } from '../_mock';

// ----------------------------------------------------------------------

type Props = { id: string };

/** รายละเอียดใบสั่งผลิต: การ์ดเครื่อง + ล็อตการผลิต + คำอธิบายของ agent + ไทม์ไลน์เหตุการณ์ */
export function FactoryWorkOrderView({ id }: Props) {
  const { t } = useTranslate('factory');

  const { rerouted } = useFactoryDemo();

  const share = useBoolean();

  const order = FOCUS_ORDER;

  const events = rerouted ? ORDER_EVENTS : ORDER_EVENTS.slice(0, 3);

  const doneLots = LOT_SLOTS.filter((slot) => slot.state === 'done').length;

  return (
    <Box component={m.div} variants={stagger()} initial="hidden" animate="show">
      <PageHeader
        back
        crumbs={[t('crumb.orders'), order.customer, id]}
        title={t('wo.title', { id })}
        actions={
          <>
            <Button
              variant="outlined"
              color="inherit"
              onClick={share.onTrue}
              startIcon={<Iconify icon="solar:share-bold" />}
            >
              {t('wo.share')}
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<Iconify icon="solar:phone-bold" />}
            >
              {t('wo.call')}
            </Button>
            {!rerouted && (
              <Button
                component={RouterLink}
                href={paths.factory.dispatch}
                variant="contained"
                color="primary"
              >
                {t('dispatch.approveMove')}
              </Button>
            )}
          </>
        }
      />

      <Box
        sx={{
          gap: 2,
          display: 'grid',
          alignItems: 'start',
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.9fr) minmax(0, 1fr)' },
        }}
      >
        <Stack spacing={2} sx={{ minWidth: 0 }}>
          <OrderHero rerouted={rerouted} />

          <Box
            sx={{
              gap: 2,
              display: 'grid',
              alignItems: 'start',
              gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.6fr) minmax(0, 1fr)' },
            }}
          >
            <Panel>
              <Stack direction="row" alignItems="center" sx={{ mb: 2 }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1">{t('wo.lots', { mold: order.mold })}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {t('wo.lotsMeta', { done: doneLots, total: LOT_SLOTS.length })}
                  </Typography>
                </Box>
                <Label color="primary" startIcon={<Iconify icon="solar:temperature-bold" />}>
                  {order.moldTemp} · {t('wo.stable')}
                </Label>
              </Stack>

              <Box
                component={m.div}
                variants={stagger(0.5, 0.025)}
                sx={{ gap: 0.75, display: 'grid', gridTemplateColumns: 'repeat(13, 1fr)' }}
              >
                {LOT_SLOTS.map((slot) => (
                  <Box
                    key={slot.no}
                    component={m.div}
                    variants={popIn}
                    sx={{
                      borderRadius: 1,
                      aspectRatio: '1 / 1',
                      position: 'relative',
                      bgcolor: greyTint(0.2),
                      ...(slot.state === 'done' && { bgcolor: 'text.primary' }),
                      ...(slot.state === 'running' && { bgcolor: 'primary.main' }),
                    }}
                  >
                    {slot.state === 'running' && (
                      <Box
                        component={m.span}
                        animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
                        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
                        sx={{
                          inset: 0,
                          borderRadius: 1,
                          position: 'absolute',
                          border: (theme) => `2px solid ${theme.vars.palette.primary.main}`,
                        }}
                      />
                    )}
                  </Box>
                ))}
              </Box>

              <Stack direction="row" spacing={2} sx={{ mt: 1.5 }}>
                {(['done', 'running', 'wait'] as const).map((state) => (
                  <Stack key={state} direction="row" alignItems="center" spacing={0.75}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: 0.5,
                        bgcolor: greyTint(0.32),
                        ...(state === 'done' && { bgcolor: 'text.primary' }),
                        ...(state === 'running' && { bgcolor: 'primary.main' }),
                      }}
                    />
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {t(`wo.lot.${state}`)}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Panel>

            <Panel>
              {[
                { label: t('wo.po'), value: order.po },
                { label: t('wo.start'), value: order.start },
                { label: t('wo.product'), value: order.product },
                { label: t('wo.shiftLeft'), value: `${order.shiftLeft} · ${order.shiftNote}` },
              ].map((row) => (
                <Box key={row.label} sx={{ '&:not(:last-of-type)': { mb: 1.25 } }}>
                  <Typography variant="overline" sx={{ fontSize: 10, color: 'text.disabled' }}>
                    {row.label}
                  </Typography>
                  <Typography variant="subtitle2">{row.value}</Typography>
                </Box>
              ))}
            </Panel>
          </Box>
        </Stack>

        <Stack spacing={2} sx={{ minWidth: 0 }}>
          <Panel tone="agent">
            <AgentTag label="Planning Agent" sx={{ mb: 1.5 }} />

            <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
              {rerouted ? t('wo.riskResolved') : t('wo.riskOpen')}
            </Typography>

            <Stack spacing={1.25}>
              {(['what', 'why', 'recommendation'] as const).map((key) => (
                <Box
                  key={key}
                  sx={{ gap: 1.5, display: 'grid', gridTemplateColumns: '96px minmax(0, 1fr)' }}
                >
                  <Typography variant="overline" sx={{ fontSize: 10, color: 'text.disabled' }}>
                    {t(`wo.agent.${key}`)}
                  </Typography>
                  <Typography variant="body2">{ORDER_AGENT_NOTE[key]}</Typography>
                </Box>
              ))}
            </Stack>

            <Box
              component={m.div}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, duration: 0.5, ease: EASE }}
              sx={{ mt: 2, p: 1.5, borderRadius: 2, bgcolor: 'background.paper' }}
            >
              <Typography variant="h5" sx={{ color: rerouted ? 'success.main' : 'primary.main' }}>
                −{t('common.minutes', { count: order.savedMin })}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {rerouted ? t('hero.saved') : t('wo.canSave')}
              </Typography>
            </Box>

            {rerouted && (
              <Stack
                direction="row"
                alignItems="center"
                spacing={0.75}
                sx={{ mt: 1.5, color: 'text.secondary' }}
              >
                <Iconify icon="eva:checkmark-fill" width={16} />
                <Typography variant="caption">
                  {t('wo.approvedBy', { name: CURRENT_USER.fullName })}
                </Typography>
              </Stack>
            )}

            <Button
              component={RouterLink}
              href={paths.factory.live}
              variant="outlined"
              color="inherit"
              startIcon={<Iconify icon="solar:eye-bold" />}
              sx={{ mt: 1.5, bgcolor: 'background.paper' }}
            >
              {t('wo.viewOnFloor')}
            </Button>
          </Panel>

          <Panel>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              {t('wo.timeline')}
            </Typography>

            <Stack component={m.div} variants={stagger(0.6, 0.12)}>
              {events.map((event, index) => (
                <Stack
                  key={event.time}
                  component={m.div}
                  variants={riseIn}
                  direction="row"
                  spacing={1.5}
                  sx={{ pb: index === events.length - 1 ? 0 : 2, position: 'relative' }}
                >
                  {index !== events.length - 1 && (
                    <Box
                      sx={{
                        top: 30,
                        left: 13,
                        bottom: 2,
                        width: 2,
                        position: 'absolute',
                        bgcolor: greyTint(0.24),
                      }}
                    />
                  )}
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      flexShrink: 0,
                      display: 'grid',
                      borderRadius: '50%',
                      placeItems: 'center',
                      color: `${event.tone}.main`,
                      bgcolor: tint(event.tone, 0.16),
                    }}
                  >
                    <Iconify icon={event.icon} width={16} />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                      {event.time}
                    </Typography>
                    <Typography variant="subtitle2">{event.title}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {event.by}
                    </Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Panel>
        </Stack>
      </Box>

      <ShareDialog open={share.value} onClose={share.onFalse} />
    </Box>
  );
}
