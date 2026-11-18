import { m } from 'framer-motion';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';
import { PageHeader } from 'src/layouts/factory';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

import { greyTint } from '../styles';
import { useFactoryDemo } from '../context';
import { EASE, riseIn, stagger } from '../motion';
import { NewMessageDialog } from './new-message-dialog';
import { Panel, AgentOrb, AgentTag, OrderCard, FilterPills, useTypewriter } from '../components';
import {
  INBOX_DRAFT,
  FOCUS_ORDER,
  WORK_ORDERS,
  NEW_MESSAGE,
  INBOX_THREADS,
  INBOX_CONTACT,
  INBOX_REPLIES,
  INBOX_SUMMARY,
  INBOX_CUSTOMER,
  INBOX_MESSAGES,
} from '../_mock';

// ----------------------------------------------------------------------

const DRAFT_DELAY = 0.5 + INBOX_MESSAGES.length * 0.25;

/** กล่องข้อความลูกค้า: เธรด | บทสนทนา + ร่างคำตอบของ agent | บริบทใบสั่งผลิตและลูกค้า */
export function FactoryInboxView() {
  const { t } = useTranslate('factory');

  const { rerouted } = useFactoryDemo();

  const compose = useBoolean();

  const draftReady = useBoolean();

  const [filter, setFilter] = useState('all');

  const [threadId, setThreadId] = useState(INBOX_CONTACT.threadId);

  const [sent, setSent] = useState(false);

  const draft = useTypewriter(INBOX_DRAFT, draftReady.value, 16);

  // เริ่มพิมพ์ร่างหลังบทสนทนาแสดงครบ
  useEffect(() => {
    const timer = setTimeout(draftReady.onTrue, DRAFT_DELAY * 1000 + 500);

    return () => clearTimeout(timer);
  }, [draftReady.onTrue]);

  const focusOrder = WORK_ORDERS.find((order) => order.id === FOCUS_ORDER.id)!;

  const threads = INBOX_THREADS.filter((thread) => filter === 'all' || thread.agent);

  const handleSend = () => {
    setSent(true);
    toast.success(t('msg.toast', { name: INBOX_CONTACT.name.split(' ')[0] }));
  };

  return (
    <Box component={m.div} variants={stagger()} initial="hidden" animate="show">
      <PageHeader
        search
        crumbs={[t('crumb.customers'), t('nav.inbox')]}
        title={t('nav.inbox')}
        actions={
          <>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<Iconify icon="solar:file-text-bold" />}
            >
              {t('inbox.templates')}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={compose.onTrue}
              startIcon={<Iconify icon="solar:pen-bold" />}
            >
              {t('inbox.newMessage')}
            </Button>
          </>
        }
      />

      <Box
        sx={{
          gap: 2,
          display: 'grid',
          alignItems: 'start',
          gridTemplateColumns: {
            xs: '1fr',
            md: '280px minmax(0, 1fr)',
            lg: '280px minmax(0, 1fr) 320px',
          },
        }}
      >
        {/* threads */}
        <Box>
          <FilterPills
            value={filter}
            onChange={setFilter}
            items={[
              { key: 'all', label: t('filter.all'), count: INBOX_THREADS.length },
              { key: 'drafts', label: t('inbox.aiDrafts'), count: 2 },
            ]}
            sx={{ mb: 1.5 }}
          />

          <Stack component={m.div} variants={stagger(0.15, 0.06)} spacing={1}>
            {threads.map((thread) => {
              const selected = thread.id === threadId;

              return (
                <Box
                  key={thread.id}
                  component={m.div}
                  variants={riseIn}
                  onClick={() => setThreadId(thread.id)}
                  sx={{
                    p: 1.5,
                    cursor: 'pointer',
                    borderRadius: 2.5,
                    bgcolor: 'background.neutral',
                    border: '1.5px solid transparent',
                    transition: (theme) =>
                      theme.transitions.create(['border-color', 'background-color']),
                    ...(selected && { borderColor: 'primary.main', bgcolor: 'background.paper' }),
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Avatar sx={{ width: 30, height: 30, fontSize: 13 }}>
                      {thread.name.slice(0, 1)}
                    </Avatar>
                    <Typography variant="subtitle2" noWrap sx={{ flexGrow: 1 }}>
                      {thread.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                      {thread.time}
                    </Typography>
                  </Stack>
                  <Typography
                    variant="caption"
                    noWrap
                    sx={{ mt: 0.5, display: 'block', fontWeight: 600, color: 'primary.main' }}
                  >
                    {thread.topic}
                  </Typography>
                  <Typography
                    variant="caption"
                    noWrap
                    sx={{ display: 'block', color: 'text.secondary' }}
                  >
                    {thread.preview}
                  </Typography>
                </Box>
              );
            })}
          </Stack>
        </Box>

        {/* conversation */}
        <Panel>
          <Stack direction="row" alignItems="center" spacing={1.25}>
            <Avatar sx={{ width: 40, height: 40 }}>{INBOX_CONTACT.name.slice(0, 1)}</Avatar>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography variant="subtitle1" noWrap>
                {INBOX_CONTACT.name}
              </Typography>
              <Typography
                variant="caption"
                noWrap
                sx={{ display: 'block', color: 'text.secondary' }}
              >
                {INBOX_CONTACT.role}
              </Typography>
            </Box>
            <Chip
              size="small"
              component={RouterLink}
              href={paths.factory.order(FOCUS_ORDER.id)}
              clickable
              label={FOCUS_ORDER.id}
              icon={<Iconify icon="solar:box-bold" width={14} />}
            />
            <IconButton size="small" sx={{ bgcolor: 'background.paper' }}>
              <Iconify icon="solar:phone-bold" width={16} />
            </IconButton>
            <IconButton size="small">
              <Iconify icon="eva:more-horizontal-fill" />
            </IconButton>
          </Stack>

          <Divider sx={{ my: 2 }}>
            <Typography variant="overline" sx={{ fontSize: 10, color: 'text.disabled' }}>
              {t('inbox.today')}
            </Typography>
          </Divider>

          <Stack component={m.div} variants={stagger(0.4, 0.25)} spacing={1.5}>
            {INBOX_MESSAGES.map((message) => (
              <MessageBubble key={message.text} message={message} />
            ))}
          </Stack>

          {/* agent draft */}
          <Box
            component={m.div}
            initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: DRAFT_DELAY, duration: 0.5, ease: EASE }}
            sx={{
              p: 2,
              mt: 2.5,
              borderRadius: 2.5,
              bgcolor: 'background.paper',
              border: (theme) => `1.5px solid ${theme.vars.palette.primary.main}`,
            }}
          >
            <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
              <AgentTag
                label={sent ? t('inbox.sent') : t('inbox.agentDraft')}
                size={20}
                sx={{ flexGrow: 1 }}
              />
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {t('msg.to')} {INBOX_CONTACT.name}
              </Typography>
            </Stack>

            <Typography variant="body2" sx={{ minHeight: 66 }}>
              {draft.value}
              {draftReady.value && !draft.done && '▍'}
            </Typography>

            <Stack direction="row" alignItems="center" flexWrap="wrap" sx={{ mt: 1.5, gap: 0.75 }}>
              <Button size="small" variant="contained" color="inherit" disabled={sent}>
                {t('inbox.edit')}
              </Button>
              {NEW_MESSAGE.tones.slice(0, 2).map((tone) => (
                <Chip key={tone} size="small" label={tone} onClick={() => {}} />
              ))}
              <Box sx={{ flexGrow: 1 }} />
              <Button
                size="small"
                variant="contained"
                color="primary"
                disabled={!draft.done || sent}
                onClick={handleSend}
                endIcon={<Iconify icon="solar:plain-bold" width={16} />}
              >
                {t('inbox.send')}
              </Button>
            </Stack>
          </Box>
        </Panel>

        {/* context */}
        <Stack
          component={m.div}
          variants={stagger(0.3, 0.1)}
          spacing={2}
          sx={{ minWidth: 0, gridColumn: { md: '1 / -1', lg: 'auto' } }}
        >
          <Box component={m.div} variants={riseIn}>
            <SideLabel>{t('inbox.order')}</SideLabel>
            <OrderCard
              order={focusOrder}
              resolved={rerouted ? { toTime: FOCUS_ORDER.etaAlt } : undefined}
            />
          </Box>

          <Box component={m.div} variants={riseIn}>
            <SideLabel>{t('inbox.customer')}</SideLabel>
            <Panel sx={{ py: 1 }}>
              {INBOX_CUSTOMER.map((row) => (
                <Stack
                  key={row.key}
                  direction="row"
                  justifyContent="space-between"
                  spacing={2}
                  sx={{
                    py: 1,
                    '&:not(:last-of-type)': {
                      borderBottom: (theme) => `1px solid ${theme.vars.palette.divider}`,
                    },
                  }}
                >
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {t(`inbox.c.${row.key}`)}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 600, ...(row.tone && { color: `${row.tone}.main` }) }}
                  >
                    {row.value}
                  </Typography>
                </Stack>
              ))}
            </Panel>
          </Box>

          <Panel tone="agent">
            <AgentTag label={t('inbox.summary')} size={20} sx={{ mb: 1 }} />
            <Typography variant="caption" sx={{ display: 'block' }}>
              {INBOX_SUMMARY}
            </Typography>
          </Panel>

          <Box component={m.div} variants={riseIn}>
            <SideLabel>{t('inbox.replies')}</SideLabel>
            <Stack spacing={0.75}>
              {INBOX_REPLIES.map((reply, index) => (
                <Stack
                  key={reply}
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{
                    py: 1,
                    px: 1.5,
                    cursor: 'pointer',
                    borderRadius: 1.5,
                    border: (theme) => `1px solid ${theme.vars.palette.divider}`,
                    '&:hover': { bgcolor: greyTint(0.08) },
                  }}
                >
                  <Iconify
                    icon={
                      ['eva:checkmark-fill', 'solar:calendar-mark-bold', 'solar:link-bold'][index]
                    }
                    width={16}
                    sx={{ color: 'primary.main' }}
                  />
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    {reply}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Box>
        </Stack>
      </Box>

      <NewMessageDialog open={compose.value} onClose={compose.onFalse} />
    </Box>
  );
}

