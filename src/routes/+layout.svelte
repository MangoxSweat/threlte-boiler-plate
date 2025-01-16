<script>
	import App from '$lib/components/App.svelte';
	import { onMount, onDestroy } from 'svelte';
	import gsap from 'gsap';
	import Lenis from 'lenis';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';

	gsap.registerPlugin(ScrollTrigger);
	let lenis;

	onMount(() => {
		lenis = new Lenis({
			duration: 1.2,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easing function
			smooth: true,
			direction: 'vertical' // Ensure correct scrolling direction
		});

		// Setup ScrollTrigger to sync with Lenis
		ScrollTrigger.scrollerProxy(document.body, {
			scrollTop(value) {
				if (arguments.length) {
					lenis.scrollTo(value);
				} else {
					return lenis.scroll;
				}
			},
			getBoundingClientRect() {
				return {
					top: 0,
					left: 0,
					width: window.innerWidth,
					height: window.innerHeight
				};
			},
			pinType: document.body.style.transform ? 'transform' : 'fixed'
		});

		// Refresh ScrollTrigger after initialization
		ScrollTrigger.addEventListener('refresh', () => lenis.raf());
		ScrollTrigger.refresh();

		// Animation frame loop
		const raf = (time) => {
			lenis.raf(time);
			requestAnimationFrame(raf);
		};
		requestAnimationFrame(raf);
	});

	onDestroy(() => {
		// Cleanup on component destruction
		if (ScrollTrigger) {
			ScrollTrigger.killAll();
		}
		if (lenis) {
			lenis.destroy();
		}
	});
</script>

<main>
	<div id="three-canvas-container">
		<App />
	</div>

	<div id="scroller">
		<slot />
	</div>
</main>

<style>
	#scroller {
		min-height: 100vh;
	}

	#three-canvas-container {
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

	:global(body) {
		margin: 0;
		overflow: hidden; /* Prevent default scrolling */
	}
</style>
