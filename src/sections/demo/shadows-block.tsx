import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { ComponentBox } from 'src/components/card/component-box/component-box';

// ----------------------------------------------------------------------

const CUSTOM = ['z1', 'z4', 'z8', 'z12', 'z16', 'z20', 'z24', 'card', 'dialog', 'dropdown'] as const;

const COLORED = ['primary', 'secondary', 'info', 'success', 'warning', 'error'] as const;

type Props = { title: string };

/** theme.customShadows — ค่าที่ CRM ใช้กับ Card / Dialog / Popover */
export function ShadowsBlock({ title }: Props) {
  const theme = useTheme();

  return (
    <ComponentBox title={title}>
      <Box
        sx={{
          gap: 3,
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)', md: 'repeat(6, 1fr)' },
        }}
      >
        {CUSTOM.map((key) => (
          <Paper key={key} sx={{ p: 3, textAlign: 'center', boxShadow: theme.customShadows[key] }}>
            <Typography variant="subtitle2">{key}</Typography>
          </Paper>
        ))}

        {COLORED.map((key) => (
          <Paper
            key={key}
            sx={{
              p: 3,
              textAlign: 'center',
              color: `${key}.contrastText`,
              bgcolor: `${key}.main`,
              boxShadow: theme.customShadows[key],
            }}
          >
            <Typography variant="subtitle2">{key}</Typography>
          </Paper>
        ))}
      </Box>
    </ComponentBox>
  );
}
