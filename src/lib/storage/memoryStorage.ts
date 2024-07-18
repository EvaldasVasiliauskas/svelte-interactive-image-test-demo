import type { ProductDto } from '$lib/types/Product';
import type { ProductActiveZoneDto } from '$lib/types/ProductActiveZone';
import type { ProductActiveZoneProductDto } from '$lib/types/ProductActiveZoneProduct';

let products: ProductDto[] = [
	{ id: 1, name: 'Product 1' },
	{ id: 2, name: 'Product 2' },
	{ id: 3, name: 'Product 3' },
	{ id: 4, name: 'Product 4' },
	{ id: 5, name: 'Product 5' },
	{ id: 6, name: 'Product 6' },
	{ id: 7, name: 'Product 7' },
	{ id: 8, name: 'Product 8' },
	{ id: 9, name: 'Product 9' },
	{ id: 10, name: 'Product 10' }
];

let productActiveZones: ProductActiveZoneDto[] = [
	{
		id: 1,
		x: 892.8674972285203,
		y: 775.8697526838396,
		width: 32.90877122145423,
		height: 36.19966947115381
	},
	{
		id: 2,
		x: 2311.012709255263,
		y: 799.7363298322771,
		width: 37.84508338341357,
		height: 41.13595815805286
	},
	{
		id: 3,
		x: 1081.328871364638,
		y: 1229.8685413707385,
		width: 34.55420860877416,
		height: 42.78141902043262
	},
	{
		id: 4,
		x: 2585.490248317763,
		y: 1095.242921629152,
		width: 31.263427734375,
		height: 34.554255558894056
	},
	{
		id: 5,
		x: 2786.2338443213685,
		y: 1113.342756364729,
		width: 36.19966947115381,
		height: 39.490497295673094
	},
	{
		id: 6,
		x: 1842.6070414367534,
		y: 231.4787661679142,
		width: 37.84517728365381,
		height: 42.78144249549277
	},
	{
		id: 7,
		x: 844.6552873802631,
		y: 1510.8975941051135,
		width: 36.19966947115381,
		height: 36.19966947115381
	},
	{
		id: 8,
		x: 2436.1012571819456,
		y: 2024.9879824765076,
		width: 32.908841646634755,
		height: 36.19966947115381
	},
	{
		id: 9,
		x: 863.3307775395178,
		y: 1172.17116306545,
		width: 41.13605205829322,
		height: 37.84517728365404
	}
];

let productActiveZoneProducts: ProductActiveZoneProductDto[] = [
	{ id: 1, productId: 1, productActiveZoneId: 1 },
	{ id: 2, productId: 2, productActiveZoneId: 2 },
	{ id: 3, productId: 2, productActiveZoneId: 3 },
	{ id: 4, productId: 2, productActiveZoneId: 9 },
	{ id: 5, productId: 4, productActiveZoneId: 4 },
	{ id: 6, productId: 4, productActiveZoneId: 8 },
	{ id: 7, productId: 5, productActiveZoneId: 5 },
	{ id: 8, productId: 5, productActiveZoneId: 7 },
	{ id: 9, productId: 6, productActiveZoneId: 6 }
];

// * Product API

export function getProducts(): ProductDto[] {
	return products;
}

export function addProduct(product: Omit<ProductDto, 'id'>): ProductDto {
	const newProduct = {
		...product,
		id: products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1
	};
	products.push(newProduct);
	return newProduct;
}

export function updateProduct(updatedProduct: ProductDto): ProductDto | null {
	const index = products.findIndex((p) => p.id === updatedProduct.id);
	if (index !== -1) {
		products[index] = updatedProduct;
		return updatedProduct;
	}
	return null;
}

export function deleteProduct(id: number): boolean {
	const initialLength = products.length;
	products = products.filter((p) => p.id !== id);
	productActiveZoneProducts = productActiveZoneProducts.filter((p) => p.productId !== id);
	return products.length < initialLength;
}

// * Active Zone API

export function getProductActiveZones(): ProductActiveZoneDto[] {
	return productActiveZones;
}

export function addProductActiveZone(
	productActiveZone: Omit<ProductActiveZoneDto, 'id'>
): ProductActiveZoneDto {
	const newProductActiveZone = {
		...productActiveZone,
		id: productActiveZones.length ? Math.max(...productActiveZones.map((p) => p.id)) + 1 : 1
	};
	productActiveZones.push(newProductActiveZone);
	return newProductActiveZone;
}

export function updateProductActiveZone(
	updatedProductActiveZone: ProductActiveZoneDto
): ProductActiveZoneDto | null {
	const index = productActiveZones.findIndex((p) => p.id === updatedProductActiveZone.id);
	if (index !== -1) {
		productActiveZones[index] = updatedProductActiveZone;
		return updatedProductActiveZone;
	}
	return null;
}

export function deleteProductActiveZone(id: number): boolean {
	const initialLength = productActiveZones.length;
	productActiveZones = productActiveZones.filter((p) => p.id !== id);
	productActiveZoneProducts = productActiveZoneProducts.filter((p) => p.productActiveZoneId !== id);
	return productActiveZones.length < initialLength;
}

// * Product Active Zone Product API

export function getProductActiveZoneProducts(productActiveZoneId: number): ProductActiveZoneProductDto[] {
	return productActiveZoneProducts.filter((p) => p.productActiveZoneId === productActiveZoneId);
}

export function getProductProductActiveZones(productId: number): ProductActiveZoneProductDto[] {
	return productActiveZoneProducts.filter((p) => p.productId === productId);
}

export function addProductActiveZoneProduct(
	productActiveZoneProduct: Omit<ProductActiveZoneProductDto, 'id'>
): ProductActiveZoneProductDto {
	const newProductActiveZoneProduct = {
		...productActiveZoneProduct,
		id: productActiveZoneProducts.length ? Math.max(...productActiveZoneProducts.map((p) => p.id)) + 1 : 1
	};
	productActiveZoneProducts.push(newProductActiveZoneProduct);
	return newProductActiveZoneProduct;
}

export function updateProductActiveZoneProduct(
	updatedProductActiveZoneProduct: ProductActiveZoneProductDto
): ProductActiveZoneProductDto | null {
	const index = productActiveZoneProducts.findIndex((p) => p.id === updatedProductActiveZoneProduct.id);
	if (index !== -1) {
		productActiveZoneProducts[index] = updatedProductActiveZoneProduct;
		return updatedProductActiveZoneProduct;
	}
	return null;
}

export function deleteProductActiveZoneProduct(id: number): boolean {
	const initialLength = productActiveZoneProducts.length;
	productActiveZoneProducts = productActiveZoneProducts.filter((p) => p.id !== id);
	return productActiveZoneProducts.length < initialLength;
}

// *