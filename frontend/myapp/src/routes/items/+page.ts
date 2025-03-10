import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => { //typescript type checking as PageLoad only done here
  // Define the API endpoints for each model.
  const endpoints = [
    '/api/items/',

  ];

  // Fetch all endpoints concurrently.
  const responses = await Promise.all(
    endpoints.map(endpoint => fetch(endpoint))
  );

  // Check each response for errors.
  responses.forEach((res, index) => {
    if (!res.ok) {
      throw new Error(`Failed to fetch data from ${endpoints[index]}`);
    }
  });

  // Parse the JSON from each response.
  const [items] = await Promise.all(
    responses.map(res => res.json())
  );

  // Return the data so it's available in your Svelte component.
  return { items};
};