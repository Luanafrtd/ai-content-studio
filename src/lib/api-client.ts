export class ApiClientError extends Error {
  status: number;
  issues?: Record<string, string[] | undefined>;
  constructor(status: number, message: string, issues?: Record<string, string[] | undefined>) {
    super(message);
    this.status = status;
    this.issues = issues;
  }
}

export async function apiFetch<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiClientError(response.status, body.error ?? "Request failed", body.issues);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
