import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useTranslate } from 'src/locales';

import { FactoryLiveView } from 'src/sections/factory/live/view';

// ----------------------------------------------------------------------

export default function FactoryLivePage() {
  const { t } = useTranslate('factory');

  return (
    <>
      <Helmet>
        <title>{`${t('nav.live')} - ${CONFIG.site.name}`}</title>
      </Helmet>

      <FactoryLiveView />
    </>
  );
}
