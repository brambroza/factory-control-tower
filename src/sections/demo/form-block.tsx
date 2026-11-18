import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { ComponentBox } from 'src/components/card/component-box/component-box';

// ----------------------------------------------------------------------

const DemoSchema = zod.object({
  name: zod.string().min(1, { message: 'กรุณากรอกชื่อ' }),
  qty: zod.number().min(1, { message: 'จำนวนต้องมากกว่า 0' }),
  status: zod.string().min(1, { message: 'กรุณาเลือกสถานะ' }),
  tags: zod.array(zod.string()),
  startDate: zod.string().nullable(),
  country: zod.string(),
  phone: zod.string(),
  agree: zod.boolean().refine((value) => value, { message: 'ต้องยอมรับเงื่อนไข' }),
  notify: zod.boolean(),
});

type DemoSchemaType = zod.infer<typeof DemoSchema>;

const STATUS_OPTIONS = ['draft', 'approved', 'closed'];

const TAG_OPTIONS = ['CRM', 'WMS', 'HRM', 'Service'];

type Props = { title: string };

/** Form + zod + Field.* ชุดเดียวกับ CRM — submit แล้วแสดงค่าใน toast */
export function FormBlock({ title }: Props) {
  const methods = useForm<DemoSchemaType>({
    resolver: zodResolver(DemoSchema),
    defaultValues: {
      name: '',
      qty: 1,
      status: '',
      tags: [],
      startDate: null,
      country: 'TH',
      phone: '',
      agree: false,
      notify: true,
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    toast.success(JSON.stringify(data, null, 2));
  });

  return (
    <ComponentBox title={title}>
      <Form methods={methods} onSubmit={onSubmit}>
        <Box
          sx={{
            gap: 2,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          }}
        >
          <Field.Text name="name" label="ชื่อ" />
          <Field.TextNumber name="qty" label="จำนวน" />

          <Field.Select name="status" label="สถานะ">
            {STATUS_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Field.Select>

          <Field.Autocomplete
            name="tags"
            label="Tags"
            multiple
            options={TAG_OPTIONS}
            getOptionLabel={(option) => option}
          />

          <Field.DatePicker name="startDate" label="วันเริ่ม" />
          <Field.CountrySelect name="country" label="ประเทศ" />
          <Field.Phone name="phone" label="โทรศัพท์" />

          <Stack direction="row" spacing={2}>
            <Field.Checkbox name="agree" label="ยอมรับเงื่อนไข" />
            <Field.Switch name="notify" label="แจ้งเตือน" />
          </Stack>
        </Box>

        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            บันทึก
          </LoadingButton>
        </Stack>
      </Form>
    </ComponentBox>
  );
}
