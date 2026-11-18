import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { ComponentBox } from 'src/components/card/component-box/component-box';

// ----------------------------------------------------------------------

const VARIANTS = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'subtitle1',
  'subtitle2',
  'body1',
  'body2',
  'caption',
  'overline',
  'button',
] as const;

type Props = { title: string };

/** ทุก variant ของ typography — ใช้เทียบ font-size / weight / line-height กับ CRM */
export function TypographyBlock({ title }: Props) {
  return (
    <ComponentBox title={title}>
      <Stack spacing={1.5}>
        {VARIANTS.map((variant) => (
          <Typography key={variant} variant={variant} component="p">
            {variant} — ทดสอบตัวอักษรภาษาไทย Kanit / The quick brown fox 0123456789
          </Typography>
        ))}
      </Stack>
    </ComponentBox>
  );
}
