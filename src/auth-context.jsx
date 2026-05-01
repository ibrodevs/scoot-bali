import React from 'react';
import { apiRequest, authRequest, getDeviceId } from './api';

const AuthContext = React.createContext(null);
const STORAGE_KEY = 'scoot-bali-auth';
const LANG_STORAGE_KEY = 'scoot-bali-lang';

const AUTH_COPY = {
  en: { loadFailed: 'Failed to load account', supportChat: 'Support Chat' },
  ru: { loadFailed: 'Не удалось загрузить аккаунт', supportChat: 'Чат поддержки' },
  zh: { loadFailed: '无法加载账户', supportChat: '支持聊天' },
  id: { loadFailed: 'Gagal memuat akun', supportChat: 'Chat dukungan' },
  de: { loadFailed: 'Konto konnte nicht geladen werden', supportChat: 'Support-Chat' },
  fr: { loadFailed: 'Impossible de charger le compte', supportChat: 'Chat support' },
};

function getUiLang() {
  return window.localStorage.getItem(LANG_STORAGE_KEY) || 'en';
}

function loadStoredSession() {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function persistSession(session) {
  if (!session) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

function normalizeList(payload) {
  return payload?.results || payload || [];
}

async function optionalAuthList(path, accessToken, fallback = []) {
  try {
    const payload = await authRequest(path, accessToken);
    return normalizeList(payload);
  } catch {
    return fallback;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = React.useState(loadStoredSession);
  const [state, setState] = React.useState({
    loading: false,
    error: '',
    profile: null,
    bookings: [],
    documents: [],
    notifications: [],
    chatThreads: [],
    quickReplies: [],
    payments: [],
    deliveryAddresses: [],
    supportTickets: [],
    supportLinks: [],
  });

  async function loadAccount(accessToken = session?.access) {
    if (!accessToken) {
      setState({
        loading: false,
        error: '',
        profile: null,
        bookings: [],
        documents: [],
        notifications: [],
        chatThreads: [],
        quickReplies: [],
        payments: [],
        deliveryAddresses: [],
        supportTickets: [],
        supportLinks: [],
      });
      return;
    }

    setState((current) => ({ ...current, loading: true, error: '' }));

    try {
      const [profile, bookings, documents, notifications, chatThreads, quickReplies, payments, deliveryAddresses, supportTickets, supportLinks] = await Promise.all([
        authRequest('/profile/', accessToken),
        authRequest('/bookings/', accessToken),
        authRequest('/documents/my/', accessToken),
        authRequest('/notifications/', accessToken),
        authRequest('/chat/threads/', accessToken),
        authRequest('/chat/quick-replies/?is_active=true', accessToken),
        authRequest('/payments/', accessToken),
        authRequest('/delivery-addresses/', accessToken),
        optionalAuthList('/support/tickets/', accessToken),
        optionalAuthList('/support/contact-links/?is_active=true', accessToken),
      ]);

      setState({
        loading: false,
        error: '',
        profile,
        bookings: normalizeList(bookings),
        documents: normalizeList(documents),
        notifications: normalizeList(notifications),
        chatThreads: normalizeList(chatThreads),
        quickReplies: normalizeList(quickReplies),
        payments: normalizeList(payments),
        deliveryAddresses: normalizeList(deliveryAddresses),
        supportTickets,
        supportLinks,
      });
      registerDevice(accessToken).catch(() => {});
    } catch (error) {
      persistSession(null);
      setSession(null);
      setState({
        loading: false,
        error: error.message || (AUTH_COPY[getUiLang()] || AUTH_COPY.en).loadFailed,
        profile: null,
        bookings: [],
        documents: [],
        notifications: [],
        chatThreads: [],
        quickReplies: [],
        payments: [],
        deliveryAddresses: [],
        supportTickets: [],
        supportLinks: [],
      });
    }
  }

  React.useEffect(() => {
    persistSession(session);
    if (session?.access) {
      loadAccount(session.access);
      return;
    }
    setState({
      loading: false,
      error: '',
      profile: null,
      bookings: [],
      documents: [],
      notifications: [],
      chatThreads: [],
      quickReplies: [],
      payments: [],
      deliveryAddresses: [],
      supportTickets: [],
      supportLinks: [],
    });
  }, [session?.access]);

  async function login(credentials) {
    const auth = await apiRequest('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    setSession(auth);
    return auth;
  }

  async function register(payload) {
    await apiRequest('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return login({ email: payload.email, password: payload.password });
  }

  async function logout() {
    if (session?.refresh && session?.access) {
      try {
        await authRequest('/auth/logout/', session.access, {
          method: 'POST',
          body: JSON.stringify({ refresh: session.refresh }),
        });
      } catch {
        // Ignore logout API failures and clear the local session anyway.
      }
    }
    persistSession(null);
    setSession(null);
  }

  async function updateProfile(payload) {
    if (!session?.access) {
      throw new Error('Not authenticated');
    }
    await authRequest('/profile/', session.access, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    await loadAccount(session.access);
  }

  async function uploadDocument(payload) {
    if (!session?.access) {
      throw new Error('Not authenticated');
    }
    await authRequest('/documents/', session.access, {
      method: 'POST',
      body: payload,
    });
    await loadAccount(session.access);
  }

  async function markAllNotificationsRead() {
    if (!session?.access) {
      return;
    }
    await authRequest('/notifications/mark-all-read/', session.access, {
      method: 'POST',
      body: JSON.stringify({}),
    });
    await loadAccount(session.access);
  }

  async function registerDevice(accessToken = session?.access) {
    if (!accessToken) {
      return;
    }
    await authRequest('/notifications/register-device/', accessToken, {
      method: 'POST',
      body: JSON.stringify({
        fcm_token: `web:${getDeviceId()}`,
        platform: 'web',
        device_id: getDeviceId(),
        app_version: 'web-1.0',
      }),
    });
  }

  async function ensureSupportThread(title = (AUTH_COPY[getUiLang()] || AUTH_COPY.en).supportChat) {
    if (!session?.access) {
      throw new Error('Not authenticated');
    }
    const thread = await authRequest('/chat/threads/ensure-support/', session.access, {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
    await loadAccount(session.access);
    return thread;
  }

  async function loadChatMessages(threadId, accessToken = session?.access) {
    if (!accessToken || !threadId) {
      return [];
    }
    const messages = await authRequest(`/chat/messages/?thread=${threadId}&ordering=created_at&page_size=100`, accessToken);
    return normalizeList(messages);
  }

  async function sendChatMessage(threadId, text) {
    if (!session?.access) {
      throw new Error('Not authenticated');
    }
    await authRequest('/chat/messages/', session.access, {
      method: 'POST',
      body: JSON.stringify({ thread_id: threadId, text }),
    });
    await loadAccount(session.access);
    return loadChatMessages(threadId, session.access);
  }

  async function createPayment(bookingId, provider = import.meta.env.VITE_PAYMENT_PROVIDER || 'mock', accessToken = session?.access) {
    if (!accessToken) {
      throw new Error('Not authenticated');
    }
    const payment = await authRequest('/payments/create/', accessToken, {
      method: 'POST',
      body: JSON.stringify({ booking_id: bookingId, provider }),
    });
    await loadAccount(accessToken);
    return payment;
  }

  async function cancelBooking(bookingId) {
    if (!session?.access) {
      throw new Error('Not authenticated');
    }
    const booking = await authRequest(`/bookings/${bookingId}/cancel/`, session.access, {
      method: 'POST',
      body: JSON.stringify({}),
    });
    await loadAccount(session.access);
    return booking;
  }

  async function saveDeliveryAddress(payload) {
    if (!session?.access) {
      throw new Error('Not authenticated');
    }
    await authRequest('/delivery-addresses/', session.access, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    await loadAccount(session.access);
  }

  async function deleteDeliveryAddress(addressId) {
    if (!session?.access) {
      throw new Error('Not authenticated');
    }
    await authRequest(`/delivery-addresses/${addressId}/`, session.access, {
      method: 'DELETE',
    });
    await loadAccount(session.access);
  }

  async function createSupportTicket(payload) {
    if (!session?.access) {
      throw new Error('Not authenticated');
    }
    const ticket = await authRequest('/support/tickets/', session.access, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    await loadAccount(session.access);
    return ticket;
  }

  async function sendSupportTicketMessage(ticketId, message) {
    if (!session?.access) {
      throw new Error('Not authenticated');
    }
    await authRequest('/support/messages/', session.access, {
      method: 'POST',
      body: JSON.stringify({ ticket_id: ticketId, message }),
    });
    await loadAccount(session.access);
  }

  async function getCryptoCurrencies() {
    if (!session?.access) {
      throw new Error('Not authenticated');
    }
    const currencies = await authRequest('/payments/crypto/currencies/', session.access);
    return normalizeList(currencies);
  }

  async function createCryptoInvoice(bookingId, currencyId) {
    if (!session?.access) {
      throw new Error('Not authenticated');
    }
    const invoice = await authRequest('/payments/crypto/invoice/create/', session.access, {
      method: 'POST',
      body: JSON.stringify({ booking_id: bookingId, currency_id: currencyId }),
    });
    await loadAccount(session.access);
    return invoice;
  }

  async function setSessionFromGuest(auth) {
    setSession(auth);
  }

  const value = {
    isAuthenticated: Boolean(session?.access),
    session,
    user: state.profile,
    profile: state.profile,
    bookings: state.bookings,
    documents: state.documents,
    notifications: state.notifications,
    chatThreads: state.chatThreads,
    quickReplies: state.quickReplies,
    payments: state.payments,
    deliveryAddresses: state.deliveryAddresses,
    supportTickets: state.supportTickets,
    supportLinks: state.supportLinks,
    loading: state.loading,
    error: state.error,
    login,
    register,
    logout,
    reloadAccount: () => loadAccount(session?.access),
    updateProfile,
    uploadDocument,
    markAllNotificationsRead,
    ensureSupportThread,
    loadChatMessages,
    sendChatMessage,
    createPayment,
    cancelBooking,
    registerDevice,
    saveDeliveryAddress,
    deleteDeliveryAddress,
    createSupportTicket,
    sendSupportTicketMessage,
    getCryptoCurrencies,
    createCryptoInvoice,
    setSessionFromGuest,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
