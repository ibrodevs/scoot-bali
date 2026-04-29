import React from 'react';
import { useAuth } from './auth-context';
import { useSite } from './site-context';
import { Badge, Btn, C, FormField, Icon, ScooterImg, StyledInput } from './ui';

function formatDateRange(start, end, locale) {
  const formatter = new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric', year: 'numeric' });
  return `${formatter.format(new Date(start))} – ${formatter.format(new Date(end))}`;
}

function statusVariant(status) {
  if (['active', 'confirmed', 'delivery', 'paid'].includes(status)) return 'green';
  if (status === 'cancelled') return 'red';
  return 'default';
}

function paymentVariant(status) {
  if (status === 'succeeded' || status === 'paid') return 'green';
  if (status === 'failed' || status === 'refunded') return 'red';
  return 'default';
}

function formatDateTime(value, locale) {
  if (!value) return '';
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function paymentStatusText(status, account) {
  if (status === 'succeeded' || status === 'paid') {
    return account?.paymentSucceeded || status;
  }
  if (status === 'pending') {
    return account?.paymentPending || status;
  }
  if (status === 'failed') {
    return account?.paymentFailed || status;
  }
  if (status === 'refunded') {
    return account?.paymentRefunded || status;
  }
  return status;
}

export default function AccountPage({ onCatalog, onHome }) {
  const { content, languages, fleet, lang } = useSite();
  const auth = useAuth();
  const account = content?.account;
  const common = content?.common;
  const detail = content?.detail;
  const [tab, setTab] = React.useState('bookings');
  const [authTab, setAuthTab] = React.useState('login');
  const [authForm, setAuthForm] = React.useState({ email: '', password: '', fullName: '', phone: '' });
  const [profileForm, setProfileForm] = React.useState({ full_name: '', phone: '', country: '', language: 'en', currency: 'USD' });
  const [docForm, setDocForm] = React.useState({ document_type: 'passport', file: null });
  const [message, setMessage] = React.useState('');
  const [submitError, setSubmitError] = React.useState('');
  const [working, setWorking] = React.useState(false);
  const [workingBookingId, setWorkingBookingId] = React.useState(null);
  const [docInputKey, setDocInputKey] = React.useState(0);
  const [activeThreadId, setActiveThreadId] = React.useState(null);
  const [threadMessages, setThreadMessages] = React.useState([]);
  const [threadLoading, setThreadLoading] = React.useState(false);
  const [threadError, setThreadError] = React.useState('');
  const [chatDraft, setChatDraft] = React.useState('');

  React.useEffect(() => {
    if (auth.profile) {
      setProfileForm({
        full_name: auth.profile.full_name || '',
        phone: auth.profile.phone || '',
        country: auth.profile.country || '',
        language: auth.profile.language || 'en',
        currency: auth.profile.currency || 'USD',
      });
    }
  }, [auth.profile]);

  React.useEffect(() => {
    if (!auth.chatThreads.length) {
      setActiveThreadId(null);
      return;
    }
    if (!activeThreadId || !auth.chatThreads.some((thread) => thread.id === activeThreadId)) {
      setActiveThreadId(auth.chatThreads[0].id);
    }
  }, [activeThreadId, auth.chatThreads]);

  async function loadThreadMessages(threadId, showLoading = true) {
    if (!threadId) {
      setThreadMessages([]);
      return;
    }

    if (showLoading) {
      setThreadLoading(true);
    }
    setThreadError('');

    try {
      const messages = await auth.loadChatMessages(threadId);
      setThreadMessages(messages);
    } catch (error) {
      setThreadError(error.message || account?.supportHint);
    } finally {
      if (showLoading) {
        setThreadLoading(false);
      }
    }
  }

  React.useEffect(() => {
    if (tab !== 'support' || !activeThreadId) {
      return;
    }
    loadThreadMessages(activeThreadId);
  }, [activeThreadId, tab]);

  React.useEffect(() => {
    if (!auth.isAuthenticated || tab !== 'support') {
      return;
    }

    const intervalId = window.setInterval(async () => {
      await auth.reloadAccount();
      if (activeThreadId) {
        await loadThreadMessages(activeThreadId, false);
      }
    }, 10000);

    return () => window.clearInterval(intervalId);
  }, [activeThreadId, auth.isAuthenticated, tab]);

  const scooterMap = Object.fromEntries(fleet.map((item) => [item.id, item]));

  async function submitAuth() {
    setWorking(true);
    setSubmitError('');
    setMessage('');

    try {
      if (authTab === 'login') {
        await auth.login({ email: authForm.email, password: authForm.password });
      } else {
        await auth.register({
          email: authForm.email,
          password: authForm.password,
          full_name: authForm.fullName,
          phone: authForm.phone,
          language: lang,
        });
      }
      setAuthForm({ email: '', password: '', fullName: '', phone: '' });
    } catch (error) {
      setSubmitError(error.message || account?.authFailed);
    } finally {
      setWorking(false);
    }
  }

  async function saveProfile() {
    setWorking(true);
    setSubmitError('');
    setMessage('');

    try {
      await auth.updateProfile(profileForm);
      setMessage(account?.profileSaved);
    } catch (error) {
      setSubmitError(error.message || account?.saveProfileFailed);
    } finally {
      setWorking(false);
    }
  }

  async function uploadDocument() {
    if (!docForm.file) {
      setSubmitError(account?.fileRequired);
      return;
    }

    setWorking(true);
    setSubmitError('');
    setMessage('');

    try {
      const payload = new FormData();
      payload.append('document_type', docForm.document_type);
      payload.append('file', docForm.file);
      await auth.uploadDocument(payload);
      setDocForm((current) => ({ ...current, file: null }));
      setDocInputKey((current) => current + 1);
      setMessage(account?.documentUploaded);
    } catch (error) {
      setSubmitError(error.message || account?.uploadFailed);
    } finally {
      setWorking(false);
    }
  }

  async function handleBookingPayment(item) {
    setWorkingBookingId(item.id);
    setSubmitError('');
    setMessage('');

    try {
      if (item.latest_payment?.status === 'pending' && item.latest_payment?.payment_url) {
        window.open(item.latest_payment.payment_url, '_blank', 'noopener,noreferrer');
        setMessage(account?.paymentPending);
        return;
      }

      const payment = await auth.createPayment(item.id);
      if (payment.payment_url) {
        window.open(payment.payment_url, '_blank', 'noopener,noreferrer');
      }
      setMessage(payment.status === 'succeeded'
        ? account?.paymentSucceeded
        : account?.paymentStarted);
    } catch (error) {
      setSubmitError(error.message || account?.startPaymentFailed);
    } finally {
      setWorkingBookingId(null);
    }
  }

  async function handleBookingCancel(item) {
    setWorkingBookingId(item.id);
    setSubmitError('');
    setMessage('');

    try {
      await auth.cancelBooking(item.id);
      setMessage(account?.bookingCancelled);
    } catch (error) {
      setSubmitError(error.message || account?.cancelBookingFailed);
    } finally {
      setWorkingBookingId(null);
    }
  }

  async function ensureSupportThread() {
    const thread = await auth.ensureSupportThread(account?.supportThreadTitle || account?.support);
    setActiveThreadId(thread.id);
    return thread;
  }

  async function handleStartSupport() {
    setWorking(true);
    setThreadError('');
    try {
      const thread = await ensureSupportThread();
      await loadThreadMessages(thread.id);
    } catch (error) {
      setThreadError(error.message || account?.supportHint);
    } finally {
      setWorking(false);
    }
  }

  async function handleSendChat() {
    const text = chatDraft.trim();
    if (!text) {
      return;
    }

    setWorking(true);
    setThreadError('');
    try {
      let threadId = activeThreadId;
      if (!threadId) {
        const thread = await ensureSupportThread();
        threadId = thread.id;
      }
      const messages = await auth.sendChatMessage(threadId, text);
      setThreadMessages(messages);
      setChatDraft('');
    } catch (error) {
      setThreadError(error.message || account?.supportHint);
    } finally {
      setWorking(false);
    }
  }

  if (!auth.isAuthenticated) {
    return (
      <div style={{ paddingTop: 72, minHeight: '100vh', background: C.gray100, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingInline: 24 }}>
        <div style={{ width: '100%', maxWidth: 560, background: C.white, borderRadius: 24, border: `1px solid ${C.gray200}`, padding: 36 }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
            {[
              ['login', account?.loginTab],
              ['register', account?.registerTab],
            ].map(([value, label]) => (
              <div key={value} onClick={() => setAuthTab(value)} style={{ padding: '10px 18px', borderRadius: 12, background: authTab === value ? C.black : C.gray100, color: authTab === value ? C.white : C.gray700, fontFamily: 'Inter', fontWeight: 600, cursor: 'pointer' }}>
                {label}
              </div>
            ))}
          </div>

          <h2 style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 34, color: C.black, margin: '0 0 10px' }}>{account?.guestTitle}</h2>
          <p style={{ fontFamily: 'Inter', fontSize: 15, lineHeight: 1.7, color: C.gray500, margin: '0 0 28px' }}>{account?.guestBody}</p>

          <div style={{ display: 'grid', gap: 16 }}>
            {authTab === 'register' && (
              <>
                <FormField label={account?.fullName}>
                  <StyledInput value={authForm.fullName} onChange={(event) => setAuthForm((current) => ({ ...current, fullName: event.target.value }))} placeholder="Alex Kim" />
                </FormField>
                <FormField label={account?.phone}>
                  <StyledInput value={authForm.phone} onChange={(event) => setAuthForm((current) => ({ ...current, phone: event.target.value }))} placeholder="+62 812 0000 0000" />
                </FormField>
              </>
            )}

            <FormField label={account?.email}>
              <StyledInput type="email" value={authForm.email} onChange={(event) => setAuthForm((current) => ({ ...current, email: event.target.value }))} placeholder="alex@example.com" />
            </FormField>
            <FormField label={account?.password}>
              <StyledInput type="password" value={authForm.password} onChange={(event) => setAuthForm((current) => ({ ...current, password: event.target.value }))} placeholder="••••••••" />
            </FormField>
          </div>

          {(submitError || auth.error) && (
            <div style={{ marginTop: 18, background: '#fef2f2', color: '#991b1b', borderRadius: 12, padding: '14px 16px', fontFamily: 'Inter', fontSize: 14 }}>
              {submitError || auth.error}
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <Btn variant="primary" onClick={submitAuth} disabled={working} fullWidth>
              {working ? '...' : authTab === 'login' ? account?.signIn : account?.register}
            </Btn>
            <Btn variant="outline" onClick={onHome} fullWidth>← {detail?.breadcrumbs?.home}</Btn>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: 'bookings', label: account?.bookings, icon: 'document-text' },
    { id: 'documents', label: account?.documents, icon: 'document' },
    { id: 'notifications', label: account?.notifications, icon: 'bell', count: auth.notifications.filter((item) => !item.is_read).length },
    { id: 'support', label: account?.support, icon: 'chat' },
    { id: 'profile', label: account?.profile, icon: 'user' },
  ];

  const activeThread = auth.chatThreads.find((thread) => thread.id === activeThreadId) || null;

  return (
    <div style={{ paddingTop: 72, minHeight: '100vh', background: C.gray100 }}>
      <div className="account-layout" style={{ padding: '36px 80px', display: 'grid', gridTemplateColumns: '260px 1fr', gap: 28 }}>
        <div>
          <div style={{ background: C.white, borderRadius: 18, padding: 24, marginBottom: 16, border: `1px solid ${C.gray200}`, textAlign: 'center' }}>
            <div style={{ width: 76, height: 76, background: `linear-gradient(135deg, ${C.gold} 0%, #e6b800 100%)`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', boxShadow: '0 8px 24px rgba(255,215,0,0.35)' }}>
              <span style={{ fontFamily: 'Sora', fontWeight: 900, fontSize: 26, color: C.black }}>
                {(auth.profile?.full_name || auth.profile?.email || 'A').slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 17, color: C.black, marginBottom: 2 }}>{auth.profile?.full_name || auth.profile?.email}</div>
            <div style={{ fontFamily: 'Inter', fontSize: 13, color: C.gray500, marginBottom: 12 }}>{auth.profile?.email}</div>
            <Badge variant="gold">
              <Icon name="star-filled" size={12} color={C.black} strokeWidth={1.6} />
              {account?.liveBadge}
            </Badge>
            <div style={{ marginTop: 16, padding: '12px', background: C.gray100, borderRadius: 10 }}>
              <div style={{ fontFamily: 'Inter', fontSize: 11, color: C.gray500, marginBottom: 4 }}>{account?.bookings}</div>
              <div style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 22, color: C.black }}>{auth.bookings.length}</div>
            </div>
          </div>

          <div style={{ background: C.white, borderRadius: 18, overflow: 'hidden', border: `1px solid ${C.gray200}` }}>
            {navItems.map((item, index) => (
                <div key={item.id} onClick={() => setTab(item.id)} style={{ padding: '15px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, cursor: 'pointer', background: tab === item.id ? C.gold : C.white, borderTop: index > 0 ? `1px solid ${C.gray200}` : 'none', transition: 'background 0.2s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Icon name={item.icon} size={16} color={C.black} />
                  <span style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 14, color: C.black }}>{item.label}</span>
                </div>
                {item.count ? <Badge variant="gold">{item.count}</Badge> : null}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16, display: 'grid', gap: 10 }}>
            <Btn variant="primary" fullWidth onClick={onCatalog}>{account?.newBooking}</Btn>
            <Btn variant="outline" fullWidth onClick={onHome}>← {detail?.breadcrumbs?.home}</Btn>
            <Btn variant="ghost" fullWidth onClick={auth.logout}>{account?.logout || common?.signOut}</Btn>
          </div>
        </div>

        <div>
          {(submitError || message) && (
            <div style={{ marginBottom: 20, background: submitError ? '#fef2f2' : '#eff6ff', color: submitError ? '#991b1b' : '#1e40af', borderRadius: 12, padding: '14px 16px', fontFamily: 'Inter', fontSize: 14 }}>
              {submitError || message}
            </div>
          )}

          {tab === 'bookings' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 32, letterSpacing: '-0.04em', color: C.black, margin: 0 }}>{account?.bookings}</h2>
                <Btn variant="primary" onClick={onCatalog}>{account?.newBooking}</Btn>
              </div>
              {auth.bookings.length === 0 ? (
                <div style={{ background: C.white, borderRadius: 18, padding: 28, border: `1px solid ${C.gray200}`, fontFamily: 'Inter', color: C.gray500 }}>{account?.noBookings}</div>
              ) : auth.bookings.map((item) => {
                const fleetScooter = scooterMap[item.scooter?.id];
                const paymentStatus = item.latest_payment?.status || item.payment_status;
                const canPay = item.payment_method === 'online_card' && item.payment_status !== 'paid' && !['completed', 'cancelled'].includes(item.status);
                const canCancel = !['cancelled', 'completed'].includes(item.status);
                const isBusy = workingBookingId === item.id;
                const bookingMeta = [
                  formatDateRange(item.start_datetime, item.end_datetime, lang),
                  item.delivery_address,
                  `#${item.order_number}`,
                ].filter(Boolean).join(' · ');

                return (
                  <div className="account-booking-card" key={item.id} style={{ background: C.white, borderRadius: 18, padding: '24px', marginBottom: 16, border: `1px solid ${C.gray200}`, display: 'flex', gap: 20, alignItems: 'center' }}>
                    <div style={{ width: 110, borderRadius: 12, overflow: 'hidden', flexShrink: 0 }}>
                      <ScooterImg scooter={fleetScooter || { ...scooterMap[1], name: item.scooter?.title || common?.vehicle, engine: fleetScooter?.engine || '', typeLabel: fleetScooter?.typeLabel || common?.types?.scooter, accent: fleetScooter?.accent || '#111111' }} height={78} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <div>
                          <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 17, color: C.black, marginBottom: 4, letterSpacing: '-0.02em' }}>{fleetScooter?.name || item.scooter?.title}</div>
                          <div style={{ fontFamily: 'Inter', fontSize: 13, color: C.gray500 }}>{bookingMeta}</div>
                        </div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                          <Badge variant={statusVariant(item.status)}>{common?.bookingStatuses?.[item.status] || item.status}</Badge>
                          <Badge variant={paymentVariant(paymentStatus)}>{account?.paymentStatus}: {paymentStatusText(paymentStatus, account)}</Badge>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 18, color: C.black }}>${Number(item.total_price).toFixed(2)}</span>
                        <span style={{ fontFamily: 'Inter', fontSize: 13, color: C.gray500 }}>{item.rental_days} {common?.days}</span>
                        <span style={{ fontFamily: 'Inter', fontSize: 13, color: C.gray500 }}>{account?.paymentMethod}: {common?.paymentMethods?.[item.payment_method] || item.payment_method}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
                        {canPay && (
                          <Btn variant="primary" size="sm" onClick={() => handleBookingPayment(item)} disabled={isBusy}>
                            {isBusy ? '...' : (item.latest_payment?.status === 'pending' && item.latest_payment?.payment_url
                              ? account?.openPayment
                              : account?.payNow)}
                          </Btn>
                        )}
                        {canCancel && (
                          <Btn variant="outline" size="sm" onClick={() => handleBookingCancel(item)} disabled={isBusy}>
                            {isBusy ? '...' : account?.cancelBookingAction}
                          </Btn>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {tab === 'documents' && (
            <div>
              <h2 style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 32, letterSpacing: '-0.04em', color: C.black, margin: '0 0 24px' }}>{account?.documents}</h2>
              <div style={{ background: C.white, borderRadius: 18, padding: 32, border: `1px solid ${C.gray200}`, marginBottom: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 16, alignItems: 'end' }}>
                  <FormField label={account?.documentType}>
                    <select value={docForm.document_type} onChange={(event) => setDocForm((current) => ({ ...current, document_type: event.target.value }))} style={{ width: '100%', padding: '13px 16px', border: `1.5px solid ${C.gray300}`, borderRadius: 10, fontFamily: 'Inter', fontSize: 15, outline: 'none', background: C.white }}>
                      {Object.entries(common?.documentTypes || {}).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </FormField>
                  <FormField label={account?.documentFile}>
                    <input key={docInputKey} type="file" onChange={(event) => setDocForm((current) => ({ ...current, file: event.target.files?.[0] || null }))} style={{ width: '100%', fontFamily: 'Inter' }} />
                  </FormField>
                  <Btn variant="dark" onClick={uploadDocument} disabled={working}>{account?.uploadDocument}</Btn>
                </div>
              </div>
              <div style={{ background: C.white, borderRadius: 18, padding: 32, border: `1px solid ${C.gray200}` }}>
                {auth.documents.length === 0 ? (
                  <div style={{ fontFamily: 'Inter', color: C.gray500 }}>{account?.noDocuments}</div>
                ) : auth.documents.map((document) => (
                  <div key={document.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 0', borderBottom: `1px solid ${C.gray200}` }}>
                    <div>
                      <div style={{ fontFamily: 'Sora', fontWeight: 600, fontSize: 15, color: C.black }}>{common?.documentTypes?.[document.document_type] || document.document_type}</div>
                      <div style={{ fontFamily: 'Inter', fontSize: 12, color: C.gray500, marginTop: 4 }}>{account?.documentIdLabel?.replace('{id}', String(document.id))}</div>
                      <div style={{ fontFamily: 'Inter', fontSize: 12, color: C.gray500, marginTop: 4 }}>{account?.uploadedAt}: {formatDateTime(document.created_at, lang)}</div>
                      {document.file && (
                        <a href={document.file} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: 8, fontFamily: 'Inter', fontSize: 12, color: C.black }}>
                          {account?.viewDocument}
                        </a>
                      )}
                    </div>
                    <Badge variant={document.status === 'approved' ? 'green' : document.status === 'rejected' ? 'red' : 'orange'}>{common?.documentStatuses?.[document.status] || document.status}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'notifications' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 32, letterSpacing: '-0.04em', color: C.black, margin: 0 }}>{account?.notifications}</h2>
                <Btn variant="outline" onClick={auth.markAllNotificationsRead}>{account?.markRead}</Btn>
              </div>
              <div style={{ background: C.white, borderRadius: 18, overflow: 'hidden', border: `1px solid ${C.gray200}` }}>
                {auth.notifications.length === 0 ? (
                  <div style={{ padding: 24, fontFamily: 'Inter', color: C.gray500 }}>{account?.noNotifications}</div>
                ) : auth.notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={async () => {
                      const threadId = notification.data?.thread_id || notification.data_json?.thread_id;
                      if (!threadId) {
                        return;
                      }
                      setTab('support');
                      setActiveThreadId(threadId);
                      await loadThreadMessages(threadId);
                    }}
                    style={{ padding: '18px 24px', display: 'flex', gap: 16, alignItems: 'flex-start', borderBottom: `1px solid ${C.gray200}`, background: notification.is_read ? C.white : 'rgba(255,215,0,0.04)', cursor: notification.data?.thread_id || notification.data_json?.thread_id ? 'pointer' : 'default' }}
                  >
                    <div style={{ width: 44, height: 44, background: notification.is_read ? C.gray100 : C.gold, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon name="bell" size={20} color={C.black} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 14, color: C.black, marginBottom: 3 }}>{notification.title}</div>
                      <div style={{ fontFamily: 'Inter', fontSize: 13, color: C.gray500 }}>{notification.message || notification.body}</div>
                      <div style={{ fontFamily: 'Inter', fontSize: 12, color: C.gray500, marginTop: 8 }}>{formatDateTime(notification.created_at, lang)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'support' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <div>
                  <h2 style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 32, letterSpacing: '-0.04em', color: C.black, margin: 0 }}>{account?.support}</h2>
                  <div style={{ fontFamily: 'Inter', fontSize: 13, color: C.gray500, marginTop: 8 }}>{account?.supportHint}</div>
                </div>
                <Btn variant="primary" onClick={handleStartSupport} disabled={working}>{account?.supportCreate}</Btn>
              </div>

              {threadError ? (
                <div style={{ marginBottom: 16, background: '#fef2f2', color: '#991b1b', borderRadius: 12, padding: '14px 16px', fontFamily: 'Inter', fontSize: 14 }}>
                  {threadError}
                </div>
              ) : null}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                <div style={{ background: C.white, borderRadius: 18, overflow: 'hidden', border: `1px solid ${C.gray200}` }}>
                  {auth.chatThreads.length === 0 ? (
                    <div style={{ padding: 24, fontFamily: 'Inter', color: C.gray500 }}>{account?.noSupportThreads}</div>
                  ) : auth.chatThreads.map((thread) => (
                    <div
                      key={thread.id}
                      onClick={() => setActiveThreadId(thread.id)}
                      style={{ padding: '16px 18px', borderBottom: `1px solid ${C.gray200}`, cursor: 'pointer', background: activeThreadId === thread.id ? 'rgba(255,215,0,0.08)' : C.white }}
                    >
                      <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 14, color: C.black, marginBottom: 4 }}>{thread.title || account?.supportThreadTitle}</div>
                      <div style={{ fontFamily: 'Inter', fontSize: 12, color: C.gray500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {thread.last_message?.text || account?.noSupportThreads}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ background: C.white, borderRadius: 18, border: `1px solid ${C.gray200}`, display: 'flex', flexDirection: 'column', minHeight: 520 }}>
                  {activeThread ? (
                    <>
                      <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.gray200}` }}>
                        <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 18, color: C.black }}>{activeThread.title || account?.supportThreadTitle}</div>
                        <div style={{ fontFamily: 'Inter', fontSize: 12, color: C.gray500, marginTop: 4 }}>{activeThread.status}</div>
                      </div>
                      <div style={{ flex: 1, padding: '20px 24px', background: C.gray100, display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }}>
                        {threadLoading ? (
                          <div style={{ fontFamily: 'Inter', fontSize: 14, color: C.gray500 }}>{common?.loading}</div>
                        ) : threadMessages.length === 0 ? (
                          <div style={{ fontFamily: 'Inter', fontSize: 14, color: C.gray500 }}>{account?.noSupportThreads}</div>
                        ) : threadMessages.map((item) => {
                          const isOwn = item.sender?.email === auth.profile?.email;
                          return (
                            <div key={item.id} style={{ alignSelf: isOwn ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                              <div style={{ background: isOwn ? C.black : C.white, color: isOwn ? C.white : C.black, borderRadius: isOwn ? '18px 6px 18px 18px' : '6px 18px 18px 18px', padding: '12px 16px' }}>
                                <div style={{ fontFamily: 'Inter', fontSize: 14, lineHeight: 1.6 }}>{item.text}</div>
                              </div>
                              <div style={{ fontFamily: 'Inter', fontSize: 11, color: C.gray500, marginTop: 5, textAlign: isOwn ? 'right' : 'left' }}>{formatDateTime(item.created_at, lang)}</div>
                            </div>
                          );
                        })}
                      </div>
                      <div style={{ padding: '18px 24px', borderTop: `1px solid ${C.gray200}` }}>
                        {auth.quickReplies.length > 0 ? (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                            {auth.quickReplies.slice(0, 4).map((reply) => (
                              <Btn key={reply.id} variant="ghost" onClick={() => setChatDraft(reply.text)}>{reply.title}</Btn>
                            ))}
                          </div>
                        ) : null}
                        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
                          <textarea value={chatDraft} onChange={(event) => setChatDraft(event.target.value)} placeholder={account?.supportPlaceholder} style={{ width: '100%', minHeight: 96, resize: 'vertical', borderRadius: 12, border: `1.5px solid ${C.gray300}`, padding: '14px 16px', fontFamily: 'Inter', fontSize: 14, outline: 'none' }} />
                          <Btn variant="primary" onClick={handleSendChat} disabled={working || !chatDraft.trim()} style={{ height: 44 }}>
                            {working ? '...' : account?.supportSend}
                          </Btn>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div style={{ padding: 24, fontFamily: 'Inter', color: C.gray500 }}>{account?.noSupportThreads}</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {tab === 'profile' && (
            <div>
              <h2 style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 32, letterSpacing: '-0.04em', color: C.black, margin: '0 0 24px' }}>{account?.profile}</h2>
              <div style={{ background: C.white, borderRadius: 18, padding: 32, border: `1px solid ${C.gray200}` }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <FormField label={account?.fullName}>
                    <StyledInput value={profileForm.full_name} onChange={(event) => setProfileForm((current) => ({ ...current, full_name: event.target.value }))} placeholder="Alex Kim" />
                  </FormField>
                  <FormField label={account?.phone}>
                    <StyledInput value={profileForm.phone} onChange={(event) => setProfileForm((current) => ({ ...current, phone: event.target.value }))} placeholder="+62 812 0000 0000" />
                  </FormField>
                  <FormField label={account?.country}>
                    <StyledInput value={profileForm.country} onChange={(event) => setProfileForm((current) => ({ ...current, country: event.target.value }))} placeholder="Indonesia" />
                  </FormField>
                  <FormField label={account?.language}>
                    <select value={profileForm.language} onChange={(event) => setProfileForm((current) => ({ ...current, language: event.target.value }))} style={{ width: '100%', padding: '13px 16px', border: `1.5px solid ${C.gray300}`, borderRadius: 10, fontFamily: 'Inter', fontSize: 15, outline: 'none', background: C.white }}>
                      {languages.map((language) => <option key={language.api_code} value={language.api_code}>{language.label}</option>)}
                    </select>
                  </FormField>
                  <FormField label={account?.currency}>
                    <select value={profileForm.currency} onChange={(event) => setProfileForm((current) => ({ ...current, currency: event.target.value }))} style={{ width: '100%', padding: '13px 16px', border: `1.5px solid ${C.gray300}`, borderRadius: 10, fontFamily: 'Inter', fontSize: 15, outline: 'none', background: C.white }}>
                      {['USD', 'IDR'].map((currency) => <option key={currency} value={currency}>{currency}</option>)}
                    </select>
                  </FormField>
                  <FormField label={account?.email}>
                    <StyledInput value={auth.profile?.email || ''} onChange={() => {}} placeholder={auth.profile?.email || ''} />
                  </FormField>
                </div>
                <div style={{ marginTop: 28 }}>
                  <Btn variant="primary" onClick={saveProfile} disabled={working}>{account?.saveProfile}</Btn>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
