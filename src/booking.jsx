import React from 'react';
import { useAuth } from './auth-context';
import { apiRequest, authRequest, trackEvent } from './api';
import { useSite } from './site-context';
import { Badge, Btn, C, Divider, FormField, Icon, ScooterImg } from './ui';

function buildDateTime(date, time) {
  return `${date}T${time}:00`;
}

function paymentStatusLabel(status, bookingContent, accountContent) {
  if (status === 'succeeded' || status === 'paid') {
    return bookingContent?.paymentSucceeded || accountContent?.paymentSucceeded || status;
  }
  if (status === 'pending') {
    return bookingContent?.paymentPending || accountContent?.paymentPending || status;
  }
  if (status === 'failed') {
    return accountContent?.paymentFailed || status;
  }
  if (status === 'refunded') {
    return accountContent?.paymentRefunded || status;
  }
  return status;
}

export default function BookingPage({ scooter, onAccount, onCatalog, onHome }) {
  const { addons, deliveryZones, deliverySlots, content, lang } = useSite();
  const auth = useAuth();
  const availableSlots = deliverySlots.length > 0 ? deliverySlots : ['09:00'];
  const [step, setStep] = React.useState(1);
  const [data, setData] = React.useState({
    checkIn: '',
    checkOut: '',
    time: availableSlots[0],
    zone: '',
    address: '',
    addons: [],
    payment: 'online_card',
    fullName: '',
    email: '',
    phone: '',
    cardholderName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });
  const [quote, setQuote] = React.useState(null);
  const [pricingPreview, setPricingPreview] = React.useState(null);
  const [quoteError, setQuoteError] = React.useState('');
  const [promoState, setPromoState] = React.useState({ code: '', message: '', valid: null, discount: 0 });
  const [submitting, setSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState('');
  const [done, setDone] = React.useState(null);

  const booking = content?.booking;
  const account = content?.account;
  const common = content?.common;
  const detail = content?.detail;
  const selectedZone = deliveryZones.find((zone) => zone.name === data.zone) || null;

  React.useEffect(() => {
    setData((current) => {
      if (availableSlots.includes(current.time)) {
        return current;
      }
      return { ...current, time: availableSlots[0] };
    });
  }, [availableSlots]);

  React.useEffect(() => {
    if (auth.profile?.full_name || auth.profile?.email) {
      setData((current) => ({
        ...current,
        fullName: current.fullName || auth.profile.full_name || '',
        email: current.email || auth.profile.email || '',
        phone: current.phone || auth.profile.phone || '',
      }));
    }
  }, [auth.profile]);

  React.useEffect(() => {
    async function calculateQuote() {
      if (!scooter || !data.checkIn || !data.checkOut) {
        setQuote(null);
        setPricingPreview(null);
        setQuoteError('');
        return;
      }

      try {
        const payload = {
          scooter_id: scooter.id,
          start_datetime: buildDateTime(data.checkIn, data.time),
          end_datetime: buildDateTime(data.checkOut, data.time),
          delivery_address: data.address || undefined,
          delivery_latitude: selectedZone?.latitude,
          delivery_longitude: selectedZone?.longitude,
          add_on_ids: data.addons,
          promo_code: promoState.valid ? promoState.code : undefined,
          payment_method: data.payment,
          currency: 'USD',
        };
        const [response, pricing] = await Promise.all([
          apiRequest('/bookings/calculate/', {
            method: 'POST',
            body: JSON.stringify(payload),
          }),
          apiRequest('/pricing/calculate/', {
            method: 'POST',
            body: JSON.stringify({
              scooter_id: scooter.id,
              start_date: data.checkIn,
              end_date: data.checkOut,
              device_type: 'web',
            }),
          }).catch(() => null),
        ]);
        setQuote(response);
        setPricingPreview(pricing);
        setQuoteError('');
      } catch (error) {
        setQuote(null);
        setPricingPreview(null);
        setQuoteError(error.message || booking?.calculateFailed);
      }
    }

    calculateQuote();
  }, [data.addons, data.address, data.checkIn, data.checkOut, data.payment, data.time, promoState.code, promoState.valid, scooter, selectedZone]);

  React.useEffect(() => {
    if (step === 3 && scooter) {
      trackEvent('start_checkout', { scooter_id: scooter.id }, { accessToken: auth.session?.access });
    }
  }, [auth.session?.access, scooter, step]);

  if (!scooter) {
    return (
      <div style={{ minHeight: '100vh', paddingTop: 72, background: C.gray100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: C.white, borderRadius: 20, border: `1px solid ${C.gray200}`, padding: '40px 32px', textAlign: 'center', maxWidth: 480 }}>
          <h2 style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 28, color: C.black, margin: '0 0 12px' }}>{booking?.unavailableTitle}</h2>
          <p style={{ fontFamily: 'Inter', fontSize: 15, lineHeight: 1.7, color: C.gray500, margin: '0 0 24px' }}>{booking?.unavailableBody}</p>
          <Btn variant="dark" onClick={onCatalog}>{booking?.goToFleet}</Btn>
        </div>
      </div>
    );
  }

  const days = quote?.rental_days || 0;
  const total = Number(quote?.total_price || 0);
  const steps = booking?.steps || [];

  async function completeBooking() {
    if (!data.checkIn || !data.checkOut || !data.zone || !data.address) {
      setSubmitError(booking?.detailsRequired || 'Please complete dates and delivery details first.');
      return;
    }

    if (!data.fullName || !data.email) {
      setSubmitError(booking?.contactRequired || 'Please provide your contact details.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    const payload = {
      scooter_id: scooter.id,
      start_datetime: buildDateTime(data.checkIn, data.time),
      end_datetime: buildDateTime(data.checkOut, data.time),
      delivery_address: data.address,
      delivery_latitude: selectedZone?.latitude,
      delivery_longitude: selectedZone?.longitude,
      add_on_ids: data.addons,
      payment_method: data.payment,
      promo_code: promoState.valid ? promoState.code : undefined,
      currency: 'USD',
    };

    try {
      let bookingResponse;
      let paymentResponse = null;
      let createdAccount = false;
      let eventAccessToken = auth.session?.access;

      if (auth.isAuthenticated) {
        bookingResponse = await authRequest('/bookings/', auth.session.access, {
          method: 'POST',
          body: JSON.stringify(payload),
        });

        if (payload.payment_method === 'online_card') {
          paymentResponse = await auth.createPayment(bookingResponse.id);
        } else {
          await auth.reloadAccount();
        }
      } else {
        const response = await apiRequest('/bookings/guest-create/', {
          method: 'POST',
          body: JSON.stringify({
            ...payload,
            guest_email: data.email,
            guest_full_name: data.fullName,
            guest_phone: data.phone,
            language: lang,
          }),
        });
        await auth.setSessionFromGuest(response.auth);
        bookingResponse = response.booking;
        createdAccount = response.created_account;
        eventAccessToken = response.auth.access;

        if (payload.payment_method === 'online_card') {
          paymentResponse = await auth.createPayment(response.booking.id, undefined, response.auth.access);
        }
      }

      setDone({ booking: bookingResponse, payment: paymentResponse, createdAccount });
      trackEvent('booking_created', { booking_id: bookingResponse.id, scooter_id: scooter.id }, { accessToken: eventAccessToken });
    } catch (error) {
      setSubmitError(error.message || booking?.submitError || booking?.existingEmailError || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    const booked = done.booking;
    const payment = done.payment || booked.latest_payment;
    const paymentPending = payment?.status === 'pending' || ['created', 'pending_payment'].includes(booked.status);
    const title = paymentPending ? (booking?.pendingTitle || booking?.title) : booking?.confirmedTitle;
    const body = paymentPending
      ? (booking?.pendingBody || booking?.confirmationBody || '').replace('{scooter}', scooter.name)
      : (booking?.confirmationBody || '').replace('{scooter}', scooter.name);

    return (
      <div style={{ paddingTop: 72, minHeight: '100vh', background: C.gray100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="booking-confirmation-card" style={{ background: C.white, borderRadius: 24, padding: '72px 56px', maxWidth: 540, width: '100%', textAlign: 'center', boxShadow: '0 24px 80px rgba(0,0,0,0.1)' }}>
          <div style={{ width: 88, height: 88, background: C.gold, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', boxShadow: '0 12px 40px rgba(255,215,0,0.4)' }}>
            <Icon name="check" size={40} color={C.black} strokeWidth={2.2} />
          </div>
          <h2 style={{ fontFamily: 'Sora', fontWeight: 900, fontSize: 36, letterSpacing: '-0.04em', color: C.black, margin: '0 0 12px' }}>{title}</h2>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: C.gray100, borderRadius: 100, padding: '8px 20px', marginBottom: 20 }}>
            <span style={{ fontFamily: 'Inter', fontSize: 14, color: C.gray700 }}>{booking?.bookingId}:</span>
            <span style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 14, color: C.black }}>#{booked.order_number}</span>
          </div>
          <p style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: 1.7, color: C.gray500, margin: '0 0 20px' }}>
            {body}
          </p>
          {done.createdAccount && (
            <div style={{ background: 'rgba(255,215,0,0.12)', borderRadius: 14, padding: '16px 18px', margin: '0 0 20px', fontFamily: 'Inter', fontSize: 14, color: C.gray700 }}>
              {booking?.createdAccount}
            </div>
          )}
          {payment && (
            <div style={{ background: payment?.status === 'succeeded' ? 'rgba(34,197,94,0.08)' : 'rgba(59,130,246,0.08)', border: `1px solid ${payment?.status === 'succeeded' ? 'rgba(34,197,94,0.18)' : 'rgba(59,130,246,0.18)'}`, borderRadius: 14, padding: '18px 20px', margin: '0 0 20px', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', marginBottom: payment?.payment_url ? 12 : 0 }}>
                <div>
                  <div style={{ fontFamily: 'Inter', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', color: C.gray500, marginBottom: 6 }}>
                    {account?.paymentStatus}
                  </div>
                  <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 16, color: C.black }}>
                    {paymentStatusLabel(payment.status, booking, account)}
                  </div>
                </div>
                <Badge variant={payment?.status === 'succeeded' ? 'green' : payment?.status === 'failed' ? 'red' : 'default'}>
                  {paymentStatusLabel(payment.status, booking, account)}
                </Badge>
              </div>
              {payment?.payment_url && (
                <Btn variant="dark" onClick={() => window.open(payment.payment_url, '_blank', 'noopener,noreferrer')}>
                  {booking?.openPayment || account?.openPayment}
                </Btn>
              )}
            </div>
          )}
          <div style={{ background: C.gray100, borderRadius: 14, padding: '20px', margin: '0 0 32px', textAlign: 'left' }}>
            {[
              [booking?.summaryLabels?.vehicle, scooter.name],
              [booking?.summaryLabels?.duration, `${booked.rental_days} ${common?.days}`],
              [booking?.summaryLabels?.delivery, data.zone],
              [booking?.summaryLabels?.total, `$${Number(booked.total_price).toFixed(2)}`],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Inter', fontSize: 14, color: C.gray700, marginBottom: 8 }}>
                <span>{label}</span><strong style={{ color: C.black }}>{value}</strong>
              </div>
            ))}
          </div>
          <div className="booking-success-actions" style={{ display: 'flex', gap: 12 }}>
            <Btn variant="dark" fullWidth onClick={onAccount}>{content?.account?.bookings}</Btn>
            <Btn variant="outline" fullWidth onClick={onHome}>{detail?.breadcrumbs?.home}</Btn>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 72, minHeight: '100vh', background: C.gray100 }}>
      <div className="page-header" style={{ background: C.white, borderBottom: `1px solid ${C.gray200}`, padding: '22px 80px' }}>
        <div className="booking-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 960, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 22, letterSpacing: '-0.03em', color: C.black, margin: 0 }}>{booking?.title}</h2>
          <div className="booking-stepper" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {steps.map((label, index) => (
              <React.Fragment key={label}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: index + 1 < step ? C.black : index + 1 === step ? C.gold : C.gray200, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Sora', fontWeight: 800, fontSize: 12, color: index + 1 < step ? C.white : index + 1 === step ? C.black : C.gray500, transition: 'all 0.3s' }}>
                    {index + 1 < step ? <Icon name="check" size={14} color={C.white} strokeWidth={2.3} /> : index + 1}
                  </div>
                  <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: index + 1 === step ? 700 : 400, color: index + 1 === step ? C.black : C.gray500 }}>{label}</span>
                </div>
                {index < steps.length - 1 && <div style={{ width: 28, height: 1.5, background: index + 1 < step ? C.black : C.gray300, margin: '0 4px' }} />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="booking-layout" style={{ maxWidth: 960, margin: '36px auto', padding: '0 80px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
        <div>
          {step === 1 && (
            <div>
              <div style={{ background: C.white, borderRadius: 18, padding: 32, border: `1px solid ${C.gray200}`, marginBottom: 20 }}>
                <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 20, color: C.black, margin: '0 0 24px', letterSpacing: '-0.02em' }}>{booking?.rentalDatesTitle}</h3>
                <div className="booking-dates" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  {[[booking?.startDate, 'checkIn'], [booking?.endDate, 'checkOut']].map(([label, key]) => (
                    <FormField key={key} label={label}>
                      <input type="date" value={data[key]} onChange={(event) => setData((current) => ({ ...current, [key]: event.target.value }))}
                        style={{ width: '100%', boxSizing: 'border-box', padding: '13px 16px', border: `1.5px solid ${C.gray300}`, borderRadius: 10, fontFamily: 'Inter', fontSize: 15, outline: 'none', cursor: 'pointer' }} />
                    </FormField>
                  ))}
                </div>
                <FormField label={booking?.deliveryTime} style={{ maxWidth: 200 }}>
                  <select value={data.time} onChange={(event) => setData((current) => ({ ...current, time: event.target.value }))}
                    style={{ width: '100%', padding: '13px 16px', border: `1.5px solid ${C.gray300}`, borderRadius: 10, fontFamily: 'Inter', fontSize: 15, outline: 'none', background: C.white, cursor: 'pointer' }}>
                    {availableSlots.map((time) => <option key={time} value={time}>{time}</option>)}
                  </select>
                </FormField>
              </div>

              <div style={{ background: C.white, borderRadius: 18, padding: 32, border: `1px solid ${C.gray200}` }}>
                <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 20, color: C.black, margin: '0 0 24px', letterSpacing: '-0.02em' }}>{booking?.deliveryAddressTitle}</h3>
                {auth.deliveryAddresses.length > 0 ? (
                  <FormField label={booking?.savedAddressLabel || 'Saved addresses'} style={{ marginBottom: 16 }}>
                    <select
                      value=""
                      onChange={(event) => {
                        const selected = auth.deliveryAddresses.find((item) => String(item.id) === event.target.value);
                        if (!selected) {
                          return;
                        }
                        setData((current) => ({ ...current, address: selected.address_text }));
                      }}
                      style={{ width: '100%', padding: '13px 16px', border: `1.5px solid ${C.gray300}`, borderRadius: 10, fontFamily: 'Inter', fontSize: 15, outline: 'none', background: C.white }}
                    >
                      <option value="">{booking?.selectSavedAddress || 'Use a saved address'}</option>
                      {auth.deliveryAddresses.map((address) => <option key={address.id} value={address.id}>{address.address_text}</option>)}
                    </select>
                  </FormField>
                ) : null}
                <FormField label={booking?.areaZone} style={{ marginBottom: 16 }}>
                  <select value={data.zone} onChange={(event) => setData((current) => ({ ...current, zone: event.target.value }))}
                    style={{ width: '100%', padding: '13px 16px', border: `1.5px solid ${C.gray300}`, borderRadius: 10, fontFamily: 'Inter', fontSize: 15, outline: 'none', background: C.white }}>
                    <option value="">{booking?.selectArea}</option>
                    {deliveryZones.map((zone) => (
                      <option key={zone.id} value={zone.name}>
                        {zone.name} — {zone.freeDelivery ? common?.free : `Rp ${zone.deliveryFeeIDR.toLocaleString()}`} · {zone.timeMinutes} {common?.minutesShort}
                      </option>
                    ))}
                  </select>
                </FormField>
                <FormField label={booking?.fullAddress}>
                  <textarea value={data.address} onChange={(event) => setData((current) => ({ ...current, address: event.target.value }))} placeholder={booking?.addressPlaceholder}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '13px 16px', border: `1.5px solid ${C.gray300}`, borderRadius: 10, fontFamily: 'Inter', fontSize: 15, outline: 'none', resize: 'vertical', minHeight: 88 }} />
                </FormField>
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ background: C.white, borderRadius: 18, padding: 32, border: `1px solid ${C.gray200}` }}>
              <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 20, color: C.black, margin: '0 0 8px', letterSpacing: '-0.02em' }}>{booking?.addonsTitle}</h3>
              <p style={{ fontFamily: 'Inter', fontSize: 14, color: C.gray500, margin: '0 0 28px' }}>{booking?.addonsSubtitle}</p>
              <div className="booking-addons" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
                {addons.map((addon) => {
                  const enabled = data.addons.includes(addon.id);
                  const toggle = () => setData((current) => ({
                    ...current,
                    addons: enabled ? current.addons.filter((item) => item !== addon.id) : [...current.addons, addon.id],
                  }));

                  return (
                    <div key={addon.id} onClick={toggle} style={{ padding: '20px', borderRadius: 14, cursor: 'pointer', border: `1.5px solid ${enabled ? C.gold : C.gray200}`, background: enabled ? 'rgba(255,215,0,0.06)' : C.gray100, transition: 'all 0.22s' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                        <Icon name={addon.icon} size={28} color={C.black} />
                        <div style={{ width: 24, height: 24, borderRadius: 7, border: `2px solid ${enabled ? C.gold : C.gray300}`, background: enabled ? C.gold : C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.18s' }}>
                          {enabled && <Icon name="check" size={13} color={C.black} strokeWidth={2.4} />}
                        </div>
                      </div>
                      <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 14, color: C.black, marginBottom: 3 }}>{addon.name}</div>
                      <div style={{ fontFamily: 'Inter', fontSize: 12, color: C.gray500, marginBottom: 10 }}>{addon.description}</div>
                      <div style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 16, color: C.black }}>+${addon.priceUSD}<span style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: 11, color: C.gray500 }}> {common?.perDay}</span></div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div style={{ background: C.white, borderRadius: 18, padding: 32, border: `1px solid ${C.gray200}`, marginBottom: 20 }}>
                <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 20, color: C.black, margin: '0 0 24px', letterSpacing: '-0.02em' }}>{booking?.contactTitle}</h3>
                <div style={{ display: 'grid', gap: 16, marginBottom: 28 }}>
                  {[
                    [booking?.fullName, 'fullName', 'text', 'Alex Kim'],
                    [booking?.email, 'email', 'email', 'alex@example.com'],
                    [booking?.phone, 'phone', 'text', '+62 812 0000 0000'],
                  ].map(([label, key, type, placeholder]) => (
                    <FormField key={key} label={label}>
                      <input type={type} value={data[key]} onChange={(event) => setData((current) => ({ ...current, [key]: event.target.value }))} placeholder={placeholder}
                        style={{ width: '100%', boxSizing: 'border-box', padding: '13px 16px', border: `1.5px solid ${C.gray300}`, borderRadius: 10, fontFamily: 'Inter', fontSize: 15, outline: 'none' }} />
                    </FormField>
                  ))}
                </div>

                <div style={{ marginBottom: 28 }}>
                  <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 20, color: C.black, margin: '0 0 12px', letterSpacing: '-0.02em' }}>{booking?.promoTitle || 'Promo code'}</h3>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <input
                      type="text"
                      value={promoState.code}
                      onChange={(event) => setPromoState((current) => ({ ...current, code: event.target.value.toUpperCase(), valid: null, message: '' }))}
                      placeholder={booking?.promoPlaceholder || 'Enter promo code'}
                      style={{ flex: 1, boxSizing: 'border-box', padding: '13px 16px', border: `1.5px solid ${C.gray300}`, borderRadius: 10, fontFamily: 'Inter', fontSize: 15, outline: 'none' }}
                    />
                    <Btn
                      variant="outline"
                      onClick={async () => {
                        if (!promoState.code.trim()) {
                          setPromoState((current) => ({ ...current, valid: false, message: booking?.promoEmpty || 'Enter a promo code first.' }));
                          return;
                        }
                        try {
                          const response = await apiRequest('/marketing/promocodes/validate/', {
                            method: 'POST',
                            body: JSON.stringify({ code: promoState.code.trim(), amount: total || scooter.priceUSD }),
                          });
                          setPromoState((current) => ({
                            ...current,
                            valid: response.valid,
                            discount: Number(response.discount_amount || 0),
                            message: response.message,
                          }));
                        } catch (error) {
                          setPromoState((current) => ({ ...current, valid: false, message: error.message || booking?.promoInvalid || 'Promo code is invalid.' }));
                        }
                      }}
                    >
                      {booking?.promoApply || 'Apply'}
                    </Btn>
                  </div>
                  {promoState.message ? (
                    <div style={{ marginTop: 10, fontFamily: 'Inter', fontSize: 13, color: promoState.valid ? '#166534' : '#9a3412' }}>
                      {promoState.message}
                    </div>
                  ) : null}
                </div>

                <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 20, color: C.black, margin: '0 0 24px', letterSpacing: '-0.02em' }}>{booking?.paymentTitle}</h3>
                <div className="booking-payments" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
                  {[
                    ['online_card', 'credit-card', common?.paymentMethods?.online_card],
                    ['cash_on_delivery', 'wallet', common?.paymentMethods?.cash_on_delivery],
                    ['card_on_delivery', 'payment-terminal', common?.paymentMethods?.card_on_delivery],
                  ].map(([value, icon, label]) => (
                    <div key={value} onClick={() => setData((current) => ({ ...current, payment: value }))} style={{ padding: '16px', borderRadius: 12, cursor: 'pointer', border: `1.5px solid ${data.payment === value ? C.black : C.gray200}`, background: data.payment === value ? C.black : C.gray100, textAlign: 'center', transition: 'all 0.2s' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
                        <Icon name={icon} size={22} color={data.payment === value ? C.white : C.gray700} />
                      </div>
                      <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 14, color: data.payment === value ? C.white : C.gray700 }}>{label}</div>
                    </div>
                  ))}
                </div>

                {data.payment === 'online_card' && (
                  <div style={{ display: 'grid', gap: 16 }}>
                    {[
                      [booking?.cardholderName, 'cardholderName', 'text', booking?.fullName || ''],
                      [booking?.cardNumber, 'cardNumber', 'text', '1234 5678 9012 3456'],
                    ].map(([label, key, type, placeholder]) => (
                      <FormField key={key} label={label}>
                        <input type={type} value={data[key]} onChange={(event) => setData((current) => ({ ...current, [key]: event.target.value }))} placeholder={placeholder}
                          style={{ width: '100%', boxSizing: 'border-box', padding: '13px 16px', border: `1.5px solid ${C.gray300}`, borderRadius: 10, fontFamily: 'Inter', fontSize: 15, outline: 'none' }} />
                      </FormField>
                    ))}
                    <div className="booking-card-fields" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <FormField label={booking?.expiry}>
                        <input type="text" value={data.expiry} onChange={(event) => setData((current) => ({ ...current, expiry: event.target.value }))} placeholder="MM / YY"
                          style={{ width: '100%', boxSizing: 'border-box', padding: '13px 16px', border: `1.5px solid ${C.gray300}`, borderRadius: 10, fontFamily: 'Inter', fontSize: 15, outline: 'none' }} />
                      </FormField>
                      <FormField label={booking?.cvv}>
                        <input type="password" value={data.cvv} onChange={(event) => setData((current) => ({ ...current, cvv: event.target.value }))} placeholder="•••" maxLength={4}
                          style={{ width: '100%', boxSizing: 'border-box', padding: '13px 16px', border: `1.5px solid ${C.gray300}`, borderRadius: 10, fontFamily: 'Inter', fontSize: 15, outline: 'none' }} />
                      </FormField>
                    </div>
                    <div style={{ background: C.gray100, borderRadius: 14, padding: 24 }}>
                      <p style={{ fontFamily: 'Inter', fontSize: 15, color: C.gray700, margin: 0, lineHeight: 1.75 }}>{booking?.onlineCardText}</p>
                    </div>
                  </div>
                )}

                {data.payment === 'cash_on_delivery' && (
                  <div style={{ background: C.gray100, borderRadius: 14, padding: 24 }}>
                    <p style={{ fontFamily: 'Inter', fontSize: 15, color: C.gray700, margin: 0, lineHeight: 1.75 }}>{booking?.cashText}</p>
                  </div>
                )}

                {data.payment === 'card_on_delivery' && (
                  <div style={{ background: C.gray100, borderRadius: 14, padding: 24 }}>
                    <p style={{ fontFamily: 'Inter', fontSize: 15, color: C.gray700, margin: 0, lineHeight: 1.75 }}>{booking?.cardOnDeliveryText}</p>
                  </div>
                )}
              </div>

              {submitError && (
                <div style={{ marginBottom: 16, background: '#fef2f2', color: '#991b1b', borderRadius: 12, padding: '14px 16px', fontFamily: 'Inter', fontSize: 14 }}>
                  {submitError}
                </div>
              )}

              <Btn variant="primary" size="xl" fullWidth onClick={completeBooking} disabled={submitting || !quote}>
                {submitting ? (booking?.processing || 'Processing...') : `${booking?.complete} — $${total.toFixed(2)} →`}
              </Btn>
              <div style={{ textAlign: 'center', marginTop: 12, fontFamily: 'Inter', fontSize: 12, color: C.gray500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <Icon name="lock" size={13} color={C.gray500} />
                <span>{common?.secure} · {booking?.backendSynced}</span>
              </div>
            </div>
          )}

          {step < 3 && (
            <div className="booking-nav" style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
              {step > 1 ? <Btn variant="outline" onClick={() => setStep((current) => current - 1)}>← {common?.back}</Btn> : <div />}
              <Btn variant="dark" size="lg" onClick={() => setStep((current) => current + 1)}>{common?.continue} →</Btn>
            </div>
          )}
        </div>

        <div style={{ background: C.white, borderRadius: 18, padding: 24, border: `1px solid ${C.gray200}`, height: 'fit-content', position: 'sticky', top: 92 }}>
          <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 15, color: C.black, marginBottom: 18, letterSpacing: '-0.01em' }}>{booking?.summaryTitle}</div>
          <ScooterImg scooter={scooter} height={140} />
          <div style={{ marginTop: 16, marginBottom: 20 }}>
            <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 16, color: C.black, marginBottom: 6 }}>{scooter.name}</div>
            <div style={{ display: 'flex', gap: 6 }}><Badge>{scooter.engine}</Badge><Badge>{scooter.typeLabel}</Badge></div>
          </div>
          <Divider style={{ marginBottom: 18 }} />
          {quoteError ? (
            <div style={{ background: '#fff7ed', color: '#9a3412', borderRadius: 12, padding: '14px 16px', fontFamily: 'Inter', fontSize: 13, lineHeight: 1.6 }}>
              {quoteError}
            </div>
          ) : (
            <>
              {[
                quote ? [`$${Number(quote.base_price).toFixed(2)}`, `${days} ${common?.days}`] : null,
                quote ? [booking?.addonsTitle, `$${Number(quote.add_ons_price).toFixed(2)}`] : null,
                quote ? [booking?.summaryLabels?.delivery, `$${Number(quote.delivery_price).toFixed(2)}`] : null,
                promoState.valid ? [booking?.promoDiscountLabel || 'Promo discount', `-$${promoState.discount.toFixed(2)}`] : null,
                selectedZone ? [booking?.areaZone, selectedZone.name] : null,
              ].filter(Boolean).map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Inter', fontSize: 13, color: C.gray700, marginBottom: 10 }}>
                  <span>{label}</span><span>{value}</span>
                </div>
              ))}
              {pricingPreview ? (
                <>
                  <Divider style={{ margin: '14px 0' }} />
                  <div style={{ fontFamily: 'Inter', fontSize: 12, color: C.gray500, marginBottom: 8 }}>{booking?.dynamicPricingTitle || 'Dynamic pricing'}</div>
                  {[
                    ['Base', Number(pricingPreview.base_price || 0)],
                    ['Season', Number(pricingPreview.season_adjustment || 0)],
                    ['Occupancy', Number(pricingPreview.occupancy_adjustment || 0)],
                    ['Device', Number(pricingPreview.device_adjustment || 0)],
                    ['Geo', Number(pricingPreview.geo_adjustment || 0)],
                  ].map(([label, value]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Inter', fontSize: 12, color: C.gray500, marginBottom: 6 }}>
                      <span>{label}</span>
                      <span>{value >= 0 ? `$${value.toFixed(2)}` : `-$${Math.abs(value).toFixed(2)}`}</span>
                    </div>
                  ))}
                </>
              ) : null}
              <Divider style={{ margin: '14px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Sora', fontWeight: 800, fontSize: 17, color: C.black }}>
                <span>{booking?.summaryLabels?.total}</span><span>${total.toFixed(2)}</span>
              </div>
            </>
          )}
          <div style={{ marginTop: 16, background: C.gray100, borderRadius: 10, padding: '12px', fontFamily: 'Inter', fontSize: 11, color: C.gray500, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Icon name="lock" size={12} color={C.gray500} />
            <span>{booking?.secureTotalsNote}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
