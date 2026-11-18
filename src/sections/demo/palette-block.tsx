import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';

import { toast } from 'src/components/snackbar';
import { ComponentBox } from 'src/components/card/component-box/component-box';

// ----------------------------------------------------------------------

const COLORS = ['primary', 'secondary', 'info', 'success', 'warning', 'error'] as const;

const SHADES = ['lighter', 'light', 'main', 'dark', 'darker'] as const;

const GREYS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'] as const;

type Props = { title: string };

/** สี semantic + grey จาก theme.palette — คลิกสีเพื่อ copy hex */
export function PaletteBlock({ title }: Props) {
  const theme = useTheme();

  const { copy } = useCopyToClipboard();

  const onCopy = (value: string) => {
    copy(value);
    toast.success(`Copied: ${value}`);
  };

  return (
    <ComponentBox title={title}>
      <Stack spacing={2}>
        {COLORS.map((color) => (
          <Stack key={color} direction="row" spacing={1} alignItems="center">
            <Typography variant="subtitle2" sx={{ width: 96, textTransform: 'capitalize' }}>
              {color}
            </Typography>

            {SHADES.map((shade) => {
              const value = theme.palette[color][shade];

              return (
                <Swatch key={shade} value={value} label={shade} onClick={() => onCopy(value)} />
              );
            })}
          </Stack>
        ))}

        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="subtitle2" sx={{ width: 96 }}>
            Grey
          </Typography>

          {GREYS.map((key) => {
            const value = theme.palette.grey[key];

            return <Swatch key={key} value={value} label={key} onClick={() => onCopy(value)} />;
          })}
        </Stack>
      </Stack>
    </ComponentBox>
  );
}

// ----------------------------------------------------------------------

type SwatchProps = { value: string; label: string; onClick: () => void };

function Swatch({ value, label, onClick }: SwatchProps) {
  return (
    <Box
      onClick={onClick}
      sx={{
        width: 1,
        height: 56,
        cursor: 'pointer',
        borderRadius: 1,
        bgcolor: value,
        display: 'flex',
        alignItems: 'flex-end',
        p: 0.5,
      }}
    >
      <Typography
        variant="caption"
        sx={{ color: (theme) => theme.palette.getContrastText(value), lineHeight: 1 }}
      >
        {label}
      </Typography>
    </Box>
  );
}
