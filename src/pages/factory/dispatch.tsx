import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useTranslate } from 'src/locales';

import { FactoryDispatchView } from 'src/sections/factory/dispatch/view';

// ----------------------------------------------------------------------

export default function FactoryDispatchPage() {
  const { t } = useTranslate('factory');

  return (
    <>
      <Helmet>
        <title>{`${t('nav.dispatch')} - ${CONFIG.site.name}`}</title>
      </Helmet>

      <FactoryDispatchView />
    </>
  );
}
