import type { RequestHandler } from '@sveltejs/kit';
import { getProductProductActiveZones } from '$lib/storage/memoryStorage';

export const GET: RequestHandler = ({ url }) => {
	if (!url.searchParams.get('productId')) {
		return new Response(JSON.stringify({ error: 'Product ID is required' }), { status: 400 });
	}
	let productId: number;
	try {
		productId = parseInt(url.searchParams.get('productId') as string);
	} catch {
		return new Response(JSON.stringify({ error: 'Product ID must be a number' }), { status: 400 });
	}

	return new Response(JSON.stringify({ productActiveZones: getProductProductActiveZones(productId) }), { status: 200 });
};