import type { RequestHandler } from '@sveltejs/kit';
import { getProducts, addProduct, updateProduct, deleteProduct } from '$lib/storage/memoryStorage';


// GET: List products
export const GET: RequestHandler = () => {
	return new Response(JSON.stringify({ products: getProducts() }), { status: 200 });
};

// POST: Add a product
export const POST: RequestHandler = async ({ request }) => {
	const newProduct = await request.json();
	const addedProduct = addProduct(newProduct);
	return new Response(JSON.stringify({ product: addedProduct }), { status: 201 });
};

// PUT: Edit a product
export const PUT: RequestHandler = async ({ request }) => {
	const updatedProduct = await request.json();
	const result = updateProduct(updatedProduct);
	if (result) {
		return new Response(JSON.stringify({ product: result }), { status: 200 });
	}
	return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404 });
};

// DELETE: Remove a product
export const DELETE: RequestHandler = async ({ request }) => {
	const { id } = await request.json();
	const success = deleteProduct(id);
	if (success) {
		return new Response(JSON.stringify({ success: true }), { status: 200 });
	}
	return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404 });
};
