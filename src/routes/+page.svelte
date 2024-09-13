<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	const disp = writable(0);

	let isStart = false;

	onMount(() => {
		let eventSource: EventSource;

		const connectEventSource = () => {
			eventSource = new EventSource('/api/countup');
			console.log('connect');
			eventSource.onmessage = (event) => {
				console.log('Received message:', event);
				const data = JSON.parse(event.data);
				disp.set(data.count);
			};

			eventSource.onerror = (event) => {
				console.error('Error occurred:', event);
				console.log('EventSource readyState:', eventSource.readyState);

				if (eventSource.readyState === EventSource.CLOSED) {
					console.log('Reconnecting...');
					setTimeout(() => {
						connectEventSource();
					}, 3000);
				}
			};
		};

		connectEventSource();

		return () => {
			if (eventSource.readyState === 1) {
				eventSource.close();
				console.log('close');
			}
		};
	});

	let reset = 0;

	const handleKeydown = (e: KeyboardEvent) => {
		let timer;

		if (e.key === 'Enter') {
			e.preventDefault();
			reset++;
			clearTimeout(timer);

			console.log(reset);

			if (reset === 5) {
				fetch('/api/countup', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						value: '-'
					})
				})
					.then((responce) => responce.json())
					.then((data) => {
						console.log('Success:', data);
					})
					.catch((e) => {
						console.error('Error:', e);
					});
				reset = 0;
				console.log('reset');
			}

			timer = setTimeout(() => {
				reset = 0;
			}, 2000);
		}
	};

	let storeCount = 0;

	$: console.log(storeCount)
</script>

<svelte:window on:keydown={(e) => handleKeydown(e)} />

<div
	class="w-screen h-screen text-sky-500 font-bold flex flex-col gap-10 items-center justify-center"
>
	{#if isStart}
		<p id="count" class="text-xl">Count: {$disp}</p>
		<button
			class="p-4 border border-sky-400 rounded-lg shadow-lg shadow-sky-400/20"
			on:click={() => {
				isStart = false;
				storeCount = Number(document.querySelector('#count')?.innerHTML.split(': ')[1]) | 0
				console.log(storeCount)
			}}
		>
			計測停止
		</button>
	{:else}
		<p class="text-xl">計測停止中 store: {storeCount}</p>
		<div class="flex gap-3">
			<button
				class="p-4 border border-sky-400 rounded-lg shadow-lg shadow-sky-400/20"
				on:click={() => {
					fetch('/api/countup', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							value: '-'
						})
					})
						.then((responce) => responce.json())
						.then((data) => {
							console.log('Success:', data);
						})
						.catch((e) => {
							console.error('Error:', e);
						})
					isStart = true;
				}}
			>
				0から計測開始
			</button>
			{#if storeCount != 0}
				<button
					class="p-4 border border-sky-400 rounded-lg shadow-lg shadow-sky-400/20"
					on:click={() => {
						isStart = true;
					}}
				>
					再開
				</button>
			{/if}
		</div>
		<div>
			<button
				class="p-4 border border-sky-400 rounded-lg shadow-lg shadow-sky-400/20"
				on:click={() => {
					window.location.href = `/result?co=${storeCount}`
				}}
			>
				リザルト画面に移る
			</button>
		</div>
	{/if}
</div>
