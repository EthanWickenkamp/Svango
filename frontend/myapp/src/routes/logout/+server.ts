// src/routes/logout/+server.ts
import type { RequestHandler } from './$types';
import { logout } from '$lib/server/auth';

export const GET: RequestHandler = async (event) => {
  await logout(event);           // deletes cookies + redirects (if your logout throws redirect)
  return new Response(null, { status: 204 }); // not reached if logout redirects
};