// ----------------------------------------------------------------------

function SideLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      variant="overline"
      sx={{ mb: 0.75, display: 'block', fontSize: 10, color: 'text.disabled' }}
    >
      {children}
    </Typography>
  );
}

// ----------------------------------------------------------------------

type MessageBubbleProps = { message: (typeof INBOX_MESSAGES)[number] };

function MessageBubble({ message }: MessageBubbleProps) {
  if (message.from === 'agent') {
    return (
      <Stack
        component={m.div}
        variants={riseIn}
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={1}
      >
        <AgentOrb size={20} />
        <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main' }}>
          {message.text}
        </Typography>
      </Stack>
    );
  }

  const mine = message.from === 'us';

  return (
    <Stack component={m.div} variants={riseIn} alignItems={mine ? 'flex-end' : 'flex-start'}>
      <Box
        sx={{
          py: 1.25,
          px: 1.75,
          maxWidth: 440,
          borderRadius: 2.5,
          typography: 'body2',
          bgcolor: 'background.paper',
          ...(mine && { color: 'background.paper', bgcolor: 'text.primary' }),
        }}
      >
        {message.text}
      </Box>
      <Typography variant="caption" sx={{ mt: 0.5, px: 0.5, color: 'text.disabled' }}>
        {message.meta}
      </Typography>
    </Stack>
  );
}
