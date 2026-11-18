import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { NEW_MESSAGE } from '../_mock';
import { tint, greyTint } from '../styles';
import { AgentOrb, BlurDialog, FilterPills, useTypewriter } from '../components';

// ----------------------------------------------------------------------

type MessageSchemaType = { subject: string; message: string };

type Props = { open: boolean; onClose: () => void };

const aiFieldSx = { '& .MuiOutlinedInput-root': { bgcolor: tint('primary', 0.08) } };

/** เขียนข้อความถึงลูกค้า — เริ่มจากร่างของ Customer Agent (พิมพ์ให้เห็นทีละตัว) แล้วแก้ต่อได้ */
export function NewMessageDialog({ open, onClose }: Props) {
  const { t } = useTranslate('factory');

  const [channel, setChannel] = useState('email');

  const methods = useForm<MessageSchemaType>({
    resolver: zodResolver(
      zod.object({
        subject: zod.string().min(1, { message: t('order.required') }),
        message: zod.string().min(1, { message: t('order.required') }),
      })
    ),
    defaultValues: { subject: '', message: '' },
  });

  const { reset, setValue, handleSubmit } = methods;

  const typed = useTypewriter(NEW_MESSAGE.body, open, 14);

  useEffect(() => {
    if (open) reset({ subject: NEW_MESSAGE.subject, message: '' });
  }, [open, reset]);

  // ส่งข้อความที่ agent พิมพ์เข้า form — หยุดเมื่อพิมพ์จบ เพื่อให้ผู้ใช้แก้ต่อได้
  useEffect(() => {
    if (open && typed.value) setValue('message', typed.value);
  }, [open, setValue, typed.value]);

  const onSubmit = handleSubmit(async () => {
    toast.success(t('msg.toast', { name: NEW_MESSAGE.to.split(' ')[0] }));
    onClose();
  });

  return (
    <BlurDialog
      open={open}
      onClose={onClose}
      agent="Customer Agent"
      title={t('msg.title')}
      description={t('msg.description')}
      footNote={t('msg.footNote', { about: NEW_MESSAGE.about.split(' ')[0] })}
      actions={
        <>
          <Button variant="outlined" color="inherit" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button variant="contained" color="primary" disabled={!typed.done} onClick={onSubmit}>
            {channel === 'email' ? t('msg.sendEmail') : t('msg.sendSms')}
          </Button>
        </>
      }
    >
      <Form methods={methods} onSubmit={onSubmit}>
        <Stack spacing={2}>
          <Box>
            <FieldLabel>{t('msg.to')}</FieldLabel>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{
                p: 0.75,
                borderRadius: 1.5,
                border: (theme) => `1px solid ${theme.vars.palette.divider}`,
              }}
            >
              <Chip
                size="small"
                label={NEW_MESSAGE.to}
                onDelete={() => {}}
                avatar={<Avatar>{NEW_MESSAGE.to.slice(0, 1)}</Avatar>}
              />
              <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                {t('msg.addPeople')}
              </Typography>
            </Stack>
          </Box>

          <Stack direction="row" spacing={2}>
            <Box>
              <FieldLabel>{t('msg.channel')}</FieldLabel>
              <FilterPills
                value={channel}
                onChange={setChannel}
                items={[
                  { key: 'email', label: t('msg.email') },
                  { key: 'sms', label: 'SMS' },
                ]}
              />
            </Box>

            <Box sx={{ flexGrow: 1 }}>
              <FieldLabel>{t('msg.about')}</FieldLabel>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ px: 1.5, height: 36, borderRadius: 1.5, bgcolor: greyTint(0.1) }}
              >
                <Iconify icon="solar:box-bold" width={16} />
                <Typography variant="body2" sx={{ flexGrow: 1 }}>
                  {NEW_MESSAGE.about}
                </Typography>
                <Iconify
                  icon="eva:arrow-ios-downward-fill"
                  width={16}
                  sx={{ color: 'text.disabled' }}
                />
              </Stack>
            </Box>
          </Stack>

          <Field.Text name="subject" label={t('msg.subject')} size="small" sx={aiFieldSx} />

          <Box sx={{ position: 'relative' }}>
            <Field.Text
              multiline
              rows={7}
              name="message"
              label={t('msg.message')}
              sx={{ ...aiFieldSx, '& textarea': { pb: 5 } }}
            />

            <Stack
              direction="row"
              alignItems="center"
              spacing={0.75}
              sx={{ left: 12, bottom: 12, position: 'absolute' }}
            >
              <AgentOrb size={22} />
              {NEW_MESSAGE.tones.map((tone) => (
                <Chip
                  key={tone}
                  size="small"
                  variant="outlined"
                  color="primary"
                  label={tone}
                  onClick={() => {}}
                />
              ))}
            </Stack>
          </Box>
        </Stack>
      </Form>
    </BlurDialog>
  );
}

// ----------------------------------------------------------------------

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography variant="caption" sx={{ mb: 0.75, display: 'block', color: 'text.secondary' }}>
      {children}
    </Typography>
  );
}
