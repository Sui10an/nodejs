<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { writable } from 'svelte/store';

	const disp = writable(0);

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
</script>

<p>Count: {$disp}</p>
