const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';
const SESSION_ID_KEY = 'scoot-bali-session-id';
const DEVICE_ID_KEY = 'scoot-bali-device-id';
const LANG_STORAGE_KEY = 'scoot-bali-lang';

function getUiLang() {
  const stored = window.localStorage.getItem(LANG_STORAGE_KEY);
  if (stored) {
    return stored;
  }
  return (navigator.language || 'en').slice(0, 2);
}

function getFallbackMessage() {
  return {
    ru: 'Запрос не выполнен',
    zh: '请求失败',
    id: 'Permintaan gagal',
    de: 'Anfrage fehlgeschlagen',
    fr: 'La requete a echoue',
  }[getUiLang()] || 'Request failed';
}

export function buildApiUrl(path) {
  if (!path.startsWith('/')) {
    return `${API_BASE}/${path}`;
  }
  return `${API_BASE}${path}`;
}

function randomId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;
}

export function getSessionId() {
  let value = window.sessionStorage.getItem(SESSION_ID_KEY);
  if (!value) {
    value = randomId('sess');
    window.sessionStorage.setItem(SESSION_ID_KEY, value);
  }
  return value;
}

export function getDeviceId() {
  let value = window.localStorage.getItem(DEVICE_ID_KEY);
  if (!value) {
    value = randomId('device');
    window.localStorage.setItem(DEVICE_ID_KEY, value);
  }
  return value;
}

function flattenErrors(payload) {
  if (!payload || typeof payload !== 'object') {
    return '';
  }
  const parts = [];
  for (const [key, value] of Object.entries(payload)) {
    if (key === 'detail' || key === 'error') {
      continue;
    }
    if (Array.isArray(value)) {
      parts.push(`${key}: ${value.join(', ')}`);
      continue;
    }
    if (value && typeof value === 'object') {
      parts.push(`${key}: ${flattenErrors(value)}`);
      continue;
    }
    if (value) {
      parts.push(`${key}: ${String(value)}`);
    }
  }
  return parts.filter(Boolean).join(' · ');
}

async function parseJson(response) {
  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }
  if (!response.ok) {
    const message = data?.error || data?.detail || flattenErrors(data) || getFallbackMessage();
    throw new Error(message);
  }
  return data;
}

export async function apiRequest(path, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const isJsonBody = options.body && !(options.body instanceof FormData);
  const response = await fetch(buildApiUrl(path), {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(isJsonBody ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
  });

  return parseJson(response);
}

export async function authRequest(path, accessToken, options = {}) {
  return apiRequest(path, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(options.headers || {}),
    },
  });
}

export async function trackEvent(event_name, payload = {}, options = {}) {
  try {
    return await apiRequest('/analytics/events/', {
      method: 'POST',
      headers: options.accessToken ? { Authorization: `Bearer ${options.accessToken}` } : {},
      body: JSON.stringify({
        event_name,
        payload,
        session_id: getSessionId(),
        device_id: getDeviceId(),
      }),
    });
  } catch {
    return null;
  }
}
