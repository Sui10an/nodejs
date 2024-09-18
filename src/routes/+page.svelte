<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { isError, fetchAPI, handleKeydown, onMessage, onError, Button, goToResult } from '$lib';
	import ModalC from '$lib/ModalC.svelte';
	import ModalG from '$lib/ModalG.svelte';

	let disp = writable(0);
	let isStart = false;
	let storeCount = 0;
	let mordalC = writable(false);
	let mordalG = writable(false);

	const originalConsoleError = console.error;

	console.error = (...args: any[]) => {
		const errorMessage = args[0] || '';
        if (!errorMessage.startsWith('Error enqueuing message:') && !errorMessage.startsWith('Stream closed, stopping keep-alive:')) {
            isError.set(true);
        }
        originalConsoleError(...args);
	};

	onMount(() => {
		let eventSource: EventSource;

		const connectEventSource = () => {
			eventSource = new EventSource('/api/countup');
			console.log('connect');
			eventSource.onmessage = (event) => onMessage(event, disp);
			eventSource.onerror = (event) => onError(event, eventSource, connectEventSource);
		};

		connectEventSource();

		return () => {
			if (eventSource.readyState === 1) {
				eventSource.close();
				console.log('close');
			}
		};
	});

	const startMeasurement = async () => {
		const count = await fetchAPI();
		disp.set(count.count);
		isStart = true;
	};

	const stopMeasurement = () => {
		isStart = false;
		storeCount = Number(document.querySelector('#count')?.innerHTML.split(': ')[1]) || 0;
	};

	$: if ($isError && typeof window !== 'undefined') {
		window.document.body.style.backgroundColor = 'red';
	}
</script>

<svelte:window on:keydown={async (e) => await handleKeydown(e, disp, mordalC, mordalG)} />

<ModalC bind:mordalC={mordalC} bind:disp={disp} bind:storeCount={storeCount} />
<ModalG bind:mordalG={mordalG} />

<div
	class="w-screen h-screen text-sky-500 font-bold flex flex-col gap-10 items-center justify-center"
>
	<p>使い方等のヘルプは <a class="underline" href="/how">こちら</a> から</p>
	{#if isStart}
		<p id="count" class="text-xl">Count: {$disp === undefined ? '0' : $disp}</p>
		<Button on:click={stopMeasurement}>計測停止</Button>
	{:else}
		<p class="text-xl">計測停止中 store: {storeCount}</p>
		<div class="flex gap-3">
			<Button on:click={startMeasurement}>0から計測開始</Button>
			{#if storeCount != 0}
				<Button on:click={() => (isStart = true)}>再開</Button>
				<Button on:click={() => goToResult(storeCount)}>リザルト画面に移る</Button>
			{/if}
		</div>
	{/if}
</div>
