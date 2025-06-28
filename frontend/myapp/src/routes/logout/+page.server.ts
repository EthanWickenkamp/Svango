import { redirect } from '@sveltejs/kit';

export async function load({ cookies }) {
	cookies.delete('access_token', { path: '/' });   // clear JWT cookie
	throw redirect(302, '/');                        // send user to homepage
}
