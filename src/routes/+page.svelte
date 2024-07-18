<script lang="ts">
	import { onMount } from 'svelte';
	import type { ProductDto } from '$lib/types/Product';
	import type { ProductActiveZoneDto } from '$lib/types/ProductActiveZone';
	import type { ProductActiveZoneProductDto } from '$lib/types/ProductActiveZoneProduct';
	import ProductListComponent from '$lib/components/page/product-list';
	import ProductSchemaImage from '$lib/components/page/product-schema/productSchemaImage.svelte';

	let products: ProductDto[] = $state([]);
	let activeZones: ProductActiveZoneDto[] = $state([]);
	let activeZonesProducts: ProductActiveZoneProductDto[] = $state([]);

	let selectedMainProductImg: string = $state('/images/sample.png');
	let selectedProducts: ProductDto[] | null = $state(null);
	let selectedActiveZones: ProductActiveZoneDto[] | null = $state(null);

	// * Products

	async function fetchProducts() {
		const response = await fetch('/api/products');
		const data = await response.json();
		products = data.products;
	}

	async function addProduct(newProduct: ProductDto) {
		await fetch('/api/products', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(newProduct)
		});
		fetchProducts();
	}

	async function deleteProduct(id: number) {
		await fetch('/api/products', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id })
		});
		fetchProducts();
	}

	async function editProduct(product: ProductDto) {
		await fetch('/api/products', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(product)
		});
		fetchProducts();
	}

	// * Product Active Zones

	async function fetchProductActiveZones() {
		const response = await fetch('/api/productActiveZones');
		const data = await response.json();
		activeZones = data.productActiveZones;
	}

	async function addProductActiveZone(newProductActiveZone: ProductActiveZoneDto) {
		await fetch('/api/productActiveZones', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(newProductActiveZone)
		});
		fetchProductActiveZones();
	}

	async function deleteProductActiveZone(id: number) {
		await fetch('/api/productActiveZones', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id })
		});
		fetchProductActiveZones();
	}

	async function editProductActiveZone(activeZone: ProductActiveZoneDto) {
		await fetch('/api/productActiveZones', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(activeZone)
		});
		fetchProductActiveZones();
	}

	// * Active Zone Products

	async function fetchProductActiveZoneProducts(productActiveZoneId: number) {
		const response = await fetch(
			'/api/productActiveZoneProducts?productActiveZoneId=' + productActiveZoneId
		);
		const data = await response.json();
		selectedProducts = data.productActiveZones.map((p) => ({ id: p.productId }));
	}

	async function fetchProductProductActiveZones(productId: number) {
		const response = await fetch('/api/productProductActiveZones?productId=' + productId);
		const data = await response.json();
		selectedActiveZones = data.productActiveZones.map((p) => ({ id: p.productActiveZoneId }));
	}

	async function addProductActiveZoneProduct(
		newProductActiveZoneProduct: ProductActiveZoneProductDto
	) {
		await fetch('/api/productActiveZoneProducts', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(newProductActiveZoneProduct)
		});
	}

	async function deleteProductActiveZoneProduct(id: number) {
		await fetch('/api/productActiveZoneProducts', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id })
		});
	}

	async function editProductActiveZoneProduct(activeZoneProduct: ProductActiveZoneProductDto) {
		await fetch('/api/productActiveZoneProducts', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(activeZoneProduct)
		});
	}

	// * Actions

	const productClick = async (product: ProductDto) => {
		selectedProducts = [product];
		await fetchProductProductActiveZones(product.id);
	};

	const productAdd = (product: ProductDto) => {
		addProduct(product);
	};

	const productRemove = (product: ProductDto) => {
		deleteProduct(product.id);
	};

	const activeZoneClick = async (zone: ProductActiveZoneDto) => {
		selectedActiveZones = [zone];
		await fetchProductActiveZoneProducts(zone.id);
	};

	const activeZoneAdd = (zone: ProductActiveZoneDto) => {
		addProductActiveZone(zone);
	};

	const activeZoneRemove = (zone: ProductActiveZoneDto) => {
		deleteProductActiveZone(zone.id);
	};

	onMount(() => {
		fetchProducts();
		fetchProductActiveZones();
	});
</script>

<div class="h-screen w-full p-2 md:p-2 lg:p-4">
	<div class="grid grid-cols-1 gap-4 md:grid-cols-6">
		<!-- list -->
		<div class="m-2 hidden border-2 p-4 md:col-span-2 md:block">
			<ProductListComponent
				tableHeaderTitles={['Id', 'Title']}
				{products}
				{selectedProducts}
				{productClick}
			/>
		</div>
		<!-- image -->
		<div class="col-span-1 m-2 overflow-hidden border-2 p-4 md:col-span-4">
			<ProductSchemaImage
				mode="edit"
				src={selectedMainProductImg}
				{activeZones}
				{selectedActiveZones}
				{activeZoneClick}
				{activeZoneAdd}
				{activeZoneRemove}
			/>
		</div>
	</div>
</div>

<style>
</style>
