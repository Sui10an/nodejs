<script lang="ts">
    import '../app.css'
    import { resetCount } from '$lib'
</script>

<svelte:window on:keydown={(e) => resetCount(e)} />

<slot />