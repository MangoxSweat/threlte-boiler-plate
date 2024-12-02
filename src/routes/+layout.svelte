<script>
	import App from '$lib/components/App.svelte';
	import { onMount, onDestroy } from 'svelte';
	import { gsapStore, scrollTriggerStore, lenisStore } from '$lib/stores/libStore.js';

	let lenis;
	let gsap;
	let ScrollTrigger;

	async function loadLibraries() {
		console.log('Loading GSAP, ScrollTrigger, Lenisonry...');
		const modules = await Promise.all([
			import('gsap'),
			import('gsap/ScrollTrigger'),
			import('lenis')
		]);

		gsap = modules[0].gsap;
		ScrollTrigger = modules[1].ScrollTrigger;
		const Lenis = modules[2].default;

		console.log('Initializing Lenis...');
		lenis = new Lenis({
			duration: 1.2,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easing function
			smooth: true,
			direction: 'vertical' // Ensure the correct scrolling direction
		});

		gsap.registerPlugin(ScrollTrigger);

		function raf(time) {
			lenis.raf(time);
			requestAnimationFrame(raf);
		}

		requestAnimationFrame(raf);

		// Update the stores with the loaded modules
		gsapStore.set(gsap);
		scrollTriggerStore.set(ScrollTrigger);
		lenisStore.set(lenis);
	}

	onMount(async () => {
		if (typeof window !== 'undefined') {
			console.log('Mounting component...');
			await loadLibraries();

			ScrollTrigger.scrollerProxy(document.body, {
				scrollTop(value) {
					return arguments.length ? lenis.scrollTo(value) : lenis.scroll;
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

			ScrollTrigger.addEventListener('refresh', () => lenis.raf());
			ScrollTrigger.refresh();

			ScrollTrigger.create({
				start: 'top top',
				end: 'bottom bottom',
				onUpdate: (self) => {
					const header = document.querySelector('header');
					const scrollThreshold = document.documentElement.scrollHeight * 0.05;

					if (self.direction === 1 && self.scroll() > scrollThreshold) {
						// Scrolling down
						header.classList.add('header-hidden');
					} else if (self.direction === -1 || self.scroll() <= scrollThreshold) {
						// Scrolling up
						header.classList.remove('header-hidden');
					}
				}
			});

			// Start the animation frame loop
			requestAnimationFrame((time) => lenis.raf(time));
		}
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			console.log('Destroying component...');
			ScrollTrigger.killAll();
		}
	});
</script>

<main>
	<div id="three-canvas-container">
		<App />
	</div>
</main>

<style>
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

	#scroller {
		/*border: green 3px solid;*/
		min-height: 1000vh; /* Creates 2x the viewport height scrollable area */
	}
	/* You can include any global styles here if needed */

	:global(body) {
		margin: 0;
		overflow: hidden; /* Prevent default scrolling */
	}
</style>
