import { FOCUS_ORDER } from './_mock';
import { MAP_NODES } from './components/floor-map';

import type { MapMarker } from './components/floor-map';

// ----------------------------------------------------------------------

type Translate = (key: string, options?: Record<string, unknown>) => string;

const MACHINE_ICON = 'solar:settings-minimalistic-bold';

/**
 * marker ชุดมาตรฐานของผังโรงงานรอบ ๆ ใบสั่งผลิตที่ถูกปักธง
 * ก่อนอนุมัติ: งานอยู่ที่ M-07 (เตือน + เต้น) · หลังอนุมัติ: marker เดียวกันย้ายไป M-12
 */
export function focusMarkers(rerouted: boolean, t: Translate): MapMarker[] {
  const order = FOCUS_ORDER;

  return [
    { id: 'warehouse', ...MAP_NODES.warehouse, icon: 'solar:garage-bold' },
    { id: 'dryer', ...MAP_NODES.dryer, icon: 'solar:fire-bold' },
    { id: 'm09', ...MAP_NODES.m09, icon: 'solar:danger-triangle-bold', tone: 'error' },
    { id: 'trim', ...MAP_NODES.trim, icon: 'solar:scissors-bold' },
    { id: 'fg', ...MAP_NODES.fg, icon: 'solar:box-bold' },
    {
      id: 'idle',
      ...(rerouted ? MAP_NODES.m07 : MAP_NODES.m12),
      icon: MACHINE_ICON,
    },
    rerouted
      ? {
          id: 'focus',
          ...MAP_NODES.m12,
          icon: MACHINE_ICON,
          tone: 'primary',
          title: order.id,
          sub: t('map.onTimeVia', { machine: order.altMachine }),
          subTone: 'success',
        }
      : {
          id: 'focus',
          ...MAP_NODES.m07,
          icon: MACHINE_ICON,
          tone: 'warning',
          pulse: true,
          title: order.id,
          sub: t('map.lateBy', { count: order.delayMin }),
        },
  ];
}
