import type { RequestHandler } from '@sveltejs/kit';
import { getProductActiveZoneProducts, addProductActiveZoneProduct, updateProductActiveZoneProduct, deleteProductActiveZoneProduct } from '$lib/storage/memoryStorage';


// GET: List productActiveZoneProducts
export const GET: RequestHandler = ({ url }) => {
	if (!url.searchParams.get('productActiveZoneId')) {
		return new Response(JSON.stringify({ error: 'Product Active Zone ID is required' }), { status: 400 });
	}
	let productActiveZoneId: number;
	try {
		productActiveZoneId = parseInt(url.searchParams.get('productActiveZoneId') as string);
	} catch {
		return new Response(JSON.stringify({ error: 'Product Active Zone ID must be a number' }), { status: 400 });
	}

	return new Response(JSON.stringify({ productActiveZones: getProductActiveZoneProducts(productActiveZoneId) }), { status: 200 });
};

// POST: Add a productActiveZoneProduct
export const POST: RequestHandler = async ({ request }) => {
	const newProductActiveZoneProduct = await request.json();
	const addedProductActiveZoneProduct = addProductActiveZoneProduct(newProductActiveZoneProduct);
	return new Response(JSON.stringify({ productActiveZoneProduct: addedProductActiveZoneProduct }), { status: 201 });
};

// PUT: Edit a productActiveZoneProduct
export const PUT: RequestHandler = async ({ request }) => {
	const updatedProductActiveZoneProduct = await request.json();
	const result = updateProductActiveZoneProduct(updatedProductActiveZoneProduct);
	if (result) {
		return new Response(JSON.stringify({ productActiveZoneProduct: result }), { status: 200 });
	}
	return new Response(JSON.stringify({ error: 'Product Active Zone Product not found' }), { status: 404 });
};

// DELETE: Remove a productActiveZoneProduct
export const DELETE: RequestHandler = async ({ request }) => {
	const { id } = await request.json();
	const success = deleteProductActiveZoneProduct(id);
	if (success) {
		return new Response(JSON.stringify({ success: true }), { status: 200 });
	}
	return new Response(JSON.stringify({ error: 'Product Active Zone Product not found' }), { status: 404 });
};
