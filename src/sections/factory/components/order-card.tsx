import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import { riseIn } from '../motion';
import { tint, greyTint } from '../styles';

import type { WorkOrder } from '../_mock';

// ----------------------------------------------------------------------

const STATUS_COLOR = { risk: 'warning', delayed: 'error', booked: 'default' } as const;

const STATUS_ICON = {
  risk: 'solar:danger-triangle-bold',
  delayed: 'solar:clock-circle-bold',
  booked: 'solar:calendar-mark-bold',
} as const;

const RISK_LEVEL = { low: 1, medium: 2, high: 3 } as const;

const RISK_COLOR = { low: 'success', medium: 'warning', high: 'error' } as const;

type Props = {
  order: WorkOrder;
  selected?: boolean;
  /** หลังอนุมัติย้ายเครื่อง: สถานะกลับเป็น "ตามแผน" และเวลาปลายทางเปลี่ยน */
  resolved?: { toTime: string };
  onClick?: () => void;
};

/** การ์ดใบสั่งผลิตในคิวจ่ายงาน */
export function OrderCard({ order, selected, resolved, onClick }: Props) {
  const { t } = useTranslate('factory');

  const riskColor = RISK_COLOR[order.risk];

  return (
    <Box
      layout
      component={m.div}
      variants={riseIn}
      onClick={onClick}
      sx={{
        p: 1.5,
        borderRadius: 2.5,
        bgcolor: 'background.neutral',
        border: '1.5px solid transparent',
        cursor: onClick ? 'pointer' : 'default',
        transition: (theme) => theme.transitions.create(['border-color', 'background-color']),
        ...(selected && { borderColor: 'primary.main', bgcolor: 'background.paper' }),
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
          {order.id}
        </Typography>

        {resolved ? (
          <Label color="success" startIcon={<Iconify icon="solar:check-circle-bold" />}>
            {t('status.onPlan')}
          </Label>
        ) : (
          <Label
            color={STATUS_COLOR[order.status]}
            startIcon={<Iconify icon={STATUS_ICON[order.status]} />}
          >
            {t(`status.${order.status}`)}
          </Label>
        )}
      </Stack>

      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.25 }}>
        <Box
          sx={{
            width: 28,
            height: 28,
            flexShrink: 0,
            display: 'grid',
            borderRadius: 1,
            placeItems: 'center',
            color: `${order.tone}.main`,
            bgcolor: tint(order.tone, 0.16),
          }}
        >
          <Iconify icon={order.icon} width={16} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle2" noWrap>
            {order.customer}
          </Typography>
          <Typography variant="caption" noWrap sx={{ display: 'block', color: 'text.secondary' }}>
            {order.product} · {t('common.lots', { count: order.lots })}
          </Typography>
        </Box>
      </Stack>

      <Stack
        spacing={0.5}
        sx={{ p: 1.25, borderRadius: 1.5, bgcolor: selected ? greyTint(0.08) : 'background.paper' }}
      >
        {[
          { place: order.from, time: order.fromTime, filled: true, late: false },
          {
            place: order.to,
            time: resolved?.toTime ?? order.toTime,
            filled: false,
            late: !resolved && order.status !== 'booked',
          },
        ].map((stop) => (
          <Stack key={stop.place} direction="row" alignItems="center" spacing={1}>
            <Box
              sx={{
                width: 8,
                height: 8,
                flexShrink: 0,
                borderRadius: '50%',
                bgcolor: stop.filled ? 'text.primary' : 'transparent',
                border: (theme) =>
                  `2px solid ${stop.filled ? theme.vars.palette.text.primary : theme.vars.palette.primary.main}`,
              }}
            />
            <Typography variant="caption" sx={{ flexGrow: 1, fontWeight: 500 }}>
              {stop.place}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                ...(stop.late && { color: 'error.main', fontWeight: 600 }),
                ...(resolved && !stop.filled && { color: 'success.main', fontWeight: 600 }),
              }}
            >
              {stop.time}
            </Typography>
          </Stack>
        ))}
      </Stack>

      <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1.25 }}>
        {order.owner ? (
          <>
            <Avatar sx={{ width: 22, height: 22, fontSize: 11 }}>{order.owner.slice(0, 1)}</Avatar>
            <Typography variant="caption" noWrap sx={{ flexGrow: 1 }}>
              {order.owner}
            </Typography>
          </>
        ) : (
          <Typography variant="caption" noWrap sx={{ flexGrow: 1, color: 'primary.main' }}>
            {order.note}
          </Typography>
        )}

        <Stack direction="row" alignItems="flex-end" spacing={0.25} sx={{ height: 12 }}>
          {[1, 2, 3].map((level) => (
            <Box
              key={level}
              sx={{
                width: 3,
                borderRadius: 1,
                height: 4 + level * 2.5,
                bgcolor: level <= RISK_LEVEL[order.risk] ? `${riskColor}.main` : greyTint(0.32),
              }}
            />
          ))}
        </Stack>
        <Typography variant="caption" sx={{ color: `${riskColor}.main`, fontWeight: 600 }}>
          {t(`risk.${order.risk}`)}
        </Typography>
      </Stack>
    </Box>
  );
}
