import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export type FactoryNavItem = {
  /** key ของคำแปล `factory:nav.<key>` */
  key: string;
  path: string;
  icon: string;
  badge?: number;
  badgeColor?: 'error' | 'primary';
};

export const NAV_ITEMS: FactoryNavItem[] = [
  { key: 'dashboard', path: paths.factory.root, icon: 'solar:widget-5-bold' },
  { key: 'newOrder', path: paths.factory.newOrder, icon: 'solar:box-bold' },
  {
    key: 'dispatch',
    path: paths.factory.dispatch,
    icon: 'solar:plain-bold',
    badge: 3,
    badgeColor: 'primary',
  },
  {
    key: 'live',
    path: paths.factory.live,
    icon: 'solar:map-point-wave-bold',
    badge: 24,
    badgeColor: 'error',
  },
  { key: 'sequence', path: paths.factory.sequence, icon: 'solar:routing-2-bold' },
  { key: 'inbox', path: paths.factory.inbox, icon: 'solar:chat-round-dots-bold', badge: 6 },
];
