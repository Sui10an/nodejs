<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { count } from '$lib';
	import { writable } from 'svelte/store';
	import {io} from "$lib"

	const disp = writable(0);

	let eventSource: EventSource;

	onMount(() => {
		io.on('message', message => {
			console.log(message)
		})
		eventSource = new EventSource('/api/countup');
		eventSource.onmessage = (event) => {
			const data = JSON.parse(event.data);
			disp.set(data.count);
		};

		return () => {
			if (eventSource.readyState === 1) {
				eventSource.close()
			}
		}
	});
</script>

<p>Count: {$disp}</p>
