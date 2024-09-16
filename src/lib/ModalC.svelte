<script lang="ts">
    import { Modal } from 'flowbite-svelte';
    import { Button, updateCount } from '$lib';
	import type { Writable } from 'svelte/store';

    export let mordalC: Writable<boolean>;
    export let disp: Writable<number>;
    export let storeCount: number;
</script>

<Modal
	class="mx-10"
	bind:open={$mordalC}
	title="怪しげなモーダルだ…"
	on:close={() => mordalC.set(false)}
>
	<div class="flex flex-col justify-center gap-6">
		<p class="w-full py-5 text-center">全く関係ないけどそれっぽい数字を選ぼう</p>
		<div class="w-full flex justify-center">
			<div class="grid grid-cols-3 w-fit pb-10 justify-center gap-5">
				{#each Array.from({ length: 9 }, (_, i) => i + 1) as num}
					<div class="flex justify-center">
						<Button
						on:click={() => {
							const N = num * 100;
							disp.update((n) => n + N);
							storeCount += N;
							updateCount(N.toString());
							mordalC.set(false);
						}}
					>
						{num * 100}
					</Button>
					</div>
				{/each}
			</div>
		</div>
	</div>
	<svelte:fragment slot="footer">
		<div class="w-full flex justify-end">
			<Button on:click={() => mordalC.set(false)}>キャンセル</Button>
		</div>
	</svelte:fragment>
</Modal>