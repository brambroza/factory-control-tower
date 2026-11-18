import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useTranslate } from 'src/locales';

import { FactorySequenceView } from 'src/sections/factory/sequence/view';

// ----------------------------------------------------------------------

export default function FactorySequencePage() {
  const { t } = useTranslate('factory');

  return (
    <>
      <Helmet>
        <title>{`${t('nav.sequence')} - ${CONFIG.site.name}`}</title>
      </Helmet>

      <FactorySequenceView />
    </>
  );
}
