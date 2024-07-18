<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import type { ProductActiveZoneDto } from '$lib/types/ProductActiveZone';

	type ModeEnum = 'view' | 'edit';
	type Props = {
		src: string;
		activeZones: ProductActiveZoneDto[];
		mode?: ModeEnum;
		selectedActiveZones?: ProductActiveZoneDto[] | null;
		activeZoneClick?: (selectedActiveZone: ProductActiveZoneDto) => void;
		activeZoneAdd?: (newActiveZone: ProductActiveZoneDto) => void;
		activeZoneEdit?: (selectedActiveZone: ProductActiveZoneDto) => void;
		activeZoneRemove?: (selectedActiveZone: ProductActiveZoneDto) => void;
	};

	let {
		src,
		activeZones,
		mode = 'view',
		selectedActiveZones,
		activeZoneClick,
		activeZoneAdd,
		activeZoneRemove
	}: Props = $props();

	let svgElement: SVGSVGElement;
	let imageElement: SVGImageElement;
	let zoneContainerElement: SVGGElement;
	let cursorPoint: SVGPoint;
	let cursorContainerStyle: string = $state('cursor-grab');
	let cursorZoneStyle: string = $state('cursor-pointer');
	let lastTouchDistance: number | null = null;
	let containerWidth: number = 0;
	let containerHeight: number = 0;
	let imageWidth: number = 0;
	let imageHeight: number = 0;
	let minScale: number = 0.2;
	let maxScale: number = 5;
	let scaleDelta: number = -0.1;
	let scale: number = 1;
	let dragDelta: number = 2;
	let originX: number = 0;
	let originY: number = 0;
	let isDragging: boolean = $state(false);
	let isDrawing: boolean = $state(false);
	let isDeleting: boolean = $state(false);
	let startX: number, startY: number;
	let drawStartX: number, drawStartY: number;
	let newZone: ProductActiveZoneDto | null = $state(null);
	let selectedZoneAnimation: string = 'animate-pulse bg-blue-500 p-4 rounded zone-selected';

	const onWheel = (event: WheelEvent) => {
		const rect = svgElement.getBoundingClientRect();
		const mouseX = event.clientX - rect.left;
		const mouseY = event.clientY - rect.top;

		const previousScale = scale;
		const delta = Math.sign(event.deltaY) * scaleDelta;
		scale = Math.min(Math.max(minScale, scale + delta), maxScale);

		// Adjust origin based on cursor position
		const offsetX = mouseX - originX;
		const offsetY = mouseY - originY;

		originX -= offsetX * (scale / previousScale - 1);
		originY -= offsetY * (scale / previousScale - 1);

		updateTransform();
	};

	const onMouseDown = (event: MouseEvent | TouchEvent) => {
		if (isDrawing) {
			updateCursorPoint(event);

			// Adjust for current transformations
			drawStartX = (cursorPoint.x - originX) / scale;
			drawStartY = (cursorPoint.y - originY) / scale;

			onNewZoneDrawingStarted();
		} else {
			isDragging = true;
			startX = (event instanceof MouseEvent) ? event.clientX : event.touches[0].clientX;
			startY = (event instanceof MouseEvent) ? event.clientY : event.touches[0].clientY;
			cursorContainerStyle = 'cursor-grabbing';
		}
	};

	const onMouseMove = (event: MouseEvent | TouchEvent) => {
		if (isDrawing && newZone) {
			updateCursorPoint(event);

			// Adjust for current transformations
			const currentX = (cursorPoint.x - originX) / scale;
			const currentY = (cursorPoint.y - originY) / scale;

			newZone.width = currentX - drawStartX;
			newZone.height = currentY - drawStartY;
		} else if (isDragging) {
			originX += (((event instanceof MouseEvent) ? event.clientX : event.touches[0].clientX) - startX) * dragDelta;
			originY += (((event instanceof MouseEvent) ? event.clientY : event.touches[0].clientY) - startY) * dragDelta;
			startX = (event instanceof MouseEvent) ? event.clientX : event.touches[0].clientX;
			startY = (event instanceof MouseEvent) ? event.clientY : event.touches[0].clientY;

			updateTransform();
		}
	};

	const onMouseUp = (event: MouseEvent | TouchEvent) => {
		if (isDrawing) {
			toggleDrawing();
			onNewZoneDrawingFinished();
		} else {
			isDragging = false;
			cursorContainerStyle = 'cursor-grab';
		}
	};
	
	const handleTouchStart = (event: TouchEvent) => {
		if (event.touches.length === 2) {
			lastTouchDistance = getTouchDistance(event.touches);
		} else {
			onMouseDown(event);
		}
	};

	const handleTouchMove = (event: TouchEvent) => {
		if (event.touches.length === 2 && lastTouchDistance !== null) {
			const currentTouchDistance = getTouchDistance(event.touches);
			const scaleDelta = (currentTouchDistance - lastTouchDistance) * 0.01;

			scale = Math.min(Math.max(minScale, scale + scaleDelta), maxScale);
			lastTouchDistance = currentTouchDistance;

			updateTransform();
		} else {
			onMouseMove(event);
		}
	};

	const handleTouchEnd = (event: TouchEvent) => {
		if (event.touches.length < 2) {
			lastTouchDistance = null;
		}
		onMouseUp(event);
	};

	const getTouchDistance = (touches: TouchList): number => {
		const [touch1, touch2] = touches;
		return Math.sqrt(
			Math.pow(touch2.clientX - touch1.clientX, 2) +
			Math.pow(touch2.clientY - touch1.clientY, 2)
		);
	};

	const updateTransform = () => {
		if (svgElement && imageElement) {
			const transform = `translate(${originX}, ${originY}) scale(${scale})`;
			imageElement.setAttribute('transform', transform);

			if (zoneContainerElement) {
				zoneContainerElement.setAttribute('transform', transform);
			}
		}
	};

	const updateCursorPoint = (event: MouseEvent | TouchEvent) => {
		cursorPoint.x = (event instanceof MouseEvent) ? event.clientX : event.touches[0].clientX;
		cursorPoint.y = (event instanceof MouseEvent) ? event.clientY : event.touches[0].clientY;
		cursorPoint = cursorPoint.matrixTransform(svgElement.getScreenCTM()?.inverse());
	};

	const handleResize = () => {
		containerWidth = svgElement.clientWidth;
		containerHeight = svgElement.clientHeight;
		if (imageWidth > 0 && imageHeight > 0) {
			updateTransform();
		}
	};

	onMount(() => {
		// Set initial cursor
		cursorPoint = svgElement.createSVGPoint();

		// Add event listeners
		document.addEventListener('mouseup', onMouseUp);
		document.addEventListener('mousemove', onMouseMove);
		window.addEventListener('resize', handleResize);
		svgElement.addEventListener('touchstart', handleTouchStart);
		svgElement.addEventListener('touchmove', handleTouchMove);
		svgElement.addEventListener('touchend', handleTouchEnd);

		// Set original image dimensions
		const img = new Image();
		img.onload = () => {
			imageWidth = img.width;
			imageHeight = img.height;
			imageElement.setAttribute('width', imageWidth.toString());
			imageElement.setAttribute('height', imageHeight.toString());
			svgElement.setAttribute('viewBox', `0 0 ${imageWidth} ${imageHeight}`);
		};
		img.src = src;

		return () => {
			document.removeEventListener('mouseup', onMouseUp);
			document.removeEventListener('mousemove', onMouseMove);
			window.removeEventListener('resize', handleResize);
			svgElement.removeEventListener('touchstart', handleTouchStart);
			svgElement.removeEventListener('touchmove', handleTouchMove);
			svgElement.removeEventListener('touchend', handleTouchEnd);
		};
	});

	const handleZoneClick = (zone: ProductActiveZoneDto) => {
		if (isDeleting) {
			activeZoneRemove?.(zone);
			toggleZoneDelete();
		} else {
			activeZoneClick?.(zone);
		}
	};

	function onNewZoneDrawingStarted() {
		cursorContainerStyle = 'cursor-crosshair';
		newZone = { id: Date.now(), x: drawStartX, y: drawStartY, width: 0, height: 0 };
	}

	function onNewZoneDrawingFinished() {
		if (!newZone) {
			toggleDrawing();
			return;
		}

		activeZoneAdd?.(newZone);
		newZone = null;
	}

	const toggleDrawing = (event?: MouseEvent | TouchEvent) => {
		event?.preventDefault();
		event?.stopPropagation();
		isDeleting = false;
		isDrawing = !isDrawing;
		if (isDrawing) {
			cursorContainerStyle = 'cursor-crosshair';
			cursorZoneStyle = 'cursor-crosshair';
		} else {
			cursorContainerStyle = 'cursor-grab';
			cursorZoneStyle = 'cursor-pointer';
		}
	};
	const toggleZoneDelete = (event?: MouseEvent | TouchEvent) => {
		event?.preventDefault();
		event?.stopPropagation();
		isDrawing = false;
		isDeleting = !isDeleting;
		if (isDeleting) {
			cursorZoneStyle = 'cursor-crosshair';
		} else {
			cursorZoneStyle = 'cursor-pointer';
		}
	};
