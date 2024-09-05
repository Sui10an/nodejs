<script>
	import { onMount } from 'svelte';

	let count = 0;

	async function sendData() {
		try {
			const response = await fetch('http://localhost:4000/data', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ value: 'some data' })
			});
			const result = await response.text();
			console.log('Response from server:', result);
		} catch (error) {
			console.error('Error sending data:', error);
		}
	}

	// Svelteアプリケーションでデータを受け取るためのエンドポイント
	async function updateCount(newCount) {
		try {
			const response = await fetch('http://localhost:4000/update', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ count: newCount })
			});
			if (response.ok) {
				console.log('Data updated successfully');
			} else {
				console.log(response);
				console.error('Failed to update data');
			}
		} catch (error) {
			console.error('Error updating data:', error);
		}
	};

	onMount(() => {
		sendData();
		// サーバーサイドイベントを使用してカウントを更新する
		const eventSource = new EventSource('http://localhost:4000/events');

		eventSource.onmessage = (event) => {
			const data = JSON.parse(event.data);
			count = data.count;
			console.log('Received count:', count); // 追加したログ
			updateCount(count);
		};

		return () => {
			eventSource.close();
		};
	});
</script>

<p>Count: {count}</p>
