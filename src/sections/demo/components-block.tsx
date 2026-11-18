import { useState } from 'react';

import Tab from '@mui/material/Tab';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { useBoolean } from 'src/hooks/use-boolean';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { CustomTabs } from 'src/components/custom-tabs';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { ComponentBox } from 'src/components/card/component-box/component-box';

// ----------------------------------------------------------------------

const COLORS = ['inherit', 'primary', 'secondary', 'info', 'success', 'warning', 'error'] as const;

const LABEL_COLORS = ['default', 'primary', 'secondary', 'info', 'success', 'warning', 'error'] as const;

const BUTTON_VARIANTS = ['contained', 'outlined', 'text', 'soft'] as const;

const LABEL_VARIANTS = ['filled', 'outlined', 'soft', 'inverted'] as const;

type Props = { title: string };

/** Button ทุก variant/สี, Label, Iconify, Popover, ConfirmDialog, CustomTabs */
export function ComponentsBlock({ title }: Props) {
  const confirm = useBoolean();

  const popover = usePopover();

  const [tab, setTab] = useState('one');

  return (
    <ComponentBox title={title}>
      <Stack spacing={3}>
        {BUTTON_VARIANTS.map((variant) => (
          <Stack key={variant} direction="row" spacing={1} flexWrap="wrap" alignItems="center">
            <Typography variant="subtitle2" sx={{ width: 96, textTransform: 'capitalize' }}>
              {variant}
            </Typography>
            {COLORS.map((color) => (
              <Button key={color} variant={variant} color={color}>
                {color}
              </Button>
            ))}
          </Stack>
        ))}

        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="subtitle2" sx={{ width: 96 }}>
            Lab
          </Typography>
          <LoadingButton loading variant="contained">
            Loading
          </LoadingButton>
          <LoadingButton loading loadingPosition="start" startIcon={<Iconify icon="mingcute:add-line" />} variant="outlined">
            Saving
          </LoadingButton>
          <Button variant="contained" startIcon={<Iconify icon="mingcute:add-line" />}>
            With icon
          </Button>
        </Stack>

        {LABEL_VARIANTS.map((variant) => (
          <Stack key={variant} direction="row" spacing={1} alignItems="center">
            <Typography variant="subtitle2" sx={{ width: 96, textTransform: 'capitalize' }}>
              Label {variant}
            </Typography>
            {LABEL_COLORS.map((color) => (
              <Label key={color} variant={variant} color={color}>
                {color}
              </Label>
            ))}
          </Stack>
        ))}

        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="subtitle2" sx={{ width: 96 }}>
            Overlay
          </Typography>
          <Button variant="outlined" color="inherit" onClick={popover.onOpen}>
            Popover
          </Button>
          <Button variant="outlined" color="error" onClick={confirm.onTrue}>
            Confirm dialog
          </Button>
        </Stack>

        <CustomTabs value={tab} onChange={(_, value) => setTab(value)} sx={{ width: 1 }}>
          <Tab value="one" label="Tab one" />
          <Tab value="two" label="Tab two" />
          <Tab value="three" label="Tab three" />
        </CustomTabs>
      </Stack>

      <CustomPopover open={popover.open} anchorEl={popover.anchorEl} onClose={popover.onClose}>
        <MenuItem onClick={popover.onClose}>
          <Iconify icon="solar:pen-bold" /> Edit
        </MenuItem>
        <MenuItem onClick={popover.onClose} sx={{ color: 'error.main' }}>
          <Iconify icon="solar:trash-bin-trash-bold" /> Delete
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="ยืนยันการลบ"
        content="ตัวอย่าง ConfirmDialog — ปุ่มยกเลิกใช้คำแปลจาก translation.json"
        action={
          <Button variant="contained" color="error" onClick={confirm.onFalse}>
            ลบ
          </Button>
        }
      />
    </ComponentBox>
  );
}
