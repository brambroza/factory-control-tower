import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Switch from '@mui/material/Switch';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';

import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';

import { useTranslate } from 'src/locales';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

import { greyTint } from '../styles';
import { BlurDialog, useTypewriter } from '../components';
import { SHARE_LINK, FOCUS_ORDER, SHARE_CONTACTS, SHARE_VISIBILITY } from '../_mock';

// ----------------------------------------------------------------------

type Props = { open: boolean; onClose: () => void };

/** ส่งลิงก์ติดตามสถานะการผลิตให้ลูกค้า — เลือกผู้รับและสิ่งที่ลูกค้ามองเห็นได้ */
export function ShareDialog({ open, onClose }: Props) {
  const { t } = useTranslate('factory');

  const { copy } = useCopyToClipboard();

  const [copied, setCopied] = useState(false);

  const [recipients, setRecipients] = useState<string[]>([]);

  const [visible, setVisible] = useState<Record<string, boolean>>({});

  const link = useTypewriter(SHARE_LINK, open, 28);

  useEffect(() => {
    if (open) {
      setCopied(false);
      setRecipients(
        SHARE_CONTACTS.filter((contact) => contact.checked).map((contact) => contact.name)
      );
      setVisible(Object.fromEntries(SHARE_VISIBILITY.map((item) => [item.key, item.on])));
    }
  }, [open]);

  const handleCopy = () => {
    copy(`https://${SHARE_LINK}`);
    setCopied(true);
  };

  const handleSend = () => {
    toast.success(t('share.toast', { count: recipients.length }));
    onClose();
  };

  const firstName = recipients[0]?.split(' ')[0];

  return (
    <BlurDialog
      open={open}
      onClose={onClose}
      title={t('share.title')}
      description={t('share.description', { customer: FOCUS_ORDER.customer, id: FOCUS_ORDER.id })}
      footNote={t('share.footNote')}
      actions={
        <>
          <Button variant="outlined" color="inherit" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={!recipients.length}
            onClick={handleSend}
          >
            {firstName ? t('share.sendTo', { name: firstName }) : t('share.send')}
          </Button>
        </>
      }
    >
      <SectionLabel>{t('share.link')}</SectionLabel>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{ mb: 2, py: 0.75, pl: 1.5, pr: 0.75, borderRadius: 1.5, bgcolor: greyTint(0.1) }}
      >
        <Iconify icon="solar:link-bold" width={16} sx={{ color: 'text.disabled' }} />
        <Typography variant="body2" noWrap sx={{ flexGrow: 1, fontFamily: 'monospace' }}>
          {link.value}
          {!link.done && '|'}
        </Typography>
        <Button
          size="small"
          variant="outlined"
          color={copied ? 'success' : 'inherit'}
          disabled={!link.done}
          onClick={handleCopy}
          sx={{ bgcolor: 'background.paper' }}
        >
          {copied ? t('share.copied') : t('share.copy')}
        </Button>
      </Stack>

      <SectionLabel>{t('share.recipients')}</SectionLabel>
      <Box
        sx={{
          mb: 2,
          borderRadius: 2,
          border: (theme) => `1px solid ${theme.vars.palette.divider}`,
        }}
      >
        {SHARE_CONTACTS.map((contact) => (
          <Stack
            key={contact.name}
            direction="row"
            alignItems="center"
            spacing={1.25}
            sx={{ p: 1.25, borderBottom: (theme) => `1px solid ${theme.vars.palette.divider}` }}
          >
            <Checkbox
              size="small"
              checked={recipients.includes(contact.name)}
              onChange={() =>
                setRecipients((prev) =>
                  prev.includes(contact.name)
                    ? prev.filter((name) => name !== contact.name)
                    : [...prev, contact.name]
                )
              }
              sx={{ p: 0.5 }}
            />
            <Avatar sx={{ width: 32, height: 32, fontSize: 13 }}>{contact.name.slice(0, 1)}</Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle2" noWrap>
                {contact.name}
              </Typography>
              <Typography
                variant="caption"
                noWrap
                sx={{ display: 'block', color: 'text.secondary' }}
              >
                {contact.meta}
              </Typography>
            </Box>
          </Stack>
        ))}

        <Button
          size="small"
          color="primary"
          startIcon={<Iconify icon="mingcute:add-line" />}
          sx={{ m: 0.75 }}
        >
          {t('share.addPerson')}
        </Button>
      </Box>

      <SectionLabel>{t('share.visibility')}</SectionLabel>
      <Stack sx={{ mb: 2, py: 0.5, px: 1.5, borderRadius: 2, bgcolor: greyTint(0.1) }}>
        {SHARE_VISIBILITY.map((item) => (
          <Stack key={item.key} direction="row" alignItems="center" sx={{ py: 0.5 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle2">{t(`share.see.${item.key}`)}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {t(`share.see.${item.key}Note`)}
              </Typography>
            </Box>
            <Switch
              checked={Boolean(visible[item.key])}
              onChange={(event) =>
                setVisible((prev) => ({ ...prev, [item.key]: event.target.checked }))
              }
            />
          </Stack>
        ))}
      </Stack>

      <SectionLabel>{t('share.expires')}</SectionLabel>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{ py: 1, px: 1.5, borderRadius: 1.5, bgcolor: greyTint(0.1) }}
      >
        <Iconify icon="solar:clock-circle-bold" width={16} />
        <Typography variant="body2" sx={{ flexGrow: 1 }}>
          {t('share.expiresValue')}
        </Typography>
        <Iconify icon="eva:arrow-ios-downward-fill" width={16} sx={{ color: 'text.disabled' }} />
      </Stack>
    </BlurDialog>
  );
}

// ----------------------------------------------------------------------

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography variant="caption" sx={{ mb: 0.75, display: 'block', color: 'text.secondary' }}>
      {children}
    </Typography>
  );
}
