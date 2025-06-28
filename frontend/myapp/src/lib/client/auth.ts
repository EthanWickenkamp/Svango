// src/lib/client/auth.ts
export async function authenticatedFetch(
    path: string,
    options: RequestInit = {}
): Promise<Response> {
    const headers = new Headers(options.headers);
    const apiPath = path.startsWith('/') ? path : `/${path}`;

    const response = await fetch(`/api${apiPath}`, {
        ...options,
        headers,
        credentials: 'include' // Required to send access_token cookie
    });

    if (response.status === 401) {
        window.location.href = '/login';
    }

    return response;
}