</script>

{#if mode === 'edit'}
	<Button variant="outline" onclick={toggleDrawing}>
		{isDrawing ? 'Cancel' : 'Add Active Zone'}
	</Button>

	<Button variant="outline" onclick={toggleZoneDelete} class="m-2">
		{isDeleting ? 'Cancel' : 'Delete Active Zone'}
	</Button>
{/if}

<svg
	role="presentation"
	bind:this={svgElement}
	class="image-container h-full w-full {cursorContainerStyle}"
	onmousedown={onMouseDown}
	onwheel={onWheel}
>
	<image bind:this={imageElement} href={src} x="0" y="0" />
	<g bind:this={zoneContainerElement} class="zone-container">
		{#each activeZones as zone (zone.id)}
			<rect
				role="presentation"
				x={zone.x}
				y={zone.y}
				width={zone.width}
				height={zone.height}
				class="zone {cursorZoneStyle} {selectedActiveZones?.find((z) => z.id === zone.id) ? selectedZoneAnimation : ''}"
				onclick={() => handleZoneClick(zone)}
			/>
		{/each}
		{#if newZone}
			<rect
				role="presentation"
				x={newZone.x}
				y={newZone.y}
				width={newZone.width}
				height={newZone.height}
				class="zone {cursorZoneStyle}"
			/>
		{/if}
	</g>
</svg>

<style>
	.zone {
		fill: rgba(255, 0, 0, 0.3);
		stroke: red;
		stroke-width: 2;
	}
	.zone-selected {
		fill: rgba(39, 82, 20, 0.3);
		stroke: rgba(39, 82, 20);
		stroke-width: 2;
		animation: pulseSize 2s infinite;
	}
	@keyframes pulseSize {
		0% {
			transform: scale(0.99);
		}

		70% {
			transform: scale(1);
		}

		100% {
			transform: scale(0.99);
		}
	}
</style>
