const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1';

const SESSION_KEY = 'auth_token';

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    sessionStorage.setItem(SESSION_KEY, token);
  } else {
    sessionStorage.removeItem(SESSION_KEY);
  }
}

export function getAuthToken(): string | null {
  return authToken;
}

export function restoreAuthToken(): string | null {
  const stored = sessionStorage.getItem(SESSION_KEY);
  if (stored) authToken = stored;
  return stored;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let detail = response.statusText;
    try {
      const body = await response.json();
      detail = body.detail ?? detail;
    } catch {
      // ignore parse errors
    }
    throw new Error(detail);
  }

  if (response.status === 204) {
    return undefined as unknown as T;
  }

  return response.json();
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
  postForm: <T>(path: string, data: Record<string, string>) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    return fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers,
      body: new URLSearchParams(data).toString(),
    }).then(async (response) => {
      if (!response.ok) {
        let detail = response.statusText;
        try {
          const body = await response.json();
          detail = body.detail ?? detail;
        } catch {
          // ignore
        }
        throw new Error(detail);
      }
      return response.json() as Promise<T>;
    });
  },
};
