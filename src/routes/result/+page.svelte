<script lang="ts">
	import { onMount } from 'svelte';
	import { Spinner } from 'flowbite-svelte';
	import { page } from '$app/stores';
	import * as QRCode from 'qrcode';
	import * as CryptoJS from 'crypto-js';

	const baseURL = 'https://j2a.f5.si/addranking';
	const key = 'J2A2024';

	let co: string;
	let src: string;

	onMount(() => {
		co = $page.url.searchParams.get('co') || 'Error';
		const img = document.getElementById('qrcode');

		if (!img) return;

		const encryptedCo = CryptoJS.AES.encrypt(co, key).toString();

		console.log()

		QRCode.toDataURL(baseURL + '?co=' + encryptedCo, { width: 200, margin: 1 })
			.then((url) => {
				src = url;
			})
			.catch((err) => {
				console.error(err);
				co = 'Error';
			});
	});
</script>

<div class="w-screen h-screen p-10">
	<div class="main w-full h-full border-4 border-slate-800 p-10 font-black">
		{#if co === 'Error'}
			<p>エラーが発生しました</p>
		{:else}
			<div class="w-full flex justify-center border-b-4 border-slate-900 pb-6 px-10">
				<p class="text-4xl">成績発表</p>
			</div>
			<div class="w-full flex justify-center flex-col gap-10 py-10 text-center pl-5">
				<p class="text-4xl">あなたの結果は…</p>
				<p class="text-6xl text-red-600 flex flex-row gap-5 justify-center items-end">
					<span class="under text-8xl">
						{#if co === undefined}
							<Spinner color="red" size={10} />
						{:else}
							{co}
						{/if}
					</span>
					<span class="py-6">点！</span>
				</p>
			</div>
			<div class="w-full flex justify-center py-5 pb-8">
				<img id="qrcode" {src} alt="qrcode" />
			</div>
			<div class="w-full flex justify-center">
				<p class="text-2xl p-4 border-4 border-slate-900">ランキング登録はこちらから↑</p>
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	.main {
		position: relative;

		&::after {
			content: '';
			position: absolute;
			bottom: 0;
			right: 0;
			width: 50px;
			height: 50px;
			clip-path: polygon(100% 100%, 0 100%, 100% 0);
			@apply bg-slate-800;
		}
	}

	.under {
		&::after {
			content: '';
			display: block;
			width: 100%;
			@apply border-b-[20px] border-double border-red-600;
		}
	}
</style>