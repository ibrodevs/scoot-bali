import React from 'react';
import { apiRequest, authRequest } from './api';

const AuthContext = React.createContext(null);
const STORAGE_KEY = 'scoot-bali-auth';

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
      });
      return;
    }

    setState((current) => ({ ...current, loading: true, error: '' }));

    try {
      const [profile, bookings, documents, notifications, chatThreads, quickReplies] = await Promise.all([
        authRequest('/profile/', accessToken),
        authRequest('/bookings/', accessToken),
        authRequest('/documents/', accessToken),
        authRequest('/notifications/', accessToken),
        authRequest('/chat/threads/', accessToken),
        authRequest('/chat/quick-replies/?is_active=true', accessToken),
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
      });
    } catch (error) {
      persistSession(null);
      setSession(null);
      setState({
        loading: false,
        error: error.message || 'Failed to load account',
        profile: null,
        bookings: [],
        documents: [],
        notifications: [],
        chatThreads: [],
        quickReplies: [],
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

  function logout() {
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

  async function ensureSupportThread(title = 'Support Chat') {
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
