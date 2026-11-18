import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useTranslate } from 'src/locales';

import { FactoryDashboardView } from 'src/sections/factory/dashboard/view';

// ----------------------------------------------------------------------

export default function FactoryDashboardPage() {
  const { t } = useTranslate('factory');

  return (
    <>
      <Helmet>
        <title>{`${t('nav.dashboard')} - ${CONFIG.site.name}`}</title>
      </Helmet>

      <FactoryDashboardView />
    </>
  );
}
