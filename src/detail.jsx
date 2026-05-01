import React from 'react';
import { apiRequest, authRequest, trackEvent } from './api';
import { useAuth } from './auth-context';
import { useSite } from './site-context';
import { Badge, Btn, C, Divider, Icon, ScooterImg, Stars } from './ui';

export default function DetailPage({ scooter, onCatalog, onHome, onBookScooter }) {
  const { addons, content, lang } = useSite();
  const auth = useAuth();
  const [imgIdx, setImgIdx] = React.useState(0);
  const [tab, setTab] = React.useState('specs');
  const [selectedAddons, setSelectedAddons] = React.useState([]);
  const [detailData, setDetailData] = React.useState(null);
  const [reviews, setReviews] = React.useState([]);
  const [availability, setAvailability] = React.useState(null);
  const [reviewForm, setReviewForm] = React.useState({ booking: '', rating: 5, comment: '' });
  const [reviewMessage, setReviewMessage] = React.useState('');
  const [reviewError, setReviewError] = React.useState('');
  const [submittingReview, setSubmittingReview] = React.useState(false);
  const days = 3;
  const detail = content?.detail;
  const common = content?.common;
  const fallbackCopy = {
    en: {
      availabilityDaysLabel: 'days open this month',
      reviewsTitle: 'Rider reviews',
      noReviews: 'No reviews yet for this scooter.',
      guestRider: 'Guest Rider',
      leaveReview: 'Leave a review',
      selectBooking: 'Select completed booking',
      reviewPlaceholder: 'Share your riding experience',
      reviewRequired: 'Select a booking and write a short review.',
      reviewSubmitted: 'Review submitted for moderation.',
      reviewFailed: 'Failed to submit review.',
    },
    ru: {
      availabilityDaysLabel: 'дней доступно в этом месяце',
      reviewsTitle: 'Отзывы райдеров',
      noReviews: 'У этого скутера пока нет отзывов.',
      guestRider: 'Гость',
      leaveReview: 'Оставить отзыв',
      selectBooking: 'Выберите завершённое бронирование',
      reviewPlaceholder: 'Поделитесь впечатлениями от поездки',
      reviewRequired: 'Выберите бронирование и добавьте короткий отзыв.',
      reviewSubmitted: 'Отзыв отправлен на модерацию.',
      reviewFailed: 'Не удалось отправить отзыв.',
    },
  }[lang] || {
    availabilityDaysLabel: 'days open this month',
    reviewsTitle: 'Rider reviews',
    noReviews: 'No reviews yet for this scooter.',
    guestRider: 'Guest Rider',
    leaveReview: 'Leave a review',
    selectBooking: 'Select completed booking',
    reviewPlaceholder: 'Share your riding experience',
    reviewRequired: 'Select a booking and write a short review.',
    reviewSubmitted: 'Review submitted for moderation.',
    reviewFailed: 'Failed to submit review.',
  };
  const liveScooter = detailData ? {
    ...scooter,
    name: detailData.title || scooter.name,
    rating: detailData.rating_avg ?? scooter.rating,
    reviews: detailData.reviews_count ?? scooter.reviews,
    available: detailData.is_available ?? scooter.available,
    description: detailData.full_description || scooter.description,
    rentalTerms: detailData.rental_terms || scooter.rentalTerms,
    specs: detailData.characteristics || scooter.specs,
    mainImage: detailData.main_image || scooter.mainImage,
    gallery: detailData.gallery || scooter.gallery,
  } : scooter;
  const detailAddons = detailData?.available_addons?.length ? detailData.available_addons : addons;

  const toggleAddon = (id) => setSelectedAddons((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const addonsTotal = detailAddons.filter((item) => selectedAddons.includes(item.id)).reduce((sum, item) => sum + Number(item.priceUSD), 0);
  const eligibleBookings = auth.bookings.filter((item) => item.status === 'completed' && item.scooter?.id === scooter?.id);

  React.useEffect(() => {
    if (!scooter) {
      return;
    }

    const now = new Date();
    apiRequest(`/scooters/${scooter.id}/`).then(setDetailData).catch(() => {});
    apiRequest(`/scooters/${scooter.id}/reviews/`).then((data) => setReviews(Array.isArray(data) ? data : data?.results || [])).catch(() => {});
    apiRequest(`/scooters/${scooter.id}/availability/?year=${now.getFullYear()}&month=${now.getMonth() + 1}`).then(setAvailability).catch(() => {});
    trackEvent('view_scooter', { scooter_id: scooter.id, slug: scooter.slug }, { accessToken: auth.session?.access });
  }, [auth.session?.access, scooter]);

  const availabilitySummary = React.useMemo(() => {
    if (!availability?.days) {
      return '';
    }
    const blocked = availability.days.filter((item) => item.status !== 'available').length;
    return `${availability.days.length - blocked}/${availability.days.length} ${detail?.availabilityDaysLabel || fallbackCopy.availabilityDaysLabel}`;
  }, [availability, detail?.availabilityDaysLabel, fallbackCopy.availabilityDaysLabel]);
  const activeGalleryImage = detailData?.gallery?.[imgIdx]?.image || liveScooter?.gallery?.[imgIdx]?.image || '';

  if (!scooter) {
    return (
      <div style={{ minHeight: '100vh', paddingTop: 72, background: C.gray100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: C.white, borderRadius: 20, border: `1px solid ${C.gray200}`, padding: '40px 32px', textAlign: 'center', maxWidth: 480 }}>
          <h2 style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 28, color: C.black, margin: '0 0 12px' }}>{detail?.notFoundTitle}</h2>
          <p style={{ fontFamily: 'Inter', fontSize: 15, lineHeight: 1.7, color: C.gray500, margin: '0 0 24px' }}>{detail?.notFoundBody}</p>
          <Btn variant="dark" onClick={onCatalog}>{detail?.backToFleet}</Btn>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 72, minHeight: '100vh', background: C.gray100 }}>
      <div className="page-subheader" style={{ background: C.white, borderBottom: `1px solid ${C.gray200}`, padding: '14px 80px', display: 'flex', alignItems: 'center', gap: 10 }}>
        {[
          [detail?.breadcrumbs?.home, 'home'],
          [detail?.breadcrumbs?.fleet, 'catalog'],
          [liveScooter.name, null],
        ].map(([label, page], index) => (
          <React.Fragment key={label}>
            {index > 0 && <span style={{ color: C.gray300, fontSize: 13 }}>/</span>}
            <span onClick={() => {
              if (page === 'home') onHome();
              if (page === 'catalog') onCatalog();
            }} style={{ fontFamily: 'Inter', fontSize: 13, color: page ? C.gray500 : C.black, cursor: page ? 'pointer' : 'default', fontWeight: page ? 400 : 500 }}>{label}</span>
          </React.Fragment>
        ))}
      </div>

      <div className="detail-layout" style={{ padding: '36px 80px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: 36 }}>
        <div>
          <div style={{ borderRadius: 20, overflow: 'hidden', marginBottom: 10 }}>
            <ScooterImg scooter={{ ...liveScooter, selectedImage: activeGalleryImage || liveScooter.mainImage }} height={460} />
          </div>
          {detailData?.gallery?.length ? (
            <div className="detail-thumbs" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 36 }}>
              {detailData.gallery.slice(0, 4).map((image, index) => (
                <div key={image.id || index} onClick={() => setImgIdx(index)} style={{ borderRadius: 12, overflow: 'hidden', border: `2.5px solid ${imgIdx === index ? C.gold : 'transparent'}`, cursor: 'pointer', transition: 'border-color 0.2s' }}>
                  <img src={image.image} alt={image.alt_text || liveScooter.name} style={{ display: 'block', width: '100%', height: 80, objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          ) : (
            <div className="detail-thumbs" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 36 }}>
              {[0, 1, 2, 3].map((index) => (
                <div key={index} onClick={() => setImgIdx(index)} style={{ borderRadius: 12, overflow: 'hidden', border: `2.5px solid ${imgIdx === index ? C.gold : 'transparent'}`, cursor: 'pointer', transition: 'border-color 0.2s' }}>
                  <div style={{ height: 80, background: `linear-gradient(${140 + index * 25}deg, ${liveScooter.accent} 0%, #1e1e1e 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: 'Inter', fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>{detail?.viewPhoto?.replace('{index}', String(index + 1))}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ background: C.white, borderRadius: 18, overflow: 'hidden', border: `1px solid ${C.gray200}`, marginBottom: 24 }}>
            <div style={{ display: 'flex', borderBottom: `1px solid ${C.gray200}` }}>
              {['specs', 'conditions', 'description'].map((key) => (
                <div key={key} onClick={() => setTab(key)} style={{ flex: 1, padding: '18px', textAlign: 'center', cursor: 'pointer', fontFamily: 'Inter', fontSize: 14, fontWeight: tab === key ? 700 : 500, color: tab === key ? C.black : C.gray500, borderBottom: `2.5px solid ${tab === key ? C.gold : 'transparent'}`, transition: 'all 0.2s' }}>
                  {detail?.tabs?.[key]}
                </div>
              ))}
            </div>
            <div style={{ padding: 32 }}>
              {tab === 'specs' && (
                <div className="detail-specs" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                  {Object.entries(liveScooter.specs).map(([key, value]) => (
                    <div key={key} style={{ background: C.gray100, borderRadius: 12, padding: '18px 22px' }}>
                      <div style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.gray500, marginBottom: 8 }}>{common?.specLabels?.[key] || key}</div>
                      <div style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 22, color: C.black, letterSpacing: '-0.02em' }}>{value}</div>
                    </div>
                  ))}
                </div>
              )}
              {tab === 'conditions' && (
                <div>
                  {[
                    [detail?.conditions?.minimumAge, detail?.conditions?.minimumAgeValue],
                    [detail?.conditions?.deposit, detail?.conditions?.depositValue?.replace('{deposit}', liveScooter.deposit.toLocaleString(lang))],
                    [detail?.conditions?.fuelPolicy, detail?.conditions?.fuelPolicyValue],
                    [detail?.conditions?.cancellation, detail?.conditions?.cancellationValue],
                    [detail?.conditions?.extension, detail?.conditions?.extensionValue],
                  ].map(([label, value]) => (
                    <div key={label} style={{ display: 'flex', gap: 24, padding: '14px 0', borderBottom: `1px solid ${C.gray200}` }}>
                      <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 14, color: C.black, minWidth: 160, flexShrink: 0 }}>{label}</div>
                      <div style={{ fontFamily: 'Inter', fontSize: 14, color: C.gray700, lineHeight: 1.6 }}>{value}</div>
                    </div>
                  ))}
                </div>
              )}
              {tab === 'description' && (
                <div>
                  <p style={{ fontFamily: 'Inter', fontSize: 15, lineHeight: 1.8, color: C.gray700, margin: '0 0 16px' }}>{liveScooter.description}</p>
                  <p style={{ fontFamily: 'Inter', fontSize: 14, lineHeight: 1.7, color: C.gray500, margin: 0 }}>{liveScooter.rentalTerms}</p>
                </div>
              )}
            </div>
          </div>

          <div style={{ background: C.white, borderRadius: 18, padding: 32, border: `1px solid ${C.gray200}` }}>
            <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 22, color: C.black, margin: '0 0 8px', letterSpacing: '-0.02em' }}>{detail?.addonsTitle}</h3>
            <p style={{ fontFamily: 'Inter', fontSize: 14, color: C.gray500, margin: '0 0 24px' }}>{detail?.addonsSubtitle}</p>
            <div className="detail-addons" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
              {detailAddons.map((addon) => {
                const enabled = selectedAddons.includes(addon.id);
                return (
                  <div key={addon.id} onClick={() => toggleAddon(addon.id)} style={{ padding: '18px', borderRadius: 14, cursor: 'pointer', border: `1.5px solid ${enabled ? C.gold : C.gray200}`, background: enabled ? 'rgba(255,215,0,0.06)' : C.gray100, transition: 'all 0.22s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                      <Icon name={addon.icon} size={26} color={C.black} />
                      <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${enabled ? C.gold : C.gray300}`, background: enabled ? C.gold : C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.18s' }}>
                        {enabled && <Icon name="check" size={12} color={C.black} strokeWidth={2.4} />}
                      </div>
                    </div>
                    <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 14, color: C.black, marginBottom: 3 }}>{addon.name}</div>
                    <div style={{ fontFamily: 'Inter', fontSize: 12, color: C.gray500, marginBottom: 8 }}>{addon.description || addon.desc}</div>
                    <div style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 15, color: C.black }}>+${addon.priceUSD}<span style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: 11, color: C.gray500 }}> {common?.perDay}</span></div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ background: C.white, borderRadius: 18, padding: 32, border: `1px solid ${C.gray200}`, marginTop: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <div>
                <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 22, color: C.black, margin: '0 0 6px', letterSpacing: '-0.02em' }}>{detail?.reviewsTitle || fallbackCopy.reviewsTitle}</h3>
                <p style={{ fontFamily: 'Inter', fontSize: 13, color: C.gray500, margin: 0 }}>{availabilitySummary}</p>
              </div>
              <Badge variant={liveScooter.available ? 'green' : 'red'}>{liveScooter.available ? common?.availability?.available : common?.availability?.booked}</Badge>
            </div>

            {reviews.length === 0 ? (
              <div style={{ fontFamily: 'Inter', fontSize: 14, color: C.gray500, marginBottom: 20 }}>{detail?.noReviews || fallbackCopy.noReviews}</div>
            ) : (
              <div style={{ display: 'grid', gap: 14, marginBottom: 24 }}>
                {reviews.slice(0, 6).map((item) => (
                  <div key={item.id} style={{ background: C.gray100, borderRadius: 14, padding: 18 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
                      <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 14, color: C.black }}>{item.user_name || fallbackCopy.guestRider}</div>
                      <Stars rating={item.rating} size={13} />
                    </div>
                    <div style={{ fontFamily: 'Inter', fontSize: 14, lineHeight: 1.7, color: C.gray700 }}>{item.comment}</div>
                  </div>
                ))}
              </div>
            )}

            {auth.isAuthenticated && eligibleBookings.length > 0 ? (
              <div style={{ borderTop: `1px solid ${C.gray200}`, paddingTop: 24 }}>
                <h4 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 18, color: C.black, margin: '0 0 14px' }}>{detail?.leaveReview || fallbackCopy.leaveReview}</h4>
                <div style={{ display: 'grid', gap: 14 }}>
                  <select value={reviewForm.booking} onChange={(event) => setReviewForm((current) => ({ ...current, booking: event.target.value }))}
                    style={{ width: '100%', padding: '13px 16px', border: `1.5px solid ${C.gray300}`, borderRadius: 10, fontFamily: 'Inter', fontSize: 15, outline: 'none', background: C.white }}>
                    <option value="">{detail?.selectBooking || fallbackCopy.selectBooking}</option>
                    {eligibleBookings.map((item) => (
                      <option key={item.id} value={item.id}>#{item.order_number} · {new Date(item.end_datetime).toLocaleDateString(lang)}</option>
                    ))}
                  </select>
                  <select value={reviewForm.rating} onChange={(event) => setReviewForm((current) => ({ ...current, rating: Number(event.target.value) }))}
                    style={{ width: '100%', padding: '13px 16px', border: `1.5px solid ${C.gray300}`, borderRadius: 10, fontFamily: 'Inter', fontSize: 15, outline: 'none', background: C.white }}>
                    {[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value} / 5</option>)}
                  </select>
                  <textarea value={reviewForm.comment} onChange={(event) => setReviewForm((current) => ({ ...current, comment: event.target.value }))}
                    placeholder={detail?.reviewPlaceholder || fallbackCopy.reviewPlaceholder}
                    style={{ width: '100%', minHeight: 110, resize: 'vertical', borderRadius: 12, border: `1.5px solid ${C.gray300}`, padding: '14px 16px', fontFamily: 'Inter', fontSize: 14, outline: 'none' }} />
                  {(reviewError || reviewMessage) ? (
                    <div style={{ background: reviewError ? '#fef2f2' : '#eff6ff', color: reviewError ? '#991b1b' : '#1e40af', borderRadius: 12, padding: '12px 14px', fontFamily: 'Inter', fontSize: 14 }}>
                      {reviewError || reviewMessage}
                    </div>
                  ) : null}
                  <Btn
                    variant="primary"
                    onClick={async () => {
                      if (!reviewForm.booking || !reviewForm.comment.trim()) {
                        setReviewError(detail?.reviewRequired || fallbackCopy.reviewRequired);
                        setReviewMessage('');
                        return;
                      }
                      setSubmittingReview(true);
                      setReviewError('');
                      setReviewMessage('');
                      try {
                        await authRequest(`/scooters/${scooter.id}/reviews/`, auth.session.access, {
                          method: 'POST',
                          body: JSON.stringify({
                            booking: Number(reviewForm.booking),
                            rating: reviewForm.rating,
                            comment: reviewForm.comment.trim(),
                          }),
                        });
                        setReviewForm({ booking: '', rating: 5, comment: '' });
                        setReviewMessage(detail?.reviewSubmitted || fallbackCopy.reviewSubmitted);
                        const latest = await apiRequest(`/scooters/${scooter.id}/reviews/`);
                        setReviews(Array.isArray(latest) ? latest : latest?.results || []);
                      } catch (error) {
                        setReviewError(error.message || detail?.reviewFailed || fallbackCopy.reviewFailed);
                      } finally {
                        setSubmittingReview(false);
                      }
                    }}
                    disabled={submittingReview}
                  >
                    {submittingReview ? '...' : (detail?.submitReview || 'Submit review')}
                  </Btn>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div style={{ position: 'sticky', top: 92, height: 'fit-content' }}>
          <div style={{ background: C.white, borderRadius: 20, padding: 32, border: `1px solid ${C.gray200}`, boxShadow: '0 8px 40px rgba(0,0,0,0.09)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontFamily: 'Sora', fontWeight: 900, fontSize: 40, color: C.black, letterSpacing: '-0.04em' }}>${liveScooter.priceUSD}</span>
                  <span style={{ fontFamily: 'Inter', fontSize: 15, color: C.gray500 }}>{common?.perDay}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <Stars rating={liveScooter.rating} size={13} />
                  <span style={{ fontFamily: 'Inter', fontSize: 13, color: C.gray500 }}>{liveScooter.reviews} {detail?.reviews}</span>
                </div>
              </div>
              <Badge variant={liveScooter.available ? 'green' : 'red'}>
                <Icon name={liveScooter.available ? 'check-circle' : 'clock'} size={12} color="currentColor" />
                {liveScooter.available ? common?.availability?.available : common?.availability?.booked}
              </Badge>
            </div>

            <Divider style={{ margin: '20px 0' }} />

            <div style={{ background: C.gray100, borderRadius: 14, overflow: 'hidden', marginBottom: 18 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: `1px solid ${C.gray200}` }}>
                {[[detail?.checkIn, detail?.selectDate], [detail?.checkOut, detail?.selectDate]].map(([label, value], index) => (
                  <div key={label} style={{ padding: '14px 16px', borderRight: index === 0 ? `1px solid ${C.gray200}` : 'none', cursor: 'pointer' }}>
                    <div style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.gray500, marginBottom: 5 }}>{label}</div>
                    <div style={{ fontFamily: 'Inter', fontSize: 14, color: C.gray500 }}>{value}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '14px 16px', cursor: 'pointer' }}>
                <div style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.gray500, marginBottom: 5 }}>{detail?.deliveryLocation}</div>
                <div style={{ fontFamily: 'Inter', fontSize: 14, color: C.gray500 }}>{detail?.addressPlaceholder}</div>
              </div>
            </div>

            {selectedAddons.length > 0 && (
              <div style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.25)', borderRadius: 12, padding: '14px 16px', marginBottom: 18 }}>
                {detailAddons.filter((item) => selectedAddons.includes(item.id)).map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Inter', fontSize: 13, color: C.black, marginBottom: 5 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Icon name={item.icon} size={14} color={C.black} />{item.name}</span><span>+${item.priceUSD} {common?.perDay}</span>
                  </div>
                ))}
              </div>
            )}

            <Btn variant="primary" size="lg" fullWidth onClick={() => onBookScooter(liveScooter)} style={{ marginBottom: 12 }}>{detail?.reserveNow}</Btn>
            <div style={{ textAlign: 'center', fontFamily: 'Inter', fontSize: 12, color: C.gray500, marginBottom: 20 }}>{detail?.freeCancellation}</div>

            <Divider style={{ marginBottom: 20 }} />

              {[
                [`$${liveScooter.priceUSD} × ${days} ${common?.days}`, `$${(liveScooter.priceUSD * days).toFixed(1)}`],
                selectedAddons.length > 0 ? [`${detail?.addonsTitle} × ${days} ${common?.days}`, `+$${(addonsTotal * days).toFixed(1)}`] : null,
                [detail?.delivery, common?.free],
              ].filter(Boolean).map(([label, value]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Inter', fontSize: 14, color: C.gray700, marginBottom: 10 }}>
                <span>{label}</span><span>{value}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Sora', fontWeight: 800, fontSize: 18, color: C.black, paddingTop: 14, borderTop: `1px solid ${C.gray200}`, marginTop: 8 }}>
              <span>{detail?.summaryTotal?.replace('{days}', String(days))}</span>
              <span>${((liveScooter.priceUSD + addonsTotal) * days).toFixed(1)}</span>
            </div>

            <div style={{ marginTop: 20, padding: '12px 16px', background: C.gray100, borderRadius: 10, fontFamily: 'Inter', fontSize: 12, color: C.gray700, textAlign: 'center' }}>
              {detail?.secureText}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
