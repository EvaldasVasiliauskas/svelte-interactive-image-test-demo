import type { RequestHandler } from '@sveltejs/kit';
import { getProductActiveZones, addProductActiveZone, updateProductActiveZone, deleteProductActiveZone } from '$lib/storage/memoryStorage';


// GET: List productActiveZones
export const GET: RequestHandler = () => {
	return new Response(JSON.stringify({ productActiveZones: getProductActiveZones() }), { status: 200 });
};

// POST: Add a productActiveZone
export const POST: RequestHandler = async ({ request }) => {
	const newProductActiveZone = await request.json();
	const addedProductActiveZone = addProductActiveZone(newProductActiveZone);
	return new Response(JSON.stringify({ productActiveZone: addedProductActiveZone }), { status: 201 });
};

// PUT: Edit a productActiveZone
export const PUT: RequestHandler = async ({ request }) => {
	const updatedProductActiveZone = await request.json();
	const result = updateProductActiveZone(updatedProductActiveZone);
	if (result) {
		return new Response(JSON.stringify({ productActiveZone: result }), { status: 200 });
	}
	return new Response(JSON.stringify({ error: 'Product Active Zone not found' }), { status: 404 });
};

// DELETE: Remove a productActiveZone
export const DELETE: RequestHandler = async ({ request }) => {
	const { id } = await request.json();
	const success = deleteProductActiveZone(id);
	if (success) {
		return new Response(JSON.stringify({ success: true }), { status: 200 });
	}
	return new Response(JSON.stringify({ error: 'Product Active Zone not found' }), { status: 404 });
};
