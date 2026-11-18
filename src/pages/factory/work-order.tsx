import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { useTranslate } from 'src/locales';

import { FactoryWorkOrderView } from 'src/sections/factory/work-order/view';

// ----------------------------------------------------------------------

export default function FactoryWorkOrderPage() {
  const { t } = useTranslate('factory');

  const { id = '' } = useParams();

  return (
    <>
      <Helmet>
        <title>{`${t('wo.title', { id })} - ${CONFIG.site.name}`}</title>
      </Helmet>

      <FactoryWorkOrderView id={id} />
    </>
  );
}
