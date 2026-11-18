import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useTranslate } from 'src/locales';

import { FactoryNewOrderView } from 'src/sections/factory/new-order/view';

// ----------------------------------------------------------------------

export default function FactoryNewOrderPage() {
  const { t } = useTranslate('factory');

  return (
    <>
      <Helmet>
        <title>{`${t('order.title')} - ${CONFIG.site.name}`}</title>
      </Helmet>

      <FactoryNewOrderView />
    </>
  );
}
