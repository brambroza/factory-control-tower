import type { Theme, SxProps } from '@mui/material/styles';

import { z as zod } from 'zod';
import { m } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import LinearProgress from '@mui/material/LinearProgress';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import { PageHeader } from 'src/layouts/factory';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { tint, greyTint } from '../styles';
import { EASE, riseIn, stagger } from '../motion';
import { Panel, AgentOrb, AgentTag } from '../components';
import { NEW_ORDER_AI, NEW_ORDER_OPTIONS, NEW_ORDER_OPERATOR } from '../_mock';

// ----------------------------------------------------------------------

type OrderSchemaType = zod.infer<ReturnType<typeof createSchema>>;

const createSchema = (required: string) =>
  zod.object({
    customer: zod.string().min(1, { message: required }),
    contact: zod.string(),
    customerPo: zod.string().min(1, { message: required }),
    billTo: zod.string(),
    machine: zod.string().min(1, { message: required }),
    startDate: zod.string(),
    startWindow: zod.string(),
    deliverTo: zod.string(),
    dueDate: zod.string(),
    dueWindow: zod.string().min(1, { message: required }),
    product: zod.string().min(1, { message: required }),
    qty: zod.string().min(1, { message: required }),
    material: zod.string(),
    mold: zod.string(),
    note: zod.string(),
    assignOperator: zod.boolean(),
    notifyBooking: zod.boolean(),
    notifySms: zod.boolean(),
  });

type TextFieldName = Exclude<
  keyof OrderSchemaType,
  'assignOperator' | 'notifyBooking' | 'notifySms'
>;

/** ลำดับที่ agent กรอก — ไล่จากบนลงล่างเหมือนคนอ่านเอกสาร */
const AI_FILL_ORDER: TextFieldName[] = [
  'customer',
  'contact',
  'customerPo',
  'billTo',
  'machine',
  'startDate',
  'startWindow',
  'deliverTo',
  'dueDate',
  'dueWindow',
  'product',
  'qty',
  'material',
  'mold',
  'note',
];

const AI_VALUES: Record<TextFieldName, string> = {
  ...NEW_ORDER_AI,
  deliverTo: `${NEW_ORDER_AI.customer} · บางพลี`,
};

const SUGGESTED_WINDOW = '13:00 – 14:30';

const DRAFT_ID = 'WO-49412';

// ----------------------------------------------------------------------

/**
 * เปิดใบสั่งผลิตใหม่ — agent อ่านใบสั่งซื้อ (PDF/อีเมล) แล้วกรอกฟอร์มให้
 * ช่องที่ AI กรอกเป็นพื้นสี primary จาง · ช่องที่ต้องให้คนตรวจเป็นสี warning
 */
