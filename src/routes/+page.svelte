<script>
	import App from '$lib/components/App.svelte';
</script>

<div id="background-container">
	<App />
</div>

<style>
	:global(body) {
		margin: 0;
		overflow: hidden; /* Prevent default scrolling */
	}

	#background-container {
		position: fixed;
		z-index: -1;
		border: none;
		pointer-events: none;
		left: 0;
		top: 0;
		width: 100vw;
		height: 100vh;
		background: rgb(13, 19, 32);
		background: linear-gradient(180deg, rgba(13, 19, 32, 1) 0%, rgba(8, 12, 21, 1) 100%);
	}
</style>
