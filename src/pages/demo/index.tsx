import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { DemoView } from 'src/sections/demo/view';

// ----------------------------------------------------------------------

const metadata = { title: `Theme check - ${CONFIG.site.name}` };

/** หน้า demo สำหรับตรวจว่า theme ตรงกับ go-crm-24v4 — ลบทิ้งได้เมื่อเริ่มงานจริง */
export default function DemoPage() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DemoView />
    </>
  );
}