export function FactoryNewOrderView() {
  const { t } = useTranslate('factory');

  const router = useRouter();

  const [phase, setPhase] = useState<'reading' | 'filling' | 'done'>('reading');

  const [aiFields, setAiFields] = useState<string[]>([]);

  const [needsCheck, setNeedsCheck] = useState(true);

  const methods = useForm<OrderSchemaType>({
    resolver: zodResolver(createSchema(t('order.required'))),
    defaultValues: {
      customer: '',
      contact: '',
      customerPo: '',
      billTo: '',
      machine: '',
      startDate: '',
      startWindow: '',
      deliverTo: '',
      dueDate: '',
      dueWindow: '',
      product: '',
      qty: '',
      material: '',
      mold: '',
      note: '',
      assignOperator: true,
      notifyBooking: true,
      notifySms: true,
    },
  });

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  // อ่านเอกสาร → กรอกทีละช่อง
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(setTimeout(() => setPhase('filling'), 1400));

    AI_FILL_ORDER.forEach((name, index) => {
      timers.push(
        setTimeout(
          () => {
            setValue(name, AI_VALUES[name], { shouldValidate: true });
            setAiFields((prev) => [...prev, name]);
          },
          1500 + index * 130
        )
      );
    });

    timers.push(setTimeout(() => setPhase('done'), 1500 + AI_FILL_ORDER.length * 130 + 200));

    return () => timers.forEach(clearTimeout);
  }, [setValue]);

  const applySuggestedWindow = useCallback(() => {
    setValue('dueWindow', SUGGESTED_WINDOW, { shouldValidate: true });
    setNeedsCheck(false);
  }, [setValue]);

  const onSubmit = handleSubmit(async () => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    toast.success(t('order.toast', { id: DRAFT_ID }));
    router.push(`${paths.factory.dispatch}?assign=1`);
  });

  const fieldSx = (name: string): SxProps<Theme> => ({
    '& .MuiOutlinedInput-root': {
      transition: (theme) => theme.transitions.create('background-color', { duration: 600 }),
      ...(aiFields.includes(name) && { bgcolor: tint('primary', 0.08) }),
      ...(name === 'dueWindow' &&
        needsCheck &&
        aiFields.includes(name) && { bgcolor: tint('warning', 0.16) }),
    },
  });

  const filledCount = aiFields.length;

  const renderSelect = (name: keyof typeof NEW_ORDER_OPTIONS, label: string) => (
    <Field.Select name={name} label={label} size="small" sx={fieldSx(name)}>
      {NEW_ORDER_OPTIONS[name].map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </Field.Select>
  );

  const renderText = (name: TextFieldName, label: string) => (
    <Field.Text name={name} label={label} size="small" sx={fieldSx(name)} />
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Box component={m.div} variants={stagger()} initial="hidden" animate="show">
        <PageHeader
          back
          crumbs={[t('crumb.orders'), t('order.crumbNew')]}
          title={t('order.title')}
          actions={
            <>
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<Iconify icon="solar:diskette-bold" />}
              >
                {t('order.saveDraft')}
              </Button>
              <LoadingButton
                type="submit"
                variant="contained"
                color="primary"
                loading={isSubmitting}
                disabled={phase !== 'done'}
                startIcon={<Iconify icon="eva:checkmark-fill" />}
              >
                {t('order.create')}
              </LoadingButton>
            </>
          }
        />

        <Box
          sx={{
            gap: 2,
            display: 'grid',
            alignItems: 'start',
            gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.9fr) minmax(0, 1fr)' },
          }}
        >
          <Stack spacing={2} sx={{ minWidth: 0 }}>
            {/* source */}
            <Panel tone="agent" sx={{ py: 1.5, overflow: 'hidden', position: 'relative' }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <AgentOrb size={32} />
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography variant="subtitle2" noWrap>
                    {phase === 'reading'
                      ? t('order.reading', { file: NEW_ORDER_AI.file })
                      : t('order.filledFrom', { customer: NEW_ORDER_AI.customer })}
                  </Typography>
                  <Typography
                    variant="caption"
                    noWrap
                    sx={{ display: 'block', color: 'text.secondary' }}
                  >
                    {NEW_ORDER_AI.file} · {t('order.filledMeta', { count: filledCount })}
                    {needsCheck && phase === 'done' && ` · ${t('order.needsCheck', { count: 1 })}`}
                  </Typography>
                </Box>
                <Button
                  size="small"
                  variant="outlined"
                  color="inherit"
                  startIcon={<Iconify icon="solar:file-bold" />}
                  sx={{ bgcolor: 'background.paper' }}
                >
                  {t('order.replaceFile')}
                </Button>
                <Button
                  size="small"
                  color="inherit"
                  startIcon={<Iconify icon="solar:letter-bold" />}
                >
                  {t('order.pasteEmail')}
                </Button>
              </Stack>

              {phase !== 'done' && (
                <LinearProgress
                  color="primary"
                  variant={phase === 'reading' ? 'indeterminate' : 'determinate'}
                  value={(filledCount / AI_FILL_ORDER.length) * 100}
                  sx={{ left: 0, right: 0, bottom: 0, height: 3, position: 'absolute' }}
                />
              )}
            </Panel>

            <FormSection no="01" title={t('order.s1.title')} subtitle={t('order.s1.subtitle')}>
              <Box
                sx={{
                  gap: 1.5,
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' },
                }}
              >
                {renderSelect('customer', t('order.f.customer'))}
                {renderSelect('contact', t('order.f.contact'))}
                {renderText('customerPo', t('order.f.customerPo'))}
                {renderSelect('billTo', t('order.f.billTo'))}
              </Box>
            </FormSection>

            <FormSection
              no="02"
              title={t('order.s2.title')}
              subtitle={t('order.s2.subtitle')}
              action={
                <Button size="small" color="primary">
                  {t('order.addStep')}
                </Button>
              }
            >
              <Box
                sx={{
                  gap: 1.5,
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                }}
              >
                <StopCard icon="solar:settings-minimalistic-bold" title={t('order.produce')}>
                  {renderSelect('machine', t('order.f.machine'))}
                  <Box sx={{ gap: 1.5, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
                    {renderSelect('startDate', t('order.f.date'))}
                    {renderText('startWindow', t('order.f.window'))}
                  </Box>
                </StopCard>

                <StopCard icon="solar:box-bold" title={t('order.deliver')}>
                  {renderText('deliverTo', t('order.f.deliverTo'))}
                  <Box sx={{ gap: 1.5, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
                    {renderSelect('dueDate', t('order.f.date'))}
                    {renderText('dueWindow', t('order.f.window'))}
                  </Box>

                  {needsCheck && aiFields.includes('dueWindow') && (
                    <Stack
                      component={m.div}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      direction="row"
                      alignItems="center"
                      spacing={0.75}
                      sx={{ color: 'warning.dark' }}
                    >
                      <Iconify icon="solar:danger-triangle-bold" width={16} />
                      <Typography variant="caption" sx={{ flexGrow: 1 }}>
                        {t('order.windowWarning', { window: SUGGESTED_WINDOW })}
                      </Typography>
                      <Button size="small" color="warning" onClick={applySuggestedWindow}>
                        {t('order.useWindow')}
                      </Button>
                    </Stack>
                  )}
                </StopCard>
              </Box>
            </FormSection>

            <FormSection no="03" title={t('order.s3.title')} subtitle={t('order.s3.subtitle')}>
              <Box
                sx={{
                  mb: 1.5,
                  gap: 1.5,
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' },
                }}
              >
                {renderText('product', t('order.f.product'))}
                {renderText('qty', t('order.f.qty'))}
                {renderText('material', t('order.f.material'))}
                {renderText('mold', t('order.f.mold'))}
              </Box>
              {renderText('note', t('order.f.note'))}
            </FormSection>
          </Stack>

          {/* side */}
          <Stack spacing={2} sx={{ minWidth: 0 }}>
            <Panel>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 1.5 }}
              >
                <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                  {DRAFT_ID}
                </Typography>
                <Label>{t('order.draft')}</Label>
              </Stack>

              <SummaryStop
                filled
                title={values.machine || t('order.pendingValue')}
                note={`${t('order.produce')} ${values.startDate} · ${values.startWindow}`}
              />
              <SummaryStop
                title={values.deliverTo || t('order.pendingValue')}
                note={`${t('order.deliver')} ${values.dueDate} · ${values.dueWindow}`}
              />

              <Stack direction="row" flexWrap="wrap" sx={{ mt: 1.5, gap: 0.75 }}>
                {[values.qty && `${values.qty} ${t('order.pieces')}`, values.material, values.mold]
                  .filter(Boolean)
                  .map((chip) => (
                    <Box
                      key={chip}
                      component={m.span}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      sx={{
                        px: 1,
                        py: 0.25,
                        borderRadius: 999,
                        typography: 'caption',
                        bgcolor: 'background.paper',
                      }}
                    >
                      {chip}
                    </Box>
                  ))}
              </Stack>
            </Panel>

            <Box
              component={m.div}
              initial={false}
              animate={
                phase === 'done'
                  ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                  : { opacity: 0.4, y: 0, filter: 'blur(6px)' }
              }
              transition={{ duration: 0.6, ease: EASE }}
            >
              <Panel tone="agent">
                <AgentTag
                  label={t('order.agentSuggests')}
                  note={t('live.confidence', { count: 92 })}
                  sx={{ mb: 1.5 }}
                />

                <Box sx={{ p: 1.5, mb: 1.25, borderRadius: 2, bgcolor: 'background.paper' }}>
                  <Stack direction="row" alignItems="center">
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="overline" sx={{ fontSize: 10, color: 'text.disabled' }}>
                        {t('order.suggestedCost')}
                      </Typography>
                      <Typography variant="h4">{NEW_ORDER_OPERATOR.cost}</Typography>
                    </Box>
                    <Button size="small" variant="outlined" color="inherit">
                      {t('order.useCost')}
                    </Button>
                  </Stack>

                  <Box
                    sx={{
                      my: 1,
                      height: 4,
                      borderRadius: 2,
                      position: 'relative',
                      bgcolor: greyTint(0.2),
                    }}
                  >
                    <Box
                      component={m.div}
                      initial={false}
                      animate={{ width: phase === 'done' ? '42%' : '0%' }}
                      transition={{ delay: 0.3, duration: 0.8, ease: EASE }}
                      sx={{
                        top: 0,
                        left: '24%',
                        height: 1,
                        borderRadius: 2,
                        position: 'absolute',
                        bgcolor: 'primary.main',
                      }}
                    />
                  </Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {t('order.marketRange')}
                  </Typography>
                </Box>

                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'background.paper' }}>
                  <Stack direction="row" alignItems="center" spacing={1.25}>
                    <Avatar sx={{ width: 36, height: 36, fontSize: 14 }}>
                      {NEW_ORDER_OPERATOR.name.slice(0, 1)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography variant="subtitle2" noWrap>
                        {NEW_ORDER_OPERATOR.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        noWrap
                        sx={{ display: 'block', color: 'text.secondary' }}
                      >
                        {NEW_ORDER_OPERATOR.meta}
                      </Typography>
                    </Box>
                    <Label color="success">
                      {t('order.onTimeRate', { rate: NEW_ORDER_OPERATOR.onTime })}
                    </Label>
                  </Stack>

                  <Field.Checkbox
                    name="assignOperator"
                    label={
                      <Typography variant="caption">
                        {t('order.assignWhenCreate', { name: NEW_ORDER_OPERATOR.short })}
                      </Typography>
                    }
                  />
                </Box>

                <Stack direction="row" spacing={0.75} sx={{ mt: 1.25, color: 'warning.dark' }}>
                  <Iconify icon="solar:danger-triangle-bold" width={16} sx={{ mt: 0.25 }} />
                  <Typography variant="caption">{t('order.agentWarning')}</Typography>
                </Stack>
              </Panel>
            </Box>

            <Panel>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                {t('order.updates.title')}
              </Typography>

              {(['notifyBooking', 'notifySms'] as const).map((name) => (
                <Field.Switch
                  key={name}
                  name={name}
                  labelPlacement="start"
                  label={
                    <Box>
                      <Typography variant="subtitle2">{t(`order.updates.${name}`)}</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {t(`order.updates.${name}Note`)}
                      </Typography>
                    </Box>
                  }
                  sx={{ mx: 0, mb: 1, width: 1, justifyContent: 'space-between' }}
                />
              ))}

              <Stack
                direction="row"
                alignItems="center"
                spacing={0.75}
                sx={{ color: 'text.disabled' }}
              >
                <Iconify icon="solar:lock-keyhole-bold" width={14} />
                <Typography variant="caption">{t('order.updates.note')}</Typography>
              </Stack>
            </Panel>
          </Stack>
        </Box>
      </Box>
    </Form>
  );
}

// ----------------------------------------------------------------------

type FormSectionProps = {
  no: string;
  title: string;
  subtitle: string;
  action?: React.ReactNode;
  children: React.ReactNode;
};

function FormSection({ no, title, subtitle, action, children }: FormSectionProps) {
  return (
    <Panel>
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
        <Box
          sx={{
            width: 30,
            height: 30,
            flexShrink: 0,
            display: 'grid',
            borderRadius: 1,
            placeItems: 'center',
            typography: 'caption',
            fontWeight: 600,
            bgcolor: 'text.primary',
            color: 'background.paper',
          }}
        >
          {no}
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1">{title}</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {subtitle}
          </Typography>
        </Box>
        {action}
      </Stack>

      {children}
    </Panel>
  );
}

// ----------------------------------------------------------------------

type StopCardProps = { icon: string; title: string; children: React.ReactNode };

function StopCard({ icon, title, children }: StopCardProps) {
  return (
    <Stack
      component={m.div}
      variants={riseIn}
      spacing={1.5}
      sx={{ p: 2, borderRadius: 2, bgcolor: 'background.paper' }}
    >
      <Stack direction="row" alignItems="center" spacing={0.75} sx={{ color: 'text.secondary' }}>
        <Iconify icon={icon} width={16} />
        <Typography variant="overline" sx={{ fontSize: 10 }}>
          {title}
        </Typography>
      </Stack>
      {children}
    </Stack>
  );
}

// ----------------------------------------------------------------------

function SummaryStop({ title, note, filled }: { title: string; note: string; filled?: boolean }) {
  return (
    <Stack direction="row" spacing={1.25} sx={{ pb: filled ? 1.5 : 0, position: 'relative' }}>
      {filled && (
        <Box
          sx={{
            top: 16,
            left: 4,
            bottom: 0,
            width: 2,
            position: 'absolute',
            bgcolor: greyTint(0.32),
          }}
        />
      )}
      <Box
        sx={{
          mt: 0.75,
          width: 10,
          height: 10,
          flexShrink: 0,
          borderRadius: '50%',
          bgcolor: filled ? 'text.primary' : 'background.paper',
          border: (theme) =>
            `2px solid ${filled ? theme.vars.palette.text.primary : theme.vars.palette.primary.main}`,
        }}
      />
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="subtitle2" noWrap>
          {title}
        </Typography>
        <Typography variant="caption" noWrap sx={{ display: 'block', color: 'text.secondary' }}>
          {note}
        </Typography>
      </Box>
    </Stack>
  );
}
