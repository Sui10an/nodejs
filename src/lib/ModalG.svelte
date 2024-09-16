<script lang="ts">
    import { Modal } from 'flowbite-svelte';
    import { Button, goToResult } from '$lib';
	import type { Writable } from 'svelte/store';

    export let mordalG: Writable<boolean>;
</script>

<Modal
	class="mx-10"
	bind:open={$mordalG}
	title="めちゃくちゃ怪しげなモーダルだ…"
	on:close={() => mordalG.set(false)}
>
	<div class="flex flex-col justify-center gap-6">
		<div class="w-full flex justify-center">
            <p class="py-6">
                本当にランダムな点数を送信しますか？
            </p>
		</div>
	</div>
	<svelte:fragment slot="footer">
		<div class="w-full flex justify-end gap-4">
			<Button on:click={() => mordalG.set(false)}
				class="bg-sky-500 text-slate-50"
			>キャンセル</Button>
			<Button on:click={() => {
                const n = Math.floor(Math.floor(Math.random() * 10)) * 100;
                goToResult(n);
            }}>送信する</Button>
		</div>
	</svelte:fragment>
</Modal>