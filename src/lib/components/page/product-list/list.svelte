<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import type { ProductDto } from '$lib/types/Product';

	type ModeEnum = 'view' | 'edit';
	type Props = {
		products: ProductDto[];
		tableCaption?: string | undefined;
		tableHeaderTitles?: string[] | undefined;
		mode?: ModeEnum;
		selectedProducts?: ProductDto[] | null;
		productClick?: (product: ProductDto) => void;
		productAdd?: (newProduct: ProductDto) => void;
		productEdit?: (selectedProduct: ProductDto) => void;
		productRemove?: (selectedProduct: ProductDto) => void;
	};

	let {
		products,
		tableCaption,
		tableHeaderTitles,
		mode = 'view',
		selectedProducts,
		productClick,
		productAdd,
		productRemove
	}: Props = $props();

	let selectedProductAnimation: string = 'animate-pulse bg-green-500 p-4 rounded product-selected';

    const handleProductClick = (zone: ProductDto) => {
        productClick?.(zone);
	};
</script>

<Table.Root>
	{#if tableCaption}
		<Table.Caption>{tableCaption}</Table.Caption>
	{/if}
	{#if tableHeaderTitles}
		<Table.Header>
			<Table.Row>
				{#each tableHeaderTitles as title}
					<Table.Head>{title}</Table.Head>
				{/each}
			</Table.Row>
		</Table.Header>
	{/if}
	<Table.Body>
		{#each products as product}
			<Table.Row
				onclick={() => handleProductClick(product)}
				class={selectedProducts?.find((z) => z.id === product.id) ? selectedProductAnimation : ''}
			>
				<Table.Cell class="font-medium">{product.id}</Table.Cell>
				<Table.Cell>{product.name}</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>

<style>
	.product-selected {
		fill: rgba(39, 82, 20, 0.3);
		stroke: rgba(39, 82, 20);
		stroke-width: 2;
		animation: pulseSize 2s infinite;
	}
	@keyframes pulseSize {
		0% {
			transform: scale(0.98);
			box-shadow: 0 0 0 0 rgb(92, 75, 192);
		}

		70% {
			transform: scale(1);
			box-shadow: 0 0 0 60px rgba(229, 62, 62, 0);
		}

		100% {
			transform: scale(0.98);
		}
	}
</style>
