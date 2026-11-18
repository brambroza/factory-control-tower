import type { Theme, SxProps } from '@mui/material/styles';

import Stack from '@mui/material/Stack';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

import { greyTint } from '../styles';

// ----------------------------------------------------------------------

export type FilterPill = { key: string; label: string; count?: string | number };

type Props = {
  items: FilterPill[];
  value: string;
  onChange: (key: string) => void;
  /** elevated = พื้นขาวมีเงา (วางทับแผนที่) */
  elevated?: boolean;
  sx?: SxProps<Theme>;
};

/** ตัวกรองแบบ pill — ตัวที่เลือกเป็นพื้นเข้ม + เครื่องหมายถูก */
export function FilterPills({ items, value, onChange, elevated, sx }: Props) {
  return (
    <Stack direction="row" flexWrap="wrap" sx={[{ gap: 0.75 }, ...(Array.isArray(sx) ? sx : [sx])]}>
      {items.map((item) => {
        const selected = item.key === value;

        return (
          <ButtonBase
            key={item.key}
            onClick={() => onChange(item.key)}
            sx={{
              px: 1.25,
              gap: 0.75,
              height: 30,
              borderRadius: 999,
              whiteSpace: 'nowrap',
              typography: 'caption',
              fontWeight: 600,
              bgcolor: elevated ? 'background.paper' : greyTint(0.12),
              transition: (theme) => theme.transitions.create(['background-color', 'color']),
              ...(elevated && { boxShadow: (theme) => theme.customShadows.z1 }),
              ...(selected && { color: 'background.paper', bgcolor: 'text.primary' }),
            }}
          >
            {selected && <Iconify icon="eva:checkmark-fill" width={14} />}
            {item.label}
            {item.count !== undefined && (
              <Typography
                component="span"
                variant="caption"
                sx={{
                  px: 0.75,
                  borderRadius: 999,
                  bgcolor: greyTint(selected ? 0.48 : 0.16),
                }}
              >
                {item.count}
              </Typography>
            )}
          </ButtonBase>
        );
      })}
    </Stack>
  );
}
