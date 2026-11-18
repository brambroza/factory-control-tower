import type { LanguageValue } from 'src/locales';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/config-global';
import { useTranslate } from 'src/locales';

import { Logo } from 'src/components/logo';
import { SettingsButton } from 'src/components/settings';

import { FormBlock } from './form-block';
import { PaletteBlock } from './palette-block';
import { ShadowsBlock } from './shadows-block';
import { TypographyBlock } from './typography-block';
import { ComponentsBlock } from './components-block';

// ----------------------------------------------------------------------

/**
 * หน้าเดียวที่รวมทุก block ไว้เทียบกับ CRM
 * เปิด CRM (8080) คู่กับ starter (8081) แล้วเทียบด้วยตา + ค่า CSS var บน :root
 */
export function DemoView() {
  const { t, currentLang, onChangeLang } = useTranslate();

  const nextLang: LanguageValue = currentLang.value === 'th' ? 'en' : 'th';

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 5 }}>
        <Logo />

        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4">
            {CONFIG.site.name} — {t('demo.title')}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('demo.description')}
          </Typography>
        </Box>

        <Button variant="outlined" color="inherit" onClick={() => onChangeLang(nextLang)}>
          {currentLang.label} → {nextLang.toUpperCase()}
        </Button>

        <SettingsButton />
      </Stack>

      <Stack spacing={6}>
        <PaletteBlock title={t('demo.palette')} />
        <TypographyBlock title={t('demo.typography')} />
        <ComponentsBlock title={t('demo.components')} />
        <FormBlock title={t('demo.form')} />
        <ShadowsBlock title={t('demo.shadows')} />
      </Stack>
    </Container>
  );
}
