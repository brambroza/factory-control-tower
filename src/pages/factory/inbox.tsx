import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useTranslate } from 'src/locales';

import { FactoryInboxView } from 'src/sections/factory/inbox/view';

// ----------------------------------------------------------------------

export default function FactoryInboxPage() {
  const { t } = useTranslate('factory');

  return (
    <>
      <Helmet>
        <title>{`${t('nav.inbox')} - ${CONFIG.site.name}`}</title>
      </Helmet>

      <FactoryInboxView />
    </>
  );
}
